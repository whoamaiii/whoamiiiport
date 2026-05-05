#!/usr/bin/env node
import { chromium } from '@playwright/test';

const TARGET_URL = process.argv[2] ?? 'http://localhost:4173/';
const VIEWPORT = { width: 390, height: 844 };
const FAST_4G = {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  connectionType: 'cellular4g',
};
const CPU_THROTTLE_RATE = 4;
const THRESHOLDS = {
  fcpMs: 1500,
  heroRequestStartMs: 500,
  firstGalleryReadyAfterScrollMs: 750,
};

function round(value) {
  return Number.isFinite(value) ? Math.round(value) : null;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  const consoleMessages = [];

  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      consoleMessages.push(`${message.type()}: ${message.text()}`);
    }
  });

  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', FAST_4G);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_THROTTLE_RATE });

  try {
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 60000 });
    await page.waitForFunction(
      () => Boolean(document.querySelector('[data-testid="hero-title-visual"]')),
      { timeout: 60000 },
    );

    const topMetrics = await page.evaluate(() => {
      const origin = location.origin;
      const paints = Object.fromEntries(
        performance.getEntriesByType('paint').map((entry) => [entry.name, Math.round(entry.startTime)]),
      );
      const resources = performance.getEntriesByType('resource').map((entry) => ({
        name: entry.name.startsWith(origin) ? entry.name.slice(origin.length) : entry.name,
        startTime: Math.round(entry.startTime),
        duration: Math.round(entry.duration),
        transferSize: entry.transferSize,
        decodedBodySize: entry.decodedBodySize,
      }));
      const heroResourceStarts = resources
        .filter((entry) => entry.name.includes('/images/liquid-perception-hero-'))
        .map((entry) => entry.startTime);
      const lowerGalleryResourcesBeforeScroll = resources
        .filter((entry) =>
          /\/images\/(?:psychedelic-bathroom|ferdigcop-video-poster)-/.test(entry.name),
        )
        .map((entry) => entry.name);

      return {
        firstContentfulPaint: paints['first-contentful-paint'] ?? null,
        heroRequestStart: heroResourceStarts.length ? Math.min(...heroResourceStarts) : null,
        lowerGalleryResourcesBeforeScroll,
        resources,
      };
    });

    await page.evaluate(() => document.querySelector('#work')?.scrollIntoView({ block: 'start' }));
    const galleryScrollStart = Date.now();
    await page.waitForFunction(() => {
      const firstImage = document.querySelector('#work img');
      return Boolean(firstImage?.complete && firstImage.naturalWidth > 0);
    }, { timeout: 60000 });
    const firstGalleryReadyAfterScroll = Date.now() - galleryScrollStart;

    let firstGalleryUpgradeAfterScroll = null;
    await page.waitForFunction(() => {
      const firstImage = document.querySelector('#work img');
      return Boolean(firstImage?.currentSrc && /-1024\.webp(?:$|\?)/.test(firstImage.currentSrc));
    }, { timeout: 8000 }).then(() => {
      firstGalleryUpgradeAfterScroll = Date.now() - galleryScrollStart;
    }).catch(() => undefined);

    await page.waitForTimeout(250);
    const afterGalleryMetrics = await page.evaluate(() => {
      const origin = location.origin;
      const firstImage = document.querySelector('#work img');
      const firstCard = document.querySelector('#work button');
      const grid = document.querySelector('#work .grid');

      return {
        firstGalleryImageSrc: firstImage?.currentSrc
          ? (firstImage.currentSrc.startsWith(origin) ? firstImage.currentSrc.slice(origin.length) : firstImage.currentSrc)
          : null,
        firstGalleryImageNaturalWidth: firstImage?.naturalWidth ?? null,
        firstCardOpacity: firstCard ? getComputedStyle(firstCard.closest('[style]') ?? firstCard).opacity : null,
        gridOpacity: grid ? getComputedStyle(grid).opacity : null,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        shaderCanvasCount: document.querySelectorAll('canvas').length,
        resourceSummary: performance.getEntriesByType('resource').map((entry) => ({
          name: entry.name.startsWith(origin) ? entry.name.slice(origin.length) : entry.name,
          startTime: Math.round(entry.startTime),
          duration: Math.round(entry.duration),
          transferSize: entry.transferSize,
          decodedBodySize: entry.decodedBodySize,
        })),
      };
    });

    const failures = [];
    const fcp = topMetrics.firstContentfulPaint;
    const heroRequestStart = topMetrics.heroRequestStart;

    if (fcp === null || fcp > THRESHOLDS.fcpMs) {
      failures.push(`FCP ${fcp ?? 'missing'}ms exceeded ${THRESHOLDS.fcpMs}ms`);
    }

    if (heroRequestStart === null || heroRequestStart > THRESHOLDS.heroRequestStartMs) {
      failures.push(`hero image request start ${heroRequestStart ?? 'missing'}ms exceeded ${THRESHOLDS.heroRequestStartMs}ms`);
    }

    if (topMetrics.lowerGalleryResourcesBeforeScroll.length > 0) {
      failures.push(
        `lower-priority gallery images loaded before scroll: ${topMetrics.lowerGalleryResourcesBeforeScroll.join(', ')}`,
      );
    }

    if (firstGalleryReadyAfterScroll > THRESHOLDS.firstGalleryReadyAfterScrollMs) {
      failures.push(
        `first gallery image ready ${firstGalleryReadyAfterScroll}ms after scroll exceeded ${THRESHOLDS.firstGalleryReadyAfterScrollMs}ms`,
      );
    }

    if (afterGalleryMetrics.firstCardOpacity === '0' || afterGalleryMetrics.gridOpacity === '0') {
      failures.push('gallery card shell was still hidden at opacity 0 after scroll');
    }

    if (!afterGalleryMetrics.firstGalleryImageSrc || !/-1024\.webp(?:$|\?)/.test(afterGalleryMetrics.firstGalleryImageSrc)) {
      failures.push('first gallery image did not resolve to the 1024w mobile candidate');
    }

    if (afterGalleryMetrics.horizontalOverflow) {
      failures.push('mobile viewport has horizontal overflow');
    }

    if (consoleMessages.some((message) => /GPU stall|ReadPixels/i.test(message))) {
      failures.push('console still contains GPU stall / ReadPixels warnings');
    }

    const result = {
      url: TARGET_URL,
      profile: {
        viewport: VIEWPORT,
        deviceScaleFactor: 3,
        network: 'Fast 4G',
        cpuThrottleRate: CPU_THROTTLE_RATE,
      },
      metrics: {
        firstContentfulPaint: round(fcp),
        heroRequestStart: round(heroRequestStart),
        lowerGalleryResourcesBeforeScroll: topMetrics.lowerGalleryResourcesBeforeScroll,
        firstGalleryReadyAfterScroll,
        firstGalleryUpgradeAfterScroll,
        firstGalleryImageSrc: afterGalleryMetrics.firstGalleryImageSrc,
        firstGalleryImageNaturalWidth: afterGalleryMetrics.firstGalleryImageNaturalWidth,
        firstCardOpacity: afterGalleryMetrics.firstCardOpacity,
        gridOpacity: afterGalleryMetrics.gridOpacity,
        shaderCanvasCount: afterGalleryMetrics.shaderCanvasCount,
      },
      notableResources: afterGalleryMetrics.resourceSummary
        .filter((entry) => /assets\/|liquid-perception|psychedelic-bathroom|ferdigcop|typekit/.test(entry.name))
        .sort((a, b) => a.startTime - b.startTime),
      consoleMessages,
      thresholds: THRESHOLDS,
      failures,
    };

    console.log(JSON.stringify(result, null, 2));

    if (failures.length > 0) {
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

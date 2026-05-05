import { expect, test } from '@playwright/test';

test('portfolio boots and the gallery shell is present', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Whoamiii/i);
  await expect(page.getByTestId('scroll-progress')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: /Altered Perceptions\./i })).toBeVisible();
  await expect(page.getByTestId('hero-title-visual')).toHaveCount(1);
  await expect(page.getByText(/Psychedelic Art Portfolio/i)).toBeVisible();
  await expect(
    page.getByText(/Digital paintings and dream-burned color studies from altered states\./i),
  ).toBeVisible();
  await expect(page.getByText(/PORTFOLIO HIGHLIGHTS/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Selected Works\./i })).toBeVisible();
  await expect(page.getByRole('region', { name: /Selected Works\./i })).toBeVisible();
  await expect(
    page.getByText(/Dream-burned paintings and digital artifacts pulled from the archive\./i),
  ).toBeVisible();
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByTestId('site-header').getByRole('link', { name: /whoamiii/i })).toBeVisible();
  await expect(page.getByText(/Artist Portfolio/i)).toHaveCount(0);

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.5));

  await expect(
    page.getByRole('heading', { name: /Let's Create Something Trippy\./i }),
  ).toBeVisible();
  await expect(page.getByRole('contentinfo').getByRole('link', { name: /whoamiii/i })).toBeVisible();
  await expect(
    page.getByText(/Psychedelic paintings, altered-state studies, and commission inquiries from the archive\./i),
  ).toBeVisible();
  await expect(
    page.getByText(new RegExp(`© ${new Date().getFullYear()} Whoamiii\\. All rights reserved\\.`, 'i')),
  ).toBeVisible();

  const heroImage = page.locator('section').first().locator('img').first();
  await expect(heroImage).not.toHaveClass(/animate-hue-breathe/);
  await expect(heroImage).toHaveAttribute('width', '1672');
  await expect(heroImage).toHaveAttribute('height', '941');

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://whoamiii.art/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://whoamiii.art/social-preview.png',
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  );

  const aboutImage = page.getByRole('img', {
    name: /portrait of the artist in a hooded sweatshirt/i,
  });
  await expect(aboutImage).toHaveAttribute('src', /\/images\/about-portrait-800\.webp$/);
  await expect(aboutImage).toHaveAttribute('srcset', /about-portrait-1200\.webp 1200w/);
  await expect(aboutImage).toHaveAttribute('loading', 'lazy');
});

test('skip link lands on main content and artwork modal opens and closes', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: /skip to content/i });
  await expect(skipLink).toBeVisible();
  await skipLink.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator('#main-content')).toBeFocused();

  const artworkButton = page.getByRole('button', {
    name: /view liquid perception.*artwork/i,
  });
  await artworkButton.click();

  const dialog = page.getByRole('dialog', {
    name: /liquid perception/i,
  });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: /close modal/i })).toBeFocused();
  await expect
    .poll(() =>
      page.locator('[aria-controls]').evaluateAll((nodes) =>
        nodes
          .map((node) => node.getAttribute('aria-controls'))
          .filter((id): id is string => typeof id === 'string' && !document.getElementById(id)),
      ),
    )
    .toEqual([]);

  await expect(
    dialog.getByRole('img', {
      name: /surreal hooded forest portrait/i,
    }),
  ).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(artworkButton).toBeFocused();
});

test('mobile workflow modal opens, advances steps, and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#work');

  const workflowButton = page.getByRole('button', {
    name: /open larger view and notes for step 1: computational framework/i,
  });
  await workflowButton.scrollIntoViewIfNeeded();
  await workflowButton.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: /computational framework/i })).toBeVisible();

  const dialogBounds = await dialog.boundingBox();
  expect(dialogBounds).not.toBeNull();
  expect(dialogBounds!.x).toBeLessThanOrEqual(1);
  expect(dialogBounds!.y).toBeLessThanOrEqual(1);
  expect(dialogBounds!.width).toBeGreaterThanOrEqual(389);
  expect(dialogBounds!.height).toBeGreaterThanOrEqual(843);

  await expect(
    dialog.getByRole('img', {
      name: /computational framework for psychedelic visual phenomena/i,
    }),
  ).toBeVisible();
  await expect(dialog.getByRole('heading', { name: /what this step is doing/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /close workflow step details/i })).toBeFocused();

  await dialog.getByRole('button', { name: /^next$/i }).click();
  await expect(dialog.getByRole('heading', { name: /simulation stages/i })).toBeVisible();
  await expect(dialog.getByText(/from receptor to visible simulation/i)).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(workflowButton).toBeFocused();
});

test('fourth gallery card opens the Ferdigcop video modal', async ({ page }) => {
  await page.goto('/#work');

  const videoButton = page.getByRole('button', {
    name: /view ferdigcop.*video/i,
  });
  await videoButton.scrollIntoViewIfNeeded();
  await videoButton.click();

  const dialog = page.getByRole('dialog', {
    name: /ferdigcop/i,
  });
  await expect(dialog).toBeVisible();

  const video = dialog.locator('video');
  await expect(video).toBeVisible();
  await expect(video).toHaveJSProperty('autoplay', true);
  await expect(video).toHaveJSProperty('muted', true);
  await expect(video).toHaveAttribute('preload', 'metadata');
  await expect(video.locator('source')).toHaveAttribute('src', '/videos/ferdigcop-gallery.mp4');
  await expect
    .poll(() => video.evaluate((element) => !(element as HTMLVideoElement).paused))
    .toBe(true);

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(videoButton).toBeFocused();
});

test('mobile menu traps focus and restores it to the trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const menuButton = page.getByRole('button', { name: /open menu/i });
  await menuButton.click();

  const dialog = page.getByRole('dialog', { name: /navigation menu/i });
  const dialogCloseButton = dialog.getByRole('button', { name: /close menu/i });
  const mobileContactCta = dialog.getByRole('button', { name: /get in touch/i });
  await expect(dialog).toBeVisible();
  await expect(dialogCloseButton).toBeFocused();
  await expect(mobileContactCta).toBeVisible();

  await page.keyboard.press('Shift+Tab');
  await expect(mobileContactCta).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(dialogCloseButton).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(menuButton).toBeFocused();
});

test('narrow mobile header exposes a coherent menu trigger and dialog CTA', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');

  const menuButton = page.locator('.site-reference-menu-trigger');
  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAccessibleName(/open menu/i);
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).toHaveAttribute('aria-haspopup', 'dialog');
  await expect(menuButton).not.toHaveAttribute('aria-controls');

  const menuBounds = await menuButton.boundingBox();
  expect(menuBounds).not.toBeNull();
  expect(menuBounds!.x + menuBounds!.width).toBeLessThanOrEqual(320);

  await menuButton.click();
  await expect(menuButton).toHaveAccessibleName(/close navigation menu/i);
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('dialog', { name: /navigation menu/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^close menu$/i })).toHaveCount(1);
  await expect(page.getByRole('button', { name: /get in touch/i })).toBeVisible();
  await expect
    .poll(() =>
      page.locator('[aria-controls]').evaluateAll((nodes) =>
        nodes
          .map((node) => node.getAttribute('aria-controls'))
          .filter((id): id is string => typeof id === 'string' && !document.getElementById(id)),
      ),
    )
    .toEqual([]);
});

test('mobile header keeps the hamburger lines centered in the glass bubble', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const geometry = await page.evaluate(() => {
    const header = document.querySelector('[data-testid="site-header"]');
    const mobileSurface = document.querySelector('.site-reference-glass-surface--mobile');
    const menuButton = document.querySelector('.site-reference-menu-trigger');
    const menuLines = document.querySelector('.site-reference-menu-trigger-lines');

    if (!header || !mobileSurface || !menuButton || !menuLines) {
      return null;
    }

    const surfaceRect = mobileSurface.getBoundingClientRect();
    const buttonRect = menuButton.getBoundingClientRect();
    const linesRect = menuLines.getBoundingClientRect();
    const expectedLineCenterX = surfaceRect.left + surfaceRect.width * (362 / 390);
    const expectedButtonCenterX = surfaceRect.left + surfaceRect.width * (362 / 390);
    const expectedCenterY = surfaceRect.top + surfaceRect.height * (43 / 88);
    const lineCenterX = linesRect.left + linesRect.width / 2;
    const lineCenterY = linesRect.top + linesRect.height / 2;
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;

    return {
      buttonDeltaX: Math.abs(buttonCenterX - expectedButtonCenterX),
      buttonDeltaY: Math.abs(buttonCenterY - expectedCenterY),
      lineDeltaX: Math.abs(lineCenterX - expectedLineCenterX),
      lineDeltaY: Math.abs(lineCenterY - expectedCenterY),
      lineCount: menuLines.querySelectorAll('span').length,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
    };
  });

  expect(geometry).not.toBeNull();
  expect(geometry!.lineCount).toBe(3);
  expect(geometry!.lineDeltaX).toBeLessThanOrEqual(3);
  expect(geometry!.lineDeltaY).toBeLessThanOrEqual(3);
  expect(geometry!.buttonDeltaX).toBeLessThanOrEqual(4);
  expect(geometry!.buttonDeltaY).toBeLessThanOrEqual(4);
  expect(geometry!.overflowX).toBeLessThanOrEqual(0);
});

test('absolute site header scrolls away with the hero instead of staying fixed', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Selected Works\./i })).toBeVisible();
  await page.waitForFunction(() => document.documentElement.scrollHeight > window.innerHeight + 200);

  const scrollState = await page.evaluate(async () => {
    const header = document.querySelector('[data-testid="site-header"]');

    if (!header) {
      return null;
    }

    const beforeTop = header.getBoundingClientRect().top;
    const previousHtmlScrollBehavior = document.documentElement.style.scrollBehavior;
    const previousBodyScrollBehavior = document.body.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';

    const maxScrollY = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    ) - window.innerHeight;
    const targetScrollY = Math.min(900, Math.max(80, maxScrollY));

    window.scrollTo(0, targetScrollY);
    const startedAt = performance.now();
    while (window.scrollY === 0 && performance.now() - startedAt < 1000) {
      window.scrollTo(0, targetScrollY);
      await new Promise((resolve) => window.setTimeout(resolve, 50));
    }
    const afterTop = header.getBoundingClientRect().top;
    document.documentElement.style.scrollBehavior = previousHtmlScrollBehavior;
    document.body.style.scrollBehavior = previousBodyScrollBehavior;

    return {
      afterTop,
      beforeTop,
      position: getComputedStyle(header).position,
      scrollY: window.scrollY,
      targetScrollY,
    };
  });

  expect(scrollState).not.toBeNull();
  expect(scrollState!.position).toBe('absolute');
  expect(scrollState!.targetScrollY).toBeGreaterThan(0);
  expect(scrollState!.scrollY).toBeGreaterThan(0);
  expect(scrollState!.afterTop).toBeLessThan(scrollState!.beforeTop - 40);
});

test('menu section buttons scroll to and focus target sections with breathing room', async ({
  page,
}) => {
  await page.goto('/');

  const sections = [
    { label: 'Work', id: 'work', menuLabel: /work/i },
    { label: 'About', id: 'about', menuLabel: /about/i },
    { label: 'Contact', id: 'contact', menuLabel: /get in touch/i },
  ] as const;

  for (const section of sections) {
    await page.getByRole('button', { name: /open menu/i }).click();
    const menu = page.getByRole('dialog', { name: /navigation menu/i });
    await expect(menu).toBeVisible();
    await menu.getByRole('button', { name: section.menuLabel }).click();
    await expect(menu).toHaveCount(0);

    await expect
      .poll(
        () =>
          page.evaluate((sectionId) => {
            const target = document.getElementById(sectionId);
            const nav = document.querySelector('[data-testid="site-header"]');

            if (!target || !nav) {
              return false;
            }

            const targetRect = target.getBoundingClientRect();
            const navRect = nav.getBoundingClientRect();

            return document.activeElement === target && targetRect.top - navRect.bottom >= 12;
          }, section.id),
        {
          message: `${section.label} section should be focused and clear of the header`,
          timeout: 3000,
        },
      )
      .toBe(true);
  }
});

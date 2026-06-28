import { expect, test } from '@playwright/test';

test('portfolio boots and the gallery shell is present', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Whoamiii/i);
  await expect(page.getByTestId('scroll-progress')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: /Endrede sanseflater\./i })).toBeVisible();
  await expect(page.getByTestId('hero-title-visual')).toHaveCount(1);
  await expect(page.getByText(/Psykedelisk kunstportefølje/i)).toBeVisible();
  await expect(
    page.getByText(/Bilder fra den andre siden av glasset\./i),
  ).toBeVisible();
  await page.evaluate(() => document.querySelector('#work')?.scrollIntoView({ block: 'start' }));
  await page.waitForFunction(() => Boolean(document.querySelector('#work')));

  await expect(page.getByText(/PORTFØLJEUTVALG/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Utvalgte verk\./i })).toBeVisible();
  await expect(page.getByRole('region', { name: /Utvalgte verk\./i })).toBeVisible();
  await expect(
    page.getByText(/Drømmebrente bilder og digitale artefakter hentet fra arkivet\./i),
  ).toBeVisible();
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByTestId('site-header').getByRole('link', { name: /whoamiii/i })).toBeVisible();
  await expect(page.getByText(/Artist Portfolio/i)).toHaveCount(0);

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.5));

  await expect(
    page.getByRole('heading', { name: /La oss lage noe trippy\./i }),
  ).toBeVisible();
  await expect(page.getByRole('contentinfo').getByRole('link', { name: /whoamiii/i })).toBeVisible();
  await expect(
    page.getByText(/Åpen for oppdrag, samarbeid og utstillinger\./i),
  ).toBeVisible();
  await expect(
    page.getByText(new RegExp(`© ${new Date().getFullYear()} Whoamiii\\. Alle rettigheter reservert\\.`, 'i')),
  ).toBeVisible();

  const heroImage = page.locator('section').first().locator('img').first();
  await expect(heroImage).not.toHaveClass(/animate-hue-breathe/);
  await expect(heroImage).toHaveAttribute('width', '1672');
  await expect(heroImage).toHaveAttribute('height', '941');

  const heroImageGeometry = await heroImage.evaluate((element) => {
    const rect = element.getBoundingClientRect();

    return {
      bottom: rect.bottom,
      top: rect.top,
      viewportHeight: window.innerHeight,
    };
  });

  expect(heroImageGeometry.top).toBeLessThan(-heroImageGeometry.viewportHeight * 0.45);
  expect(heroImageGeometry.bottom).toBeGreaterThan(heroImageGeometry.viewportHeight);

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
    name: /modifisert selvportrett av kunstneren/i,
  });
  await expect(aboutImage).toHaveAttribute('src', /\/images\/liquid-perception-800\.webp$/);
  await expect(aboutImage).toHaveAttribute('srcset', /liquid-perception-1200\.webp 1200w/);
  await expect(aboutImage).toHaveAttribute('loading', 'lazy');
});

test('skip link lands on main content and artwork modal opens and closes', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: /hopp til innhold/i });
  await expect(skipLink).toBeVisible();
  await skipLink.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator('#main-content')).toBeFocused();

  const artworkButton = page.getByRole('button', {
    name: /se soppoffer.*verk/i,
  });
  await artworkButton.click();

  const dialog = page.getByRole('dialog', {
    name: /soppoffer/i,
  });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: /lukk modal/i })).toBeFocused();
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
      name: /hånd som holder en sopp/i,
    }),
  ).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(artworkButton).toBeFocused();
});

test('mobile process video card loads and exposes playback control', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#work');

  const processCard = page.getByTestId('workflow-process-card');
  await processCard.scrollIntoViewIfNeeded();

  await expect(processCard.getByRole('heading', { name: /kaffe i bevegelse/i })).toBeVisible();
  await expect(processCard.getByText(/prosessfilm/i)).toBeVisible();

  const processVideo = processCard.getByTestId('workflow-process-video');
  await expect(processVideo).toBeVisible();
  await expect(processVideo).toHaveAttribute('width', '720');
  await expect(processVideo).toHaveAttribute('height', '1160');
  await expect(processVideo).toHaveAttribute('poster', '/images/cup-coffee-process-poster.webp');
  await expect(processVideo).toHaveJSProperty('muted', true);
  await expect(processVideo).toHaveJSProperty('autoplay', true);
  await expect(processVideo.locator('source')).toHaveAttribute(
    'src',
    '/videos/cup-coffee-process.mp4',
  );

  await expect
    .poll(() =>
      processVideo.evaluate((element) => {
        if (!(element instanceof HTMLVideoElement)) {
          return false;
        }

        return !element.paused;
      }),
    )
    .toBe(true);

  const playbackButton = processCard.getByRole('button', {
    name: /pause prosessvideo med kopp og kaffe/i,
  });
  await playbackButton.click();

  await expect
    .poll(() =>
      processVideo.evaluate((element) => {
        if (!(element instanceof HTMLVideoElement)) {
          return false;
        }

        return element.paused;
      }),
    )
    .toBe(true);

  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
    .toBeLessThanOrEqual(0);
});

test('third gallery card opens the Håndportal video modal', async ({ page }) => {
  await page.goto('/#work');

  const videoButton = page.getByRole('button', {
    name: /se håndportal.*video/i,
  });
  await videoButton.scrollIntoViewIfNeeded();
  await videoButton.click();

  const dialog = page.getByRole('dialog', {
    name: /håndportal/i,
  });
  await expect(dialog).toBeVisible();

  const video = dialog.locator('video');
  await expect(video).toBeVisible();
  await expect(video).toHaveJSProperty('autoplay', true);
  await expect(video).toHaveJSProperty('muted', true);
  await expect(video).toHaveAttribute('preload', 'metadata');
  await expect(video.locator('source')).toHaveAttribute('src', '/videos/hand-portal-study.mp4');
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

  const menuButton = page.locator('.site-header-menu-trigger');
  await expect(menuButton).toHaveAccessibleName(/åpne meny/i);
  await menuButton.click();

  const dialog = page.getByRole('dialog', { name: /navigasjonsmeny/i });
  const closeButton = dialog.getByRole('button', { name: /^lukk meny$/i });
  const mobileContactCta = dialog.getByRole('button', { name: /ta kontakt/i });
  await expect(dialog).toBeVisible();
  await expect(closeButton).toBeFocused();
  await expect(mobileContactCta).toBeVisible();

  await page.keyboard.press('Shift+Tab');
  await expect(mobileContactCta).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(closeButton).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(menuButton).toBeFocused();
});

test('narrow mobile header exposes a coherent menu trigger and dialog CTA', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');

  const menuButton = page.locator('.site-header-menu-trigger');
  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAccessibleName(/åpne meny/i);
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).toHaveAttribute('aria-haspopup', 'dialog');
  await expect(menuButton).not.toHaveAttribute('aria-controls');

  const menuBounds = await menuButton.boundingBox();
  expect(menuBounds).not.toBeNull();
  expect(menuBounds!.x + menuBounds!.width).toBeLessThanOrEqual(320);

  await menuButton.click();
  await expect(menuButton).toHaveAccessibleName(/lukk navigasjonsmeny/i);
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');
  const dialog = page.getByRole('dialog', { name: /navigasjonsmeny/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: /^lukk meny$/i })).toBeVisible();
  await expect(dialog.getByRole('button', { name: /ta kontakt/i })).toBeVisible();
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
    const menuButton = document.querySelector('.site-header-menu-trigger');
    const menuLines = document.querySelector('.site-header-menu-trigger-lines');

    if (!header || !menuButton || !menuLines) {
      return null;
    }

    const headerRect = header.getBoundingClientRect();
    const buttonRect = menuButton.getBoundingClientRect();
    const linesRect = menuLines.getBoundingClientRect();
    const expectedLineCenterX = buttonRect.left + buttonRect.width / 2;
    const expectedCenterY = buttonRect.top + buttonRect.height / 2;
    const lineCenterX = linesRect.left + linesRect.width / 2;
    const lineCenterY = linesRect.top + linesRect.height / 2;

    return {
      buttonRight: buttonRect.right,
      headerRight: headerRect.right,
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
  expect(geometry!.buttonRight).toBeLessThanOrEqual(geometry!.headerRight);
  expect(geometry!.overflowX).toBeLessThanOrEqual(0);
});

test('absolute site header scrolls away with the hero instead of staying fixed', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Utvalgte verk\./i })).toBeVisible();
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
    { label: 'Verk', id: 'work', menuLabel: /verk/i },
    { label: 'Om', id: 'about', menuLabel: /om/i },
    { label: 'Kontakt', id: 'contact', menuLabel: /ta kontakt/i },
  ] as const;

  for (const section of sections) {
    await page.getByRole('button', { name: /åpne meny/i }).click();
    const menu = page.getByRole('dialog', { name: /navigasjonsmeny/i });
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

            return (
              document.activeElement === target
              && targetRect.top - navRect.bottom >= 12
              && targetRect.top <= window.innerHeight * 0.28
            );
          }, section.id),
        {
          message: `${section.label} section should be focused, clear of the header, and not land too low`,
          timeout: 3000,
        },
      )
      .toBe(true);
  }
});

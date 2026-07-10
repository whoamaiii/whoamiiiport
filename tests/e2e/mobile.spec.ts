import { expect, test, type Page } from '@playwright/test';

async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
    .toBeLessThanOrEqual(0);
}

async function expectSectionLanding(
  page: Page,
  sectionId: string,
  options: { expectFocused?: boolean } = {},
) {
  await expect
    .poll(
      () =>
        page.evaluate(
          ({ expectFocused, sectionId }) => {
            const section = document.getElementById(sectionId);
            if (!section) return false;

            const rect = section.getBoundingClientRect();
            return (
              rect.top <= 2
              && rect.bottom > 0
              && document.documentElement.scrollWidth <= window.innerWidth
              && (!expectFocused || document.activeElement === section)
            );
          },
          { expectFocused: options.expectFocused ?? false, sectionId },
        ),
      { message: `${sectionId} should align to the top of the mobile viewport`, timeout: 6000 },
    )
    .toBe(true);
}

test('mobile first viewport presents the identity without overflow', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Whoamiii/i);
  await expect(page.getByRole('heading', { name: 'Altered perception.' })).toBeVisible();
  await expect(
    page.getByText(/Personal photographs pushed into unstable encounters/i),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /Enter the archive/i })).toBeVisible();

  const geometry = await page.evaluate(() => {
    const header = document.querySelector('[data-testid="site-header"]');
    const hero = document.querySelector('.hero-section');
    const heading = document.querySelector('.hero-heading');
    const image = document.querySelector('.hero-background-image');

    const rectFor = (element: Element | null) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { bottom: rect.bottom, left: rect.left, right: rect.right, top: rect.top };
    };

    return {
      header: rectFor(header),
      heading: rectFor(heading),
      hero: rectFor(hero),
      image: rectFor(image),
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
    };
  });

  expect(geometry.overflowX).toBeLessThanOrEqual(0);
  expect(geometry.header).not.toBeNull();
  expect(geometry.heading).not.toBeNull();
  expect(geometry.hero).not.toBeNull();
  expect(geometry.image).not.toBeNull();
  expect(geometry.hero?.top).toBeLessThanOrEqual(0);
  expect(geometry.hero?.bottom).toBeGreaterThanOrEqual(geometry.viewportHeight);
  expect(geometry.heading?.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
  expect(geometry.header?.left).toBeGreaterThanOrEqual(0);
  expect(geometry.header?.right).toBeLessThanOrEqual(geometry.viewportWidth);

  const menuButton = page.getByRole('button', { name: 'Open menu' });
  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).not.toHaveAttribute('aria-controls');
});

test('mobile editorial sections keep deliberate scale and reading measure', async ({ page }) => {
  await page.goto('/#work');
  await page.locator('#selected-works-heading').waitFor({ state: 'visible' });

  const workGeometry = await page.locator('#work').evaluate((section) => {
    const heading = section.querySelector('#selected-works-heading');
    const intro = section.querySelector('.editorial-intro');
    const firstArtwork = section.querySelector('.selected-work-item');
    const headingRect = heading?.getBoundingClientRect();
    const introRect = intro?.getBoundingClientRect();
    const artworkRect = firstArtwork?.getBoundingClientRect();

    return {
      artworkWidth: artworkRect?.width ?? 0,
      headingFontSize: heading ? Number.parseFloat(getComputedStyle(heading).fontSize) : 0,
      headingWidth: headingRect?.width ?? 0,
      introWidth: introRect?.width ?? 0,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
    };
  });

  expect(workGeometry.headingFontSize).toBeGreaterThanOrEqual(64);
  expect(workGeometry.headingWidth).toBeLessThanOrEqual(390);
  expect(workGeometry.introWidth).toBeLessThanOrEqual(330);
  expect(workGeometry.artworkWidth).toBeGreaterThan(250);
  expect(workGeometry.overflowX).toBeLessThanOrEqual(0);

  await page.goto('/#about');
  await page.locator('#about-heading').waitFor({ state: 'visible' });

  const aboutGeometry = await page.locator('#about').evaluate((section) => {
    const heading = section.querySelector('#about-heading');
    const portrait = section.querySelector('.about-portrait');
    const copy = section.querySelector('.about-copy');
    const headingRect = heading?.getBoundingClientRect();
    const portraitRect = portrait?.getBoundingClientRect();
    const copyRect = copy?.getBoundingClientRect();

    return {
      copyWidth: copyRect?.width ?? 0,
      headingBottom: headingRect?.bottom ?? 0,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      portraitTop: portraitRect?.top ?? 0,
      portraitWidth: portraitRect?.width ?? 0,
    };
  });

  expect(aboutGeometry.portraitTop).toBeGreaterThanOrEqual(aboutGeometry.headingBottom - 24);
  expect(aboutGeometry.portraitWidth).toBeGreaterThan(300);
  expect(aboutGeometry.copyWidth).toBeLessThanOrEqual(330);
  expect(aboutGeometry.overflowX).toBeLessThanOrEqual(0);
});

test('mobile menu traps focus, navigates, and restores focus', async ({ page }) => {
  await page.goto('/');

  const trigger = page.locator('.site-header-menu-trigger');
  await expect(trigger).toHaveAccessibleName('Open menu');
  await trigger.click();

  const menu = page.getByRole('dialog', { name: 'Index / Whoamiii' });
  const closeButton = menu.getByRole('button', { name: 'Close menu' });
  const contactButton = menu.getByRole('button', { name: 'Contact' });

  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-controls', 'mobile-menu');
  await expect(closeButton).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(contactButton).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(closeButton).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();

  await trigger.click();
  await menu.getByRole('button', { name: 'Archive' }).click();
  await expect(menu).toHaveCount(0);
  await expectSectionLanding(page, 'gallery', { expectFocused: true });
});

test('mobile direct hashes load and align lazy sections', async ({ page }) => {
  for (const id of ['work', 'gallery', 'about', 'contact', 'gallery-hand-portals']) {
    await page.goto('about:blank');
    await page.goto(`/#${id}`);
    await expectSectionLanding(page, id);
  }
});

test('mobile archive progressively reveals one chapter', async ({ page }) => {
  await page.goto('/#gallery');

  const rooms = page.getByRole('button', { name: /Rooms.*10 works/i });
  const surfaces = page.getByRole('button', { name: /Domestic surfaces/i });
  await expect(rooms).toHaveAttribute('aria-expanded', 'false');
  await rooms.click();
  await expect(rooms).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#archive-panel-liminal-rooms')).toBeVisible();
  await expect(page.locator('#archive-panel-liminal-rooms .artwork-card-trigger')).toHaveCount(10);

  await surfaces.click();
  await expect(rooms).toHaveAttribute('aria-expanded', 'false');
  await expect(surfaces).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#archive-panel-liminal-rooms')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

test('mobile artwork modal covers the viewport and restores focus', async ({ page }) => {
  await page.goto('/#work');

  const artworkButton = page.getByRole('button', {
    name: /View Optisk fokus video and artist notes/i,
  });
  await artworkButton.click();

  const dialog = page.getByRole('dialog', { name: /Optisk fokus artwork details/i });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close artwork' })).toBeFocused();
  await expect(dialog.getByRole('button', { name: 'Read meaning + process' })).toBeVisible();

  const bounds = await dialog.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds?.x).toBeLessThanOrEqual(1);
  expect(bounds?.y).toBeLessThanOrEqual(1);
  expect(bounds?.width).toBeGreaterThanOrEqual(389);
  expect(bounds?.height).toBeGreaterThanOrEqual(843);

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(artworkButton).toBeFocused();
});

test('contact and fixed header remain legible on a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/#contact');

  await expect(page.getByRole('heading', { name: 'Make something strange with me.' })).toBeVisible();
  await expect(page.getByRole('link', { name: /hello@whoamiii.art/i })).toBeVisible();
  await expect(page.getByTestId('site-header')).toHaveCSS('position', 'fixed');

  const geometry = await page.evaluate(() => {
    const heading = document.querySelector('#contact-heading');
    const trigger = document.querySelector('.site-header-menu-trigger');
    const headingRect = heading?.getBoundingClientRect();
    const triggerRect = trigger?.getBoundingClientRect();

    return {
      headingLeft: headingRect?.left ?? -1,
      headingRight: headingRect?.right ?? 321,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      triggerRight: triggerRect?.right ?? 321,
    };
  });

  expect(geometry.headingLeft).toBeGreaterThanOrEqual(0);
  expect(geometry.headingRight).toBeLessThanOrEqual(320);
  expect(geometry.triggerRight).toBeLessThanOrEqual(320);
  expect(geometry.overflowX).toBeLessThanOrEqual(0);
});

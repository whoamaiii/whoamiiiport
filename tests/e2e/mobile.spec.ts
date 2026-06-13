import { expect, test, type Page } from '@playwright/test';

const MOBILE_SECTION_LANDING_MAX_VIEWPORT_RATIO = 0.28;

async function expectSectionLanding(
  page: Page,
  sectionId: string,
  label: string,
  options: { expectFocused?: boolean } = {},
) {
  await expect
    .poll(
      () =>
        page.evaluate(
          ({ expectFocused, maxViewportRatio, sectionId }) => {
            const section = document.getElementById(sectionId);
            const header = document.querySelector('[data-testid="site-header"]');

            if (!section || !header) {
              return false;
            }

            const sectionRect = section.getBoundingClientRect();
            const headerRect = header.getBoundingClientRect();
            const headerIsVisible = headerRect.bottom > 0 && headerRect.top < window.innerHeight;
            const sectionIsInViewport =
              sectionRect.top < window.innerHeight && sectionRect.bottom > 0;
            const sectionIsClearOfHeader =
              !headerIsVisible || sectionRect.top - headerRect.bottom >= 12;
            const sectionDoesNotLandTooLow =
              sectionRect.top <= window.innerHeight * maxViewportRatio;
            const hasNoHorizontalOverflow =
              document.documentElement.scrollWidth - window.innerWidth <= 0;
            const focusMatches = !expectFocused || document.activeElement === section;

            return (
              focusMatches
              && sectionIsInViewport
              && sectionIsClearOfHeader
              && sectionDoesNotLandTooLow
              && hasNoHorizontalOverflow
            );
          },
          {
            expectFocused: options.expectFocused ?? false,
            maxViewportRatio: MOBILE_SECTION_LANDING_MAX_VIEWPORT_RATIO,
            sectionId,
          },
        ),
      {
        message: `${label} should land visibly near the top of the mobile viewport`,
        timeout: 5000,
      },
    )
    .toBe(true);
}

test('mobile first viewport keeps hero and navigation coherent', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Whoamiii/i);

  const geometry = await page.evaluate(() => {
    const header = document.querySelector('[data-testid="site-header"]');
    const eyebrow = document.querySelector('.liquid-kicker');
    const heroTitle = document.querySelector('[data-testid="hero-title-visual"]');
    const subtitle = document.querySelector('.hero-subtitle');

    const rectFor = (element: Element | null) => {
      if (!element) {
        return null;
      }

      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
      };
    };

    return {
      eyebrow: rectFor(eyebrow),
      header: rectFor(header),
      heroTitle: rectFor(heroTitle),
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      subtitle: rectFor(subtitle),
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
    };
  });

  expect(geometry.overflowX).toBeLessThanOrEqual(0);
  expect(geometry.header).not.toBeNull();
  expect(geometry.eyebrow).not.toBeNull();
  expect(geometry.heroTitle).not.toBeNull();
  expect(geometry.subtitle).not.toBeNull();
  expect(geometry.header!.top).toBeGreaterThanOrEqual(0);
  expect(geometry.header!.left).toBeGreaterThanOrEqual(0);
  expect(geometry.header!.right).toBeLessThanOrEqual(geometry.viewportWidth);
  expect(geometry.header!.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
  expect(geometry.eyebrow!.top).toBeGreaterThan(geometry.header!.bottom);
  expect(geometry.eyebrow!.bottom).toBeLessThanOrEqual(geometry.heroTitle!.top);
  expect(geometry.heroTitle!.bottom).toBeLessThanOrEqual(geometry.subtitle!.top);
  expect(geometry.subtitle!.bottom).toBeLessThanOrEqual(geometry.viewportHeight);

  const menuButton = page.getByRole('button', { name: /open menu/i });
  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('heading', { name: /Altered Perceptions\./i })).toBeVisible();
  await expect(page.getByText(/Psychedelic Art Portfolio/i)).toBeVisible();
  await expect(
    page.getByText(/Digital paintings and dream-burned color studies from altered states\./i),
  ).toBeVisible();
});

test('mobile menu traps focus and closes back to the trigger', async ({ page }) => {
  await page.goto('/');

  const menuButton = page.locator('.site-reference-menu-trigger');
  await expect(menuButton).toHaveAccessibleName(/open menu/i);
  await menuButton.click();

  const menu = page.getByRole('dialog', { name: /navigation menu/i });
  const contactButton = menu.getByRole('button', { name: /get in touch/i });

  await expect(menu).toBeVisible();
  await expect(menuButton).toHaveAccessibleName(/close navigation menu/i);
  await expect(menuButton).toBeFocused();
  await expect(page.getByRole('button', { name: /^close menu$/i })).toHaveCount(0);

  await page.keyboard.press('Shift+Tab');
  await expect(contactButton).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(menuButton).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(menuButton).toBeFocused();
});

test('mobile menu lands target sections cleanly', async ({ page }) => {
  const targets = [
    { label: 'Work', id: 'work', menuLabel: /work/i },
    { label: 'About', id: 'about', menuLabel: /about/i },
    { label: 'Contact', id: 'contact', menuLabel: /get in touch/i },
  ] as const;

  for (const target of targets) {
    await page.goto('about:blank');
    await page.goto('/');
    await expect(page.getByRole('button', { name: /open menu/i })).toBeVisible();
    await page.getByRole('button', { name: /open menu/i }).click();

    const menu = page.getByRole('dialog', { name: /navigation menu/i });
    await expect(menu).toBeVisible();
    await menu.getByRole('button', { name: target.menuLabel }).click();
    await expect(menu).toHaveCount(0);

    await expectSectionLanding(page, target.id, target.label, { expectFocused: true });
  }
});

test('mobile direct hashes land target sections cleanly', async ({ page }) => {
  const targets = [
    { label: 'Work', id: 'work' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ] as const;

  for (const target of targets) {
    await page.goto('about:blank');
    await page.goto(`/#${target.id}`);
    await expectSectionLanding(page, target.id, target.label);
  }
});

test('mobile artwork modal covers the viewport and restores focus', async ({ page }) => {
  await page.goto('/#work');

  const artworkButton = page.getByRole('button', {
    name: /view mycelial hand/i,
  });
  await artworkButton.scrollIntoViewIfNeeded();
  await artworkButton.click();

  const dialog = page.getByRole('dialog', {
    name: /mycelial hand/i,
  });
  await expect(dialog).toBeVisible();
  await expect
    .poll(() =>
      page.locator('[aria-controls]').evaluateAll((nodes) =>
        nodes
          .map((node) => node.getAttribute('aria-controls'))
          .filter((id): id is string => typeof id === 'string' && !document.getElementById(id)),
      ),
    )
    .toEqual([]);

  const dialogBounds = await dialog.boundingBox();
  expect(dialogBounds).not.toBeNull();
  expect(dialogBounds!.x).toBeLessThanOrEqual(1);
  expect(dialogBounds!.y).toBeLessThanOrEqual(1);
  expect(dialogBounds!.width).toBeGreaterThanOrEqual(389);
  expect(dialogBounds!.height).toBeGreaterThanOrEqual(843);

  await expect(page.getByRole('button', { name: /close modal/i })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(artworkButton).toBeFocused();
});

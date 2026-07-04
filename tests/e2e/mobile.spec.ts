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
    const heroWords = Array.from(document.querySelectorAll('.hero-title-shader-word'));

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
      heroWordBleedY: heroWords.map((word) => {
        const rect = word.getBoundingClientRect();
        const style = window.getComputedStyle(word);
        const lineHeight = Number.parseFloat(style.lineHeight);

        return Number.isFinite(lineHeight) ? rect.height - lineHeight : 0;
      }),
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
  expect(geometry.subtitle).toBeNull();
  if (
    geometry.header === null
    || geometry.eyebrow === null
    || geometry.heroTitle === null
  ) {
    throw new Error('Mobile hero geometry should be available');
  }
  expect(geometry.header.top).toBeGreaterThanOrEqual(0);
  expect(geometry.header.left).toBeGreaterThanOrEqual(0);
  expect(geometry.header.right).toBeLessThanOrEqual(geometry.viewportWidth);
  expect(geometry.header.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
  expect(geometry.eyebrow.top).toBeGreaterThan(geometry.header.bottom);
  expect(geometry.eyebrow.bottom).toBeLessThanOrEqual(geometry.heroTitle.top);
  expect(geometry.heroTitle.bottom).toBeLessThanOrEqual(geometry.viewportHeight);
  expect(geometry.heroWordBleedY).toHaveLength(2);
  for (const bleedY of geometry.heroWordBleedY) {
    expect(bleedY).toBeGreaterThanOrEqual(12);
  }

  const menuButton = page.getByRole('button', { name: /åpne meny/i });
  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('heading', { name: /Altered perception\./i })).toBeVisible();
  await expect(page.getByText(/Psychedelic art portfolio/i)).toBeVisible();
  await expect(page.getByText(/Images from the other side of the glass\./i)).toHaveCount(0);
});

test('mobile shader headings keep the requested gallery scale and about placement', async ({
  page,
}) => {
  await page.goto('/#gallery');
  await page.locator('#gallery-library-heading').scrollIntoViewIfNeeded();

  const galleryGeometry = await page.locator('#gallery-library-heading').evaluate((heading) => {
    const rect = heading.getBoundingClientRect();
    const word = heading.querySelector('.section-shader-word');

    return {
      fontSize: Number.parseFloat(window.getComputedStyle(heading).fontSize),
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      visibleText: word?.getAttribute('data-text') ?? '',
      width: rect.width,
    };
  });

  expect(galleryGeometry.visibleText).toBe('Galleri.');
  expect(galleryGeometry.fontSize).toBeGreaterThanOrEqual(48);
  expect(galleryGeometry.width).toBeLessThanOrEqual(390);
  expect(galleryGeometry.overflowX).toBeLessThanOrEqual(0);

  await page.goto('/#about');
  await page.locator('#about-heading').scrollIntoViewIfNeeded();

  const aboutGeometry = await page.locator('#about').evaluate((section) => {
    const heading = section.querySelector('#about-heading');
    const portrait = section.querySelector('img');
    const word = section.querySelector('#about-heading .section-shader-word');

    if (!(heading instanceof HTMLElement) || !(portrait instanceof HTMLElement)) {
      return {
        found: false,
        headingBottom: 0,
        headingCenter: 0,
        imageCenter: 0,
        imageTop: 0,
        overflowX: document.documentElement.scrollWidth - window.innerWidth,
        visualLineCount: 0,
        visualText: '',
      };
    }

    const headingRect = heading.getBoundingClientRect();
    const portraitRect = portrait.getBoundingClientRect();

    return {
      found: true,
      headingBottom: headingRect.bottom,
      headingCenter: headingRect.left + headingRect.width / 2,
      imageCenter: portraitRect.left + portraitRect.width / 2,
      imageTop: portraitRect.top,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      visualLineCount: section.querySelectorAll('#about-heading .section-shader-word').length,
      visualText: word?.getAttribute('data-text') ?? '',
    };
  });

  expect(aboutGeometry.found).toBe(true);
  expect(aboutGeometry.visualText).toBe('Sinnet bak bildet');
  expect(aboutGeometry.visualLineCount).toBe(1);
  expect(Math.abs(aboutGeometry.headingCenter - aboutGeometry.imageCenter)).toBeLessThanOrEqual(28);
  expect(aboutGeometry.imageTop).toBeGreaterThan(aboutGeometry.headingBottom);
  expect(aboutGeometry.overflowX).toBeLessThanOrEqual(0);
});

test('mobile text blocks keep a deliberate reading measure', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.6));
  await page.locator('#selected-works-heading').waitFor({ state: 'visible' });

  const workGeometry = await page.locator('#work').evaluate((section) => {
    const button = section.querySelector('button');
    const subtitle = section.querySelector('.gallery-subtitle');
    const buttonRect = button?.getBoundingClientRect();
    const subtitleRect = subtitle?.getBoundingClientRect();

    return {
      buttonCenter:
        buttonRect === undefined ? null : buttonRect.left + buttonRect.width / 2,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      subtitleWidth: subtitleRect?.width ?? 0,
      viewportCenter: window.innerWidth / 2,
    };
  });

  expect(workGeometry.overflowX).toBeLessThanOrEqual(0);
  expect(workGeometry.subtitleWidth).toBeLessThanOrEqual(300);
  expect(workGeometry.buttonCenter).not.toBeNull();
  if (workGeometry.buttonCenter === null) {
    throw new Error('Selected works CTA should be measurable on mobile');
  }
  expect(Math.abs(workGeometry.buttonCenter - workGeometry.viewportCenter)).toBeLessThanOrEqual(18);

  await page.locator('#about-heading').scrollIntoViewIfNeeded();

  const aboutCopyGeometry = await page.locator('#about').evaluate((section) => {
    const copyBlocks = Array.from(section.querySelectorAll('.about-body-copy'));
    const socialRow = section.querySelector('.about-social-row');
    const firstCopyRect = copyBlocks[0]?.getBoundingClientRect();
    const copyRects = copyBlocks.map((block) => {
      const rect = block.getBoundingClientRect();

      return {
        left: rect.left,
        right: rect.right,
        width: rect.width,
      };
    });
    const socialRect = socialRow?.getBoundingClientRect();

    return {
      copyRects,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      socialLeft: socialRect?.left ?? null,
      firstCopyLeft: firstCopyRect?.left ?? null,
    };
  });

  expect(aboutCopyGeometry.copyRects).toHaveLength(2);
  for (const rect of aboutCopyGeometry.copyRects) {
    expect(rect.left).toBeGreaterThanOrEqual(40);
    expect(rect.right).toBeLessThanOrEqual(350);
    expect(rect.width).toBeLessThanOrEqual(300);
  }
  expect(aboutCopyGeometry.socialLeft).not.toBeNull();
  expect(aboutCopyGeometry.firstCopyLeft).not.toBeNull();
  if (
    aboutCopyGeometry.socialLeft === null
    || aboutCopyGeometry.firstCopyLeft === null
  ) {
    throw new Error('About social row and copy should be measurable on mobile');
  }
  expect(Math.abs(aboutCopyGeometry.socialLeft - aboutCopyGeometry.firstCopyLeft)).toBeLessThanOrEqual(2);
  expect(aboutCopyGeometry.overflowX).toBeLessThanOrEqual(0);
});

test('mobile menu traps focus and closes back to the trigger', async ({ page }) => {
  await page.goto('/');

  const menuButton = page.locator('.site-header-menu-trigger');
  await expect(menuButton).toHaveAccessibleName(/åpne meny/i);
  await menuButton.click();

  const menu = page.getByRole('dialog', { name: /navigasjonsmeny/i });
  const closeButton = menu.getByRole('button', { name: /lukk meny/i });
  const contactButton = menu.getByRole('button', { name: /ta kontakt/i });

  await expect(menu).toBeVisible();
  await expect(menuButton).toHaveAttribute('aria-label', /lukk navigasjonsmeny/i);
  await expect(menuButton).toHaveAttribute('aria-hidden', 'true');
  await expect(menuButton).toHaveAttribute('tabindex', '-1');
  await expect(closeButton).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(contactButton).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(closeButton).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(menuButton).toBeFocused();
});

test('mobile menu lands target sections cleanly', async ({ page }) => {
  const targets = [
    { label: 'Verk', id: 'work', menuLabel: /verk/i },
    { label: 'Om', id: 'about', menuLabel: /om/i },
    { label: 'Kontakt', id: 'contact', menuLabel: /ta kontakt/i },
  ] as const;

  for (const target of targets) {
    await page.goto('about:blank');
    await page.goto('/');
    await expect(page.getByRole('button', { name: /åpne meny/i })).toBeVisible();
    await page.getByRole('button', { name: /åpne meny/i }).click();

    const menu = page.getByRole('dialog', { name: /navigasjonsmeny/i });
    await expect(menu).toBeVisible();
    await menu.getByRole('button', { name: target.menuLabel }).click();
    await expect(menu).toHaveCount(0);

    await expectSectionLanding(page, target.id, target.label, { expectFocused: true });
  }
});

test('mobile direct hashes land target sections cleanly', async ({ page }) => {
  const targets = [
    { label: 'Verk', id: 'work' },
    { label: 'Om', id: 'about' },
    { label: 'Kontakt', id: 'contact' },
    { label: 'Galleri-gruppe', id: 'gallery-hand-portals' },
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
    name: /se optisk fokus/i,
  });
  await artworkButton.scrollIntoViewIfNeeded();
  await artworkButton.click();

  const dialog = page.getByRole('dialog', {
    name: /optisk fokus/i,
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
  if (dialogBounds === null) {
    throw new Error('Mobile artwork modal bounds should be available');
  }
  expect(dialogBounds.x).toBeLessThanOrEqual(1);
  expect(dialogBounds.y).toBeLessThanOrEqual(1);
  expect(dialogBounds.width).toBeGreaterThanOrEqual(389);
  expect(dialogBounds.height).toBeGreaterThanOrEqual(843);

  await expect(page.getByRole('button', { name: /lukk modal/i })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(artworkButton).toBeFocused();
});

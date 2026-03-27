import { expect, test } from '@playwright/test';

test('portfolio boots and the gallery shell is present', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Whoamiii/i);
  await expect(page.getByTestId('scroll-progress')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: /Altered Perceptions\./i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Selected Works/i })).toBeVisible();
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByText('Whoamiii.')).toBeVisible();
  await expect(page.getByText(/^WHOAMIII$/)).toHaveCount(0);

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

  const artworkButton = page.getByRole('button', {
    name: /view where snow holds time/i,
  });
  await artworkButton.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: /close modal/i })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(artworkButton).toBeFocused();
});

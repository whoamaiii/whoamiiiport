import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('portfolio boots with the new editorial identity and production metadata', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Whoamiii/i);
  await expect(page.getByTestId('scroll-progress')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Altered perception.' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Selected work' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The living archive' })).toHaveCount(0);
  await expect(page.getByRole('main')).toHaveCount(1);

  await page.getByRole('button', { name: /Open the living archive/i }).click();
  await expect(page.getByRole('heading', { name: 'The living archive' })).toBeVisible();
  await expect(page.getByText('49 works / 6 chapters')).toBeVisible();

  await page.getByRole('button', { name: 'About' }).click();
  await expect(page.getByRole('heading', { name: 'The mind behind the image' })).toBeVisible();
  await expect(page.getByText(/AI-assisted image research/i)).toBeVisible();

  await page.getByRole('button', { name: 'Contact' }).click();
  await expect(page.getByRole('heading', { name: 'Make something strange with me.' })).toBeVisible();
  await expect(page.getByRole('contentinfo').getByRole('link', { name: /Whoamiii/i })).toBeVisible();

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://whoamiii.art/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://whoamiii.art/social-preview.png',
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  );

  const heroImage = page.getByRole('img', {
    name: /Krommaskert psykedelisk skogsportrett/i,
  });
  await expect(heroImage).toHaveAttribute('width', '1672');
  await expect(heroImage).toHaveAttribute('height', '941');

  const aboutImage = page.getByRole('img', {
    name: /Modifisert selvportrett av kunstneren/i,
  });
  await expect(aboutImage).toHaveAttribute('src', /liquid-perception-800\.webp$/);
  await expect(aboutImage).toHaveAttribute('srcset', /liquid-perception-1200\.webp 1200w/);
});

test('skip link and artwork modal are keyboard complete', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await expect(skipLink).toBeVisible();
  await skipLink.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator('#main-content')).toBeFocused();

  const artworkButton = page.getByRole('button', {
    name: /View Optisk fokus video and artist notes/i,
  });
  await artworkButton.click();

  const dialog = page.getByRole('dialog', { name: /Optisk fokus artwork details/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close artwork' })).toBeFocused();
  await expect(dialog.getByLabel(/Optisk fokus video/i)).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Hide notes' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(artworkButton).toBeFocused();
});

test('process film loads near view and exposes a real playback control', async ({ page }) => {
  await page.goto('/#work');

  const processCard = page.getByTestId('workflow-process-card');
  await processCard.scrollIntoViewIfNeeded();
  await expect(processCard.getByRole('heading', { name: 'Coffee in motion' })).toBeVisible();
  await expect(processCard.getByText('Process / 15 sec')).toBeVisible();

  const video = processCard.getByTestId('workflow-process-video');
  await expect(video).toHaveAttribute('poster', '/images/cup-coffee-process-poster.webp');
  await expect(video).toHaveAttribute('preload', 'metadata');
  await expect(video.locator('source')).toHaveAttribute('src', '/videos/cup-coffee-process.mp4');

  const playback = processCard.getByRole('button', { name: /coffee process study/i });
  await expect(playback).toBeEnabled();
  await playback.click();
  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).paused))
    .toBe(true);
});

test('archive opens a chapter and launches its video artwork', async ({ page }) => {
  await page.goto('/#gallery');

  const rooms = page.getByRole('button', { name: /Rooms.*10 works/i });
  await rooms.click();
  const videoButton = page.getByRole('button', {
    name: /View Korridormaster video and artist notes/i,
  });
  await videoButton.scrollIntoViewIfNeeded();
  await videoButton.click();

  const dialog = page.getByRole('dialog', { name: /Korridormaster artwork details/i });
  await expect(dialog).toBeVisible();
  const video = dialog.locator('video');
  await expect(video).toHaveAttribute('preload', 'metadata');
  await expect(video.locator('source')).toHaveAttribute('src', '/videos/corridor-master.mp4');

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(videoButton).toBeFocused();
});

test('homepage passes automated accessibility checks', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Open the living archive/i }).click();
  await page.getByRole('button', { name: /Rooms.*10 works/i }).click();

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

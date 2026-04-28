import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage has no detected accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test('artwork modal has no detected accessibility violations', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /view liquid perception.*artwork/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  const results = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .analyze();

  expect(results.violations).toEqual([]);
});

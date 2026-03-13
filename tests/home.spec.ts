import { expect, test } from '@playwright/test';

test('homepage hero is visible and CTA is clickable', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Never Miss Another Customer/i })).toBeVisible();

  const cta = page.getByRole('link', { name: /Start Free Trial/i }).first();
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page).toHaveURL(/\/signup\?plan=pro/);
});

test('demo page opens from homepage and shows the demo interface', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try Live Demo' }).first().click();

  await expect(page).toHaveURL(/\/demo/);
  await expect(page.getByRole('heading', { name: 'Try the AI Demo' })).toBeVisible();
  await expect(page.getByText('Live demo for Car Rental')).toBeVisible();
});

test('pricing section shows Most Popular label on Pro card', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Most Popular')).toBeVisible();
  await expect(page.getByText('For growing businesses that want full control')).toBeVisible();
});

test('faq expands and shows answer content', async ({ page }) => {
  await page.goto('/');
  const questionButton = page.locator('button').filter({ hasText: 'Which languages does the AI speak?' }).first();
  await expect(questionButton).toBeVisible();
  await questionButton.click();
  await expect(page.getByText('English, Turkish, Arabic, Russian, and Greek. It detects language automatically', { exact: false })).toBeVisible();
});

test('mobile responsive breakpoints render key sections', async ({ page }) => {
  const breakpoints = [
    { width: 320, height: 760 },
    { width: 375, height: 812 },
    { width: 414, height: 896 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
  ];

  for (const bp of breakpoints) {
    await page.setViewportSize(bp);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Never Miss Another Customer/i })).toBeVisible();
    await expect(page.locator('#pricing')).toBeVisible();
  }
});

import { expect, test } from '@playwright/test';

test('homepage hero is visible and CTA is clickable', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1').filter({ hasText: 'Never Miss a Customer Again' }).first()).toBeVisible();

  const cta = page.getByRole('link', { name: /Start Free 7-Day Trial/i }).first();
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page).toHaveURL(/#pricing/);
});

test('demo modal opens and shows conversation content', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'See Live Demo' }).click();

  await expect(page.getByText('Live Demo Conversation')).toBeVisible();
  await expect(page.getByText('Yes! 🚗 Our SUVs start at $55/day.', { exact: false }).last()).toBeVisible();
});

test('pricing section shows Most Popular label on Pro card', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Most Popular')).toBeVisible();
  await expect(page.getByText('Most chosen by Cyprus businesses')).toBeVisible();
});

test('faq expands and shows answer content', async ({ page }) => {
  await page.goto('/');
  const questionButton = page.locator('button').filter({ hasText: 'Which languages does the AI support?' }).first();
  await expect(questionButton).toBeVisible();
  await questionButton.click();
  await expect(page.getByText('BizAI speaks English, Turkish, Arabic, and Russian fluently.')).toBeVisible();
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
    await expect(page.locator('h1').filter({ hasText: 'Never Miss a Customer Again' }).first()).toBeVisible();
    await expect(page.locator('#pricing')).toBeVisible();
  }
});

import { expect, test } from '@playwright/test';

test('homepage hero is visible and CTA is clickable', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1').filter({ hasText: 'Your AI assistant that never misses a customer.' }).first()).toBeVisible();

  const cta = page.getByRole('link', { name: 'Get Live in 24 Hours' });
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page).toHaveURL(/#pricing/);
});

test('demo modal opens and shows conversation content', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'See a Live Demo' }).click();

  await expect(page.getByText('Live Demo Conversation')).toBeVisible();
  await expect(page.getByText('Toyota Yaris available', { exact: false })).toBeVisible();
});

test('pricing section shows Most Popular label on Pro card', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Most Popular')).toBeVisible();
});

test('faq shows at least 5 answer panels', async ({ page }) => {
  await page.goto('/');
  const questions = page.locator('[data-testid="faq-question"]');
  const questionCount = await questions.count();
  expect(questionCount).toBeGreaterThanOrEqual(5);

  const firstFive = Math.min(questionCount, 5);
  for (let i = 0; i < firstFive; i += 1) {
    await questions.nth(i).click();
  }

  await expect(page.locator('[data-testid="faq-answer"][data-state="open"]').first()).toBeVisible();
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
    await expect(page.locator('h1').filter({ hasText: 'Your AI assistant that never misses a customer.' }).first()).toBeVisible();
    await expect(page.locator('#pricing')).toBeVisible();
  }
});

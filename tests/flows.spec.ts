import { expect, test } from '@playwright/test';

test('signup validates required fields and continues to payment with saved details', async ({ page }) => {
  await page.goto('/signup?plan=pro');

  await page.getByRole('button', { name: 'Continue to Payment →' }).click();
  await expect(page.getByText('Business name is required.')).toBeVisible();
  await expect(page.getByText('Email address is required.')).toBeVisible();

  await page.getByPlaceholder('e.g. DriveEasy Car Rentals').fill('BizAI Test Rentals');
  await page.getByPlaceholder('e.g. Ahmed Yilmaz').fill('Rolland Tech');
  await page.getByPlaceholder('cypai.app@cypai.app').fill('bizaicyprus123@gmail.com');
  await page.getByPlaceholder('+90 533 XXX XXXX').fill('+90 533 842 5559');
  await page.getByLabel('Business Type').selectOption('Car Rental');
  await page.getByPlaceholder('https://yourbusiness.com').fill('https://example.com');

  await page.getByRole('button', { name: 'Continue to Payment →' }).click();

  await expect(page).toHaveURL(/\/payment\?plan=pro/);
  await expect(page.getByRole('heading', { name: 'Complete Your Order' })).toBeVisible();
  await expect(page.getByText('bizaicyprus123@gmail.com')).toBeVisible();
  await expect(page.getByText('BizAI Test Rentals')).toBeVisible();
});

test('payment page shows a guard when opened without signup details', async ({ page }) => {
  await page.goto('/payment?plan=pro');

  await expect(page.getByText('Missing account details')).toBeVisible();
  await expect(page.getByRole('link', { name: 'complete step 1' })).toBeVisible();
});

test('demo supports niche switching and chat replies', async ({ page }) => {
  await page.route('**/api/chat', async (route) => {
    const body = route.request().postDataJSON() as { niche?: string; message?: string };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message: `Mocked ${body.niche} reply for: ${body.message}`,
      }),
    });
  });

  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Try the AI Demo' })).toBeVisible();

  await page.getByRole('button', { name: '🏨 Hotel' }).click();
  await expect(page.getByText('Live demo for Hotel')).toBeVisible();
  await expect(page.getByText('Welcome to our hotel. I can help with room options, rates, and reservations.')).toBeVisible();

  await page.getByRole('button', { name: 'What are your prices?' }).click();
  await expect(page.getByText('Mocked hotel reply for: What are your prices?')).toBeVisible();
});

test('blog listing opens an article and shows the article CTA', async ({ page }) => {
  await page.goto('/blog');

  await expect(page.getByRole('heading', { name: /Practical AI playbooks/i })).toBeVisible();
  await page.getByRole('link', { name: 'Read article' }).first().click();

  await expect(page).toHaveURL(/\/blog\/.+/);
  await expect(page.getByRole('link', { name: 'Back to blog' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Start/i }).last()).toBeVisible();
});

test('unknown widget id shows the unavailable state', async ({ page }) => {
  await page.goto('/widget/not-a-real-business');

  await expect(page.getByText('This widget is not available.')).toBeVisible();
});
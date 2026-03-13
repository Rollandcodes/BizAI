import { expect, test } from '@playwright/test';

const dashboardPayload = {
  business: {
    id: 'biz-123',
    owner_email: 'owner@bizai.cy',
    business_name: 'DriveEasy Rentals',
    business_type: 'car_rental',
    widget_color: '#2563eb',
    plan: 'pro',
    plan_expires_at: '2026-12-31T00:00:00.000Z',
    onboarding_complete: true,
    customInstructions: 'Focus on airport pickup questions.',
    customFaqs: [{ question: 'Do you offer airport pickup?', answer: 'Yes, every day.' }],
  },
  stats: {
    totalConversations: 18,
    leadsCaptured: 6,
    monthlyConversations: 11,
    monthlyMessages: 47,
  },
  conversations: [
    {
      id: 'conv-1',
      created_at: '2026-03-10T09:00:00.000Z',
      customer_name: 'Jane Doe',
      customer_phone: '+90 555 123 4567',
      lead_captured: true,
      lead_contacted: false,
      messages: [
        { role: 'user', content: 'Do you have SUVs available this weekend?' },
        { role: 'assistant', content: 'Yes, we do. What dates do you need?' },
      ],
    },
    {
      id: 'conv-2',
      created_at: '2026-03-09T14:30:00.000Z',
      customer_name: 'Ahmet Kaya',
      customer_phone: null,
      lead_captured: false,
      lead_contacted: false,
      messages: [{ role: 'user', content: 'What are your prices?' }],
    },
  ],
  leads: [
    {
      id: 'conv-1',
      created_at: '2026-03-10T09:00:00.000Z',
      customer_name: 'Jane Doe',
      customer_phone: '+90 555 123 4567',
      lead_captured: true,
      lead_contacted: false,
      messages: [{ role: 'user', content: 'Do you have SUVs available this weekend?' }],
    },
  ],
};

test.beforeEach(async ({ page }) => {
  await page.route('**/api/business?**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(dashboardPayload),
    });
  });

  await page.route('**/api/conversations/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, conversation: { id: 'conv-1', lead_contacted: true } }),
    });
  });
});

test('dashboard auth gate allows email lookup and loads overview', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page.getByTestId('dashboard-access-gate')).toBeVisible();
  await page.getByPlaceholder('owner@business.com').fill('owner@bizai.cy');
  await page.getByRole('button', { name: 'Access Dashboard' }).click();

  await expect(page.getByText('Total Conversations')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Welcome back, DriveEasy Rentals/i })).toBeVisible();
  await expect(page.getByText('18')).toBeVisible();
});

test('dashboard tabs switch across conversations, leads, settings, and subscription', async ({ page }) => {
  await page.goto('/dashboard?email=owner@bizai.cy');

  await expect(page.getByText('Total Conversations')).toBeVisible();

  await page.getByTestId('dashboard-tab-conversations').click();
  await expect(page.getByText('All customer conversations for this business.')).toBeVisible();
  await expect(page.getByText('Do you have SUVs available this weekend?').last()).toBeVisible();

  await page.getByTestId('dashboard-tab-leads').click();
  await expect(page.getByText('All customers captured by your AI assistant.')).toBeVisible();
  const contactedCheckbox = page.getByTestId('lead-contacted-conv-1');
  await expect(contactedCheckbox).not.toBeChecked();
  await contactedCheckbox.check();
  await expect(contactedCheckbox).toBeChecked();

  await page.getByTestId('dashboard-tab-settings').click();
  await expect(page.getByText('Update your business profile, AI behavior, and chat widget appearance.')).toBeVisible();
  await expect(page.getByLabel('Business Name')).toHaveValue('DriveEasy Rentals');

  await page.getByTestId('dashboard-tab-subscription').click();
  await expect(page.getByRole('heading', { name: 'Choose Your Plan' })).toBeVisible();
  await expect(page.getByText('Current Plan', { exact: true })).toBeVisible();
});
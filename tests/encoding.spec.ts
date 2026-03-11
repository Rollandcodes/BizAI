import { expect, test } from '@playwright/test';

test('homepage HTML has no encoding artifacts', async ({ request }) => {
  const response = await request.get('/');
  expect(response.ok()).toBeTruthy();

  const contentType = response.headers()['content-type'] || '';
  expect(contentType.toLowerCase()).toContain('charset=utf-8');

  const html = await response.text();
  expect(html).not.toContain('â€”');
  expect(html).not.toContain('ðŸ');
  expect(html).not.toContain('Â·');
});

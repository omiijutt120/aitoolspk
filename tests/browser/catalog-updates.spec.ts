import { test, expect } from '@playwright/test';

test('Gemini 18-month filter shows one updated plan and its exact WhatsApp details', async ({
  page,
}) => {
  await page.goto('/plans/gemini/?duration=18+months');
  const cards = page.locator('.product-card');
  await expect(cards).toHaveCount(1);
  await expect(cards.locator('h3')).toHaveText('Gemini Pro — 18 Months');
  await expect(cards).toContainText('PKR 1,200');
  await expect(cards).toContainText('Full seller warranty (18 months)');
  const buy = cards.getByRole('link', { name: /^Buy Now:/ });
  const href = await buy.getAttribute('href');
  expect(href).toBeTruthy();
  const url = new URL(href!);
  expect(url.hostname).toBe('wa.me');
  expect(url.pathname).toBe('/923714549245');
  for (const text of [
    'PK-1C4151BB27E1',
    '1,200',
    '18 months',
    'Full seller warranty (18 months)',
  ])
    expect(url.searchParams.get('text')).toContain(text);
  await cards.getByRole('link', { name: 'View Details', exact: true }).click();
  await expect(page).toHaveURL(
    /\/tool\/gemini-pro-18-months-pk-1c4151bb27e1\/$/
  );
  await expect(page.locator('h1')).toHaveText('Gemini Pro — 18 Months');
  await expect(page.locator('.detail-layout')).toContainText('PKR 1,200');
  await expect(page.locator('.detail-layout')).toContainText(
    'Full seller warranty (18 months)'
  );
});

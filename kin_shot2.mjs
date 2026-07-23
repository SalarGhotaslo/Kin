import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
await page.goto('http://127.0.0.1:3300/');
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/kin-redesign-shots/1-onboarding.png' });

await page.getByPlaceholder('Name (optional)').fill('Maya');
await page.getByTestId('draft-age-chip-toddler').click();
await page.getByTestId('add-child-btn').click();
await page.getByPlaceholder('Name (optional)').fill('Leo');
await page.getByTestId('draft-age-chip-infant').click();
await page.getByTestId('add-child-btn').click();
await page.getByTestId('onboarding-continue').click();
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/kin-redesign-shots/2-home.png' });

await page.getByTestId('nav-ask').click();
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/kin-redesign-shots/3-ask-empty.png' });

await page.getByTestId('topic-feeding').click();
await page.waitForTimeout(2600);
await page.screenshot({ path: '/tmp/kin-redesign-shots/4-ask-response-top.png' });
await page.mouse.wheel(0, 500);
await page.waitForTimeout(200);
await page.screenshot({ path: '/tmp/kin-redesign-shots/5-ask-response-scrolled.png' });

await page.getByTestId('nav-knowledge').click();
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/kin-redesign-shots/6-knowledge.png' });

await page.getByTestId('nav-profile').click();
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/kin-redesign-shots/7-profile.png' });

await browser.close();
console.log('done');

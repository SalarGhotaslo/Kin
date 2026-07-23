import { chromium } from '@playwright/test';
const OUT = '/private/tmp/claude-501/-Users-sghotaslo-Desktop-PrivateProjects-StepChangeDeloitte-Kin/a7a25ec8-75b0-4eb0-b578-60ea2c7235aa/scratchpad/color-shots';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
await page.goto('http://127.0.0.1:3500/');
await page.getByPlaceholder('Name (optional)').fill('Maya');
await page.getByTestId('draft-age-chip-toddler').click();
await page.getByTestId('add-child-btn').click();
await page.getByTestId('onboarding-continue').click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/home.png` });

await page.getByTestId('nav-ask').click();
await page.getByTestId('topic-fever').click();
await page.waitForSelector('[data-testid="intervention-card"]', { timeout: 8000 });
await page.screenshot({ path: `${OUT}/ask-flagged.png` });

await page.getByTestId('nav-knowledge').click();
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/knowledge.png` });

await page.getByTestId('nav-profile').click();
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/profile.png` });

await browser.close();
console.log('done');

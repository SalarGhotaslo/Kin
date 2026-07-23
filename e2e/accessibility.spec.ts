import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function completeOnboarding(page: import("@playwright/test").Page) {
  await page.getByPlaceholder("Name (optional)").fill("Liam");
  await page.getByTestId("draft-age-chip-infant").click();
  await page.getByTestId("add-child-btn").click();
  await page.getByTestId("onboarding-continue").click();
}

async function expectNoViolations(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

test.describe("Accessibility (axe, WCAG 2.1 A/AA)", () => {
  test("onboarding screen has no violations", async ({ page }) => {
    await page.goto("/");
    await expectNoViolations(page);
  });

  test("home screen (with outbreak alert) has no violations", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page);
    await expectNoViolations(page);
  });

  test("outbreak detail screen has no violations", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page);
    await page.getByTestId("outbreak-banner").click();
    await expectNoViolations(page);
  });

  test("ask screen has no violations", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page);
    await page.getByTestId(/select-child-/).click();
    await expectNoViolations(page);
  });

  test("response screen, including the flagged Intervention Card, has no violations", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page);
    await page.getByTestId(/select-child-/).click();
    await page.getByTestId("topic-fever").click();
    await page.getByTestId("intervention-card").waitFor({ timeout: 8000 });
    await expectNoViolations(page);
  });

  test("clinician choice screen has no violations", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page);
    await page.getByTestId(/select-child-/).click();
    await page.getByTestId("topic-fever").click();
    await page.getByTestId("talk-to-nurse").waitFor({ timeout: 8000 });
    await page.getByTestId("talk-to-nurse").click();
    await expectNoViolations(page);
  });

  test("nurse chat screen has no violations", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page);
    await page.getByTestId(/select-child-/).click();
    await page.getByTestId("topic-fever").click();
    await page.getByTestId("talk-to-nurse").waitFor({ timeout: 8000 });
    await page.getByTestId("talk-to-nurse").click();
    await page.getByTestId("choose-chat").click();
    await expectNoViolations(page);
  });

  test("video call screen has no violations", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page);
    await page.getByTestId(/select-child-/).click();
    await page.getByTestId("topic-fever").click();
    await page.getByTestId("talk-to-nurse").waitFor({ timeout: 8000 });
    await page.getByTestId("talk-to-nurse").click();
    await page.getByTestId("choose-video").click();
    await expectNoViolations(page);
  });

  test("dark theme home screen has no violations", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await completeOnboarding(page);
    await expectNoViolations(page);
  });
});

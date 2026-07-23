import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Reduced motion collapses the screen-enter fade to ~0ms, so axe never samples
// colors mid-transition (a real source of false-positive contrast findings).
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

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

  test("Home tab (with outbreak alert) has no violations", async ({ page }) => {
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

  test("Ask AI empty state has no violations", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page);
    await page.getByTestId("nav-ask").click();
    await expectNoViolations(page);
  });

  test("Ask AI response, including the flagged Intervention Card, has no violations", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page);
    await page.getByTestId("nav-ask").click();
    await page.getByTestId("topic-fever").click();
    await page.getByTestId("intervention-card").waitFor({ timeout: 8000 });
    await expectNoViolations(page);
  });

  test("clinician chat screen has no violations", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page);
    await page.getByTestId("nav-ask").click();
    await page.getByTestId("topic-fever").click();
    await page.getByTestId("talk-to-nurse").waitFor({ timeout: 8000 });
    await page.getByTestId("talk-to-nurse").click();
    await expectNoViolations(page);
  });

  test("video call screen has no violations", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page);
    await page.getByTestId("nav-ask").click();
    await page.getByTestId("topic-feeding").click();
    await page.getByTestId("connect-video-sarah-mitchell").waitFor({ timeout: 8000 });
    await page.getByTestId("connect-video-sarah-mitchell").click();
    await expectNoViolations(page);
  });

  test("Knowledge tab has no violations", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page);
    await page.getByTestId("nav-knowledge").click();
    await expectNoViolations(page);
  });

  test("Profile tab has no violations", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page);
    await page.getByTestId("nav-profile").click();
    await expectNoViolations(page);
  });

  test("dark theme Home tab has no violations", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
    await page.goto("/");
    await completeOnboarding(page);
    await expectNoViolations(page);
  });
});

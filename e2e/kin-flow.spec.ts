import { expect, test } from "@playwright/test";

async function completeOnboarding(page: import("@playwright/test").Page, name: string, ageTestId: string) {
  await page.getByPlaceholder("Name (optional)").fill(name);
  await page.getByTestId(ageTestId).click();
  await page.getByTestId("add-child-btn").click();
  await page.getByTestId("onboarding-continue").click();
}

test.describe("Kin flagship walkthrough (real browser)", () => {
  test("onboarding → home → ask → response → clinician chat → done, end to end", async ({ page }) => {
    await page.goto("/");

    // 1. Onboarding: add a child (required to continue).
    await expect(page.getByTestId("screen-onboarding")).toBeVisible();
    await expect(page.getByTestId("onboarding-continue")).toBeDisabled();
    await completeOnboarding(page, "Liam", "draft-age-chip-infant");

    // 2. Home: outbreak alert visible, pick the child to talk about.
    await expect(page.getByTestId("screen-home")).toBeVisible();
    await expect(page.getByTestId("outbreak-banner")).toBeVisible();
    await page.getByTestId(/select-child-/).click();

    // 3. Ask: pick a topic.
    await expect(page.getByTestId("screen-ask")).toBeVisible();
    await page.getByTestId("topic-fever").click();

    // 4. Response: suggested article + community reply, Sentinel flags the risky one.
    await expect(page.getByTestId("screen-response")).toBeVisible();
    await expect(page.getByTestId("guide-title")).toContainText("4–12 months");
    await expect(page.getByTestId("intervention-card")).toBeVisible({ timeout: 8000 });
    await expect(page.getByTestId("reply-risky-wrap")).toHaveCount(0);

    await page.getByTestId("talk-to-nurse").click();

    // 5. Clinician choice → chat.
    await expect(page.getByTestId("screen-clinicianChoice")).toBeVisible();
    await page.getByTestId("choose-chat").click();

    // 6. Nurse chat plays out to completion.
    await expect(page.getByTestId("screen-nurseChat")).toBeVisible();
    await expect(page.getByTestId("nurse-footer")).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId("nurse-chat")).toContainText(/never aspirin/i);

    await page.getByTestId("nurse-done").click();
    await expect(page.getByTestId("screen-home")).toBeVisible();
  });

  test("clinician choice can go to a mocked video call", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page, "Maya", "draft-age-chip-toddler");
    await page.getByTestId(/select-child-/).click();
    await page.getByTestId("topic-sleep").click();
    await expect(page.getByTestId("intervention-card")).toBeVisible({ timeout: 8000 });

    await page.getByTestId("satisfaction-no").click();
    await expect(page.getByTestId("screen-clinicianChoice")).toBeVisible();
    await page.getByTestId("choose-video").click();

    await expect(page.getByTestId("screen-videoCall")).toBeVisible();
    await expect(page.getByText("Nurse Aanya")).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId("video-connected-note")).toBeVisible();

    await page.getByTestId("end-call").click();
    await expect(page.getByTestId("screen-home")).toBeVisible();
  });

  test("a satisfied parent can bookmark the article and return home without escalating", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page, "Liam", "draft-age-chip-infant");
    await page.getByTestId(/select-child-/).click();
    await page.getByTestId("topic-fever").click();
    await expect(page.getByTestId("intervention-card")).toBeVisible({ timeout: 8000 });

    await expect(page.getByTestId("save-label")).toHaveText("Save");
    await page.getByTestId("save-btn").click();
    await expect(page.getByTestId("save-label")).toHaveText("Saved");
    await expect(page.getByTestId("toast")).toContainText("Added to My Resources");

    await page.getByTestId("satisfaction-yes").click();
    await page.getByTestId("back-to-home").click();
    await expect(page.getByTestId("screen-home")).toBeVisible();
  });

  test("opens and dismisses the local outbreak alert", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page, "Liam", "draft-age-chip-infant");

    await page.getByTestId("outbreak-banner").click();
    await expect(page.getByTestId("screen-outbreak")).toBeVisible();
    await expect(page.getByText(/chickenpox/i).first()).toBeVisible();

    await page.getByTestId("outbreak-back").click();
    await expect(page.getByTestId("screen-home")).toBeVisible();
  });

  test("restart clears the session and returns to onboarding", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page, "Liam", "draft-age-chip-infant");
    await expect(page.getByTestId("screen-home")).toBeVisible();

    await page.getByTestId("restart-btn").click();

    await expect(page.getByTestId("screen-onboarding")).toBeVisible();
    await expect(page.getByTestId("onboarding-continue")).toBeDisabled();
  });

  test("respects the OS dark color scheme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    const bg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());
    expect(bg.toLowerCase()).toBe("#0d1117");
  });
});

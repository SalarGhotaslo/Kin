import { expect, test } from "@playwright/test";

async function completeOnboarding(page: import("@playwright/test").Page, name: string, ageTestId: string) {
  await page.getByPlaceholder("Name (optional)").fill(name);
  await page.getByTestId(ageTestId).click();
  await page.getByTestId("add-child-btn").click();
  await page.getByTestId("onboarding-continue").click();
}

test.describe("Kin (real browser): onboarding → Home → Ask AI → clinician → Knowledge/Profile", () => {
  test("onboarding → Home → Ask AI fever flow → clinician chat, thread persists on return", async ({ page }) => {
    await page.goto("/");

    // 1. Onboarding: adding a child is required to continue.
    await expect(page.getByTestId("screen-onboarding")).toBeVisible();
    await expect(page.getByTestId("onboarding-continue")).toBeDisabled();
    await completeOnboarding(page, "Liam", "draft-age-chip-infant");

    // 2. Home: outbreak alert + family snapshot + quick actions.
    await expect(page.getByTestId("screen-home")).toBeVisible();
    await expect(page.getByTestId("outbreak-banner")).toBeVisible();
    await expect(page.getByTestId("family-snapshot")).toContainText("Liam");

    await page.getByTestId("quick-action-ask").click();

    // 3. Ask AI: fever topic triggers the Sentinel scenario.
    await expect(page.getByTestId("screen-ask")).toBeVisible();
    await page.getByTestId("topic-fever").click();
    await expect(page.getByTestId("ai-response-card")).toContainText("Professional Source");
    await expect(page.getByTestId("intervention-card")).toBeVisible({ timeout: 8000 });
    await expect(page.getByTestId("reply-risky-wrap")).toHaveCount(0);

    await page.getByTestId("talk-to-nurse").click();

    // 4. Clinician chat plays out.
    await expect(page.getByTestId("screen-clinicianChat")).toBeVisible();
    await expect(page.getByTestId("nurse-footer")).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId("nurse-chat")).toContainText(/never aspirin/i);

    await page.getByTestId("nurse-done").click();

    // 5. Back on the Ask tab, the flagged thread is still there (state lives in AppShell).
    await expect(page.getByTestId("screen-ask")).toBeVisible();
    await expect(page.getByTestId("intervention-card")).toBeVisible();

    // Bottom nav still works after the round trip.
    await page.getByTestId("nav-home").click();
    await expect(page.getByTestId("screen-home")).toBeVisible();
  });

  test("a non-fever topic can escalate straight to a video call via Recommended Clinicians", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page, "Maya", "draft-age-chip-toddler");
    await page.getByTestId("nav-ask").click();
    await page.getByTestId("topic-feeding").click();

    await expect(page.getByTestId("recommended-clinicians")).toBeVisible({ timeout: 8000 });
    await page.getByTestId("connect-video-sarah-mitchell").click();

    await expect(page.getByTestId("screen-videoCall")).toBeVisible();
    await expect(page.getByText("Nurse Aanya")).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId("video-connected-note")).toBeVisible();

    await page.getByTestId("end-call").click();
    // Ending the call returns to the Ask thread it was started from, not Home.
    await expect(page.getByTestId("screen-ask")).toBeVisible();
    await expect(page.getByTestId("recommended-clinicians")).toBeVisible();
  });

  test("saying an answer didn't help escalates immediately to clinician chat", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page, "Liam", "draft-age-chip-infant");
    await page.getByTestId("nav-ask").click();
    await page.getByTestId("topic-sleep").click();
    await expect(page.getByTestId("satisfaction-block")).toBeVisible({ timeout: 8000 });

    await page.getByTestId("satisfaction-no").click();
    await expect(page.getByTestId("screen-clinicianChat")).toBeVisible();
  });

  test("Knowledge: search, filter, and bookmark an article that then shows under Profile", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page, "Liam", "draft-age-chip-infant");
    await page.getByTestId("nav-knowledge").click();

    await expect(page.getByTestId("screen-knowledge")).toBeVisible();
    await page.getByTestId("topic-filter-sleep").click();
    await expect(page.getByTestId("article-sleep-toddler")).toBeVisible();
    await expect(page.getByTestId("article-fever-infant")).toHaveCount(0);

    await page.getByTestId("save-sleep-toddler").click();
    await expect(page.getByTestId("save-sleep-toddler")).toHaveText(/saved/i);

    await page.getByTestId("nav-profile").click();
    await expect(page.getByTestId("saved-resources")).toBeVisible();
    await expect(page.getByTestId("saved-resources")).toContainText("Sleep regression survival kit");
  });

  test("Profile: family context reflects children's stages, and privacy toggles work", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page, "Liam", "draft-age-chip-school");
    await page.getByTestId("nav-profile").click();

    await expect(page.getByTestId("stage-school")).toHaveClass(/present/);
    await expect(page.getByTestId("stage-toddler")).not.toHaveClass(/present/);

    const dataRetention = page.getByTestId("toggle-dataRetention");
    await expect(dataRetention).toHaveAttribute("aria-checked", "false");
    await dataRetention.click();
    await expect(dataRetention).toHaveAttribute("aria-checked", "true");

    await page.getByTestId("save-changes").click();
    await expect(page.getByTestId("toast")).toContainText(/saved/i);
  });

  test("restart (in Profile) clears the session back to onboarding", async ({ page }) => {
    await page.goto("/");
    await completeOnboarding(page, "Liam", "draft-age-chip-infant");
    await page.getByTestId("nav-profile").click();

    await page.getByTestId("restart-btn").click();

    await expect(page.getByTestId("screen-onboarding")).toBeVisible();
    await expect(page.getByTestId("onboarding-continue")).toBeDisabled();
  });

  test("respects the OS dark color scheme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    const bg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());
    expect(bg.toLowerCase()).toBe("#14161c");
  });
});

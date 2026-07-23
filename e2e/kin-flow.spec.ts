import { expect, test } from "@playwright/test";

test.describe("Kin flagship walkthrough (real browser)", () => {
  test("profile → feed → sentinel → nurse → content, end to end", async ({ page }) => {
    await page.goto("/");

    // 1. Session profile screen.
    await expect(page.getByTestId("screen-profile")).toBeVisible();
    await expect(page.getByTestId("profile-continue")).toBeDisabled();

    await page.getByTestId("age-chip-infant").click();
    await expect(page.getByTestId("age-chip-infant")).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("profile-continue")).toBeEnabled();
    await page.getByTestId("profile-continue").click();

    // 2. Community feed.
    await expect(page.getByTestId("screen-feed")).toBeVisible();
    await page.getByTestId("suggestion-chip").click();

    // 3. Sentinel detects and flags the risky reply, offering a clinician route.
    await expect(page.getByTestId("screen-sentinel")).toBeVisible();
    await expect(page.getByTestId("reply-safe")).toBeVisible();
    await expect(page.getByTestId("intervention-card")).toBeVisible({ timeout: 8000 });
    await expect(page.getByTestId("intervention-card")).toContainText(/aspirin/i);

    // The risky reply itself must be gone once Sentinel has flagged it.
    await expect(page.getByTestId("reply-risky-wrap")).toHaveCount(0);

    await page.getByTestId("talk-to-nurse").click();

    // 4. Mocked nurse chat plays out and reaches the footer CTA.
    await expect(page.getByTestId("screen-nurse")).toBeVisible();
    await expect(page.getByTestId("nurse-footer")).toBeVisible({ timeout: 10000 });
    const nurseBubbles = page.getByTestId("chat-bubble-nurse");
    await expect(nurseBubbles).toHaveCount(3);
    await expect(page.getByTestId("chat-bubble-parent")).toHaveCount(1);
    await expect(page.getByTestId("nurse-chat")).toContainText(/never aspirin/i);

    await page.getByTestId("see-guide").click();

    // 5. Age-adaptive content card matches the infant age band chosen in step 1.
    await expect(page.getByTestId("screen-content")).toBeVisible();
    await expect(page.getByTestId("guide-title")).toContainText("4–12 months");
  });

  test("bookmarking a guide toggles Save/Saved and shows a confirmation toast", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("age-chip-toddler").click();
    await page.getByTestId("profile-continue").click();
    await page.getByTestId("suggestion-chip").click();
    await expect(page.getByTestId("intervention-card")).toBeVisible({ timeout: 8000 });
    await page.getByTestId("talk-to-nurse").click();
    await expect(page.getByTestId("nurse-footer")).toBeVisible({ timeout: 10000 });
    await page.getByTestId("see-guide").click();

    await expect(page.getByTestId("save-label")).toHaveText("Save");
    await page.getByTestId("save-btn").click();
    await expect(page.getByTestId("save-label")).toHaveText("Saved");
    await expect(page.getByTestId("toast")).toContainText("Added to My Resources");
  });

  test("restart clears the session and returns to the profile screen", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("age-chip-school").click();
    await page.getByTestId("profile-continue").click();
    await expect(page.getByTestId("screen-feed")).toBeVisible();

    await page.getByTestId("restart-btn").click();

    await expect(page.getByTestId("screen-profile")).toBeVisible();
    await expect(page.getByTestId("age-chip-school")).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByTestId("profile-continue")).toBeDisabled();
  });

  test("respects the OS dark color scheme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    const bg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());
    expect(bg.toLowerCase()).toBe("#10141a");
  });
});

import { describe, expect, it } from "vitest";
import {
  AGE_OPTIONS,
  CLOCK_BY_SCREEN,
  DEFAULT_SUGGESTED_QUESTION,
  GUIDE_BY_AGE,
  NURSE_SCRIPT,
  SCREENS,
  getGuideForAge,
  normalizePostText,
} from "../kinFlow";

describe("getGuideForAge", () => {
  it("returns the matching guide for each defined age band", () => {
    for (const option of AGE_OPTIONS) {
      const guide = getGuideForAge(option.id);
      expect(guide).toBe(GUIDE_BY_AGE[option.id]);
    }
  });

  it("falls back to the infant guide when no age is selected", () => {
    expect(getGuideForAge(null)).toBe(GUIDE_BY_AGE.infant);
  });

  it("every guide has a non-empty title, excerpt and byline", () => {
    for (const guide of Object.values(GUIDE_BY_AGE)) {
      expect(guide.title.length).toBeGreaterThan(0);
      expect(guide.excerpt.length).toBeGreaterThan(0);
      expect(guide.byline.length).toBeGreaterThan(0);
    }
  });
});

describe("normalizePostText", () => {
  it("returns the trimmed input when non-empty", () => {
    expect(normalizePostText("  hello there  ")).toBe("hello there");
  });

  it("falls back to the default suggested question when input is empty or whitespace", () => {
    expect(normalizePostText("")).toBe(DEFAULT_SUGGESTED_QUESTION);
    expect(normalizePostText("   ")).toBe(DEFAULT_SUGGESTED_QUESTION);
  });
});

describe("SCREENS / CLOCK_BY_SCREEN", () => {
  it("has a clock entry for every screen, in the same order the flow progresses", () => {
    expect(SCREENS).toEqual(["profile", "feed", "sentinel", "nurse", "content"]);
    for (const screen of SCREENS) {
      expect(CLOCK_BY_SCREEN[screen]).toMatch(/^\d{1,2}:\d{2}$/);
    }
  });

  it("clock time is non-decreasing across the flow (night keeps moving forward)", () => {
    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const times = SCREENS.map((s) => toMinutes(CLOCK_BY_SCREEN[s]));
    for (let i = 1; i < times.length; i++) {
      expect(times[i]).toBeGreaterThanOrEqual(times[i - 1]);
    }
  });
});

describe("NURSE_SCRIPT", () => {
  it("starts with the nurse and alternates sensibly (no two consecutive parent lines)", () => {
    expect(NURSE_SCRIPT[0].from).toBe("nurse");
    for (let i = 1; i < NURSE_SCRIPT.length; i++) {
      if (NURSE_SCRIPT[i].from === "parent") {
        expect(NURSE_SCRIPT[i - 1].from).toBe("nurse");
      }
    }
  });

  it("never mentions aspirin as safe advice for infants", () => {
    const nurseLines = NURSE_SCRIPT.filter((m) => m.from === "nurse").map((m) => m.text.toLowerCase());
    const aspirinLine = nurseLines.find((t) => t.includes("aspirin"));
    expect(aspirinLine).toBeDefined();
    expect(aspirinLine).toContain("never");
  });
});

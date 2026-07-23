import { describe, expect, it } from "vitest";
import {
  AGE_OPTIONS,
  CLOCK_BY_SCREEN,
  DEFAULT_SUGGESTED_QUESTION,
  ETHNIC_BACKGROUNDS,
  GUIDE_BY_AGE,
  LANGUAGE_OPTIONS,
  NURSE_SCRIPT,
  OUTBREAK_ALERT,
  PARENT_AGE_BANDS,
  RELATIONSHIP_STATUSES,
  SCREENS,
  TOPIC_SUGGESTIONS,
  createChild,
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

describe("createChild", () => {
  it("trims the given name and keeps the age band", () => {
    const child = createChild("  Liam  ", "infant");
    expect(child.name).toBe("Liam");
    expect(child.age).toBe("infant");
  });

  it("generates a unique id per call", () => {
    const a = createChild("Liam", "infant");
    const b = createChild("Liam", "infant");
    expect(a.id).not.toBe(b.id);
  });
});

describe("SCREENS / CLOCK_BY_SCREEN", () => {
  it("has a clock entry for every screen, in the same order the flow progresses", () => {
    expect(SCREENS).toEqual([
      "onboarding",
      "home",
      "outbreak",
      "ask",
      "response",
      "clinicianChoice",
      "nurseChat",
      "videoCall",
    ]);
    for (const screen of SCREENS) {
      expect(CLOCK_BY_SCREEN[screen]).toMatch(/^\d{1,2}:\d{2}$/);
    }
  });

  it("clock time is non-decreasing across the main path (onboarding through nurse chat)", () => {
    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const mainPath: (typeof SCREENS)[number][] = ["onboarding", "home", "ask", "response", "clinicianChoice", "nurseChat"];
    const times = mainPath.map((s) => toMinutes(CLOCK_BY_SCREEN[s]));
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

describe("onboarding option lists", () => {
  it("all default to a non-identifying option first or include one", () => {
    expect(PARENT_AGE_BANDS).toContain("Prefer not to say");
    expect(RELATIONSHIP_STATUSES[0]).toBe("Prefer not to say");
    expect(ETHNIC_BACKGROUNDS[0]).toBe("Prefer not to say");
  });

  it("every language option has a code and a label", () => {
    for (const lang of LANGUAGE_OPTIONS) {
      expect(lang.code.length).toBeGreaterThan(0);
      expect(lang.label.length).toBeGreaterThan(0);
    }
  });
});

describe("TOPIC_SUGGESTIONS", () => {
  it("each topic has a non-empty label and a full question", () => {
    for (const topic of TOPIC_SUGGESTIONS) {
      expect(topic.label.length).toBeGreaterThan(0);
      expect(topic.question.length).toBeGreaterThan(10);
    }
  });

  it("has unique ids", () => {
    const ids = TOPIC_SUGGESTIONS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("OUTBREAK_ALERT", () => {
  it("has a headline, summary and actionable guidance bullets", () => {
    expect(OUTBREAK_ALERT.headline.length).toBeGreaterThan(0);
    expect(OUTBREAK_ALERT.summary.length).toBeGreaterThan(0);
    expect(OUTBREAK_ALERT.bullets.length).toBeGreaterThan(0);
    for (const bullet of OUTBREAK_ALERT.bullets) {
      expect(bullet.length).toBeGreaterThan(0);
    }
  });
});

import { describe, expect, it } from "vitest";
import {
  AGE_OPTIONS,
  AI_RESPONSE_BY_TOPIC,
  DEFAULT_SUGGESTED_QUESTION,
  ETHNIC_BACKGROUNDS,
  GUIDE_BY_AGE,
  KNOWLEDGE_CATALOG,
  LANGUAGE_OPTIONS,
  NURSE_SCRIPT,
  OUTBREAK_ALERT,
  PARENT_AGE_BANDS,
  RECOMMENDED_CLINICIANS,
  RELATIONSHIP_STATUSES,
  STAGE_GROUPS,
  TABS,
  TOPICS,
  TOPIC_SUGGESTIONS,
  createChild,
  getGuideForAge,
  normalizePostText,
  parentTagline,
  tabForScreen,
  type Screen,
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

describe("tabForScreen", () => {
  it("maps every non-onboarding screen to exactly one bottom-nav tab", () => {
    const cases: [Screen, string | null][] = [
      ["onboarding", null],
      ["home", "home"],
      ["outbreak", "home"],
      ["ask", "ask"],
      ["clinicianChat", "ask"],
      ["clinicianVideo", "ask"],
      ["knowledge", "knowledge"],
      ["profile", "profile"],
    ];
    for (const [screen, expected] of cases) {
      expect(tabForScreen(screen)).toBe(expected);
    }
  });

  it("every tab in TABS is reachable from at least one screen", () => {
    const reachable = new Set(
      (["home", "outbreak", "ask", "clinicianChat", "clinicianVideo", "knowledge", "profile"] as Screen[]).map(tabForScreen)
    );
    for (const tab of TABS) {
      expect(reachable.has(tab.id)).toBe(true);
    }
  });
});

describe("parentTagline", () => {
  it("counts children singular vs plural", () => {
    const profile = { parentAgeBand: "Prefer not to say", relationshipStatus: "Prefer not to say", ethnicBackground: "Prefer not to say", languageCode: "en" } as const;
    expect(parentTagline([createChild("Liam", "infant")], profile)).toBe("Parent of 1 child");
    expect(parentTagline([createChild("Liam", "infant"), createChild("Maya", "toddler")], profile)).toBe("Parent of 2 children");
  });

  it("mentions multilingual support only when a non-English language is set", () => {
    const base = { parentAgeBand: "Prefer not to say", relationshipStatus: "Prefer not to say", ethnicBackground: "Prefer not to say" } as const;
    expect(parentTagline([], { ...base, languageCode: "en" })).not.toMatch(/multilingual/i);
    expect(parentTagline([], { ...base, languageCode: "es" })).toMatch(/multilingual/i);
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

describe("STAGE_GROUPS", () => {
  it("covers every AgeId across all groups exactly once", () => {
    const allAges = STAGE_GROUPS.flatMap((g) => g.ages);
    expect(new Set(allAges).size).toBe(allAges.length);
    for (const option of AGE_OPTIONS) {
      expect(allAges).toContain(option.id);
    }
  });
});

describe("TOPIC_SUGGESTIONS / AI_RESPONSE_BY_TOPIC", () => {
  it("each topic suggestion has a non-empty label and a full question", () => {
    for (const topic of TOPIC_SUGGESTIONS) {
      expect(topic.label.length).toBeGreaterThan(0);
      expect(topic.question.length).toBeGreaterThan(10);
    }
  });

  it("has unique ids matching a defined AI response", () => {
    const ids = TOPIC_SUGGESTIONS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(AI_RESPONSE_BY_TOPIC[id]).toBeDefined();
    }
  });

  it("only the fever topic triggers the Sentinel risky-reply scenario", () => {
    expect(AI_RESPONSE_BY_TOPIC.fever.hasRiskyReply).toBe(true);
    expect(AI_RESPONSE_BY_TOPIC.sleep.hasRiskyReply).toBeFalsy();
    expect(AI_RESPONSE_BY_TOPIC.feeding.hasRiskyReply).toBeFalsy();
    expect(AI_RESPONSE_BY_TOPIC.behaviour.hasRiskyReply).toBeFalsy();
  });

  it("every response has at least 2 concrete bullets and a follow-up note", () => {
    for (const response of Object.values(AI_RESPONSE_BY_TOPIC)) {
      expect(response.bullets.length).toBeGreaterThanOrEqual(2);
      expect(response.followUpNote.length).toBeGreaterThan(0);
    }
  });
});

describe("RECOMMENDED_CLINICIANS", () => {
  it("has at least one clinician with a name, specialty and initials", () => {
    expect(RECOMMENDED_CLINICIANS.length).toBeGreaterThan(0);
    for (const clinician of RECOMMENDED_CLINICIANS) {
      expect(clinician.name.length).toBeGreaterThan(0);
      expect(clinician.specialty.length).toBeGreaterThan(0);
      expect(clinician.initials.length).toBeGreaterThan(0);
    }
  });
});

describe("KNOWLEDGE_CATALOG", () => {
  it("has unique ids and a valid topic for every article", () => {
    const ids = KNOWLEDGE_CATALOG.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    const topicIds = new Set(TOPICS.map((t) => t.id));
    for (const article of KNOWLEDGE_CATALOG) {
      expect(topicIds.has(article.topic)).toBe(true);
    }
  });

  it("covers every topic with at least one article", () => {
    for (const topic of TOPICS) {
      expect(KNOWLEDGE_CATALOG.some((a) => a.topic === topic.id)).toBe(true);
    }
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

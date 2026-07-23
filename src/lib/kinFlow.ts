export type AgeId = "newborn" | "infant" | "toddler" | "preschool" | "school";

export type Screen =
  | "onboarding"
  | "home"
  | "outbreak"
  | "ask"
  | "response"
  | "clinicianChoice"
  | "nurseChat"
  | "videoCall";

export const SCREENS: Screen[] = [
  "onboarding",
  "home",
  "outbreak",
  "ask",
  "response",
  "clinicianChoice",
  "nurseChat",
  "videoCall",
];

export const CLOCK_BY_SCREEN: Record<Screen, string> = {
  onboarding: "2:47",
  home: "2:48",
  outbreak: "2:48",
  ask: "2:50",
  response: "2:53",
  clinicianChoice: "2:58",
  nurseChat: "3:00",
  videoCall: "3:00",
};

export interface AgeOption {
  id: AgeId;
  label: string;
  sub: string;
}

export const AGE_OPTIONS: AgeOption[] = [
  { id: "newborn", label: "Newborn", sub: "0–3 months" },
  { id: "infant", label: "Infant", sub: "4–12 months" },
  { id: "toddler", label: "Toddler", sub: "1–3 years" },
  { id: "preschool", label: "Preschool", sub: "3–5 years" },
  { id: "school", label: "School-age", sub: "5+ years" },
];

/** A child added during onboarding. Session-only — nothing here is persisted to an account. */
export interface Child {
  id: string;
  name: string;
  age: AgeId;
}

export function createChild(name: string, age: AgeId): Child {
  const trimmed = name.trim();
  return { id: `${age}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: trimmed, age };
}

export const PARENT_AGE_BANDS = ["Under 20", "20–29", "30–39", "40–49", "50+", "Prefer not to say"] as const;
export type ParentAgeBand = (typeof PARENT_AGE_BANDS)[number];

export const RELATIONSHIP_STATUSES = ["Prefer not to say", "Partnered", "Single", "Co-parenting"] as const;
export type RelationshipStatus = (typeof RELATIONSHIP_STATUSES)[number];

export const ETHNIC_BACKGROUNDS = [
  "Prefer not to say",
  "White / European",
  "Black / African / Caribbean",
  "South Asian",
  "East or Southeast Asian",
  "Middle Eastern / North African",
  "Mixed / multiple ethnic groups",
  "Other",
] as const;
export type EthnicBackground = (typeof ETHNIC_BACKGROUNDS)[number];

export interface LanguageOption {
  code: string;
  label: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "pl", label: "Polski" },
  { code: "ur", label: "اردو" },
];

export interface ParentProfile {
  parentAgeBand: ParentAgeBand;
  relationshipStatus: RelationshipStatus;
  ethnicBackground: EthnicBackground;
  languageCode: string;
}

export const DEFAULT_PARENT_PROFILE: ParentProfile = {
  parentAgeBand: "Prefer not to say",
  relationshipStatus: "Prefer not to say",
  ethnicBackground: "Prefer not to say",
  languageCode: "en",
};

export interface Guide {
  title: string;
  excerpt: string;
  byline: string;
}

export const GUIDE_BY_AGE: Record<AgeId, Guide> = {
  newborn: {
    title: "Fevers in the first 3 months: why age changes everything",
    excerpt:
      "Any fever at this age needs same-day clinical review. This guide covers what to watch for and how to stay calm on the way.",
    byline: "Reviewed by Dr. A. Osei, Paediatrician · 3 Jul 2026",
  },
  infant: {
    title: "Fevers in babies 4–12 months: what's normal, what's not",
    excerpt:
      "Most fevers at this age are manageable at home. This guide walks through comfort care, dosing safety, and the exact signs that mean it's time to call 111 or go to A&E.",
    byline: "Reviewed by Dr. A. Osei, Paediatrician · 12 Jun 2026",
  },
  toddler: {
    title: "Fevers in toddlers: comfort care that actually works",
    excerpt:
      "Toddlers run hot easily. Learn safe dosing, hydration tricks that don't end in a fight, and when a fever needs more than watching.",
    byline: "Reviewed by Dr. R. Chen, Paediatric Nurse Practitioner · 28 May 2026",
  },
  preschool: {
    title: "Fevers at preschool age: nursery, naps and knowing when to worry",
    excerpt:
      "Preschoolers pick up more bugs, and fevers often run alongside nursery. Here's how to judge severity and when it's genuinely urgent.",
    byline: "Reviewed by Dr. A. Osei, Paediatrician · 15 Apr 2026",
  },
  school: {
    title: "Fevers in school-age children: self-reporting and red flags",
    excerpt:
      "Older children can describe symptoms — this guide helps you know which of their words to trust and which still need a clinician's eyes.",
    byline: "Reviewed by Dr. R. Chen, Paediatric Nurse Practitioner · 9 Mar 2026",
  },
};

export function getGuideForAge(age: AgeId | null): Guide {
  return GUIDE_BY_AGE[age ?? "infant"];
}

export const DEFAULT_SUGGESTED_QUESTION = "My baby has a fever, what should I do?";

export function normalizePostText(raw: string): string {
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : DEFAULT_SUGGESTED_QUESTION;
}

export interface TopicSuggestion {
  id: string;
  label: string;
  question: string;
}

export const TOPIC_SUGGESTIONS: TopicSuggestion[] = [
  { id: "fever", label: "Fever", question: DEFAULT_SUGGESTED_QUESTION },
  { id: "sleep", label: "Sleep", question: "My toddler keeps waking up at night, is that normal?" },
  { id: "feeding", label: "Feeding", question: "My baby is refusing feeds today, should I be worried?" },
  { id: "behaviour", label: "Behaviour", question: "My child has started having big tantrums, how do I handle it?" },
];

export type NurseMessage = { from: "nurse" | "parent"; text: string };

export const NURSE_SCRIPT: NurseMessage[] = [
  {
    from: "nurse",
    text: "Hi, I saw your question about a fever tonight — I'm here. How old is he, and what's his temperature?",
  },
  { from: "parent", text: "He's 4 months and 38.6°C, been fussy since midnight." },
  {
    from: "nurse",
    text: "Thanks for that. Under 3 months, a fever like that needs in-person care straight away — but at 4 months, with no other red flags, this is usually manageable at home tonight.",
  },
  {
    from: "nurse",
    text: "Keep him lightly dressed, offer fluids often, and paracetamol at the right dose for his weight if he's uncomfortable — never aspirin for infants. Go to A&E or call 111 if he becomes floppy, won't feed, or the fever climbs past 39°C with a rash.",
  },
];

export const RISKY_REPLY = {
  author: "Jordan K.",
  text: "Just give him a cold bath and half an aspirin, works every time for us.",
};

export const SAFE_REPLY = {
  author: "Mira T.",
  text: "Following — we went through this last month. A cool compress and plenty of fluids helped us loads.",
};

export const FLAG_REASON =
  "Sentinel hid this reply — aspirin isn't safe for infants and toddlers and can trigger a rare but serious condition (Reye's syndrome). We've replaced it with a route to real clinical support.";

export const WHY_FLAGGED_DETAIL =
  "Kin's Sentinel model classifies community replies for unverified or dangerous medical advice in real time. Aspirin in children is a known, well-documented risk — this reply matched that pattern with high confidence and was hidden before most members saw it.";

/** Sentinel sequence timing, in ms from the moment the response screen is shown. */
export const SENTINEL_TIMING = {
  safeReplyAt: 900,
  riskyReplyRevealAt: 1900,
  scanStartAt: 2500,
  interventionAt: 3650,
} as const;

/** Per-message chat timing (typing indicator delay + read delay), in ms. */
export const CHAT_TIMING = {
  typingDelay: 900,
  nurseReadDelay: 700,
  parentReadDelay: 700,
  initialDelay: 400,
  footerDelayAfterLast: 200,
} as const;

export type Satisfaction = "yes" | "partially" | "no";

export type ClinicianMode = "chat" | "video";

/** Mocked local-outbreak alert shown on the home screen. */
export const OUTBREAK_ALERT = {
  headline: "Chickenpox cases rising in South London",
  summary: "Local nurseries have reported a spike this week. Tap for what to watch for and when to keep your child home.",
  detailTitle: "Chickenpox: what to do right now",
  bullets: [
    "Look for itchy, fluid-filled spots, usually starting on the chest, back or face.",
    "Keep your child home until all spots have crusted over — typically 5 days after they first appear.",
    "Cool baths, loose cotton clothing and calamine lotion help with itching; avoid ibuprofen unless a clinician advises it.",
    "Contact a clinician urgently if your child is under 4 weeks old, pregnant, immunocompromised, or the rash spreads to the eyes.",
  ],
} as const;

/** Mocked video-call connection timing, in ms. */
export const VIDEO_CALL_TIMING = {
  connectingFor: 2200,
} as const;

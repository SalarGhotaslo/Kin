export type AgeId = "newborn" | "infant" | "toddler" | "preschool" | "school";

/** Internal routing screen. Bottom-nav tabs are derived from this via `tabForScreen`. */
export type Screen =
  | "onboarding"
  | "home"
  | "outbreak"
  | "ask"
  | "clinicianChat"
  | "clinicianVideo"
  | "knowledge"
  | "profile";

export type Tab = "home" | "ask" | "knowledge" | "profile";

export const TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "ask", label: "Ask AI" },
  { id: "knowledge", label: "Knowledge" },
  { id: "profile", label: "Profile" },
];

export function tabForScreen(screen: Screen): Tab | null {
  switch (screen) {
    case "onboarding":
      return null;
    case "home":
    case "outbreak":
      return "home";
    case "ask":
    case "clinicianChat":
    case "clinicianVideo":
      return "ask";
    case "knowledge":
      return "knowledge";
    case "profile":
      return "profile";
  }
}

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

/** Broader life-stage groups shown on Profile's "Family Context" — several AgeIds can roll up into one stage. */
export interface StageGroup {
  id: string;
  label: string;
  sub: string;
  ages: AgeId[];
}

export const STAGE_GROUPS: StageGroup[] = [
  { id: "infant", label: "Infant", sub: "0–12 mo", ages: ["newborn", "infant"] },
  { id: "toddler", label: "Toddler", sub: "1–3 yrs", ages: ["toddler"] },
  { id: "preschool", label: "Preschool", sub: "3–5 yrs", ages: ["preschool"] },
  { id: "school", label: "School Age", sub: "6–12 yrs", ages: ["school"] },
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
  { code: "en", label: "English (US)" },
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

export const PARENT_USER = { name: "Alex Johnson" } as const;

export function parentTagline(children: Child[], profile: ParentProfile): string {
  const count = children.length;
  const childWord = count === 1 ? "1 child" : `${count} children`;
  return profile.languageCode !== "en" ? `Parent of ${childWord} · Multilingual Support Active` : `Parent of ${childWord}`;
}

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

/** Flat, filterable catalog for the Knowledge tab — spans topics and ages, not just fever. */
export interface KnowledgeArticle {
  id: string;
  title: string;
  excerpt: string;
  reviewer: string;
  reviewDate: string;
  age: AgeId;
  topic: TopicId;
}

export type TopicId = "fever" | "sleep" | "feeding" | "behaviour";

export const KNOWLEDGE_CATALOG: KnowledgeArticle[] = [
  ...AGE_OPTIONS.map((age) => ({
    id: `fever-${age.id}`,
    title: GUIDE_BY_AGE[age.id].title,
    excerpt: GUIDE_BY_AGE[age.id].excerpt,
    reviewer: GUIDE_BY_AGE[age.id].byline.replace(/^Reviewed by /, "").split(" · ")[0],
    reviewDate: GUIDE_BY_AGE[age.id].byline.split(" · ")[1],
    age: age.id,
    topic: "fever" as TopicId,
  })),
  {
    id: "sleep-toddler",
    title: "Sleep regression survival kit for toddlers",
    excerpt: "Consistent wind-down routines, safe co-sleeping alternatives, and how long a regression typically lasts.",
    reviewer: "Dr. R. Chen, Paediatric Nurse Practitioner",
    reviewDate: "2 Jun 2026",
    age: "toddler",
    topic: "sleep",
  },
  {
    id: "feeding-toddler",
    title: "Intro to solid foods: the 6-month guide",
    excerpt: "Safe first foods, textures to try in order, and choking-hazard foods to avoid at every stage.",
    reviewer: "Dr. A. Osei, Paediatrician",
    reviewDate: "20 May 2026",
    age: "infant",
    topic: "feeding",
  },
  {
    id: "feeding-picky",
    title: "Picky eating at age 2: food neophobia explained",
    excerpt: "Why toddlers suddenly reject foods they used to eat, and the One-Bite Rule for introducing new ones.",
    reviewer: "Dr. A. Osei, Paediatrician",
    reviewDate: "1 Jul 2026",
    age: "toddler",
    topic: "feeding",
  },
  {
    id: "behaviour-tantrums",
    title: "Big feelings, small people: handling tantrums at 2–3 years",
    excerpt: "What's developmentally normal, co-regulation techniques, and when frequency/intensity is worth flagging.",
    reviewer: "Dr. James Chan, Child Psychologist",
    reviewDate: "14 Apr 2026",
    age: "toddler",
    topic: "behaviour",
  },
];

export const TOPICS: { id: TopicId; label: string }[] = [
  { id: "fever", label: "Fever" },
  { id: "sleep", label: "Sleep" },
  { id: "feeding", label: "Feeding" },
  { id: "behaviour", label: "Behaviour" },
];

export const DEFAULT_SUGGESTED_QUESTION = "My baby has a fever, what should I do?";

export function normalizePostText(raw: string): string {
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : DEFAULT_SUGGESTED_QUESTION;
}

export interface TopicSuggestion {
  id: TopicId;
  label: string;
  question: string;
}

export const TOPIC_SUGGESTIONS: TopicSuggestion[] = [
  { id: "fever", label: "Fever", question: DEFAULT_SUGGESTED_QUESTION },
  { id: "sleep", label: "Sleep", question: "My toddler keeps waking up at night, is that normal?" },
  { id: "feeding", label: "Feeding", question: "My 2-year-old is refusing to eat anything but pasta. Is this normal and how can I introduce new foods?" },
  { id: "behaviour", label: "Behaviour", question: "My child has started having big tantrums, how do I handle it?" },
];

export interface CommunityQuote {
  author: string;
  text: string;
}

export interface SuggestedActivity {
  title: string;
  description: string;
  ctaLabel: string;
}

export interface AiResponse {
  intro: string;
  bullets: string[];
  followUpNote: string;
  game?: SuggestedActivity;
  watch?: { title: string };
  communityQuote?: CommunityQuote;
  /** Only set for the one scripted risk scenario (fever/aspirin) — everything else is a safe reply. */
  hasRiskyReply?: boolean;
}

export const AI_RESPONSE_BY_TOPIC: Record<TopicId, AiResponse> = {
  feeding: {
    intro:
      "Yes, this is very normal! Around age 2, many children go through a phase called food neophobia (fear of new foods) or selective eating. It's often a developmental stage related to their growing need for autonomy.",
    bullets: [
      "The “One-Bite” Rule: Encourage them to just touch or lick a new food without pressure to swallow.",
      "Keep pasta on the plate: Pair the familiar (pasta) with a tiny portion of the unfamiliar (broccoli).",
      "Model the behavior: Let them see you enjoying a variety of colorful foods.",
    ],
    followUpNote:
      "Pediatricians suggest it can take up to 8–10 exposures before a child accepts a new taste. Patience is your best tool here.",
    game: {
      title: "Sensory Texture Exploration",
      description: "Use colorful blocks and different textures to engage your toddler's senses before mealtime.",
      ctaLabel: "View Game Guide",
    },
    watch: { title: "Let's Play With Food! Fun & Healthy Snacks" },
    communityQuote: {
      author: "Alex P.",
      text: "Our toddler loved the sensory bin idea! It helped distract them from the mealtime battle.",
    },
  },
  fever: {
    intro:
      "A fever on its own usually isn't an emergency — it's the body fighting an infection. What matters most is your child's age and how they're acting alongside the number on the thermometer.",
    bullets: [
      "Dress lightly and offer fluids often — overdressing traps heat in.",
      "Paracetamol at the right dose for weight/age can help with discomfort, never aspirin for infants or toddlers.",
      "Track the pattern: how high, how long, and whether anything else (rash, breathing, feeding) changes alongside it.",
    ],
    followUpNote: "Under 3 months, any fever needs same-day clinical review — age changes the threshold for urgency.",
    hasRiskyReply: true,
  },
  sleep: {
    intro:
      "Sleep regressions are common around big developmental leaps (walking, talking, separation anxiety) and usually pass within 2–6 weeks with a steady routine.",
    bullets: [
      "Keep bed/wake times consistent, even after a rough night.",
      "A short, predictable wind-down routine cues the brain that sleep is coming.",
      "Avoid introducing new sleep props (rocking to sleep, etc.) you'll need to undo later.",
    ],
    followUpNote: "If night-waking is paired with snoring, gasping, or daytime sleepiness, it's worth a clinician check.",
    game: {
      title: "Wind-Down Story Cards",
      description: "A simple 3-card sequence (bath, story, song) your toddler can help choose each night.",
      ctaLabel: "View Routine Guide",
    },
    communityQuote: {
      author: "Priya T.",
      text: "The same 3 songs every night, in the same order, was what finally got us through the regression.",
    },
  },
  behaviour: {
    intro:
      "Big tantrums at this age are developmentally normal — your child's emotions are outpacing their ability to communicate and self-regulate.",
    bullets: [
      "Name the feeling calmly (“you're really frustrated right now”) rather than reasoning mid-meltdown.",
      "Stay close and steady — co-regulation teaches self-regulation over time.",
      "Praise the recovery, not just the compliance, once they're calm again.",
    ],
    followUpNote: "Frequent, prolonged tantrums past age 4, or ones involving self-harm, are worth flagging to a clinician.",
    watch: { title: "Staying Calm Through Toddler Meltdowns" },
    communityQuote: {
      author: "Dana K.",
      text: "Getting down to his eye level before saying anything cut our meltdowns almost in half.",
    },
  },
};

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

/** Sentinel sequence timing, in ms from the moment the response thread is shown. */
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

export interface RecommendedClinician {
  id: string;
  name: string;
  specialty: string;
  initials: string;
}

export const RECOMMENDED_CLINICIANS: RecommendedClinician[] = [
  { id: "sarah-mitchell", name: "Dr. Sarah Mitchell", specialty: "Pediatrician", initials: "SM" },
  { id: "james-chan", name: "Dr. James Chan", specialty: "Psychologist", initials: "JC" },
];

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

export interface DailyInsight {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
}

export const DAILY_INSIGHTS: DailyInsight[] = [
  { id: "sleep", tag: "SLEEP", title: "Mastering Sleep", subtitle: "Tips for transitioning your toddler to a consistent bedtime routine." },
  { id: "nutrition", tag: "NUTRITION", title: "Picky Eating Phases", subtitle: "Why food neophobia happens and how to keep mealtimes calm." },
  { id: "development", tag: "MILESTONES", title: "Talking Timelines", subtitle: "What vocabulary growth typically looks like between 18–30 months." },
];

export interface RecentActivity {
  tagLabel: string;
  summary: string;
  suggestion: string;
  continueTopic: TopicId;
}

export const RECENT_ACTIVITY: RecentActivity = {
  tagLabel: "AI CONSULTATION",
  summary: "My 2-year-old is refusing to eat anything but pasta. Kin suggested “Try exposure therapy with small portions of colorful veggies alongside the pasta.”",
  suggestion: "Try exposure therapy with small portions of colorful veggies alongside the pasta.",
  continueTopic: "feeding",
};

export interface Milestone {
  goalLabel: string;
  percentage: number;
}

export const MILESTONE: Milestone = {
  goalLabel: "vocabulary goal",
  percentage: 85,
};

export interface PrivacyToggles {
  anonymousTraining: boolean;
  cloudBackup: boolean;
  dataRetention: boolean;
}

export const DEFAULT_PRIVACY_TOGGLES: PrivacyToggles = {
  anonymousTraining: true,
  cloudBackup: true,
  dataRetention: false,
};

export const NOTIFICATION_COUNT = 2;

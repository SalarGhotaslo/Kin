# Kin MVP Summary — Epics 1–4: Trust Foundation, AI Parenting Assistant, Translation and Knowledge Hub

**Purpose:** This document summarises the first four MVP epics for Kin, a parenting support app that combines secure onboarding, AI-generated guidance, community intelligence, professional content and safe escalation to clinicians where needed.

## Epic overview

| Epic | Name | Summary |
|---|---|---|
| 1 | User Registration & Trust Foundation | Create a secure, privacy-first entry point for parents and enable basic personalisation. |
| 2 | AI Parenting Assistant | Allow parents to ask a query and receive AI-generated responses grounded in community forum knowledge and professional articles/materials, with escalation to a clinician if unresolved. |
| 3 | Babel Translation Engine | Enable multilingual participation and improve translation quality through feedback and review. |
| 4 | Expert Knowledge Hub | Provide trusted, searchable, clinically reviewed parenting material that can be used directly by parents and as a source for AI responses. |

## Epic 1: User Registration & Trust Foundation

**Goal:** Build a secure and trusted onboarding experience so parents can safely access Kin's community, AI support and knowledge services.

### Scope summary
- Secure account creation using email, phone or approved social login.
- Profile personalisation including child age range, preferred language and relevant parenting context.
- Consent capture, privacy acknowledgement and encryption of personally identifiable information.

### User stories and acceptance criteria

| User story | Purpose | Summary acceptance criteria |
|---|---|---|
| US-001 Parent Registration | Parents can create and access a secure Kin account. | Valid registration creates an account; login authenticates securely; invalid or duplicate credentials produce clear errors. |
| US-002 Profile Personalisation | Parents can tailor Kin to their family context. | Parent can add/edit child age range and preferred language, plus optional context (gender, number of children, children's ages, pregnancy status, relationship status, culture, other); profile changes are saved; sensitive data is encrypted. Child age range is required and required to drive personalised content elsewhere in the app; optional fields do not block save and do not gate other app behaviour on their own. |
| US-018 Consent Management | Parents control how their data is used. | Explicit consent is captured; consent can be withdrawn; consent history is retained; privacy policy is visible during onboarding. |

**MVP outcome:** Parents can join Kin safely, understand how their data is used and receive a personalised experience from the first session.

## Epic 2: AI Parenting Assistant

**Goal:** Let parents ask questions in natural language and receive AI-generated answers based on two governed sources: community forum insights and professional articles/materials, with escalation to a clinician when the parent is not satisfied or risk is detected.

### Scope summary
- Parent asks a parenting query rather than manually browsing forums.
- AI generates a response using community forum knowledge and professional reviewed materials.
- Source attribution separates community insight from professional guidance.
- Parent can respond, ask follow-up questions and mark whether the answer helped.
- If confidence is low, risk is detected, or the parent is not happy, Kin redirects to clinician support.

### User stories and acceptance criteria

| User story | Purpose | Summary acceptance criteria |
|---|---|---|
| US-003 Ask a Parenting Question | Parents can submit a natural-language parenting concern. | Logged-in parent can ask a query; Kin processes it; empty or inappropriate queries are handled safely. |
| US-004 AI Trusted Response | Parents receive an answer grounded in approved sources. | Response includes content from community forums and professional materials where available; answer avoids unsupported clinical claims. |
| US-005 Source Attribution | Parents can see why the answer should be trusted. | Community insights and professional articles/materials are labelled separately; source type and review status are visible. |
| US-006 Follow-Up Conversation | Parents can clarify or refine the answer. | Conversation context is retained; follow-up responses remain consistent with prior guidance and source boundaries. |
| US-007 Satisfaction Check | Kin understands whether the answer resolved the query. | After each answer, parent can select Yes, Partially or No; selection is stored for analytics and escalation logic. |
| US-008 Clinician Redirect | Parents are directed to human support when AI is insufficient. | Clinician option appears if parent selects No, repeated unresolved follow-ups occur, AI confidence is low, or high-risk indicators are detected. |
| US-010 Handover Summary | Clinicians receive context without forcing parents to repeat themselves. | Referral includes question history, AI responses, source references, satisfaction status and risk indicators. |

**MVP outcome:** Parents get faster, trusted answers while Kin maintains a safety path to clinicians when AI guidance is not enough.

## Epic 3: Babel Translation Engine

**Goal:** Reduce language barriers so parents can participate in Kin and access support in their preferred language.

### Scope summary
- Automatically translate posts, AI responses and relevant knowledge materials into the parent's preferred language.
- Preserve the original wording so translations can be reviewed and corrected.
- Capture user feedback on poor translations, especially cultural parenting terminology and slang.

### User stories and acceptance criteria

| User story | Purpose | Summary acceptance criteria |
|---|---|---|
| US-006 Auto Translation | Multilingual parents can understand Kin content. | Content in another language is shown in the preferred language; user can switch language; original text remains accessible. |
| US-007 Translation Feedback | Parents can flag unclear or incorrect translations. | User can report a translation; original and translated text are sent for review; issue status is recorded. |
| US-020 Translation Quality Review | Kin can improve accuracy before clinical scaling. | Reported translations are reviewed; critical errors are categorised; fixes can be applied to future translations. |

**MVP outcome:** Kin becomes accessible to multilingual families while maintaining a controlled quality loop before high-liability clinical features are expanded.

## Epic 4: Expert Knowledge Hub

**Goal:** Provide a trusted, searchable knowledge layer that gives parents safe self-serve guidance and supplies professional source material for the AI Parenting Assistant.

### Scope summary
- Clinically reviewed parenting guides covering development, health, behaviour, safety and wellbeing topics.
- Search, filtering and bookmarking so parents can quickly find relevant information.
- Visible reviewer, review date and content status to support trust and governance.

### User stories and acceptance criteria

| User story | Purpose | Summary acceptance criteria |
|---|---|---|
| US-008 Access Expert Guides | Parents can find reliable parenting information before escalation. | Guides are searchable; content can be filtered by child age and topic; review date and reviewer are displayed. |
| US-009 Save Resources | Parents can return to useful guidance later. | Resources can be bookmarked; saved items appear in My Resources; bookmarks sync across devices. |
| US-021 Content Governance | Kin ensures professional materials remain current and safe. | Each article has an owner, review date and approval status; expired or unapproved content is excluded from AI source retrieval. |

**MVP outcome:** Parents can self-serve trusted guidance, and Kin AI has a governed professional content base to draw from when answering queries.

## Implementation notes

- Epic 2 should be treated as the core MVP experience: ask a query, receive a grounded answer, respond, and escalate if unresolved.
- Community content should be anonymised, moderated and clearly labelled as community insight rather than professional advice.
- Professional articles/materials should be governed through Epic 4 and excluded from AI retrieval if unapproved or out of date.
- Clinician redirection should include a structured handover summary to reduce repeated triage and support clinician buy-in.

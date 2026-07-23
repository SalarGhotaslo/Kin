---
title: Kin
status: draft
created: 2026-07-23
updated: 2026-07-23
---

# PRD: Kin
*Working title — confirm.*

## 0. Document Purpose

This PRD scopes the **Kin MVP**: a parenting support app combining secure onboarding, an AI parenting assistant grounded in community and professional knowledge, multilingual access, and a clinically governed knowledge hub — with safe escalation to a human clinician when AI guidance isn't enough. Full detail for each epic's user stories and acceptance criteria lives in `stories.md`; this document covers vision, scope, and functional requirements at the feature level.

**[ASSUMPTION]** The original hackathon demo flow (session-only profile → post to feed → Sentinel flags a risky reply → Intervention Card → mocked nurse chat → age-adaptive content card) is preserved as the flagship walkthrough of Epic 2 (§4.2), not a separate scope. It demonstrates the same "detect risk → escalate to clinician" mechanic that Epic 2's US-008 Clinician Redirect formalises for the full product.

## 1. Vision

Parents facing a child's health scare at 2am face a broken choice: hours in a crowded ER for something minor, or unmoderated online forums where 82% of parents seek advice and are met with unregulated, sometimes dangerous peer misinformation. By the time a parent realizes the advice was wrong, real professional help has been delayed — and up to 70% of pediatric ER visits are for non-urgent issues that never needed to be there.

Kin is the third choice: a parent community with a clinical safety net built in, grounded in governed knowledge (community insight + clinically reviewed professional material), accessible in a parent's own language, and backed by real clinicians when the AI can't safely resolve a concern.

## 2. Target User

### 2.1 Jobs To Be Done

- When my infant/toddler shows a symptom late at night, I want a fast, trustworthy answer, so I can act correctly without waiting hours in an ER or trusting a stranger online.
- When I read peer advice in a parenting community, I want to know if it's actually safe, so I don't act on something dangerous before I find out it's wrong.
- When I'm scared and it's 2am, I want a real professional within reach, without the cost/wait of a GP or ER visit.
- When Kin's content isn't in my language, I want it translated so I can participate and understand guidance without a language barrier.
- When I want to self-serve an answer, I want searchable, clinically reviewed guides so I don't have to ask at all.

### 2.2 Non-Users (v1)

- Parents navigating adolescent mental-health stigma (Helen's use case: anonymous posting, teen mental-health content, therapist routing) remain part of Kin's long-term vision but are **not served by this MVP** — see §5 Non-Goals.
- **[CHANGE FROM PRIOR DRAFT]** Multilingual participation (previously Elena's out-of-scope use case) is now in scope via Epic 3 (Babel Translation Engine, §4.3).

### 2.3 Key User Journeys

- **UJ-1. Priya catches bad advice before it's too late, at 3am.**
  - **Persona + context:** Priya Patel, 29, first-time mother to Liam (4 months), South London. Anxious, sleep-deprived, alone with the baby at night.
  - **Path:** She registers and completes her profile (Epic 1) → asks/posts about Liam's fever → a risky community reply is flagged and hidden by the AI, replaced with an explanation and a path to a clinician (Epic 2) → she talks to a nurse and gets a safe, clinically-reasonable answer → she sees a governed, age-adaptive guide reinforcing the guidance (Epic 4).
  - **Edge case:** If AI classification/response generation fails or times out, the flow must degrade to a safe fallback (e.g., direct clinician routing) rather than dead-ending.

- **UJ-2. A non-English-speaking parent participates fully.**
  - **Persona + context:** A parent whose preferred language isn't English.
  - **Path:** Registers with a preferred language (Epic 1) → community posts, AI responses and knowledge-hub articles are shown translated (Epic 3) → flags a translation that mangles a cultural parenting term → correction feeds the quality-review loop.

## 3. Glossary

- **Kin** — the product. A parent community with an integrated safety net.
- **AI Parenting Assistant** — the feature (Epic 2) that answers a parent's natural-language query using community and professional sources, with escalation to a clinician when needed.
- **Sentinel** — the risk-detection mechanism within Epic 2 that classifies community replies/AI responses for unverified or dangerous medical advice.
- **Intervention Card** — the UI element shown in place of flagged/hidden risky content, explaining the flag and offering a route to a clinician.
- **Babel** — the translation engine (Epic 3) that auto-translates posts, AI responses and knowledge-hub material.
- **Expert Knowledge Hub** — the governed library (Epic 4) of clinically reviewed guides, also used as a professional source for the AI Parenting Assistant.
- **Handover Summary** — the structured context (question history, AI responses, sources, satisfaction, risk indicators) passed to a clinician on escalation.
- **Profile** — the parent's personalisation data: child age range (required) plus optional context (gender, number of children, children's ages, pregnancy status, relationship status, culture, other) and preferred language.

## 4. Features

### 4.1 Epic 1: User Registration & Trust Foundation

**Goal:** Build a secure and trusted onboarding experience so parents can safely access Kin's community, AI support and knowledge services.

**Functional Requirements** *(full acceptance criteria in `stories.md`)*:
- **US-001 Parent Registration** — secure account creation (email, phone, or approved social login); authenticated login; clear errors on invalid/duplicate credentials.
- **US-002 Profile Personalisation** — parent can add/edit child age range (required) and preferred language, plus optional context (gender, number of children, children's ages, pregnancy status, relationship status, culture, other); changes are saved; sensitive data is encrypted. Required field drives personalisation elsewhere (Epic 2 responses, Epic 4 content filtering); optional fields don't gate other behaviour.
- **US-018 Consent Management** — explicit consent capture; consent can be withdrawn; consent history retained; privacy policy visible during onboarding.

**Out of Scope:** Enterprise SSO, multi-factor authentication, account recovery flows beyond basic reset.

### 4.2 Epic 2: AI Parenting Assistant

**Goal:** Let parents ask questions in natural language and receive AI-generated answers grounded in community forum knowledge and professional materials (Epic 4), with escalation to a clinician when the parent is unsatisfied or risk is detected. This is the **core MVP experience**.

**Functional Requirements** *(full acceptance criteria in `stories.md`)*:
- **US-003 Ask a Parenting Question** — parent submits a natural-language query; empty/inappropriate queries handled safely.
- **US-004 AI Trusted Response** — response grounded in community + professional sources where available; avoids unsupported clinical claims.
- **US-005 Source Attribution** — community insight vs. professional material clearly labelled, with source type and review status visible.
- **US-006 (Epic 2) Follow-Up Conversation** — conversation context retained; follow-ups stay consistent with prior guidance and source boundaries.
- **US-007 (Epic 2) Satisfaction Check** — parent selects Yes/Partially/No after each answer; stored for analytics and escalation logic.
- **US-008 (Epic 2) Clinician Redirect** — clinician option surfaces on: "No" response, repeated unresolved follow-ups, low AI confidence, or high-risk indicators. This generalises the hackathon Sentinel/Intervention Card mechanic (flagging risky community replies) into the product's core safety net.
- **US-010 Handover Summary** — referral includes question history, AI responses, source references, satisfaction status, and risk indicators.

**Feature-specific NFRs:**
- If AI classification or response generation fails or times out, fall back to a safe default (e.g., direct clinician routing) — never a dead-end state.

**Out of Scope:** Real-time multi-clinician load balancing, payment/booking for clinician sessions (see roadmap in `addendum.md`).

### 4.3 Epic 3: Babel Translation Engine

**Goal:** Reduce language barriers so parents can participate in Kin and access support in their preferred language.

**Functional Requirements** *(full acceptance criteria in `stories.md`)*:
- **US-006 (Epic 3) Auto Translation** — content shown in preferred language; user can switch language; original text remains accessible.
- **US-007 (Epic 3) Translation Feedback** — parent can report a translation; original + translated text sent for review; issue status recorded.
- **US-020 Translation Quality Review** — reported translations reviewed; critical errors categorised; fixes applied to future translations.

**Out of Scope:** Real-time voice translation, dialect-level customisation beyond flagged corrections.

### 4.4 Epic 4: Expert Knowledge Hub

**Goal:** Provide a trusted, searchable knowledge layer for parent self-serve guidance and as governed professional source material for Epic 2.

**Functional Requirements** *(full acceptance criteria in `stories.md`)*:
- **US-008 (Epic 4) Access Expert Guides** — guides searchable and filterable by child age and topic; review date and reviewer displayed.
- **US-009 Save Resources** — bookmarking; saved items appear in My Resources; bookmarks sync across devices.
- **US-021 Content Governance** — each article has an owner, review date, and approval status; expired/unapproved content excluded from AI source retrieval (Epic 2).

**Out of Scope:** User-generated knowledge-hub content, multi-author collaborative editing.

## 5. Non-Goals (Explicit)

- Kin is not a diagnostic tool and makes no diagnostic claims; it is not a replacement for emergency care.
- No real clinician EHR integration or full regulatory/licensure compliance build-out in this MVP (see phased rollout in `addendum.md`).
- **Helen's use case (anonymous posting, teen mental-health content, therapist routing) is not built** — long-term vision only.
- No production-grade misinformation-detection model beyond the MVP's risk rubric/classifier.
- No payments, scheduling, or clinician marketplace features.

## 6. MVP Scope

### 6.1 In Scope
- Secure registration, profile personalisation (full field set), and consent management (Epic 1).
- AI-generated, source-attributed answers to parenting queries with satisfaction tracking and clinician escalation + handover summary (Epic 2).
- Auto-translation of posts, AI responses, and knowledge-hub content, with a feedback/review loop for translation quality (Epic 3).
- Searchable, filterable, bookmarkable, clinically governed knowledge-hub content that also feeds Epic 2's professional source pool (Epic 4).
- Community content anonymised, moderated, and clearly labelled as community insight (not professional advice).

### 6.2 Out of Scope for MVP
- Helen's mental-health/anonymity use case (long-term vision — see `addendum.md`).
- Real clinician staffing/backend beyond a scripted or lightly-integrated escalation path.
- Payments, scheduling, clinician marketplace.
- Full regulatory/compliance build-out (tracked as phased roadmap in `addendum.md`).

## 7. Success Metrics

**Primary**
- **SM-1**: A risky reply/response is caught and routed to a clinician option reliably, with a complete handover summary. Validates US-004/US-005/US-008/US-010.
- **SM-2**: Parents can get a source-attributed AI answer end-to-end (ask → answer → satisfaction check) without needing to browse forums manually. Validates US-003–US-007.

**Secondary**
- **SM-3**: Non-English-preferring parents can complete the same core flow (ask, read, escalate) entirely in their preferred language. Validates Epic 3.
- **SM-4**: Unapproved/expired knowledge-hub content is never surfaced by the AI assistant. Validates US-021.

**Counter-metrics (do not optimize)**
- **SM-C1**: Do not add scope or features at the cost of safety/escalation reliability — a flashier but fragile build loses to one that reliably routes risk to a human.

## 8. Open Questions

1. Which LLM/API powers the AI Parenting Assistant and Sentinel classification, and is an API key available? Blocks build start.
2. What defines "low confidence" and "high-risk indicators" for US-008's clinician-redirect trigger — needs a concrete rubric.
3. Who authors/reviews the initial Expert Knowledge Hub content set (US-021 owners/reviewers), and by when?
4. What's the real clinician-side integration for Epic 2/US-010 in this MVP — live handoff, ticket queue, or still scripted/mocked?
5. Duplicate story IDs exist in `stories.md` across epics (US-006, US-007, US-008 each appear twice, once per epic) — recommend renumbering for unambiguous traceability.

## 9. Assumptions Index

- §0 — The original hackathon demo flow is folded into Epic 2 as its flagship scenario, not a separate scope.
- §2.2 — Helen's use case remains out of scope; Elena's (translation) is now in scope via Epic 3.
- §4.1 US-002 — Child age range is required; all other profile fields are optional and don't gate other behaviour.
- §4.2 — Epic 2 is the core MVP experience; Sentinel-style risk detection is generalised into US-008's clinician redirect.
- §4.4 — Knowledge-hub content must be approved and current to be eligible for AI retrieval (US-021).

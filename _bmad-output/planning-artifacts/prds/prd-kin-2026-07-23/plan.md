# Kin — MVP Delivery Plan

Derived from `prd.md` and `stories.md`. Sequenced by dependency across the four epics rather than a fixed hackathon clock. The original hackathon build (session-only profile → post → Sentinel flags risky reply → Intervention Card → mocked nurse chat → age-adaptive content) remains the flagship demo scenario and is delivered as part of Phase 2/3 below, not a separate track.

## Blocking clarifications (resolve first)
1. LLM/API provider and key for AI response generation + Sentinel-style risk classification.
2. Concrete rubric for "low confidence" / "high-risk indicators" driving US-008's clinician redirect.
3. Who owns/reviews the initial Expert Knowledge Hub content set (US-021), and by when — Epic 2 and Epic 4 are both blocked on an initial governed content set existing.
4. Real vs. scripted clinician-side integration for the handover summary (US-010) in this MVP.
5. Duplicate story IDs in `stories.md` (US-006/007/008 each reused across epics) should be renumbered before sprint planning to keep traceability unambiguous.

## Phased sequence

| Phase | Epic(s) | Focus | Why this order |
|---|---|---|---|
| 1 — Foundation | Epic 1 | Secure registration, profile personalisation (child age range required + optional context fields, preferred language), consent management | Everything downstream (personalised responses, translation, saved resources) needs an authenticated parent with a profile. |
| 2 — Content backbone | Epic 4 | Governed knowledge-hub guides, search/filter/bookmark, content governance (owner, review date, approval status) | Epic 2's AI responses must draw from an approved professional source pool — this has to exist and be governed before AI retrieval can be trusted. |
| 3 — Core AI experience | Epic 2 | Ask a question → grounded, source-attributed answer → follow-up → satisfaction check → clinician redirect + handover summary | The core MVP experience (per `prd.md` §4.2). Depends on Phase 1 (auth/profile) and Phase 2 (governed content to ground responses). This phase is where the hackathon Sentinel/Intervention Card/Nurse-chat/age-adaptive-content flow lives, generalised into US-004/US-005/US-008/US-010. |
| 4 — Accessibility layer | Epic 3 | Auto-translation of posts/AI responses/knowledge-hub content, translation feedback, quality review loop | Extends Phases 1–3 to non-English-preferring parents. Sequenced last since it depends on there being community/AI/knowledge content (Phases 1–3) to translate, and its own MVP outcome explicitly frames it as a quality gate "before high-liability clinical features are expanded" further. |

**Cross-reference:** `addendum.md`'s post-hackathon roadmap (Phase 1 Compliance, Phase 2 Babel pilot, Phase 3 Shadow Sentinel, Phase 4 Controlled clinical launch) is the longer regulatory/rollout view. This plan is the feature-delivery view for reaching that roadmap's Phase 2–3 milestones; reconcile phase numbering between the two docs if both are shared externally.

## Fallback discipline
- AI response generation and risk classification (Epic 2) must degrade to a safe default (e.g., direct clinician routing) on failure/timeout — never a dead-end state, whether in a live demo or production.
- Content excluded by Epic 4 governance (expired/unapproved) must never be retrievable by Epic 2, even as a fallback.

## Out of scope reminder
Helen's use case (anonymous posting, teen mental health, therapist routing), payments/scheduling, clinician marketplace, and full regulatory/compliance build-out are not in this MVP — see `prd.md` §5 and the longer-term roadmap in `addendum.md`.

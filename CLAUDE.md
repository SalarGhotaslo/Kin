# Kin

## Repo state

This repo currently contains **planning artifacts only** — no application code has been written yet. All product/technical decisions to date live under `_bmad-output/planning-artifacts/prds/prd-kin-2026-07-23/`:

- `prd.md` — vision, target users, epics, functional requirements, non-goals, success metrics, open questions.
- `plan.md` — phased delivery sequence across the four epics, with blocking clarifications and fallback discipline.
- `stories.md` — full user stories and acceptance criteria per epic.
- `addendum.md` — supplementary detail (build-approach rationale, post-hackathon rollout roadmap) that isn't build scope.
- `.memlog.md` — chronological decision log from the planning session.

Treat `prd.md` and `stories.md` as the source of truth for scope; `plan.md` for sequencing; `addendum.md` for background/rationale only (explicitly **not** build scope).

## What Kin is

A parenting support app: parents get AI-generated answers to parenting questions grounded in community + clinically-reviewed professional content, with safe escalation to a human clinician when the AI can't resolve a concern safely. Positioned as a third option between a crowded ER visit and unmoderated online forums.

## MVP scope — four epics

1. **Epic 1 — User Registration & Trust Foundation**: secure account creation, profile personalisation (child age range required; everything else optional), consent management.
2. **Epic 2 — AI Parenting Assistant** (core MVP experience): ask a question → source-attributed grounded answer → follow-up → satisfaction check (Yes/Partially/No) → clinician redirect on low confidence/high risk/dissatisfaction → structured handover summary to the clinician.
3. **Epic 3 — Babel Translation Engine**: auto-translation of posts/AI responses/knowledge-hub content into a parent's preferred language, with a translation-feedback and quality-review loop.
4. **Epic 4 — Expert Knowledge Hub**: searchable, filterable, bookmarkable clinically-governed guides; each article has an owner/review date/approval status; expired or unapproved content must never be retrievable by Epic 2.

Delivery order per `plan.md`: Epic 1 (foundation) → Epic 4 (governed content backbone) → Epic 2 (core AI experience, needs auth + governed content) → Epic 3 (translation layer, needs content to translate).

## Hard constraints — do not violate

- **Safety fallback discipline**: if AI response generation or risk classification fails or times out, degrade to a safe default (e.g. direct clinician routing) — never a dead-end state.
- **Content governance boundary**: Epic 2 must never retrieve expired or unapproved Epic 4 content, including as a fallback.
- **No diagnostic claims**: Kin is not a diagnostic tool and is not a replacement for emergency care.
- Don't scope-creep toward safety/escalation at the expense of reliability (see PRD §7 counter-metric SM-C1) — a reliable escalation path beats a flashier but fragile build.

## Explicitly out of scope for MVP

- Helen's use case (anonymous posting, teen mental-health content, therapist routing) — long-term vision only, not built.
- Payments, scheduling, clinician marketplace, real clinician EHR integration.
- Full regulatory/compliance build-out (see `addendum.md`'s 9–12 month phased rollout for the longer-term view).
- Enterprise SSO, MFA, account recovery beyond basic reset (Epic 1); real-time voice translation (Epic 3); user-generated knowledge-hub content (Epic 4).

## Build approach (decided, per `addendum.md`)

Responsive/mobile-first web app (Next.js) on Vercel rather than a native app, with an optional PWA manifest for "Add to Home Screen" installability. Revisit only if a specific requirement demands a native/app-store artifact.

## Open questions blocking build start (see `prd.md` §8 / `plan.md`)

1. Which LLM/API powers the AI Parenting Assistant and Sentinel-style risk classification, and is a key available?
2. Concrete rubric for "low confidence" / "high-risk indicators" driving the clinician-redirect trigger (US-008).
3. Who authors/reviews the initial Expert Knowledge Hub content set, and by when?
4. Is the clinician-side handover (US-010) a live handoff, a ticket queue, or scripted/mocked for MVP?
5. `stories.md` reuses story IDs US-006/007/008 across different epics — renumber before treating IDs as globally unique.

When starting implementation work, resolve or confirm assumptions on these before writing code that depends on them.

# Kin

## Repo state

This repo is now a working Next.js (App Router, TypeScript) prototype of Kin's flagship walkthrough — not just planning artifacts. The original BMAD planning docs still live under `_bmad-output/planning-artifacts/prds/prd-kin-2026-07-23/` (`prd.md`, `plan.md`, `stories.md`, `addendum.md`, `.memlog.md`) and are useful background on the product's origin and long-term vision, but **the live product direction (given directly by the stakeholder) has superseded parts of that PRD** — see "Where this diverges from the original PRD" below. Treat this file and the actual code as the source of truth for current scope; treat `_bmad-output` as historical/strategic context, not a spec to follow literally.

## What's built

A single-page, fully-mocked interactive prototype (`src/components/KinPrototype.tsx` orchestrates everything) walking through Kin's core safety flow. No real backend, LLM, or clinician integration — everything is scripted/mocked so the flow can be demoed and iterated on before any real integration work starts.

### Screen sequence (`src/lib/kinFlow.ts` defines the `Screen` union and drives timing/copy)

1. **Onboarding** (`OnboardingScreen`) — session-only (nothing persisted to an account). Captures optional parent-level context (age band, relationship status, ethnic background, preferred language) plus a **required** list of one or more children (name + age band). Continue is gated on having at least one child.
2. **Home** (`HomeScreen`) — "Which child do you want to speak about today?" with a child picker, a language switcher, and a mocked local-outbreak alert banner (e.g. chickenpox in the area) that links to a detail screen.
3. **Outbreak detail** (`OutbreakDetailScreen`) — guidance bullets for the alert, dismiss back to Home.
4. **Ask** (`AskScreen`) — "What do you want help with?" for the selected child: topic chips (Fever/Sleep/Feeding/Behaviour) or free text.
5. **Response** (`ResponseScreen`) — the core mechanic: shows an age-matched suggested article (bookmarkable) *and* a community-reply thread. A safe reply appears, then a risky one (aspirin advice) that Sentinel detects, scans, and replaces with an Intervention Card explaining the flag and offering clinician escalation. Also runs the Satisfaction Check (Yes/Partially/No) — "No" and the Intervention Card's CTA both escalate; "Partially" offers escalation; "Yes" returns home.
6. **Clinician choice** (`ClinicianChoiceScreen`) — choose Chat or Video call.
7. **Nurse chat** (`NurseScreen`) — scripted nurse conversation, ends with "Done — back to home".
8. **Video call** (`VideoCallScreen`) — mocked connecting → connected UI with a simulated remote/self video tile layout, "End call" returns home.

A global **restart** button (top of the stage) resets all state back to onboarding.

## Where this diverges from the original PRD

The stakeholder has directed real changes beyond the original BMAD scope; these are now the actual product direction, not the PRD's:

- **Multi-child support**: onboarding now collects a *list* of children (not a single child age band), and Home asks which child today's conversation is about.
- **Expanded onboarding**: parent age, relationship status, and ethnic background are now asked directly in onboarding (still optional), not deferred to a later "personalisation" epic.
- **Restructured core flow**: rather than a community-feed-first flow, the sequence is now Ask → Response (article + community, with Sentinel) → Satisfaction → Clinician choice, more directly mirroring Epic 2's US-003 through US-008.
- **Clinician channel choice**: chat *and* video call are both offered (PRD/stories only specified chat/mocked nurse chat).
- **Local outbreak alerts**: a home-screen alert banner (e.g. "chickenpox rising in your area") — this is **new, not in the original PRD at all**.
- **Visible language switcher**: language selection is now a first-class Home-screen control, not just a profile field (Epic 3 Babel is still not actually implemented — switching shows a toast, no real translation).

## Design system

- Tokens live in `src/app/globals.css` as CSS custom properties (`--bg`, `--ink`, `--accent` [community/trust], `--pro` [professional/clinical], `--risk` [Sentinel flag], plus `-soft`/`-ink` variants), redefined for light/dark via `prefers-color-scheme` and `data-theme` overrides. **All text/background pairs are contrast-audited (WCAG AA, ≥4.5:1 for text, ≥3:1 for UI boundaries)** — see the automated axe scan in `e2e/accessibility.spec.ts`. If you change a color token, rerun that suite; a past bug here was checking contrast only against `--surface` and missing the bare `--bg` case used by header/footnote text.
- Typefaces via `next/font/google` in `src/app/layout.tsx`: Fraunces (display/headings), Manrope (body/UI), IBM Plex Mono (labels/timestamps/eyebrows).
- `AmbientBackdrop.tsx` is a decorative canvas (subtle drifting motes colored from `--accent`) behind the phone frame — respects `prefers-reduced-motion` (freezes to a static frame).
- Accessibility patterns already in place: focus moves to the new screen's root on every screen change (`KinPrototype`'s `useEffect` + `tabIndex={-1}` on each screen `<section>`), `role="alert"` on the Intervention Card, `aria-live="polite"` on the nurse chat and response-reply containers, `role="status"` on the toast, `.sr-only` utility for screen-reader-only hints, decorative SVGs marked `aria-hidden`. Hover states on solid-background buttons **darken** (not brighten) — brightening was found (via axe) to drop contrast below AA on `--risk`/`--accent`/`--pro` backgrounds.

## Testing

Three layers, all passing as of this writing:

- **Unit** (`src/lib/__tests__/kinFlow.test.ts`, Vitest): pure data/logic — age→guide mapping, nurse script safety invariants, onboarding option lists, topic/outbreak data shape.
- **Feature/component** (`src/components/__tests__/*.test.tsx`, Vitest + React Testing Library): every screen in isolation plus a full `KinPrototype.feature.test.tsx` covering the chat path, video path, satisfied-parent path, outbreak alert, multi-child routing, and restart. Screens with internal `setTimeout` sequences use `vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] })` — **use `fireEvent`, not `userEvent`, for clicks under fake timers** (userEvent's internal scheduling hangs indefinitely with Vitest fake timers even with `delay: null`; this was verified directly, not assumed).
- **Browser/e2e** (`e2e/*.spec.ts`, Playwright against a real production build): `kin-flow.spec.ts` drives the same flows in a real browser; `accessibility.spec.ts` runs axe-core (WCAG 2.1 A/AA) against every screen in both themes. **Accessibility scans force `reducedMotion: "reduce"`** — without it, axe can sample colors mid-CSS-transition during the screen-enter fade and report false-positive contrast failures.

Run: `npm test` (unit/feature), `npm run test:e2e` (browser + a11y), `npm run build && npm run lint && npx tsc --noEmit` before considering a change done.

## Known repo quirk

This directory has a git remote (`origin` → a GitHub repo under the user's account) that Claude did not set up — it appeared mid-session, suggesting parallel work outside this conversation. No commits or pushes have been made from here; confirm before assuming git history in this repo reflects only what's documented above.

# Kin

## Repo state

This repo is a working Next.js (App Router, TypeScript) prototype of Kin — a real tabbed app shell (Home / Ask AI / Knowledge / Profile), not a single linear walkthrough. The original BMAD planning docs still live under `_bmad-output/planning-artifacts/prds/prd-kin-2026-07-23/` (`prd.md`, `plan.md`, `stories.md`, `addendum.md`, `.memlog.md`) and are useful background on the product's origin and long-term vision, but **the live product direction (given directly by the stakeholder, including a set of Stitch-generated UI reference screens) has superseded parts of that PRD**. Treat this file and the actual code as the source of truth for current scope; treat `_bmad-output` as historical/strategic context, not a spec to follow literally.

The visual design was redone to match reference mockups the stakeholder supplied (made in Google's Stitch tool) — a purple/indigo-gradient-header, teal/coral-accented, card-and-pill mobile app with a persistent bottom tab bar. This replaced an earlier, more editorial "2am parenting app" visual direction (serif display font, ambient night-sky canvas, single-flow phone-frame chrome) that Claude designed independently before the reference images were provided — that direction is gone; don't resurrect it without the user asking.

## App structure

`src/components/AppShell.tsx` owns all cross-tab state and screen routing. `src/lib/kinFlow.ts` is the single source of truth for types, mock content, and timing constants.

**Routing model**: an internal `Screen` union (`onboarding | home | outbreak | ask | clinicianChat | clinicianVideo | knowledge | profile`) drives which component renders; `tabForScreen()` derives which of the 4 bottom-nav tabs (if any — `onboarding` has none) should show as active. `BottomNav` navigates by setting the screen to that tab's default screen.

**Screens**:
1. **Onboarding** (`OnboardingScreen`) — session-only, gates on adding ≥1 child (name + age band). Also captures optional parent context (age band, relationship status, ethnic background, preferred language).
2. **Home** (`HomeTab`) — "Welcome back" header, a mocked local-outbreak alert banner (chickenpox), Family Snapshot (each child + status tag), Quick Actions (Ask AI / Find Doctor / Save), Recent Activity card with "Continue Chat", horizontally-scrolling Daily Insights, a Milestone Tracker progress bar, and a floating action button to Ask AI.
3. **Outbreak detail** (`OutbreakDetailScreen`) — guidance bullets, back to Home.
4. **Ask AI** (`AskTab`) — the core mechanic, one continuous scrollable thread (not separate screens): topic chips or free text → AI response card with **Professional Source** / **Community Wisdom** tag pills, bullet guidance → community reply thread. Only the **fever** topic triggers the scripted Sentinel scenario (a risky aspirin reply gets scanned and replaced with an Intervention Card); other topics (sleep/feeding/behaviour) get a safe community quote plus a "Try This Game" / "Watch Together" card. Ends with Recommended Clinicians (Connect = chat, or a video-call icon button) and a Yes/Partially/No satisfaction check. **Thread state (question/topic/settled/satisfaction) lives in `AppShell`, not in `AskTab`** — this is deliberate, so the conversation survives navigating to a clinician screen and back or switching tabs and returning.
5. **Clinician chat** (`NurseScreen`) — scripted nurse conversation; back/done both return to the Ask thread (not Home).
6. **Clinician video** (`VideoCallScreen`) — mocked connecting → connected UI; "End call" also returns to the Ask thread it was started from.
7. **Knowledge** (`KnowledgeTab`) — search + topic filter chips over `KNOWLEDGE_CATALOG` (spans fever/sleep/feeding/behaviour across age bands), each article bookmarkable.
8. **Profile** (`ProfileTab`) — profile card, Save Changes button, Family Context stage grid (auto-derived "present" state from children's ages, not independently editable), Language + "Babel Engine Active" badge, Saved Resources (mirrors Knowledge bookmarks — `savedIds` is a single `Set<string>` owned by `AppShell`), Privacy & Data toggles, Request Data Deletion. **The dev "Restart prototype session" control lives here**, not as a floating global button — a floating restart button was tried first and collided with the real header icons/FAB, so it was moved into Profile as a normal `.btn-ghost` row.

## Where this diverges from the original PRD

- **Multi-child support**: a *list* of children, not one age band; Home/Ask ask which child a conversation is about via Family Snapshot / greeting context.
- **Expanded onboarding**: parent age, relationship status, ethnic background asked directly (still optional).
- **Tabbed IA, not a single funnel**: Home / Ask AI / Knowledge / Profile as persistent tabs, matching the supplied Stitch reference rather than the PRD's implied linear flow.
- **Clinician channel choice**: chat *and* video call, chosen directly from a clinician's row (no separate "pick a mode" interstitial screen — that was cut when matching the reference, which only shows one "Connect" affordance per clinician).
- **Local outbreak alerts** on Home — new, not in the original PRD.
- **Language switcher** lives in Profile now (not Home) — matches the reference; still a placeholder toast, Babel translation isn't actually implemented.

## Design system

Colors are **exact values from the stakeholder's design spec sheet**, not eyeballed from screenshots — `--primary: #15AFB9` (teal), `--secondary: #3C0087` (deep purple), `--tertiary: #F4A261` (orange), neutral `#EEEEEE`. Don't adjust these base hex values without a new spec; adjust only the derived `-soft`/`-ink` tint/shade tokens if a contrast issue comes up.

Tokens in `src/app/globals.css`, all **contrast-audited** (WCAG AA — ≥4.5:1 text, ≥3:1 UI boundaries) in both themes via the automated axe suite:
- `--primary` (teal — primary buttons, active nav, professional-source tag, links/icons via `--primary-ink`)
- `--secondary` (deep purple — gradient headers, parent/user chat bubbles, clinician actions; `--secondary-light` is the gradient's second stop)
- `--tertiary` (orange — community-wisdom tag, Save Changes, outbreak alert, FAB)
- `--danger` (Sentinel flag / destructive)
- neutrals `--bg` / `--surface` / `--surface-sunken` / `--ink(-soft/-faint)` / `--line`

**`--primary` and `--tertiary` are both too light to host white text or icons** (verified <3:1, in some cases as low as ~2:1) — anything filled solid with either of them (`.btn-primary`, `.btn-tertiary`, `.fab`, `.chat-bubble-user`, `.quick-action-icon.primary`, `.composer-send`, `.filter-chip.active`) uses `--on-bright` (a fixed dark color, same in both themes) for its content, never `#fff`/`white`. `--secondary` stays dark enough in both themes to always pair with `--on-deep` (fixed white). When adding a new solid-fill element in one of these three colors, use `--on-bright` (primary/tertiary) or `--on-deep` (secondary) for its text/icon — don't hardcode white or reuse `--ink`, which flips per theme and will silently break in dark mode.

Typeface: Be Vietnam Pro only (`next/font/google`, `src/app/layout.tsx`), per the spec sheet — one family for headline/body/label, no serif, no mono.

**Layout**: `.app-frame` is a fixed-height (`height: 100vh` mobile / `96vh` desktop) container — this matters: it must be a hard height, not `min-height`, or the internal `.app-view` scroll region (`flex:1; overflow-y:auto`) never actually engages and the whole page scrolls instead, which breaks the floating bottom-nav/FAB/toast (all `position: absolute` relative to `.app-frame`, deliberately *not* `position: fixed` relative to the viewport, since fixed positioning combined with a viewport-width-dependent `calc()` broke on any window size other than the one it was tuned for).

**Accessibility patterns**: focus moves to the new screen's root on every navigation (`AppShell`'s `useEffect` + `tabIndex={-1}` on each `.app-view`), `role="alert"` on the Intervention Card, `aria-live="polite"` on chat/reply containers, `role="status"` on the toast, decorative SVGs `aria-hidden`, horizontally-scrolling regions get `tabIndex={0} role="region" aria-label=...` (axe: `scrollable-region-focusable`), progressbars get an explicit `aria-label` (axe: `aria-progressbar-name`). Hover states on solid buttons **darken**, never brighten (brightening was found via axe to drop contrast below AA). **Never use `opacity` to soften text color** — axe caught `.stage-card span { opacity: 0.75 }` failing contrast even though the base color passed at full opacity; use a distinct, separately-verified color instead.

## Testing

- **Unit** (`src/lib/__tests__/kinFlow.test.ts`, Vitest): pure data/logic — `tabForScreen`, `parentTagline`, guide/topic/clinician/catalog data shape, nurse-script safety invariants.
- **Feature/component** (`src/components/__tests__/*.test.tsx`, Vitest + RTL): every screen/tab in isolation, plus `AppShell.feature.test.tsx` covering the full chat path, video path, satisfied-parent path, outbreak alert, Knowledge→Profile bookmark sync, and restart. `AskTab` is a controlled component (state owned by its parent) — its tests use a small stateful `Harness` wrapper mimicking `AppShell`, not `AskTab` in isolation.
  - Screens with internal `setTimeout` sequences use `vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] })`. **Use `fireEvent`, not `userEvent`, for clicks under fake timers** — userEvent's internal scheduling hangs indefinitely with Vitest fake timers even with `delay: null`; verified directly.
  - Resetting state when a prop changes (e.g. `AskTab` resetting its reveal animation when `question` changes) must happen **synchronously during render** (`if (question !== trackedQuestion) { setTrackedQuestion(question); setLocalStage(...); }`), not in a `useEffect` — the latter is a lint error (`react-hooks/set-state-in-effect`) and causes an extra cascading render.
- **Browser/e2e** (`e2e/*.spec.ts`, Playwright against a real production build): `kin-flow.spec.ts` drives the real flows in Chromium; `accessibility.spec.ts` runs axe-core (WCAG 2.1 A/AA) against every screen in both themes, forcing `reducedMotion: "reduce"` (without it, axe can sample colors mid-CSS-transition during the screen-enter fade and report false-positive contrast failures — confirmed by re-running with real motion and seeing the same "violations" disappear).

Run before considering any change done: `npm test`, `npm run test:e2e`, `npm run build`, `npm run lint`, `npx tsc --noEmit`.

## Known repo quirk

This directory has a git remote (`origin` → a GitHub repo under the user's account) that Claude did not set up — it appeared mid-session, suggesting parallel work outside this conversation. No commits or pushes have been made from here; confirm before assuming git history in this repo reflects only what's documented above.

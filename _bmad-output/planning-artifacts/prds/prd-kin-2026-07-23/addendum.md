# Addendum — Kin

Supplementary detail that supports the PRD but doesn't belong in its main narrative (technical-how, rejected alternatives, sizing data, in-depth notes).

## Build approach: mobile experience

- Decision leaning: responsive/mobile-first web app (Next.js) deployed on Vercel, rather than a native mobile app.
- Rationale: hackathon timeline favors a single deployable web artifact; native (React Native/Expo, app-store builds) adds build/signing overhead with no payoff for a demo.
- Optional enhancement: PWA manifest + icons so the app is "Add to Home Screen" installable, without app-store submission.
- Revisit if: a specific hackathon track/sponsor challenge requires a native or app-store artifact.

## Post-hackathon roadmap (pitch/investor Q&A material — not build scope)

Not part of the 3-hour build or the PRD's FRs. Kept here as reference for the pitch deck's roadmap slide and for answering judge Q&A about real-world clinical deployment.

**9–12 month phased rollout:**
- **Phase 1 (M1–3) — Compliance & Clinical Advisory:** Form a Clinical Advisory Board (pediatrician, pediatric NP, adolescent psychologist); legal feasibility study on virtual-triage liability, licensing, HIPAA/GDPR mapping. Milestone: approved clinical protocols + signed compliance architecture.
- **Phase 2 (M4–6) — Babel Forums & low-risk community pilot:** Launch translation/community features in one municipality with no clinical triage active. Milestone: 500 WAU, zero critical translation errors.
- **Phase 3 (M7–9) — Shadow AI Sentinel:** NLP flags posts backend-only (no user-facing freeze/cards); Clinical Advisory Board measures false positive/negative rates via manual review + nurse tabletop simulations. Milestone: >95% sensitivity, <15% false-positive rate.
- **Phase 4 (M10–12) — Controlled clinical launch:** Live AI Sentinel with contracted credentialed nurses in the pilot community; "Private Shield" teen mental-health triage soft-launched in stages (anonymous search → resource guides → limited direct booking). Milestone: first 100 documented clinical handoffs, zero liability incidents.

**Clinician buy-in strategy:**
- Frame Kin as an "in-box filter" that reduces low-priority "worried well" contacts, not a disruptive add-on.
- Clinical Advisory Board co-designs and signs off on the actual decision trees used in triage — not designed in a silo.
- Hard liability decoupling: Kin is the compliant infrastructure/pipe; a separate contracted clinical entity owns diagnosis and professional indemnity insurance.

**Key regulatory/operational risks flagged:**
- Cross-border/state clinician licensing → mitigate via geofencing; outside licensed territory, app downgrades to educational-resources-only (no live booking/chat).
- Alarm fatigue from AI Sentinel false positives overwhelming on-call nurses → mitigate via tunable NLP confidence threshold + a "snooze" parameter for repetitive non-critical terms.

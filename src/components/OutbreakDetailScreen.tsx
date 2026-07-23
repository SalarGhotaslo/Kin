"use client";

import { OUTBREAK_ALERT } from "@/lib/kinFlow";

export interface OutbreakDetailScreenProps {
  onBack: () => void;
}

export default function OutbreakDetailScreen({ onBack }: OutbreakDetailScreenProps) {
  return (
    <section className="app-view" id="screen-outbreak" data-testid="screen-outbreak" tabIndex={-1} aria-label="Local outbreak alert detail">
      <header className="top-bar">
        <div className="top-bar-row">
          <button type="button" className="top-bar-icon-btn" aria-label="Back to Home" onClick={onBack}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="top-bar-title">Local Alert</span>
          <span style={{ width: 34 }} aria-hidden="true" />
        </div>
        <div className="top-bar-heading">
          <h1>{OUTBREAK_ALERT.detailTitle}</h1>
        </div>
      </header>

      <div className="view-content">
        <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 12, fontSize: "0.9rem", lineHeight: 1.55, color: "var(--ink-soft)" }}>
          {OUTBREAK_ALERT.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
      <div className="sticky-footer">
        <button type="button" className="btn btn-primary btn-block" data-testid="outbreak-back" onClick={onBack}>
          Got it
        </button>
      </div>
    </section>
  );
}

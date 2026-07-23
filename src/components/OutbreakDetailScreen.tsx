"use client";

import { OUTBREAK_ALERT } from "@/lib/kinFlow";

export interface OutbreakDetailScreenProps {
  onBack: () => void;
}

export default function OutbreakDetailScreen({ onBack }: OutbreakDetailScreenProps) {
  return (
    <section className="phone-screen" id="screen-outbreak" data-testid="screen-outbreak" tabIndex={-1} aria-label="Local outbreak alert detail">
      <div className="screen-scroll">
        <span className="tag tag-risk" style={{ marginBottom: "10px", display: "inline-block" }}>
          Local alert
        </span>
        <h1 className="screen-title">{OUTBREAK_ALERT.detailTitle}</h1>
        <ul className="outbreak-bullets">
          {OUTBREAK_ALERT.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
      <div className="screen-footer">
        <button type="button" className="primary-btn" data-testid="outbreak-back" onClick={onBack}>
          Got it
        </button>
      </div>
    </section>
  );
}

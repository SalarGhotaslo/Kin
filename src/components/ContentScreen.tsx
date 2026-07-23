"use client";

import { useState } from "react";
import { getGuideForAge, type AgeId } from "@/lib/kinFlow";

export interface ContentScreenProps {
  age: AgeId | null;
  onShowToast: (text: string) => void;
}

export default function ContentScreen({ age, onShowToast }: ContentScreenProps) {
  const [saved, setSaved] = useState(false);
  const guide = getGuideForAge(age);

  return (
    <section className="phone-screen" id="screen-content" data-testid="screen-content">
      <div className="screen-scroll">
        <h1 className="screen-title">Reinforcing what you learned</h1>
        <p className="screen-sub">Matched to the age you set earlier — clinically reviewed, not crowd-sourced.</p>

        <div className="guide-card">
          <div className="guide-meta">
            <span className="tag tag-pro">Professional</span>
            <span className="tag tag-community" style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
              Reviewed
            </span>
          </div>
          <h3 data-testid="guide-title">{guide.title}</h3>
          <p data-testid="guide-excerpt">{guide.excerpt}</p>
          <div className="guide-byline" data-testid="guide-byline">
            {guide.byline}
          </div>
          <div className="guide-actions">
            <button
              type="button"
              className={`save-btn${saved ? " saved" : ""}`}
              data-testid="save-btn"
              onClick={() => {
                const next = !saved;
                setSaved(next);
                onShowToast(next ? "Added to My Resources" : "Removed from My Resources");
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 4h12v16l-6-4-6 4V4z" />
              </svg>
              <span data-testid="save-label">{saved ? "Saved" : "Save"}</span>
            </button>
            <button
              type="button"
              className="read-btn"
              data-testid="read-btn"
              onClick={() => onShowToast("Full guide view isn't wired up in this prototype yet")}
            >
              Read full guide
            </button>
          </div>
        </div>

        <p className="closing-note">
          That&apos;s the flagship flow: Sentinel catches risky advice in the community, hands off to real clinical
          care, and a governed guide reinforces the guidance afterwards.
        </p>
      </div>
    </section>
  );
}

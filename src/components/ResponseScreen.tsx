"use client";

import { useEffect, useState } from "react";
import {
  FLAG_REASON,
  RISKY_REPLY,
  SAFE_REPLY,
  SENTINEL_TIMING,
  WHY_FLAGGED_DETAIL,
  getGuideForAge,
  type Child,
  type Satisfaction,
} from "@/lib/kinFlow";

export interface ResponseScreenProps {
  child: Child;
  postText: string;
  onShowToast: (text: string) => void;
  onEscalate: () => void;
  onDone: () => void;
}

type Stage = "waiting" | "safeReplyShown" | "riskyReplyShown" | "scanning" | "flagged";

export default function ResponseScreen({ child, postText, onShowToast, onEscalate, onDone }: ResponseScreenProps) {
  const [stage, setStage] = useState<Stage>("waiting");
  const [showWhy, setShowWhy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [satisfaction, setSatisfaction] = useState<Satisfaction | null>(null);
  const guide = getGuideForAge(child.age);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage("safeReplyShown"), SENTINEL_TIMING.safeReplyAt),
      setTimeout(() => setStage("riskyReplyShown"), SENTINEL_TIMING.riskyReplyRevealAt),
      setTimeout(() => setStage("scanning"), SENTINEL_TIMING.scanStartAt),
      setTimeout(() => setStage("flagged"), SENTINEL_TIMING.interventionAt),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const showSafeReply = stage !== "waiting";
  const showRiskyReply = stage === "riskyReplyShown" || stage === "scanning";
  const isScanning = stage === "scanning";
  const isFlagged = stage === "flagged";

  const chooseSatisfaction = (choice: Satisfaction) => {
    setSatisfaction(choice);
    if (choice === "no") {
      onEscalate();
    }
  };

  return (
    <section className="phone-screen" id="screen-response" data-testid="screen-response" tabIndex={-1} aria-label={`Response about ${child.name}`}>
      <div className="feed-header">
        <h1>Here&apos;s what we found</h1>
        <span className="night-note">re: {postText}</span>
      </div>
      <div className="screen-scroll">
        <div className="guide-card" data-testid="suggested-article">
          <div className="guide-meta">
            <span className="tag tag-pro">Professional</span>
            <span
              className="tag tag-community"
              style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}
            >
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
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M6 4h12v16l-6-4-6 4V4z" />
              </svg>
              <span data-testid="save-label">{saved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        <h2 className="field-label" style={{ marginTop: "22px" }}>
          From the community
        </h2>
        <div className="post" data-testid="community-post" aria-live="polite">
          {!isFlagged && (
            <p className="typing-note" data-testid="typing-note">
              Community is replying…
            </p>
          )}

          {showSafeReply && (
            <div className="reply" data-testid="reply-safe" style={{ margin: 0, paddingLeft: 0, borderLeft: "none" }}>
              <div className="post-meta">
                <span className="avatar">MT</span>
                <span className="post-name">{SAFE_REPLY.author}</span>
                <span className="tag tag-community">Community</span>
              </div>
              <p className="post-body">{SAFE_REPLY.text}</p>
            </div>
          )}

          {showRiskyReply && (
            <div className={`flagged-wrap${isScanning ? " scanning" : ""}`} data-testid="reply-risky-wrap" style={{ marginLeft: 0 }}>
              <div className="scan-sweep" aria-hidden="true" />
              <div className="reply" style={{ margin: "10px 0 0", paddingLeft: 0, borderLeft: "none" }}>
                <div className="post-meta">
                  <span className="avatar">JK</span>
                  <span className="post-name">{RISKY_REPLY.author}</span>
                  <span className="tag tag-community">Community</span>
                </div>
                <p className="post-body">{RISKY_REPLY.text}</p>
              </div>
            </div>
          )}

          {isFlagged && (
            <div className="intervention-card show" data-testid="intervention-card" role="alert">
              <div className="intervention-head">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                  <path d="M12 8.2v4" strokeLinecap="round" />
                  <circle cx="12" cy="15" r="0.9" fill="currentColor" stroke="none" />
                </svg>
                This reply was flagged
              </div>
              <p>{FLAG_REASON}</p>
              <div className="intervention-actions">
                <button type="button" className="cta-primary" data-testid="talk-to-nurse" onClick={onEscalate}>
                  Talk to a clinician now
                </button>
                <button type="button" className="cta-secondary" data-testid="why-flagged" onClick={() => setShowWhy((v) => !v)}>
                  Why was this flagged?
                </button>
              </div>
              {showWhy && (
                <p className="why-detail show" data-testid="why-detail">
                  {WHY_FLAGGED_DETAIL}
                </p>
              )}
            </div>
          )}
        </div>

        {isFlagged && (
          <div className="satisfaction-block" data-testid="satisfaction-block">
            <span className="field-label">Did this help?</span>
            <div className="satisfaction-actions" role="group" aria-label="Did this help?">
              <button
                type="button"
                className={`secondary-btn${satisfaction === "yes" ? " selected" : ""}`}
                data-testid="satisfaction-yes"
                onClick={() => chooseSatisfaction("yes")}
              >
                Yes
              </button>
              <button
                type="button"
                className={`secondary-btn${satisfaction === "partially" ? " selected" : ""}`}
                data-testid="satisfaction-partially"
                onClick={() => chooseSatisfaction("partially")}
              >
                Partially
              </button>
              <button
                type="button"
                className={`secondary-btn${satisfaction === "no" ? " selected" : ""}`}
                data-testid="satisfaction-no"
                onClick={() => chooseSatisfaction("no")}
              >
                No
              </button>
            </div>

            {satisfaction && satisfaction !== "no" && (
              <div className="satisfaction-followup" data-testid="satisfaction-followup" role="status">
                <p>{satisfaction === "yes" ? "Glad that helped." : "Thanks — you can still reach a clinician if you'd like a second opinion."}</p>
                <div className="intervention-actions">
                  <button type="button" className="primary-btn" data-testid="back-to-home" onClick={onDone}>
                    Back to home
                  </button>
                  {satisfaction === "partially" && (
                    <button type="button" className="cta-secondary" data-testid="escalate-from-partial" onClick={onEscalate}>
                      Talk to a clinician
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

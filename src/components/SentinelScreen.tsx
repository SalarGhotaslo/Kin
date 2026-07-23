"use client";

import { useEffect, useState } from "react";
import { CLOCK_BY_SCREEN, FLAG_REASON, RISKY_REPLY, SAFE_REPLY, SENTINEL_TIMING, WHY_FLAGGED_DETAIL } from "@/lib/kinFlow";

export interface SentinelScreenProps {
  postText: string;
  onTalkToNurse: () => void;
}

type Stage = "waiting" | "safeReplyShown" | "riskyReplyShown" | "scanning" | "flagged";

export default function SentinelScreen({ postText, onTalkToNurse }: SentinelScreenProps) {
  const [stage, setStage] = useState<Stage>("waiting");
  const [showWhy, setShowWhy] = useState(false);

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

  return (
    <section className="phone-screen" id="screen-sentinel" data-testid="screen-sentinel">
      <div className="feed-header">
        <h1>Kin Community</h1>
        <span className="night-note">{CLOCK_BY_SCREEN.sentinel}</span>
      </div>
      <div className="screen-scroll">
        <div className="post" data-testid="own-post">
          <div className="post-meta">
            <span className="avatar">YOU</span>
            <span className="post-name">You</span>
            <span className="post-time">just now</span>
          </div>
          <p className="post-body" data-testid="own-post-text">
            {postText}
          </p>
          {!isFlagged && (
            <p className="typing-note" data-testid="typing-note">
              Community is replying…
            </p>
          )}

          {showSafeReply && (
            <div className="reply" data-testid="reply-safe">
              <div className="post-meta">
                <span className="avatar">MT</span>
                <span className="post-name">{SAFE_REPLY.author}</span>
                <span className="tag tag-community">Community</span>
              </div>
              <p className="post-body">{SAFE_REPLY.text}</p>
            </div>
          )}

          {showRiskyReply && (
            <div className={`flagged-wrap${isScanning ? " scanning" : ""}`} data-testid="reply-risky-wrap">
              <div className="scan-sweep" />
              <div className="reply">
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
            <div className="intervention-card show" data-testid="intervention-card">
              <div className="intervention-head">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                  <path d="M12 8.2v4" strokeLinecap="round" />
                  <circle cx="12" cy="15" r="0.9" fill="currentColor" stroke="none" />
                </svg>
                This reply was flagged
              </div>
              <p>{FLAG_REASON}</p>
              <div className="intervention-actions">
                <button type="button" className="cta-primary" data-testid="talk-to-nurse" onClick={onTalkToNurse}>
                  Talk to a nurse now
                </button>
                <button
                  type="button"
                  className="cta-secondary"
                  data-testid="why-flagged"
                  onClick={() => setShowWhy((v) => !v)}
                >
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
      </div>
    </section>
  );
}

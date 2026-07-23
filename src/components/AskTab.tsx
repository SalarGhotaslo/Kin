"use client";

import { useEffect, useState } from "react";
import {
  AI_RESPONSE_BY_TOPIC,
  FLAG_REASON,
  RECOMMENDED_CLINICIANS,
  RISKY_REPLY,
  SAFE_REPLY,
  SENTINEL_TIMING,
  TOPIC_SUGGESTIONS,
  WHY_FLAGGED_DETAIL,
  type ClinicianMode,
  type Satisfaction,
  type TopicId,
} from "@/lib/kinFlow";
import TopBar from "./TopBar";

export interface AskTabProps {
  question: string | null;
  topic: TopicId | null;
  settled: boolean;
  satisfaction: Satisfaction | null;
  onAsk: (text: string, topicId: TopicId) => void;
  onSettled: () => void;
  onSatisfactionChange: (choice: Satisfaction) => void;
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
  onConnectClinician: (mode: ClinicianMode) => void;
  onShowToast: (text: string) => void;
}

type LocalStage = "waiting" | "safeReplyShown" | "riskyReplyShown" | "scanning" | "done";

export default function AskTab({
  question,
  topic,
  settled,
  satisfaction,
  onAsk,
  onSettled,
  onSatisfactionChange,
  onOpenMenu,
  onOpenNotifications,
  onConnectClinician,
  onShowToast,
}: AskTabProps) {
  const [composerValue, setComposerValue] = useState("");
  const [showWhy, setShowWhy] = useState(false);
  const [localStage, setLocalStage] = useState<LocalStage>(settled ? "done" : "waiting");

  // A newly-asked question always starts unsettled; reset the reveal animation
  // synchronously during render (React's documented pattern for "reset state
  // when a prop changes") rather than in an effect, which would cascade renders.
  const [trackedQuestion, setTrackedQuestion] = useState(question);
  if (question !== trackedQuestion) {
    setTrackedQuestion(question);
    setLocalStage(settled ? "done" : "waiting");
    setShowWhy(false);
  }

  useEffect(() => {
    if (settled || !question || !topic) return;
    const response = AI_RESPONSE_BY_TOPIC[topic];
    if (!response.hasRiskyReply) {
      const t = setTimeout(() => {
        setLocalStage("done");
        onSettled();
      }, SENTINEL_TIMING.safeReplyAt);
      return () => clearTimeout(t);
    }
    const timers = [
      setTimeout(() => setLocalStage("safeReplyShown"), SENTINEL_TIMING.safeReplyAt),
      setTimeout(() => setLocalStage("riskyReplyShown"), SENTINEL_TIMING.riskyReplyRevealAt),
      setTimeout(() => setLocalStage("scanning"), SENTINEL_TIMING.scanStartAt),
      setTimeout(() => {
        setLocalStage("done");
        onSettled();
      }, SENTINEL_TIMING.interventionAt),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, topic, settled]);

  const response = topic ? AI_RESPONSE_BY_TOPIC[topic] : null;
  const isDone = localStage === "done";
  const showSafeReply = localStage !== "waiting";
  const showRiskyWrap = localStage === "riskyReplyShown" || localStage === "scanning";
  const isScanning = localStage === "scanning";
  const isFlagged = response?.hasRiskyReply && isDone;

  const chooseSatisfaction = (choice: Satisfaction) => {
    onSatisfactionChange(choice);
    if (choice === "no") onConnectClinician("chat");
  };

  return (
    <section className="app-view" id="screen-ask" data-testid="screen-ask" tabIndex={-1} aria-label="Ask Kin AI">
      <TopBar
        heading="Ask Kin AI"
        subtitle="Expert parenting advice powered by science and community wisdom."
        onOpenMenu={onOpenMenu}
        onOpenNotifications={onOpenNotifications}
      />

      <div className="view-content">
        {!question && (
          <div className="empty-ask-state" data-testid="ask-empty-state">
            <p>Pick a topic or describe what&apos;s going on.</p>
            <div className="topic-grid" role="group" aria-label="Suggested topics">
              {TOPIC_SUGGESTIONS.map((t) => (
                <button key={t.id} type="button" className="topic-chip" data-testid={`topic-${t.id}`} onClick={() => onAsk(t.question, t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {question && response && (
          <>
            <p className="chat-bubble-user" data-testid="user-question">
              {question}
            </p>

            <div className="card response-card" data-testid="ai-response-card">
              <div className="tag-row">
                <span className="pill-tag primary">Professional Source</span>
                <span className="pill-tag tertiary">Community Wisdom</span>
              </div>
              <p>{response.intro}</p>
              <ul>
                {response.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="followup-note">{response.followUpNote}</p>
            </div>

            {!showSafeReply && !isFlagged && (
              <p className="typing-note" data-testid="typing-note">
                Community is replying…
              </p>
            )}

            {showSafeReply && !response.hasRiskyReply && response.communityQuote && (
              <div className="card" data-testid="community-quote-card">
                <span className="field-label">From the Community</span>
                <p className="community-quote">&ldquo;{response.communityQuote.text}&rdquo;</p>
                <span className="community-byline">
                  — {response.communityQuote.author}
                  <button
                    type="button"
                    className="reply-link"
                    data-testid="community-reply-link"
                    onClick={() => onShowToast("Replies aren't wired up in this prototype yet")}
                  >
                    ↩ Reply
                  </button>
                </span>
              </div>
            )}

            {response.hasRiskyReply && (
              <div className="card" data-testid="community-thread-card">
                <span className="field-label">From the Community</span>
                {showSafeReply && (
                  <div className="family-row" data-testid="reply-safe" style={{ padding: "6px 0" }}>
                    <span className="avatar-circle secondary" aria-hidden="true">
                      MT
                    </span>
                    <div className="family-row-copy">
                      <div className="name-line">{SAFE_REPLY.author}</div>
                      <p style={{ margin: 0, fontSize: "0.85rem" }}>{SAFE_REPLY.text}</p>
                    </div>
                  </div>
                )}

                {showRiskyWrap && (
                  <div className={`flagged-wrap${isScanning ? " scanning" : ""}`} data-testid="reply-risky-wrap">
                    <div className="scan-sweep" aria-hidden="true" />
                    <div className="family-row" style={{ padding: "6px 0" }}>
                      <span className="avatar-circle tertiary" aria-hidden="true">
                        JK
                      </span>
                      <div className="family-row-copy">
                        <div className="name-line">{RISKY_REPLY.author}</div>
                        <p style={{ margin: 0, fontSize: "0.85rem" }}>{RISKY_REPLY.text}</p>
                      </div>
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
                      <button type="button" className="btn btn-tertiary btn-sm" data-testid="talk-to-nurse" onClick={() => onConnectClinician("chat")}>
                        Talk to a clinician now
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm" data-testid="why-flagged" onClick={() => setShowWhy((v) => !v)}>
                        Why was this flagged?
                      </button>
                    </div>
                    {showWhy && (
                      <p className="why-detail" data-testid="why-detail">
                        {WHY_FLAGGED_DETAIL}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {isDone && response.game && (
              <div className="media-card" data-testid="game-card">
                <div className="media-thumb" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="4" y="4" width="6" height="6" rx="1.5" />
                    <rect x="14" y="4" width="6" height="6" rx="1.5" />
                    <rect x="4" y="14" width="6" height="6" rx="1.5" />
                    <rect x="14" y="14" width="6" height="6" rx="1.5" />
                  </svg>
                </div>
                <div className="media-body">
                  <span className="field-label">Try This Game</span>
                  <h3>{response.game.title}</h3>
                  <p>{response.game.description}</p>
                  <button
                    type="button"
                    className="reply-link"
                    data-testid="view-game-guide"
                    onClick={() => onShowToast("Game guide isn't wired up in this prototype yet")}
                  >
                    {response.game.ctaLabel}
                  </button>
                </div>
              </div>
            )}

            {isDone && response.watch && (
              <div className="media-card" data-testid="watch-card">
                <div className="media-thumb" aria-hidden="true">
                  <span className="play-badge">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
                <div className="media-body">
                  <span className="field-label">Watch Together</span>
                  <h3>{response.watch.title}</h3>
                </div>
              </div>
            )}

            {isDone && (
              <div className="card" data-testid="recommended-clinicians">
                <span className="field-label">Recommended Clinicians</span>
                {RECOMMENDED_CLINICIANS.map((clinician) => (
                  <div className="clinician-row" key={clinician.id}>
                    <span className="avatar-circle primary" aria-hidden="true">
                      {clinician.initials}
                    </span>
                    <div className="clinician-copy">
                      <strong>{clinician.name}</strong>
                      <span>{clinician.specialty}</span>
                    </div>
                    <div className="clinician-actions">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        data-testid={`connect-chat-${clinician.id}`}
                        onClick={() => onConnectClinician("chat")}
                      >
                        Connect
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={`Start video call with ${clinician.name}`}
                        data-testid={`connect-video-${clinician.id}`}
                        onClick={() => onConnectClinician("video")}
                      >
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M3 7h11v10H3z" />
                          <path d="M14 10.5l7-3.5v10l-7-3.5" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isDone && (
              <div data-testid="satisfaction-block">
                <span className="field-label">Was this helpful?</span>
                <div className="satisfaction-actions">
                  <button
                    type="button"
                    className={`btn btn-outline btn-sm${satisfaction === "yes" ? " selected" : ""}`}
                    data-testid="satisfaction-yes"
                    onClick={() => chooseSatisfaction("yes")}
                  >
                    👍 Yes
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline btn-sm${satisfaction === "partially" ? " selected" : ""}`}
                    data-testid="satisfaction-partially"
                    onClick={() => chooseSatisfaction("partially")}
                  >
                    Partially
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline btn-sm${satisfaction === "no" ? " selected" : ""}`}
                    data-testid="satisfaction-no"
                    onClick={() => chooseSatisfaction("no")}
                  >
                    👎 No
                  </button>
                </div>

                {satisfaction && satisfaction !== "no" && (
                  <div className="satisfaction-followup" data-testid="satisfaction-followup" role="status" style={{ marginTop: 12 }}>
                    <p>{satisfaction === "yes" ? "Glad that helped!" : "Thanks — you can still reach a clinician for a second opinion."}</p>
                    {satisfaction === "partially" && (
                      <button type="button" className="btn btn-outline btn-sm" data-testid="escalate-from-partial" onClick={() => onConnectClinician("chat")}>
                        Talk to a clinician
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <form
        className="composer"
        data-testid="composer-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!composerValue.trim()) return;
          const match = TOPIC_SUGGESTIONS.find((t) => t.question === composerValue.trim());
          onAsk(composerValue, match?.id ?? "fever");
          setComposerValue("");
        }}
      >
        <label className="sr-only" htmlFor="ask-composer-input">
          Ask Kin anything about your child
        </label>
        <input
          id="ask-composer-input"
          type="text"
          data-testid="composer-input"
          placeholder="Ask Kin anything about your child…"
          value={composerValue}
          onChange={(e) => setComposerValue(e.target.value)}
        />
        <button type="submit" className="composer-send" data-testid="composer-send" aria-label="Send" disabled={!composerValue.trim()}>
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11.5l17-7.5-7.5 17-2-7.5-7.5-2z" />
          </svg>
        </button>
      </form>
    </section>
  );
}

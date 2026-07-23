"use client";

import { useEffect, useState } from "react";
import { CHAT_TIMING, NURSE_SCRIPT, type NurseMessage } from "@/lib/kinFlow";

export interface NurseScreenProps {
  onBack: () => void;
  onDone: () => void;
}

type ChatEntry = { kind: "message"; message: NurseMessage } | { kind: "typing" };

export default function NurseScreen({ onBack, onDone }: NurseScreenProps) {
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let delay = CHAT_TIMING.initialDelay;

    NURSE_SCRIPT.forEach((message) => {
      if (message.from === "nurse") {
        timers.push(
          setTimeout(() => {
            setEntries((prev) => [...prev, { kind: "typing" }]);
          }, delay)
        );
        delay += CHAT_TIMING.typingDelay;
        timers.push(
          setTimeout(() => {
            setEntries((prev) => {
              const withoutTyping = prev.filter((e) => e.kind !== "typing");
              return [...withoutTyping, { kind: "message", message }];
            });
          }, delay)
        );
        delay += CHAT_TIMING.nurseReadDelay;
      } else {
        timers.push(
          setTimeout(() => {
            setEntries((prev) => [...prev, { kind: "message", message }]);
          }, delay)
        );
        delay += CHAT_TIMING.parentReadDelay;
      }
    });

    timers.push(setTimeout(() => setFooterVisible(true), delay + CHAT_TIMING.footerDelayAfterLast));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="app-view" id="screen-nurse" data-testid="screen-clinicianChat" tabIndex={-1} aria-label="Nurse chat">
      <header className="top-bar">
        <div className="top-bar-row">
          <button type="button" className="top-bar-icon-btn" aria-label="Back to Ask Kin AI" onClick={onBack}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="top-bar-title">Nurse Chat</span>
          <span style={{ width: 34 }} aria-hidden="true" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
          <span className="avatar-circle" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }} aria-hidden="true">
            RN
          </span>
          <div>
            <h1 style={{ fontSize: "1rem", margin: 0 }}>Nurse Aanya · RN</h1>
            <div className="nurse-status-row" style={{ color: "rgba(255,255,255,0.85)" }}>
              <span className="live-dot" aria-hidden="true" style={{ background: "#fff" }} />
              Online now
            </div>
          </div>
        </div>
      </header>

      <div className="view-content" data-testid="nurse-chat" aria-live="polite">
        {entries.map((entry, i) =>
          entry.kind === "typing" ? (
            <div className="typing-indicator" key={`typing-${i}`} data-testid="typing-indicator">
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span className="sr-only">Nurse is typing…</span>
            </div>
          ) : (
            <div className={`chat-bubble ${entry.message.from}`} key={i} data-testid={`chat-bubble-${entry.message.from}`}>
              {entry.message.text}
            </div>
          )
        )}
      </div>
      {footerVisible && (
        <div className="sticky-footer" data-testid="nurse-footer">
          <button type="button" className="btn btn-primary btn-block" data-testid="nurse-done" onClick={onDone}>
            Done — back to Ask AI
          </button>
        </div>
      )}
    </section>
  );
}

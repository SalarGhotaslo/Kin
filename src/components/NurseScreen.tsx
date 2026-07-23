"use client";

import { useEffect, useState } from "react";
import { CHAT_TIMING, NURSE_SCRIPT, type NurseMessage } from "@/lib/kinFlow";

export interface NurseScreenProps {
  onSeeGuide: () => void;
}

type ChatEntry = { kind: "message"; message: NurseMessage } | { kind: "typing" };

export default function NurseScreen({ onSeeGuide }: NurseScreenProps) {
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
    <section className="phone-screen" id="screen-nurse" data-testid="screen-nurse">
      <div className="nurse-header">
        <span className="avatar pro">RN</span>
        <div>
          <div className="nurse-name">Nurse Aanya · RN</div>
          <div className="nurse-status">
            <span className="live-dot" />
            Online now
          </div>
        </div>
      </div>
      <div className="screen-scroll" data-testid="nurse-chat">
        {entries.map((entry, i) =>
          entry.kind === "typing" ? (
            <div className="typing-indicator" key={`typing-${i}`} data-testid="typing-indicator">
              <span />
              <span />
              <span />
            </div>
          ) : (
            <div className={`chat-bubble ${entry.message.from}`} key={i} data-testid={`chat-bubble-${entry.message.from}`}>
              {entry.message.text}
            </div>
          )
        )}
      </div>
      {footerVisible && (
        <div className="screen-footer" data-testid="nurse-footer">
          <button type="button" className="primary-btn" data-testid="see-guide" onClick={onSeeGuide}>
            See a guide for this age
          </button>
        </div>
      )}
    </section>
  );
}

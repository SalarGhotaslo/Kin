"use client";

import { useState } from "react";
import { DEFAULT_SUGGESTED_QUESTION, normalizePostText } from "@/lib/kinFlow";

export interface FeedScreenProps {
  onSubmitPost: (text: string) => void;
}

export default function FeedScreen({ onSubmitPost }: FeedScreenProps) {
  const [value, setValue] = useState("");

  const submit = (raw: string) => onSubmitPost(normalizePostText(raw));

  return (
    <section className="phone-screen" id="screen-feed" data-testid="screen-feed">
      <div className="feed-header">
        <h1>Kin Community</h1>
        <span className="night-note">You&apos;re not the only one up.</span>
      </div>
      <div className="screen-scroll">
        <div className="post">
          <div className="post-meta">
            <span className="avatar">AR</span>
            <span className="post-name">Anna R.</span>
            <span className="post-time">5m ago</span>
          </div>
          <p className="post-body">Anyone else&apos;s LO waking every hour this week? Teeth, growth spurt, who knows 😩</p>
          <div className="reply">
            <div className="post-meta">
              <span className="avatar">MT</span>
              <span className="post-name">Mira T.</span>
              <span className="tag tag-community">Community</span>
            </div>
            <p className="post-body">Same here — it passes. Hang in there!</p>
          </div>
        </div>
      </div>

      <div className="suggestion-row">
        <button
          type="button"
          className="suggestion-chip"
          data-testid="suggestion-chip"
          onClick={() => submit(DEFAULT_SUGGESTED_QUESTION)}
        >
          &quot;{DEFAULT_SUGGESTED_QUESTION}&quot;
        </button>
      </div>
      <form
        className="composer"
        data-testid="composer-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
          setValue("");
        }}
      >
        <input
          type="text"
          data-testid="composer-input"
          placeholder="Ask Kin or your community…"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" className="send-btn" aria-label="Send" data-testid="composer-send">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11.5l17-7.5-7.5 17-2-7.5-7.5-2z" />
          </svg>
        </button>
      </form>
    </section>
  );
}

"use client";

import { useState } from "react";
import { TOPIC_SUGGESTIONS, normalizePostText, type Child } from "@/lib/kinFlow";

export interface AskScreenProps {
  child: Child;
  onSubmit: (text: string) => void;
}

export default function AskScreen({ child, onSubmit }: AskScreenProps) {
  const [value, setValue] = useState("");

  return (
    <section className="phone-screen" id="screen-ask" data-testid="screen-ask" tabIndex={-1} aria-label={`What do you want help with, about ${child.name}`}>
      <div className="screen-scroll">
        <h1 className="screen-title">What do you want help with?</h1>
        <p className="screen-sub">
          Talking about <strong>{child.name}</strong>. Pick a topic or describe what&apos;s going on.
        </p>

        <div className="topic-grid" role="group" aria-label="Suggested topics">
          {TOPIC_SUGGESTIONS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className="topic-chip"
              data-testid={`topic-${topic.id}`}
              onClick={() => onSubmit(topic.question)}
            >
              {topic.label}
            </button>
          ))}
        </div>

        <form
          className="ask-form"
          data-testid="ask-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(normalizePostText(value));
            setValue("");
          }}
        >
          <label className="sr-only" htmlFor="ask-input">
            Describe what&apos;s going on
          </label>
          <textarea
            id="ask-input"
            data-testid="ask-input"
            placeholder={`Tell us what's going on with ${child.name}…`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
          />
          <button type="submit" className="primary-btn" data-testid="ask-submit">
            Get an answer
          </button>
        </form>
      </div>
    </section>
  );
}

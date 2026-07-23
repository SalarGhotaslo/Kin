"use client";

import type { ClinicianMode } from "@/lib/kinFlow";

export interface ClinicianChoiceScreenProps {
  onChoose: (mode: ClinicianMode) => void;
}

export default function ClinicianChoiceScreen({ onChoose }: ClinicianChoiceScreenProps) {
  return (
    <section className="phone-screen" id="screen-clinician-choice" data-testid="screen-clinicianChoice" tabIndex={-1} aria-label="Talk to a clinician">
      <div className="screen-scroll">
        <h1 className="screen-title">Talk to a real clinician</h1>
        <p className="screen-sub">A registered nurse is online now. Choose how you&apos;d like to talk.</p>

        <div className="clinician-mode-grid">
          <button type="button" className="clinician-mode-btn" data-testid="choose-chat" onClick={() => onChoose("chat")}>
            <span className="clinician-mode-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 5h16v11H8l-4 4V5z" />
              </svg>
            </span>
            <strong>Start chat</strong>
            <span>Message back and forth, at your own pace</span>
          </button>
          <button type="button" className="clinician-mode-btn" data-testid="choose-video" onClick={() => onChoose("video")}>
            <span className="clinician-mode-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 7h11v10H3z" />
                <path d="M14 10.5l7-3.5v10l-7-3.5" strokeLinejoin="round" />
              </svg>
            </span>
            <strong>Start video call</strong>
            <span>See and speak with a nurse directly</span>
          </button>
        </div>
      </div>
    </section>
  );
}

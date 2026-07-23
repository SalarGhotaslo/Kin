"use client";

import { useEffect, useRef, useState } from "react";
import { CLOCK_BY_SCREEN, DEFAULT_SUGGESTED_QUESTION, SCREENS, type AgeId, type Screen } from "@/lib/kinFlow";
import ProfileScreen from "./ProfileScreen";
import FeedScreen from "./FeedScreen";
import SentinelScreen from "./SentinelScreen";
import NurseScreen from "./NurseScreen";
import ContentScreen from "./ContentScreen";

export default function KinPrototype() {
  const [screen, setScreen] = useState<Screen>("profile");
  const [selectedAge, setSelectedAge] = useState<AgeId | null>(null);
  const [postText, setPostText] = useState(DEFAULT_SUGGESTED_QUESTION);
  const [runId, setRunId] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (text: string) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const restart = () => {
    setScreen("profile");
    setSelectedAge(null);
    setPostText(DEFAULT_SUGGESTED_QUESTION);
    setToast(null);
    setRunId((id) => id + 1);
  };

  return (
    <div className="stage">
      <div className="stage-header">
        <span className="kicker">Kin — prototype walkthrough</span>
        <button type="button" className="ghost-btn" data-testid="restart-btn" onClick={restart}>
          restart
        </button>
      </div>

      <div className="phone">
        <div className="phone-status">
          <span data-testid="clock">{CLOCK_BY_SCREEN[screen]}</span>
          <span className="dots">
            <span />
            <span />
            <span />
          </span>
        </div>

        {screen === "profile" && (
          <ProfileScreen
            key={`profile-${runId}`}
            selectedAge={selectedAge}
            onSelectAge={setSelectedAge}
            onContinue={() => setScreen("feed")}
          />
        )}
        {screen === "feed" && (
          <FeedScreen
            key={`feed-${runId}`}
            onSubmitPost={(text) => {
              setPostText(text);
              setScreen("sentinel");
            }}
          />
        )}
        {screen === "sentinel" && (
          <SentinelScreen key={`sentinel-${runId}`} postText={postText} onTalkToNurse={() => setScreen("nurse")} />
        )}
        {screen === "nurse" && (
          <NurseScreen key={`nurse-${runId}`} onSeeGuide={() => setScreen("content")} />
        )}
        {screen === "content" && (
          <ContentScreen key={`content-${runId}`} age={selectedAge} onShowToast={showToast} />
        )}
      </div>

      <div className="stage-dots" data-testid="stage-dots">
        {SCREENS.map((s) => (
          <span key={s} className={s === screen ? "active" : ""} />
        ))}
      </div>
      <p className="stage-footnote">Simulated walkthrough — no data leaves this page, no real AI or clinician is involved yet.</p>

      <div className={`toast${toast ? " show" : ""}`} data-testid="toast">
        {toast}
      </div>
    </div>
  );
}

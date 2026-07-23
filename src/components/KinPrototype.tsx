"use client";

import { useEffect, useRef, useState } from "react";
import {
  CLOCK_BY_SCREEN,
  DEFAULT_PARENT_PROFILE,
  DEFAULT_SUGGESTED_QUESTION,
  SCREENS,
  type Child,
  type ParentProfile,
  type Screen,
} from "@/lib/kinFlow";
import OnboardingScreen from "./OnboardingScreen";
import HomeScreen from "./HomeScreen";
import OutbreakDetailScreen from "./OutbreakDetailScreen";
import AskScreen from "./AskScreen";
import ResponseScreen from "./ResponseScreen";
import ClinicianChoiceScreen from "./ClinicianChoiceScreen";
import NurseScreen from "./NurseScreen";
import VideoCallScreen from "./VideoCallScreen";

const INITIAL_CHILDREN: Child[] = [];

export default function KinPrototype() {
  const [screen, setScreen] = useState<Screen>("onboarding");
  const [profile, setProfile] = useState<ParentProfile>(DEFAULT_PARENT_PROFILE);
  const [childrenList, setChildrenList] = useState<Child[]>(INITIAL_CHILDREN);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [postText, setPostText] = useState(DEFAULT_SUGGESTED_QUESTION);
  const [runId, setRunId] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    const active = phoneRef.current?.querySelector<HTMLElement>(".phone-screen");
    active?.focus();
  }, [screen]);

  const showToast = (text: string) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const restart = () => {
    setScreen("onboarding");
    setProfile(DEFAULT_PARENT_PROFILE);
    setChildrenList([]);
    setSelectedChild(null);
    setPostText(DEFAULT_SUGGESTED_QUESTION);
    setToast(null);
    setRunId((id) => id + 1);
  };

  const goHome = () => setScreen("home");

  return (
    <div className="stage">
      <div className="stage-header">
        <span className="kicker">Kin — prototype walkthrough</span>
        <button type="button" className="ghost-btn" data-testid="restart-btn" onClick={restart}>
          restart
        </button>
      </div>

      <div className="phone" ref={phoneRef}>
        <div className="phone-status">
          <span data-testid="clock">{CLOCK_BY_SCREEN[screen]}</span>
          <span className="dots">
            <span />
            <span />
            <span />
          </span>
        </div>

        {screen === "onboarding" && (
          <OnboardingScreen
            key={`onboarding-${runId}`}
            profile={profile}
            onProfileChange={setProfile}
            children_={childrenList}
            onAddChild={(child) => setChildrenList((prev) => [...prev, child])}
            onRemoveChild={(id) => setChildrenList((prev) => prev.filter((c) => c.id !== id))}
            onContinue={goHome}
          />
        )}
        {screen === "home" && (
          <HomeScreen
            key={`home-${runId}`}
            children_={childrenList}
            languageCode={profile.languageCode}
            onChangeLanguage={(code) => {
              setProfile((p) => ({ ...p, languageCode: code }));
              showToast("Kin will show translated content in this language (preview not wired up in this prototype yet)");
            }}
            onSelectChild={(child) => {
              setSelectedChild(child);
              setScreen("ask");
            }}
            onOpenOutbreakAlert={() => setScreen("outbreak")}
          />
        )}
        {screen === "outbreak" && <OutbreakDetailScreen key={`outbreak-${runId}`} onBack={goHome} />}
        {screen === "ask" && selectedChild && (
          <AskScreen
            key={`ask-${runId}`}
            child={selectedChild}
            onSubmit={(text) => {
              setPostText(text);
              setScreen("response");
            }}
          />
        )}
        {screen === "response" && selectedChild && (
          <ResponseScreen
            key={`response-${runId}`}
            child={selectedChild}
            postText={postText}
            onShowToast={showToast}
            onEscalate={() => setScreen("clinicianChoice")}
            onDone={goHome}
          />
        )}
        {screen === "clinicianChoice" && (
          <ClinicianChoiceScreen
            key={`clinicianChoice-${runId}`}
            onChoose={(mode) => setScreen(mode === "chat" ? "nurseChat" : "videoCall")}
          />
        )}
        {screen === "nurseChat" && <NurseScreen key={`nurseChat-${runId}`} onDone={goHome} />}
        {screen === "videoCall" && <VideoCallScreen key={`videoCall-${runId}`} onEndCall={goHome} />}
      </div>

      <div className="stage-dots" data-testid="stage-dots" aria-hidden="true">
        {SCREENS.map((s) => (
          <span key={s} className={s === screen ? "active" : ""} />
        ))}
      </div>
      <p className="stage-footnote">Simulated walkthrough — no data leaves this page, no real AI or clinician is involved yet.</p>

      <div className={`toast${toast ? " show" : ""}`} data-testid="toast" role="status" aria-live="polite" aria-atomic="true">
        {toast}
      </div>
    </div>
  );
}

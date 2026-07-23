"use client";

import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_PARENT_PROFILE,
  DEFAULT_PRIVACY_TOGGLES,
  RECENT_ACTIVITY,
  tabForScreen,
  type AskFlowStage,
  type AskResponseMode,
  type Child,
  type ClinicianMode,
  type ParentProfile,
  type PrivacyToggles,
  type Satisfaction,
  type Screen,
  type Tab,
  type TopicId,
} from "@/lib/kinFlow";
import OnboardingScreen from "./OnboardingScreen";
import HomeTab from "./HomeTab";
import OutbreakDetailScreen from "./OutbreakDetailScreen";
import AskTab from "./AskTab";
import NurseScreen from "./NurseScreen";
import VideoCallScreen from "./VideoCallScreen";
import KnowledgeTab from "./KnowledgeTab";
import ProfileTab from "./ProfileTab";
import BottomNav from "./BottomNav";

export default function AppShell() {
  const [screen, setScreen] = useState<Screen>("onboarding");
  const [profile, setProfile] = useState<ParentProfile>(DEFAULT_PARENT_PROFILE);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [privacy, setPrivacy] = useState<PrivacyToggles>(DEFAULT_PRIVACY_TOGGLES);

  const [askQuestion, setAskQuestion] = useState<string | null>(null);
  const [askTopic, setAskTopic] = useState<TopicId | null>(null);
  const [askSettled, setAskSettled] = useState(false);
  const [satisfaction, setSatisfaction] = useState<Satisfaction | null>(null);
  const [askResponseMode, setAskResponseMode] = useState<AskResponseMode | null>(null);
  const [askFlowStage, setAskFlowStage] = useState<AskFlowStage>("waiting");

  const [runId, setRunId] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    const active = frameRef.current?.querySelector<HTMLElement>(".app-view");
    active?.focus();
  }, [screen]);

  const showToast = (text: string) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  const askQuestionHandler = (text: string, topicId: TopicId) => {
    setAskQuestion(text);
    setAskTopic(topicId);
    setAskSettled(false);
    setSatisfaction(null);
    setAskResponseMode(null);
    setAskFlowStage("waiting");
  };

  const restart = () => {
    setScreen("onboarding");
    setProfile(DEFAULT_PARENT_PROFILE);
    setChildrenList([]);
    setSavedIds(new Set());
    setPrivacy(DEFAULT_PRIVACY_TOGGLES);
    setAskQuestion(null);
    setAskTopic(null);
    setAskSettled(false);
    setSatisfaction(null);
    setAskResponseMode(null);
    setAskFlowStage("waiting");
    setToast(null);
    setRunId((id) => id + 1);
  };

  const navigateTab = (tab: Tab) => {
    if (tab === "home") setScreen("home");
    if (tab === "ask") setScreen("ask");
    if (tab === "knowledge") setScreen("knowledge");
    if (tab === "profile") setScreen("profile");
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePrivacy = (key: keyof PrivacyToggles) => {
    setPrivacy((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      showToast(next[key] ? `${labelForPrivacyKey(key)} turned on` : `${labelForPrivacyKey(key)} turned off`);
      return next;
    });
  };

  const activeTab = tabForScreen(screen);

  return (
    <>
      <div className="app-frame" ref={frameRef}>
        {screen === "onboarding" && (
          <OnboardingScreen
            key={`onboarding-${runId}`}
            profile={profile}
            onProfileChange={setProfile}
            children_={childrenList}
            onAddChild={(child) => setChildrenList((prev) => [...prev, child])}
            onRemoveChild={(id) => setChildrenList((prev) => prev.filter((c) => c.id !== id))}
            onContinue={() => setScreen("home")}
          />
        )}

        {screen === "home" && (
          <HomeTab
            key={`home-${runId}`}
            children_={childrenList}
            onOpenMenu={() => showToast("Menu isn't wired up in this prototype yet")}
            onOpenNotifications={() => showToast(`You have 2 updates regarding ${childrenList.map((c) => c.name).join(" and ")}.`)}
            onOpenOutbreakAlert={() => setScreen("outbreak")}
            onAskAi={() => setScreen("ask")}
            onFindDoctor={() => setScreen("clinicianChat")}
            onSave={() => setScreen("knowledge")}
            onContinueChat={() => {
              askQuestionHandler(
                childrenList.length > 0 ? RECENT_ACTIVITY.summary : RECENT_ACTIVITY.summary,
                RECENT_ACTIVITY.continueTopic
              );
              setScreen("ask");
            }}
          />
        )}

        {screen === "outbreak" && <OutbreakDetailScreen key={`outbreak-${runId}`} onBack={() => setScreen("home")} />}

        {screen === "ask" && (
          <AskTab
            key={`ask-${runId}`}
            question={askQuestion}
            topic={askTopic}
            settled={askSettled}
            satisfaction={satisfaction}
            onAsk={askQuestionHandler}
            onSettled={() => setAskSettled(true)}
            onSatisfactionChange={setSatisfaction}
            onOpenMenu={() => showToast("Menu isn't wired up in this prototype yet")}
            onOpenNotifications={() => showToast("No new notifications")}
            onConnectClinician={(mode: ClinicianMode) => setScreen(mode === "chat" ? "clinicianChat" : "clinicianVideo")}
            onShowToast={showToast}
            responseMode={askResponseMode}
            flowStage={askFlowStage}
            onResponseModeChange={setAskResponseMode}
            onFlowStageChange={setAskFlowStage}
          />
        )}

        {screen === "clinicianChat" && <NurseScreen key={`clinicianChat-${runId}`} onBack={() => setScreen("ask")} onDone={() => setScreen("ask")} />}
        {screen === "clinicianVideo" && <VideoCallScreen key={`clinicianVideo-${runId}`} onEndCall={() => setScreen("ask")} />}

        {screen === "knowledge" && (
          <KnowledgeTab
            key={`knowledge-${runId}`}
            savedIds={savedIds}
            onToggleSave={toggleSave}
            onOpenMenu={() => showToast("Menu isn't wired up in this prototype yet")}
            onOpenNotifications={() => showToast("No new notifications")}
          />
        )}

        {screen === "profile" && (
          <ProfileTab
            key={`profile-${runId}`}
            profile={profile}
            onProfileChange={setProfile}
            children_={childrenList}
            savedIds={savedIds}
            onToggleSave={toggleSave}
            privacy={privacy}
            onTogglePrivacy={togglePrivacy}
            onSaveChanges={() => showToast("Profile changes saved")}
            onRequestDeletion={() => showToast("Deletion request received — a confirmation email would follow in production")}
            onOpenMenu={() => showToast("Menu isn't wired up in this prototype yet")}
            onOpenNotifications={() => showToast("No new notifications")}
            onRestart={restart}
          />
        )}

        {activeTab && <BottomNav active={activeTab} onSelect={navigateTab} />}

        <div className={`toast${toast ? " show" : ""}`} data-testid="toast" role="status" aria-live="polite" aria-atomic="true">
          {toast}
        </div>
      </div>
    </>
  );
}

function labelForPrivacyKey(key: keyof PrivacyToggles): string {
  switch (key) {
    case "anonymousTraining":
      return "Anonymous Training";
    case "cloudBackup":
      return "Cloud Backup";
    case "dataRetention":
      return "Data Retention";
  }
}

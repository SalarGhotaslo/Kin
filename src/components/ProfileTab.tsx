"use client";

import {
  KNOWLEDGE_CATALOG,
  LANGUAGE_OPTIONS,
  PARENT_USER,
  STAGE_GROUPS,
  parentTagline,
  type Child,
  type ParentProfile,
  type PrivacyToggles,
} from "@/lib/kinFlow";
import { TopBarIconRow } from "./TopBar";

export interface ProfileTabProps {
  profile: ParentProfile;
  onProfileChange: (profile: ParentProfile) => void;
  children_: Child[];
  savedIds: Set<string>;
  onToggleSave: (id: string) => void;
  privacy: PrivacyToggles;
  onTogglePrivacy: (key: keyof PrivacyToggles) => void;
  onSaveChanges: () => void;
  onRequestDeletion: () => void;
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
  onRestart: () => void;
}

export default function ProfileTab({
  profile,
  onProfileChange,
  children_,
  savedIds,
  onToggleSave,
  privacy,
  onTogglePrivacy,
  onSaveChanges,
  onRequestDeletion,
  onOpenMenu,
  onOpenNotifications,
  onRestart,
}: ProfileTabProps) {
  const savedArticles = KNOWLEDGE_CATALOG.filter((a) => savedIds.has(a.id));
  const presentStageIds = new Set(children_.map((c) => STAGE_GROUPS.find((s) => s.ages.includes(c.age))?.id).filter(Boolean));

  return (
    <section className="app-view" id="screen-profile" data-testid="screen-profile" tabIndex={-1} aria-label="Profile">
      <div className="profile-header">
        <TopBarIconRow onOpenMenu={onOpenMenu} onOpenNotifications={onOpenNotifications} />
        <div className="profile-card" style={{ marginTop: 16 }}>
          <span className="avatar-circle primary" aria-hidden="true">
            {PARENT_USER.name
              .split(" ")
              .map((p) => p[0])
              .join("")}
          </span>
          <div className="profile-card-copy">
            <strong>{PARENT_USER.name}</strong>
            <span>{parentTagline(children_, profile)}</span>
          </div>
        </div>
      </div>

      <div className="view-content">
        <button type="button" className="btn btn-tertiary btn-block" data-testid="save-changes" onClick={onSaveChanges}>
          Save Changes
        </button>

        <section>
          <div className="section-head">
            <h2>Family Context</h2>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--ink-faint)", margin: "0 0 12px" }}>
            Personalize your AI assistance by telling us your children&apos;s development stages.
          </p>
          <div className="stage-grid" data-testid="family-context-grid">
            {STAGE_GROUPS.map((stage) => (
              <div key={stage.id} className={`stage-card${presentStageIds.has(stage.id) ? " present" : ""}`} data-testid={`stage-${stage.id}`}>
                <strong>{stage.label}</strong>
                <span>{stage.sub}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2>Language</h2>
          </div>
          <label className="field-label" htmlFor="profile-language">
            Preferred Interface Language
          </label>
          <select id="profile-language" value={profile.languageCode} onChange={(e) => onProfileChange({ ...profile, languageCode: e.target.value })}>
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
          <div className="engine-badge">
            <span className="live-dot" aria-hidden="true" /> Babel Engine Active
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2>Saved Resources</h2>
          </div>
          {savedArticles.length === 0 && <p className="empty-state">Nothing saved yet — bookmark a guide from Knowledge.</p>}
          {savedArticles.length > 0 && (
            <div className="card" data-testid="saved-resources">
              {savedArticles.map((article) => (
                <div className="resource-row" key={article.id}>
                  <div className="resource-copy">
                    <strong>{article.title}</strong>
                    <span>
                      {article.topic} · {article.reviewDate}
                    </span>
                  </div>
                  <button type="button" className="icon-btn" aria-label={`Remove ${article.title} from saved resources`} onClick={() => onToggleSave(article.id)}>
                    ›
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="section-head">
            <h2>Privacy &amp; Data</h2>
          </div>
          <div className="card">
            <div className="toggle-row">
              <div className="toggle-copy">
                <strong>Anonymous Training</strong>
                <span>Help improve Kin through anonymized data.</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={privacy.anonymousTraining}
                aria-label="Anonymous Training"
                className={`switch${privacy.anonymousTraining ? " on" : ""}`}
                data-testid="toggle-anonymousTraining"
                onClick={() => onTogglePrivacy("anonymousTraining")}
              >
                <span className="switch-knob" />
              </button>
            </div>
            <div className="toggle-row">
              <div className="toggle-copy">
                <strong>Cloud Backup</strong>
                <span>Sync family content across all devices.</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={privacy.cloudBackup}
                aria-label="Cloud Backup"
                className={`switch${privacy.cloudBackup ? " on" : ""}`}
                data-testid="toggle-cloudBackup"
                onClick={() => onTogglePrivacy("cloudBackup")}
              >
                <span className="switch-knob" />
              </button>
            </div>
            <div className="toggle-row">
              <div className="toggle-copy">
                <strong>Data Retention</strong>
                <span>Auto-delete chat history after 30 days.</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={privacy.dataRetention}
                aria-label="Data Retention"
                className={`switch${privacy.dataRetention ? " on" : ""}`}
                data-testid="toggle-dataRetention"
                onClick={() => onTogglePrivacy("dataRetention")}
              >
                <span className="switch-knob" />
              </button>
            </div>
          </div>
          <button type="button" className="danger-link" data-testid="request-deletion" onClick={onRequestDeletion}>
            Request Data Deletion
          </button>
        </section>

        <section style={{ borderTop: "1px solid var(--line)", paddingTop: 16 }}>
          <button type="button" className="btn btn-ghost btn-block btn-sm" data-testid="restart-btn" onClick={onRestart}>
            Restart prototype session
          </button>
        </section>
      </div>
    </section>
  );
}

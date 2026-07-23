"use client";

import { AGE_OPTIONS, DAILY_INSIGHTS, MILESTONE, OUTBREAK_ALERT, PARENT_USER, RECENT_ACTIVITY, type Child } from "@/lib/kinFlow";
import TopBar from "./TopBar";

export interface HomeTabProps {
  children_: Child[];
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
  onOpenOutbreakAlert: () => void;
  onAskAi: () => void;
  onFindDoctor: () => void;
  onSave: () => void;
  onContinueChat: () => void;
}

export default function HomeTab({
  children_,
  onOpenMenu,
  onOpenNotifications,
  onOpenOutbreakAlert,
  onAskAi,
  onFindDoctor,
  onSave,
  onContinueChat,
}: HomeTabProps) {
  const firstName = PARENT_USER.name.split(" ")[0];
  const milestoneChild = children_[0];

  return (
    <section className="app-view" id="screen-home" data-testid="screen-home" tabIndex={-1} aria-label="Home">
      <TopBar
        heading={`Welcome back, ${firstName}!`}
        subtitle={
          children_.length > 1
            ? `You have 2 updates regarding ${children_
                .slice(0, 2)
                .map((c) => c.name)
                .join(" and ")}.`
            : undefined
        }
        onOpenMenu={onOpenMenu}
        onOpenNotifications={onOpenNotifications}
        showNotificationDot
      />

      <div className="view-content">
        <button type="button" className="outbreak-banner" data-testid="outbreak-banner" onClick={onOpenOutbreakAlert}>
          <span className="outbreak-dot" aria-hidden="true" />
          <span className="outbreak-copy">
            <strong>{OUTBREAK_ALERT.headline}</strong>
            <span>{OUTBREAK_ALERT.summary}</span>
          </span>
          <span className="outbreak-chevron" aria-hidden="true">
            ›
          </span>
        </button>

        <section>
          <div className="section-head">
            <h2>Family Snapshot</h2>
          </div>
          <div className="card" data-testid="family-snapshot">
            {children_.map((child, i) => {
              const ageOption = AGE_OPTIONS.find((a) => a.id === child.age);
              return (
                <div className="family-row" key={child.id}>
                  <span className={`avatar-circle ${i % 2 === 0 ? "secondary" : "primary"}`} aria-hidden="true">
                    {child.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="family-row-copy">
                    <div className="name-line">
                      {ageOption?.label} <span>· {child.name}, {ageOption?.sub}</span>
                    </div>
                  </div>
                  <span className="pill-tag tertiary">In focus</span>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <button type="button" className="quick-action-btn" data-testid="quick-action-ask" onClick={onAskAi}>
              <span className="quick-action-icon secondary" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a7 7 0 0 0-5.5 11.3L5 19l4.9-1.4A7 7 0 1 0 12 3z" />
                </svg>
              </span>
              Ask AI
            </button>
            <button type="button" className="quick-action-btn" data-testid="quick-action-find-doctor" onClick={onFindDoctor}>
              <span className="quick-action-icon primary" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3h6v4H9zM7 7h10v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7z" />
                  <path d="M12 11v5M9.5 13.5h5" />
                </svg>
              </span>
              Find Doctor
            </button>
            <button type="button" className="quick-action-btn" data-testid="quick-action-save" onClick={onSave}>
              <span className="quick-action-icon secondary" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 4h12v16l-6-4-6 4V4z" />
                </svg>
              </span>
              Save
            </button>
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2>Recent Activity</h2>
          </div>
          <div className="card activity-card" data-testid="recent-activity">
            <span className="pill-tag secondary">{RECENT_ACTIVITY.tagLabel}</span>
            <p>{RECENT_ACTIVITY.summary}</p>
            <button type="button" className="btn btn-primary btn-block" data-testid="continue-chat" onClick={onContinueChat}>
              Continue Chat →
            </button>
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2>Daily Insights</h2>
          </div>
          <div className="insight-scroll" data-testid="daily-insights">
            {DAILY_INSIGHTS.map((insight) => (
              <article className="insight-card" key={insight.id}>
                <div className="insight-image" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 18l5-6 4 4 3-4 4 6" />
                    <circle cx="8" cy="8" r="2" />
                  </svg>
                </div>
                <div className="insight-body">
                  <span className="pill-tag neutral">{insight.tag}</span>
                  <h3>{insight.title}</h3>
                  <p>{insight.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {milestoneChild && (
          <section>
            <div className="section-head">
              <h2>Milestone Tracker</h2>
            </div>
            <div className="card" data-testid="milestone-tracker">
              <p style={{ margin: "0 0 4px", fontSize: "0.85rem" }}>
                {milestoneChild.name} is {MILESTONE.percentage}% of the way to her {MILESTONE.goalLabel}!
              </p>
              <div className="milestone-track" role="progressbar" aria-valuenow={MILESTONE.percentage} aria-valuemin={0} aria-valuemax={100}>
                <div className="milestone-fill" style={{ width: `${MILESTONE.percentage}%` }} />
              </div>
              <button type="button" className="link-btn" style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", padding: 0 }}>
                Track progress →
              </button>
            </div>
          </section>
        )}
      </div>

      <button type="button" className="fab" aria-label="Ask Kin AI" data-testid="home-fab" onClick={onAskAi}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3a7 7 0 0 0-5.5 11.3L5 19l4.9-1.4A7 7 0 1 0 12 3z" />
        </svg>
      </button>
    </section>
  );
}

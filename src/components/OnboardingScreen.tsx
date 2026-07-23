"use client";

import { useState } from "react";
import {
  AGE_OPTIONS,
  ETHNIC_BACKGROUNDS,
  LANGUAGE_OPTIONS,
  PARENT_AGE_BANDS,
  RELATIONSHIP_STATUSES,
  createChild,
  type AgeId,
  type Child,
  type EthnicBackground,
  type ParentAgeBand,
  type ParentProfile,
  type RelationshipStatus,
} from "@/lib/kinFlow";

export interface OnboardingScreenProps {
  profile: ParentProfile;
  onProfileChange: (profile: ParentProfile) => void;
  children_: Child[];
  onAddChild: (child: Child) => void;
  onRemoveChild: (id: string) => void;
  onContinue: () => void;
}

export default function OnboardingScreen({
  profile,
  onProfileChange,
  children_,
  onAddChild,
  onRemoveChild,
  onContinue,
}: OnboardingScreenProps) {
  const [draftName, setDraftName] = useState("");
  const [draftAge, setDraftAge] = useState<AgeId | null>(null);

  const addChild = () => {
    if (!draftAge) return;
    onAddChild(createChild(draftName || `Child ${children_.length + 1}`, draftAge));
    setDraftName("");
    setDraftAge(null);
  };

  return (
    <section className="app-view" id="screen-onboarding" data-testid="screen-onboarding" tabIndex={-1} aria-label="Set up your session">
      <div className="onboarding-header">
        <div className="onboarding-hero">
          <div className="onboarding-icon" aria-hidden="true">
            ✦
          </div>
          <div className="onboarding-copy">
            <h1>Kin</h1>
            <p className="onboarding-subtitle">Because parenting takes a community</p>
          </div>
        </div>
      </div>

      <div className="view-content">
        <section>
          <span className="field-label">About you</span>
          <div className="optional-grid">
            <label>
              Your age
              <select
                value={profile.parentAgeBand}
                onChange={(e) => onProfileChange({ ...profile, parentAgeBand: e.target.value as ParentAgeBand })}
              >
                {PARENT_AGE_BANDS.map((band) => (
                  <option key={band}>{band}</option>
                ))}
              </select>
            </label>
            <label>
              Relationship status
              <select
                value={profile.relationshipStatus}
                onChange={(e) => onProfileChange({ ...profile, relationshipStatus: e.target.value as RelationshipStatus })}
              >
                {RELATIONSHIP_STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <label>
              Ethnic background
              <select
                value={profile.ethnicBackground}
                onChange={(e) => onProfileChange({ ...profile, ethnicBackground: e.target.value as EthnicBackground })}
              >
                {ETHNIC_BACKGROUNDS.map((bg) => (
                  <option key={bg}>{bg}</option>
                ))}
              </select>
            </label>
            <label>
              Preferred language
              <select value={profile.languageCode} onChange={(e) => onProfileChange({ ...profile, languageCode: e.target.value })}>
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="sr-only">All optional — you can change these any time from your Profile.</p>
        </section>

        <section>
          <span className="field-label">
            Your children <span style={{ color: "var(--danger)" }} aria-hidden="true">*</span>
          </span>
          <p className="sr-only">At least one child is required to continue.</p>

          {children_.length > 0 && (
            <ul className="child-list" data-testid="child-list" style={{ marginBottom: 12 }}>
              {children_.map((child) => {
                const ageOption = AGE_OPTIONS.find((a) => a.id === child.age);
                return (
                  <li key={child.id} className="child-chip" data-testid={`child-chip-${child.id}`}>
                    <span>
                      <strong>{child.name}</strong> · {ageOption?.label}
                    </span>
                    <button type="button" className="remove-child-btn" aria-label={`Remove ${child.name}`} onClick={() => onRemoveChild(child.id)}>
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="add-child-form" role="group" aria-label="Add a child">
            <input
              type="text"
              placeholder="Name (optional)"
              aria-label="Child's name (optional)"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
            />
            <div className="chip-grid" role="group" aria-label="Child's age (required to add)">
              {AGE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="age-chip"
                  data-testid={`draft-age-chip-${option.id}`}
                  aria-pressed={draftAge === option.id}
                  onClick={() => setDraftAge(option.id)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.sub}</span>
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-outline btn-block" data-testid="add-child-btn" disabled={!draftAge} onClick={addChild}>
              Add child
            </button>
          </div>
        </section>
      </div>

      <div className="sticky-footer">
        <button
          type="button"
          className="btn btn-primary btn-block"
          data-testid="onboarding-continue"
          disabled={children_.length === 0}
          aria-describedby="onboarding-continue-hint"
          onClick={onContinue}
        >
          Continue
        </button>
        <p id="onboarding-continue-hint" className="sr-only">
          Add at least one child above to continue.
        </p>
      </div>
    </section>
  );
}

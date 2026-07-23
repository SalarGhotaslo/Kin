"use client";

import { AGE_OPTIONS, type AgeId } from "@/lib/kinFlow";

export interface ProfileScreenProps {
  selectedAge: AgeId | null;
  onSelectAge: (age: AgeId) => void;
  onContinue: () => void;
}

export default function ProfileScreen({ selectedAge, onSelectAge, onContinue }: ProfileScreenProps) {
  return (
    <section className="phone-screen" id="screen-profile" data-testid="screen-profile">
      <div className="screen-scroll">
        <h1 className="screen-title">Before we start</h1>
        <p className="screen-sub">Just for this session — nothing here creates an account or is saved.</p>

        <span className="field-label">
          Child&apos;s age <span style={{ color: "var(--risk)" }}>*</span>
        </span>
        <div className="chip-grid" role="group" aria-label="Child's age">
          {AGE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className="age-chip"
              data-testid={`age-chip-${option.id}`}
              aria-pressed={selectedAge === option.id}
              onClick={() => onSelectAge(option.id)}
            >
              <strong>{option.label}</strong>
              <span>{option.sub}</span>
            </button>
          ))}
        </div>

        <details className="disclosure">
          <summary>Add more about you (optional)</summary>
          <div className="optional-grid">
            <label>
              Your role
              <select defaultValue="Mum">
                <option>Mum</option>
                <option>Dad</option>
                <option>Guardian</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Number of children
              <select defaultValue="1">
                <option>1</option>
                <option>2</option>
                <option>3+</option>
              </select>
            </label>
            <label>
              Pregnancy status
              <select defaultValue="N/A">
                <option>N/A</option>
                <option>Currently pregnant</option>
                <option>Trying</option>
              </select>
            </label>
            <label>
              Relationship status
              <select defaultValue="Prefer not to say">
                <option>Prefer not to say</option>
                <option>Partnered</option>
                <option>Single</option>
                <option>Co-parenting</option>
              </select>
            </label>
            <label>
              Culture / background
              <input type="text" placeholder="Optional" />
            </label>
            <label>
              Preferred language
              <select defaultValue="English">
                <option>English</option>
                <option>Español</option>
                <option>Português</option>
                <option>Polski</option>
                <option>اردو</option>
              </select>
            </label>
          </div>
          <p className="optional-note">
            These personalise Kin later — they won&apos;t block or change what you see tonight.
          </p>
        </details>
      </div>
      <div className="screen-footer">
        <button
          type="button"
          className="primary-btn"
          data-testid="profile-continue"
          disabled={!selectedAge}
          onClick={onContinue}
        >
          Continue
        </button>
      </div>
    </section>
  );
}

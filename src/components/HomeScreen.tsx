"use client";

import { AGE_OPTIONS, LANGUAGE_OPTIONS, OUTBREAK_ALERT, type Child } from "@/lib/kinFlow";

export interface HomeScreenProps {
  children_: Child[];
  languageCode: string;
  onChangeLanguage: (code: string) => void;
  onSelectChild: (child: Child) => void;
  onOpenOutbreakAlert: () => void;
}

export default function HomeScreen({ children_, languageCode, onChangeLanguage, onSelectChild, onOpenOutbreakAlert }: HomeScreenProps) {
  return (
    <section className="phone-screen" id="screen-home" data-testid="screen-home" tabIndex={-1} aria-label="Home">
      <div className="feed-header">
        <h1>Kin</h1>
        <label className="lang-switcher">
          <span className="sr-only">Preferred language</span>
          <span aria-hidden="true">🌐</span>
          <select
            data-testid="language-select"
            value={languageCode}
            onChange={(e) => onChangeLanguage(e.target.value)}
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="screen-scroll">
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

        <h2 className="screen-title" style={{ fontSize: "1.15rem", marginTop: "22px" }}>
          Which child do you want to speak about today?
        </h2>

        <ul className="child-select-list" data-testid="child-select-list">
          {children_.map((child) => {
            const ageOption = AGE_OPTIONS.find((a) => a.id === child.age);
            return (
              <li key={child.id}>
                <button
                  type="button"
                  className="child-select-btn"
                  data-testid={`select-child-${child.id}`}
                  onClick={() => onSelectChild(child)}
                >
                  <span className="avatar">{child.name.slice(0, 2).toUpperCase()}</span>
                  <span className="child-select-copy">
                    <strong>{child.name}</strong>
                    <span>{ageOption?.label}</span>
                  </span>
                  <span aria-hidden="true">›</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

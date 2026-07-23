"use client";

import { useMemo, useState } from "react";
import { KNOWLEDGE_CATALOG, TOPICS, type TopicId } from "@/lib/kinFlow";
import TopBar from "./TopBar";

export interface KnowledgeTabProps {
  savedIds: Set<string>;
  onToggleSave: (id: string) => void;
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
}

export default function KnowledgeTab({ savedIds, onToggleSave, onOpenMenu, onOpenNotifications }: KnowledgeTabProps) {
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<TopicId | "all">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return KNOWLEDGE_CATALOG.filter((article) => {
      const matchesTopic = activeTopic === "all" || article.topic === activeTopic;
      const matchesQuery = q.length === 0 || article.title.toLowerCase().includes(q) || article.excerpt.toLowerCase().includes(q);
      return matchesTopic && matchesQuery;
    });
  }, [query, activeTopic]);

  return (
    <section className="app-view" id="screen-knowledge" data-testid="screen-knowledge" tabIndex={-1} aria-label="Knowledge hub">
      <TopBar heading="Knowledge Hub" subtitle="Clinically reviewed guides, searchable by age and topic." onOpenMenu={onOpenMenu} onOpenNotifications={onOpenNotifications} />

      <div className="view-content">
        <div className="search-input-wrap">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <label className="sr-only" htmlFor="knowledge-search">
            Search guides
          </label>
          <input
            id="knowledge-search"
            type="text"
            placeholder="Search guides…"
            data-testid="knowledge-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="filter-row" role="group" aria-label="Filter by topic">
          <button type="button" className={`filter-chip${activeTopic === "all" ? " active" : ""}`} data-testid="topic-filter-all" onClick={() => setActiveTopic("all")}>
            All
          </button>
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`filter-chip${activeTopic === t.id ? " active" : ""}`}
              data-testid={`topic-filter-${t.id}`}
              onClick={() => setActiveTopic(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }} data-testid="knowledge-results">
          {results.length === 0 && <p className="empty-state">No guides match that search yet.</p>}
          {results.map((article) => {
            const saved = savedIds.has(article.id);
            return (
              <article className="card article-card" key={article.id} data-testid={`article-${article.id}`}>
                <div className="tag-row">
                  <span className="pill-tag primary">Professional</span>
                  <span className="pill-tag neutral">Reviewed</span>
                </div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <div className="article-byline">
                  Reviewed by {article.reviewer} · {article.reviewDate}
                </div>
                <button
                  type="button"
                  className={`save-toggle-btn${saved ? " saved" : ""}`}
                  data-testid={`save-${article.id}`}
                  onClick={() => onToggleSave(article.id)}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M6 4h12v16l-6-4-6 4V4z" />
                  </svg>
                  {saved ? "Saved" : "Save"}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

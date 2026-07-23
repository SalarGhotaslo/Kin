import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { KNOWLEDGE_CATALOG } from "@/lib/kinFlow";
import KnowledgeTab from "../KnowledgeTab";

function setup(savedIds = new Set<string>()) {
  const onToggleSave = vi.fn();
  render(<KnowledgeTab savedIds={savedIds} onToggleSave={onToggleSave} onOpenMenu={() => {}} onOpenNotifications={() => {}} />);
  return { onToggleSave };
}

describe("KnowledgeTab", () => {
  it("lists every article in the catalog by default", () => {
    setup();
    for (const article of KNOWLEDGE_CATALOG) {
      expect(screen.getByTestId(`article-${article.id}`)).toBeInTheDocument();
    }
  });

  it("filters by topic when a filter chip is clicked", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByTestId("topic-filter-sleep"));

    const sleepArticles = KNOWLEDGE_CATALOG.filter((a) => a.topic === "sleep");
    const otherArticles = KNOWLEDGE_CATALOG.filter((a) => a.topic !== "sleep");
    for (const a of sleepArticles) expect(screen.getByTestId(`article-${a.id}`)).toBeInTheDocument();
    for (const a of otherArticles) expect(screen.queryByTestId(`article-${a.id}`)).not.toBeInTheDocument();
  });

  it("filters by search text across title and excerpt", async () => {
    const user = userEvent.setup();
    setup();

    await user.type(screen.getByTestId("knowledge-search"), "chickenpox-does-not-match-anything");
    expect(screen.getByText(/no guides match/i)).toBeInTheDocument();
  });

  it("toggles save state and label on an article", async () => {
    const user = userEvent.setup();
    const first = KNOWLEDGE_CATALOG[0];
    const { onToggleSave } = setup();

    const saveBtn = screen.getByTestId(`save-${first.id}`);
    expect(saveBtn).toHaveTextContent("Save");
    await user.click(saveBtn);
    expect(onToggleSave).toHaveBeenCalledWith(first.id);
  });

  it("reflects already-saved articles passed in via savedIds", () => {
    const first = KNOWLEDGE_CATALOG[0];
    setup(new Set([first.id]));
    expect(screen.getByTestId(`save-${first.id}`)).toHaveTextContent("Saved");
  });
});

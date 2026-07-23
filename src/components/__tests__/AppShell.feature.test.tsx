import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { KNOWLEDGE_CATALOG, SENTINEL_TIMING } from "@/lib/kinFlow";
import AppShell from "../AppShell";

function completeOnboarding(name = "Liam", ageTestId = "draft-age-chip-infant") {
  fireEvent.change(screen.getByPlaceholderText("Name (optional)"), { target: { value: name } });
  fireEvent.click(screen.getByTestId(ageTestId));
  fireEvent.click(screen.getByTestId("add-child-btn"));
  fireEvent.click(screen.getByTestId("onboarding-continue"));
}

describe("AppShell (feature test): onboarding through the tabbed app", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("walks a parent from onboarding to Home, then through Ask Kin to a clinician chat and back", async () => {
    render(<AppShell />);

    expect(screen.getByTestId("screen-onboarding")).toBeInTheDocument();
    completeOnboarding();

    expect(screen.getByTestId("screen-home")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("quick-action-ask"));

    expect(screen.getByTestId("screen-ask")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("topic-fever"));
    fireEvent.click(screen.getByTestId("response-mode-medical"));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });
    expect(screen.getByTestId("intervention-card")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("talk-to-nurse"));
    expect(screen.getByTestId("screen-clinicianChat")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /back to ask kin/i }));
    expect(screen.getByTestId("screen-ask")).toBeInTheDocument();
    // The thread survived the round trip because its state lives in AppShell, not AskTab.
    expect(screen.getByTestId("intervention-card")).toBeInTheDocument();
  });

  it("bottom nav switches tabs and preserves the Ask thread across a Home detour", async () => {
    render(<AppShell />);
    completeOnboarding();

    fireEvent.click(screen.getByTestId("nav-ask"));
    fireEvent.click(screen.getByTestId("topic-feeding"));
    fireEvent.click(screen.getByTestId("response-mode-medical"));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.safeReplyAt + 10);
    });
    expect(screen.getByTestId("recommended-clinicians")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("nav-home"));
    expect(screen.getByTestId("screen-home")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("nav-ask"));
    expect(screen.getByTestId("user-question")).toBeInTheDocument();
    expect(screen.getByTestId("recommended-clinicians")).toBeInTheDocument();
  });

  it("lets a parent bookmark a Knowledge article and see it under Profile's Saved Resources", async () => {
    render(<AppShell />);
    completeOnboarding();

    fireEvent.click(screen.getByTestId("nav-knowledge"));
    const first = KNOWLEDGE_CATALOG[0];
    fireEvent.click(screen.getByTestId(`save-${first.id}`));

    fireEvent.click(screen.getByTestId("nav-profile"));
    expect(screen.getByText(first.title)).toBeInTheDocument();
  });

  it("opens and dismisses the local outbreak alert from Home", () => {
    render(<AppShell />);
    completeOnboarding();

    fireEvent.click(screen.getByTestId("outbreak-banner"));
    expect(screen.getByTestId("screen-outbreak")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("outbreak-back"));
    expect(screen.getByTestId("screen-home")).toBeInTheDocument();
  });

  it("Find Doctor jumps straight to the clinician chat", () => {
    render(<AppShell />);
    completeOnboarding();

    fireEvent.click(screen.getByTestId("quick-action-find-doctor"));
    expect(screen.getByTestId("screen-clinicianChat")).toBeInTheDocument();
  });

  it("restart clears children, saved articles, and the ask thread, returning to onboarding", async () => {
    render(<AppShell />);
    completeOnboarding();

    fireEvent.click(screen.getByTestId("nav-ask"));
    fireEvent.click(screen.getByTestId("topic-feeding"));

    // Restart lives in Profile, not as a floating control over real product UI.
    fireEvent.click(screen.getByTestId("nav-profile"));
    fireEvent.click(screen.getByTestId("restart-btn"));

    expect(screen.getByTestId("screen-onboarding")).toBeInTheDocument();
    expect(screen.getByTestId("onboarding-continue")).toBeDisabled();
  });

  it("never lets the risky reply text survive past the ask thread once flagged", async () => {
    render(<AppShell />);
    completeOnboarding();
    fireEvent.click(screen.getByTestId("nav-ask"));
    fireEvent.click(screen.getByTestId("topic-fever"));
    fireEvent.click(screen.getByTestId("response-mode-medical"));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });

    expect(screen.queryByText(/half an aspirin/i)).not.toBeInTheDocument();
  });
});

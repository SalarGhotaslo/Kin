import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CHAT_TIMING, GUIDE_BY_AGE, NURSE_SCRIPT, SENTINEL_TIMING } from "@/lib/kinFlow";
import KinPrototype from "../KinPrototype";

function totalNurseScriptDuration() {
  let delay = CHAT_TIMING.initialDelay;
  for (const msg of NURSE_SCRIPT) {
    delay += msg.from === "nurse" ? CHAT_TIMING.typingDelay + CHAT_TIMING.nurseReadDelay : CHAT_TIMING.parentReadDelay;
  }
  return delay + CHAT_TIMING.footerDelayAfterLast;
}

describe("Kin flagship flow (feature test): profile → feed → sentinel → nurse → content", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("walks a parent end-to-end and reinforces the nurse's guidance with an age-matched guide", async () => {
    render(<KinPrototype />);

    // 1. Session profile: required age, no account created.
    expect(screen.getByTestId("screen-profile")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("age-chip-toddler"));
    fireEvent.click(screen.getByTestId("profile-continue"));

    // 2. Community feed: ask via the suggestion chip.
    expect(screen.getByTestId("screen-feed")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("suggestion-chip"));

    // 3. Sentinel flags the risky reply and offers a clinician route.
    expect(screen.getByTestId("screen-sentinel")).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });
    expect(screen.getByTestId("intervention-card")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("talk-to-nurse"));

    // 4. Mocked nurse chat runs to completion.
    expect(screen.getByTestId("screen-nurse")).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(totalNurseScriptDuration() + 20);
    });
    expect(screen.getByTestId("nurse-footer")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("see-guide"));

    // 5. Age-adaptive content card matches the age chosen in step 1 (toddler).
    expect(screen.getByTestId("screen-content")).toBeInTheDocument();
    expect(screen.getByTestId("guide-title")).toHaveTextContent(GUIDE_BY_AGE.toddler.title);
  });

  it("restart returns to the profile screen with no age carried over, and re-runs the sentinel sequence", async () => {
    render(<KinPrototype />);

    fireEvent.click(screen.getByTestId("age-chip-newborn"));
    fireEvent.click(screen.getByTestId("profile-continue"));
    fireEvent.click(screen.getByTestId("suggestion-chip"));
    expect(screen.getByTestId("screen-sentinel")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("restart-btn"));

    expect(screen.getByTestId("screen-profile")).toBeInTheDocument();
    expect(screen.getByTestId("age-chip-newborn")).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByTestId("profile-continue")).toBeDisabled();
  });

  it("never lets an unapproved/risky reply reach the clinician hand-off screen", async () => {
    render(<KinPrototype />);

    fireEvent.click(screen.getByTestId("age-chip-infant"));
    fireEvent.click(screen.getByTestId("profile-continue"));
    fireEvent.click(screen.getByTestId("suggestion-chip"));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });
    fireEvent.click(screen.getByTestId("talk-to-nurse"));

    // The risky reply text must never appear once we've moved past the sentinel screen.
    expect(screen.queryByText(/half an aspirin/i)).not.toBeInTheDocument();
  });
});

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CHAT_TIMING, GUIDE_BY_AGE, NURSE_SCRIPT, SENTINEL_TIMING, VIDEO_CALL_TIMING } from "@/lib/kinFlow";
import KinPrototype from "../KinPrototype";

function totalNurseScriptDuration() {
  let delay = CHAT_TIMING.initialDelay;
  for (const msg of NURSE_SCRIPT) {
    delay += msg.from === "nurse" ? CHAT_TIMING.typingDelay + CHAT_TIMING.nurseReadDelay : CHAT_TIMING.parentReadDelay;
  }
  return delay + CHAT_TIMING.footerDelayAfterLast;
}

function addChild(name: string, ageTestId: string) {
  fireEvent.change(screen.getByPlaceholderText("Name (optional)"), { target: { value: name } });
  fireEvent.click(screen.getByTestId(ageTestId));
  fireEvent.click(screen.getByTestId("add-child-btn"));
}

describe("Kin flagship flow (feature test): onboarding → home → ask → response → clinician → done", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("walks a parent end-to-end via chat and back to home", async () => {
    render(<KinPrototype />);

    expect(screen.getByTestId("screen-onboarding")).toBeInTheDocument();
    addChild("Liam", "draft-age-chip-infant");
    fireEvent.click(screen.getByTestId("onboarding-continue"));

    expect(screen.getByTestId("screen-home")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId(/select-child-/));

    expect(screen.getByTestId("screen-ask")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("topic-fever"));

    expect(screen.getByTestId("screen-response")).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });
    expect(screen.getByTestId("guide-title")).toHaveTextContent(GUIDE_BY_AGE.infant.title);
    fireEvent.click(screen.getByTestId("talk-to-nurse"));

    expect(screen.getByTestId("screen-clinicianChoice")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("choose-chat"));

    expect(screen.getByTestId("screen-nurseChat")).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(totalNurseScriptDuration() + 20);
    });
    fireEvent.click(screen.getByTestId("nurse-done"));

    expect(screen.getByTestId("screen-home")).toBeInTheDocument();
  });

  it("takes the video call path through to a connected mocked call", async () => {
    render(<KinPrototype />);
    addChild("Maya", "draft-age-chip-toddler");
    fireEvent.click(screen.getByTestId("onboarding-continue"));
    fireEvent.click(screen.getByTestId(/select-child-/));
    fireEvent.click(screen.getByTestId("topic-sleep"));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });
    fireEvent.click(screen.getByTestId("satisfaction-no"));

    expect(screen.getByTestId("screen-clinicianChoice")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("choose-video"));

    expect(screen.getByTestId("screen-videoCall")).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(VIDEO_CALL_TIMING.connectingFor + 10);
    });
    expect(screen.getByText("Nurse Aanya")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("end-call"));
    expect(screen.getByTestId("screen-home")).toBeInTheDocument();
  });

  it("lets a satisfied parent return home without ever escalating", async () => {
    render(<KinPrototype />);
    addChild("Liam", "draft-age-chip-infant");
    fireEvent.click(screen.getByTestId("onboarding-continue"));
    fireEvent.click(screen.getByTestId(/select-child-/));
    fireEvent.click(screen.getByTestId("topic-fever"));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });
    fireEvent.click(screen.getByTestId("satisfaction-yes"));
    fireEvent.click(screen.getByTestId("back-to-home"));

    expect(screen.getByTestId("screen-home")).toBeInTheDocument();
  });

  it("opens and dismisses the local outbreak alert from the home screen", () => {
    render(<KinPrototype />);
    addChild("Liam", "draft-age-chip-infant");
    fireEvent.click(screen.getByTestId("onboarding-continue"));

    fireEvent.click(screen.getByTestId("outbreak-banner"));
    expect(screen.getByTestId("screen-outbreak")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("outbreak-back"));
    expect(screen.getByTestId("screen-home")).toBeInTheDocument();
  });

  it("supports multiple children and routes each to their own age-matched guide", async () => {
    render(<KinPrototype />);
    addChild("Liam", "draft-age-chip-newborn");
    addChild("Maya", "draft-age-chip-school");
    fireEvent.click(screen.getByTestId("onboarding-continue"));

    expect(screen.getByText("Liam")).toBeInTheDocument();
    expect(screen.getByText("Maya")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Maya"));
    expect(screen.getByTestId("screen-ask")).toHaveTextContent("Maya");

    fireEvent.click(screen.getByTestId("topic-fever"));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });
    expect(screen.getByTestId("guide-title")).toHaveTextContent(GUIDE_BY_AGE.school.title);
  });

  it("restart clears children and returns to onboarding", () => {
    render(<KinPrototype />);
    addChild("Liam", "draft-age-chip-infant");
    fireEvent.click(screen.getByTestId("onboarding-continue"));
    expect(screen.getByTestId("screen-home")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("restart-btn"));

    expect(screen.getByTestId("screen-onboarding")).toBeInTheDocument();
    expect(screen.getByTestId("onboarding-continue")).toBeDisabled();
  });

  it("never lets the risky reply text survive past the response screen", async () => {
    render(<KinPrototype />);
    addChild("Liam", "draft-age-chip-infant");
    fireEvent.click(screen.getByTestId("onboarding-continue"));
    fireEvent.click(screen.getByTestId(/select-child-/));
    fireEvent.click(screen.getByTestId("topic-fever"));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });
    fireEvent.click(screen.getByTestId("talk-to-nurse"));
    fireEvent.click(screen.getByTestId("choose-chat"));

    expect(screen.queryByText(/half an aspirin/i)).not.toBeInTheDocument();
  });
});

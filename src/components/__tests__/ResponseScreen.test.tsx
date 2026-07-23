import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GUIDE_BY_AGE, RISKY_REPLY, SAFE_REPLY, SENTINEL_TIMING, type Child } from "@/lib/kinFlow";
import ResponseScreen from "../ResponseScreen";

const child: Child = { id: "1", name: "Liam", age: "toddler" };

function renderScreen(overrides: Partial<React.ComponentProps<typeof ResponseScreen>> = {}) {
  const onShowToast = vi.fn();
  const onEscalate = vi.fn();
  const onDone = vi.fn();
  render(
    <ResponseScreen
      child={child}
      postText="My toddler won't stop crying"
      onShowToast={onShowToast}
      onEscalate={onEscalate}
      onDone={onDone}
      {...overrides}
    />
  );
  return { onShowToast, onEscalate, onDone };
}

describe("ResponseScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the age-matched suggested article immediately", () => {
    renderScreen();
    expect(screen.getByTestId("guide-title")).toHaveTextContent(GUIDE_BY_AGE.toddler.title);
  });

  it("reveals the safe reply, then the risky reply, then flags it with an alert", async () => {
    renderScreen();

    expect(screen.queryByTestId("reply-safe")).not.toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.safeReplyAt + 10);
    });
    expect(screen.getByTestId("reply-safe")).toHaveTextContent(SAFE_REPLY.text);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.riskyReplyRevealAt - SENTINEL_TIMING.safeReplyAt);
    });
    expect(screen.getByTestId("reply-risky-wrap")).toHaveTextContent(RISKY_REPLY.text);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt - SENTINEL_TIMING.riskyReplyRevealAt + 10);
    });
    expect(screen.queryByTestId("reply-risky-wrap")).not.toBeInTheDocument();
    const card = screen.getByTestId("intervention-card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute("role", "alert");
  });

  it("shows the satisfaction check only once the sequence has flagged the reply", async () => {
    renderScreen();
    expect(screen.queryByTestId("satisfaction-block")).not.toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });
    expect(screen.getByTestId("satisfaction-block")).toBeInTheDocument();
  });

  it("escalates immediately when the parent says the answer didn't help", async () => {
    const { onEscalate } = renderScreen();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });

    fireEvent.click(screen.getByTestId("satisfaction-no"));
    expect(onEscalate).toHaveBeenCalledTimes(1);
  });

  it("offers a clinician follow-up for 'partially' but lets the parent finish for 'yes'", async () => {
    renderScreen();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });

    fireEvent.click(screen.getByTestId("satisfaction-yes"));
    expect(screen.getByTestId("satisfaction-followup")).toHaveTextContent(/glad/i);
    expect(screen.queryByTestId("escalate-from-partial")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("satisfaction-partially"));
    expect(screen.getByTestId("escalate-from-partial")).toBeInTheDocument();
  });

  it("also escalates directly from the Intervention Card's CTA", async () => {
    const { onEscalate } = renderScreen();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });

    fireEvent.click(screen.getByTestId("talk-to-nurse"));
    expect(onEscalate).toHaveBeenCalledTimes(1);
  });

  it("toggles Save/Saved on the suggested article and reports it via onShowToast", () => {
    const { onShowToast } = renderScreen();
    expect(screen.getByTestId("save-label")).toHaveTextContent("Save");
    fireEvent.click(screen.getByTestId("save-btn"));
    expect(screen.getByTestId("save-label")).toHaveTextContent("Saved");
    expect(onShowToast).toHaveBeenCalledWith("Added to My Resources");
  });
});

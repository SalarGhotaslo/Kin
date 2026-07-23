import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CHAT_TIMING, NURSE_SCRIPT } from "@/lib/kinFlow";
import NurseScreen from "../NurseScreen";

function totalScriptDuration() {
  let delay = CHAT_TIMING.initialDelay;
  for (const msg of NURSE_SCRIPT) {
    delay += msg.from === "nurse" ? CHAT_TIMING.typingDelay + CHAT_TIMING.nurseReadDelay : CHAT_TIMING.parentReadDelay;
  }
  return delay + CHAT_TIMING.footerDelayAfterLast;
}

describe("NurseScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with an empty chat and no footer CTA", () => {
    render(<NurseScreen onSeeGuide={() => {}} />);
    expect(screen.queryByTestId(/^chat-bubble-/)).not.toBeInTheDocument();
    expect(screen.queryByTestId("nurse-footer")).not.toBeInTheDocument();
  });

  it("shows a typing indicator before the nurse's first message appears", async () => {
    render(<NurseScreen onSeeGuide={() => {}} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CHAT_TIMING.initialDelay + 10);
    });
    expect(screen.getByTestId("typing-indicator")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CHAT_TIMING.typingDelay + 10);
    });
    expect(screen.queryByTestId("typing-indicator")).not.toBeInTheDocument();
    expect(screen.getByTestId("chat-bubble-nurse")).toHaveTextContent(NURSE_SCRIPT[0].text);
  });

  it("renders the full scripted conversation in order and reveals the footer CTA once it's done", async () => {
    render(<NurseScreen onSeeGuide={() => {}} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(totalScriptDuration() + 20);
    });

    const nurseBubbles = screen.getAllByTestId("chat-bubble-nurse");
    const parentBubbles = screen.getAllByTestId("chat-bubble-parent");
    expect(nurseBubbles).toHaveLength(NURSE_SCRIPT.filter((m) => m.from === "nurse").length);
    expect(parentBubbles).toHaveLength(NURSE_SCRIPT.filter((m) => m.from === "parent").length);

    // Never recommends aspirin for infants.
    const allText = [...nurseBubbles, ...parentBubbles].map((b) => b.textContent).join(" ");
    expect(allText).toMatch(/never aspirin/i);

    expect(screen.getByTestId("nurse-footer")).toBeInTheDocument();
  });

  it("calls onSeeGuide when the footer CTA is clicked", async () => {
    const onSeeGuide = vi.fn();
    render(<NurseScreen onSeeGuide={onSeeGuide} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(totalScriptDuration() + 20);
    });

    fireEvent.click(screen.getByTestId("see-guide"));
    expect(onSeeGuide).toHaveBeenCalledTimes(1);
  });
});

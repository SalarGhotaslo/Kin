import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RISKY_REPLY, SAFE_REPLY, SENTINEL_TIMING } from "@/lib/kinFlow";
import SentinelScreen from "../SentinelScreen";

describe("SentinelScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the parent's post and a 'replying' note immediately, with no replies yet", () => {
    render(<SentinelScreen postText="My baby has a fever" onTalkToNurse={() => {}} />);
    expect(screen.getByTestId("own-post-text")).toHaveTextContent("My baby has a fever");
    expect(screen.getByTestId("typing-note")).toBeInTheDocument();
    expect(screen.queryByTestId("reply-safe")).not.toBeInTheDocument();
    expect(screen.queryByTestId("reply-risky-wrap")).not.toBeInTheDocument();
  });

  it("reveals the safe community reply first, then the risky reply", async () => {
    render(<SentinelScreen postText="q" onTalkToNurse={() => {}} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.safeReplyAt + 10);
    });
    expect(screen.getByTestId("reply-safe")).toHaveTextContent(SAFE_REPLY.text);
    expect(screen.queryByTestId("reply-risky-wrap")).not.toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.riskyReplyRevealAt - SENTINEL_TIMING.safeReplyAt);
    });
    expect(screen.getByTestId("reply-risky-wrap")).toHaveTextContent(RISKY_REPLY.text);
  });

  it("hides the risky reply and shows the Intervention Card once Sentinel finishes flagging it", async () => {
    render(<SentinelScreen postText="q" onTalkToNurse={() => {}} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });

    expect(screen.queryByTestId("reply-risky-wrap")).not.toBeInTheDocument();
    expect(screen.getByTestId("intervention-card")).toBeInTheDocument();
    expect(screen.getByTestId("intervention-card")).toHaveTextContent(/aspirin/i);
    expect(screen.queryByTestId("typing-note")).not.toBeInTheDocument();
  });

  it("applies a scanning state to the risky reply just before it's flagged", async () => {
    render(<SentinelScreen postText="q" onTalkToNurse={() => {}} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.scanStartAt + 10);
    });

    expect(screen.getByTestId("reply-risky-wrap")).toHaveClass("scanning");
  });

  it("toggles the 'why was this flagged' explanation on click", async () => {
    render(<SentinelScreen postText="q" onTalkToNurse={() => {}} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });

    expect(screen.queryByTestId("why-detail")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("why-flagged"));
    expect(screen.getByTestId("why-detail")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("why-flagged"));
    expect(screen.queryByTestId("why-detail")).not.toBeInTheDocument();
  });

  it("calls onTalkToNurse when the primary CTA is clicked", async () => {
    const onTalkToNurse = vi.fn();
    render(<SentinelScreen postText="q" onTalkToNurse={onTalkToNurse} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });

    fireEvent.click(screen.getByTestId("talk-to-nurse"));
    expect(onTalkToNurse).toHaveBeenCalledTimes(1);
  });
});

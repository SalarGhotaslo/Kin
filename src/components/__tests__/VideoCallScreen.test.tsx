import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VIDEO_CALL_TIMING } from "@/lib/kinFlow";
import VideoCallScreen from "../VideoCallScreen";

describe("VideoCallScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows a connecting status before the nurse joins", () => {
    render(<VideoCallScreen onEndCall={() => {}} />);
    expect(screen.getByText(/connecting/i)).toBeInTheDocument();
    expect(screen.queryByTestId("video-connected-note")).not.toBeInTheDocument();
  });

  it("shows the nurse as connected after the mocked connection delay", async () => {
    render(<VideoCallScreen onEndCall={() => {}} />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(VIDEO_CALL_TIMING.connectingFor + 10);
    });
    expect(screen.getByText("Nurse Aanya")).toBeInTheDocument();
    expect(screen.getByTestId("video-connected-note")).toBeInTheDocument();
  });

  it("calls onEndCall when End call is clicked", async () => {
    const onEndCall = vi.fn();
    render(<VideoCallScreen onEndCall={onEndCall} />);
    fireEvent.click(screen.getByTestId("end-call"));
    expect(onEndCall).toHaveBeenCalledTimes(1);
  });
});

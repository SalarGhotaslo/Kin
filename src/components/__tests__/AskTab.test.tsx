import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { SENTINEL_TIMING, type ClinicianMode, type Satisfaction, type TopicId } from "@/lib/kinFlow";
import AskTab from "../AskTab";

/** AskTab is a controlled component — a thin stateful harness mimics what AppShell does. */
function Harness({ onConnectClinician = vi.fn() }: { onConnectClinician?: (mode: ClinicianMode) => void }) {
  const [question, setQuestion] = useState<string | null>(null);
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [settled, setSettled] = useState(false);
  const [satisfaction, setSatisfaction] = useState<Satisfaction | null>(null);

  return (
    <AskTab
      question={question}
      topic={topic}
      settled={settled}
      satisfaction={satisfaction}
      onAsk={(text, t) => {
        setQuestion(text);
        setTopic(t);
        setSettled(false);
        setSatisfaction(null);
      }}
      onSettled={() => setSettled(true)}
      onSatisfactionChange={setSatisfaction}
      onOpenMenu={() => {}}
      onOpenNotifications={() => {}}
      onConnectClinician={onConnectClinician}
      onShowToast={() => {}}
    />
  );
}

describe("AskTab", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows topic suggestions and an empty state before any question is asked", () => {
    render(<Harness />);
    expect(screen.getByTestId("ask-empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("topic-fever")).toBeInTheDocument();
  });

  it("asking the fever topic runs the Sentinel sequence and flags the risky reply", async () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("topic-fever"));

    expect(screen.getByTestId("user-question")).toBeInTheDocument();
    expect(screen.getByTestId("ai-response-card")).toHaveTextContent("Professional Source");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.interventionAt + 10);
    });

    expect(screen.queryByTestId("reply-risky-wrap")).not.toBeInTheDocument();
    const card = screen.getByTestId("intervention-card");
    expect(card).toHaveAttribute("role", "alert");
    expect(screen.getByTestId("satisfaction-block")).toBeInTheDocument();
  });

  it("asking a non-fever topic (e.g. feeding) settles quickly with no risky reply or scan", async () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("topic-feeding"));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.safeReplyAt + 10);
    });

    expect(screen.queryByTestId("intervention-card")).not.toBeInTheDocument();
    expect(screen.getByTestId("game-card")).toBeInTheDocument();
    expect(screen.getByTestId("watch-card")).toBeInTheDocument();
    expect(screen.getByTestId("recommended-clinicians")).toBeInTheDocument();
  });

  it("escalates immediately when the parent says the answer didn't help", async () => {
    const onConnectClinician = vi.fn();
    render(<Harness onConnectClinician={onConnectClinician} />);
    fireEvent.click(screen.getByTestId("topic-feeding"));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.safeReplyAt + 10);
    });

    fireEvent.click(screen.getByTestId("satisfaction-no"));
    expect(screen.getByTestId("professional-prompt")).toBeInTheDocument();
    expect(onConnectClinician).not.toHaveBeenCalled();
  });

  it("connecting to a clinician can request chat or video", async () => {
    const onConnectClinician = vi.fn();
    render(<Harness onConnectClinician={onConnectClinician} />);
    fireEvent.click(screen.getByTestId("topic-feeding"));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SENTINEL_TIMING.safeReplyAt + 10);
    });

    const clinicianId = "sarah-mitchell";
    fireEvent.click(screen.getByTestId(`connect-chat-${clinicianId}`));
    expect(onConnectClinician).toHaveBeenCalledWith("chat");

    fireEvent.click(screen.getByTestId(`connect-video-${clinicianId}`));
    expect(onConnectClinician).toHaveBeenCalledWith("video");
  });

  it("submitting free text via the composer asks a question", async () => {
    render(<Harness />);
    const input = screen.getByTestId("composer-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "My toddler keeps waking up at night, is that normal?" } });
    fireEvent.submit(screen.getByTestId("composer-form"));

    expect(screen.getByTestId("user-question")).toHaveTextContent("waking up at night");
  });
});

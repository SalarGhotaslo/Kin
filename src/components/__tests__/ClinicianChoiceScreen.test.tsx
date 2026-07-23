import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ClinicianChoiceScreen from "../ClinicianChoiceScreen";

describe("ClinicianChoiceScreen", () => {
  it("calls onChoose('chat') when Start chat is clicked", async () => {
    const user = userEvent.setup();
    const onChoose = vi.fn();
    render(<ClinicianChoiceScreen onChoose={onChoose} />);
    await user.click(screen.getByTestId("choose-chat"));
    expect(onChoose).toHaveBeenCalledWith("chat");
  });

  it("calls onChoose('video') when Start video call is clicked", async () => {
    const user = userEvent.setup();
    const onChoose = vi.fn();
    render(<ClinicianChoiceScreen onChoose={onChoose} />);
    await user.click(screen.getByTestId("choose-video"));
    expect(onChoose).toHaveBeenCalledWith("video");
  });
});

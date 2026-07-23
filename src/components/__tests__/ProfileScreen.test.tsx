import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ProfileScreen from "../ProfileScreen";

describe("ProfileScreen", () => {
  it("disables Continue until an age is selected", () => {
    render(<ProfileScreen selectedAge={null} onSelectAge={() => {}} onContinue={() => {}} />);
    expect(screen.getByTestId("profile-continue")).toBeDisabled();
  });

  it("enables Continue once an age chip is selected, and marks it pressed", async () => {
    const user = userEvent.setup();
    const onSelectAge = vi.fn();
    const { rerender } = render(<ProfileScreen selectedAge={null} onSelectAge={onSelectAge} onContinue={() => {}} />);

    await user.click(screen.getByTestId("age-chip-infant"));
    expect(onSelectAge).toHaveBeenCalledWith("infant");

    rerender(<ProfileScreen selectedAge="infant" onSelectAge={onSelectAge} onContinue={() => {}} />);
    expect(screen.getByTestId("age-chip-infant")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("profile-continue")).toBeEnabled();
  });

  it("calls onContinue when Continue is clicked with an age selected", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(<ProfileScreen selectedAge="toddler" onSelectAge={() => {}} onContinue={onContinue} />);

    await user.click(screen.getByTestId("profile-continue"));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("does not gate Continue on any optional field", () => {
    render(<ProfileScreen selectedAge="school" onSelectAge={() => {}} onContinue={() => {}} />);
    // Optional fields live inside a closed <details> disclosure and are not required.
    expect(screen.getByText("Add more about you (optional)")).toBeInTheDocument();
    expect(screen.getByTestId("profile-continue")).toBeEnabled();
  });
});

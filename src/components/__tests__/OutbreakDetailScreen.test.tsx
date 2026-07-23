import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OUTBREAK_ALERT } from "@/lib/kinFlow";
import OutbreakDetailScreen from "../OutbreakDetailScreen";

describe("OutbreakDetailScreen", () => {
  it("shows all guidance bullets", () => {
    render(<OutbreakDetailScreen onBack={() => {}} />);
    for (const bullet of OUTBREAK_ALERT.bullets) {
      expect(screen.getByText(bullet)).toBeInTheDocument();
    }
  });

  it("calls onBack when 'Got it' is clicked", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<OutbreakDetailScreen onBack={onBack} />);
    await user.click(screen.getByTestId("outbreak-back"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

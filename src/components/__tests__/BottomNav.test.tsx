import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import BottomNav from "../BottomNav";

describe("BottomNav", () => {
  it("marks the active tab with aria-current", () => {
    render(<BottomNav active="knowledge" onSelect={() => {}} />);
    expect(screen.getByTestId("nav-knowledge")).toHaveAttribute("aria-current", "page");
    expect(screen.getByTestId("nav-home")).not.toHaveAttribute("aria-current");
  });

  it("calls onSelect with the clicked tab id", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<BottomNav active="home" onSelect={onSelect} />);
    await user.click(screen.getByTestId("nav-profile"));
    expect(onSelect).toHaveBeenCalledWith("profile");
  });

  it("renders all four tabs", () => {
    render(<BottomNav active="home" onSelect={() => {}} />);
    expect(screen.getByTestId("nav-home")).toBeInTheDocument();
    expect(screen.getByTestId("nav-ask")).toBeInTheDocument();
    expect(screen.getByTestId("nav-knowledge")).toBeInTheDocument();
    expect(screen.getByTestId("nav-profile")).toBeInTheDocument();
  });
});

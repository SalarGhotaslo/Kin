import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_SUGGESTED_QUESTION, type Child } from "@/lib/kinFlow";
import AskScreen from "../AskScreen";

const child: Child = { id: "1", name: "Liam", age: "infant" };

describe("AskScreen", () => {
  it("greets the parent by the selected child's name", () => {
    render(<AskScreen child={child} onSubmit={() => {}} />);
    expect(screen.getByText(/liam/i)).toBeInTheDocument();
  });

  it("submits the matching question when a topic chip is clicked", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AskScreen child={child} onSubmit={onSubmit} />);

    await user.click(screen.getByTestId("topic-fever"));
    expect(onSubmit).toHaveBeenCalledWith(DEFAULT_SUGGESTED_QUESTION);
  });

  it("submits free-typed text from the textarea", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AskScreen child={child} onSubmit={onSubmit} />);

    await user.type(screen.getByTestId("ask-input"), "He won't stop crying");
    await user.click(screen.getByTestId("ask-submit"));
    expect(onSubmit).toHaveBeenCalledWith("He won't stop crying");
  });

  it("falls back to the default question when submitting empty text", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AskScreen child={child} onSubmit={onSubmit} />);

    await user.click(screen.getByTestId("ask-submit"));
    expect(onSubmit).toHaveBeenCalledWith(DEFAULT_SUGGESTED_QUESTION);
  });
});

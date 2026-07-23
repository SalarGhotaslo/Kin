import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_SUGGESTED_QUESTION } from "@/lib/kinFlow";
import FeedScreen from "../FeedScreen";

describe("FeedScreen", () => {
  it("submits the suggested question when the suggestion chip is clicked", async () => {
    const user = userEvent.setup();
    const onSubmitPost = vi.fn();
    render(<FeedScreen onSubmitPost={onSubmitPost} />);

    await user.click(screen.getByTestId("suggestion-chip"));
    expect(onSubmitPost).toHaveBeenCalledWith(DEFAULT_SUGGESTED_QUESTION);
  });

  it("submits the parent's typed text when the composer form is submitted", async () => {
    const user = userEvent.setup();
    const onSubmitPost = vi.fn();
    render(<FeedScreen onSubmitPost={onSubmitPost} />);

    await user.type(screen.getByTestId("composer-input"), "Liam won't stop crying, is that normal?");
    await user.click(screen.getByTestId("composer-send"));

    expect(onSubmitPost).toHaveBeenCalledWith("Liam won't stop crying, is that normal?");
  });

  it("falls back to the default question when submitting empty/whitespace text", async () => {
    const user = userEvent.setup();
    const onSubmitPost = vi.fn();
    render(<FeedScreen onSubmitPost={onSubmitPost} />);

    await user.type(screen.getByTestId("composer-input"), "   ");
    await user.click(screen.getByTestId("composer-send"));

    expect(onSubmitPost).toHaveBeenCalledWith(DEFAULT_SUGGESTED_QUESTION);
  });

  it("clears the input after a successful submit", async () => {
    const user = userEvent.setup();
    render(<FeedScreen onSubmitPost={() => {}} />);

    const input = screen.getByTestId("composer-input") as HTMLInputElement;
    await user.type(input, "hello");
    await user.click(screen.getByTestId("composer-send"));

    expect(input.value).toBe("");
  });
});

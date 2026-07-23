import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GUIDE_BY_AGE } from "@/lib/kinFlow";
import ContentScreen from "../ContentScreen";

describe("ContentScreen", () => {
  it("shows the guide matching the selected age", () => {
    render(<ContentScreen age="toddler" onShowToast={() => {}} />);
    expect(screen.getByTestId("guide-title")).toHaveTextContent(GUIDE_BY_AGE.toddler.title);
    expect(screen.getByTestId("guide-byline")).toHaveTextContent(GUIDE_BY_AGE.toddler.byline);
  });

  it("falls back to the infant guide when no age was selected", () => {
    render(<ContentScreen age={null} onShowToast={() => {}} />);
    expect(screen.getByTestId("guide-title")).toHaveTextContent(GUIDE_BY_AGE.infant.title);
  });

  it("toggles Save/Saved and reports the change via onShowToast", async () => {
    const user = userEvent.setup();
    const onShowToast = vi.fn();
    render(<ContentScreen age="infant" onShowToast={onShowToast} />);

    expect(screen.getByTestId("save-label")).toHaveTextContent("Save");
    await user.click(screen.getByTestId("save-btn"));
    expect(screen.getByTestId("save-label")).toHaveTextContent("Saved");
    expect(onShowToast).toHaveBeenCalledWith("Added to My Resources");

    await user.click(screen.getByTestId("save-btn"));
    expect(screen.getByTestId("save-label")).toHaveTextContent("Save");
    expect(onShowToast).toHaveBeenCalledWith("Removed from My Resources");
  });

  it("reports an informational toast when Read full guide is clicked", async () => {
    const user = userEvent.setup();
    const onShowToast = vi.fn();
    render(<ContentScreen age="infant" onShowToast={onShowToast} />);

    await user.click(screen.getByTestId("read-btn"));
    expect(onShowToast).toHaveBeenCalledWith(expect.stringMatching(/prototype/i));
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OUTBREAK_ALERT, RECENT_ACTIVITY, createChild } from "@/lib/kinFlow";
import HomeTab from "../HomeTab";

const children_ = [createChild("Liam", "infant"), createChild("Maya", "toddler")];

function setup(overrides: Partial<React.ComponentProps<typeof HomeTab>> = {}) {
  const props = {
    children_,
    onOpenMenu: vi.fn(),
    onOpenNotifications: vi.fn(),
    onOpenOutbreakAlert: vi.fn(),
    onAskAi: vi.fn(),
    onFindDoctor: vi.fn(),
    onSave: vi.fn(),
    onContinueChat: vi.fn(),
    ...overrides,
  };
  render(<HomeTab {...props} />);
  return props;
}

describe("HomeTab", () => {
  it("shows the outbreak alert and each child in the family snapshot", () => {
    setup();
    expect(screen.getByTestId("outbreak-banner")).toHaveTextContent(OUTBREAK_ALERT.headline);
    expect(screen.getByTestId("family-snapshot")).toHaveTextContent("Liam");
    expect(screen.getByTestId("family-snapshot")).toHaveTextContent("Maya");
  });

  it("shows the recent activity summary and continue chat CTA", () => {
    setup();
    expect(screen.getByTestId("recent-activity")).toHaveTextContent(RECENT_ACTIVITY.summary);
  });

  it("calls onOpenOutbreakAlert when the banner is clicked", async () => {
    const user = userEvent.setup();
    const props = setup();
    await user.click(screen.getByTestId("outbreak-banner"));
    expect(props.onOpenOutbreakAlert).toHaveBeenCalledTimes(1);
  });

  it("wires each quick action to its handler", async () => {
    const user = userEvent.setup();
    const props = setup();

    await user.click(screen.getByTestId("quick-action-ask"));
    expect(props.onAskAi).toHaveBeenCalledTimes(1);

    await user.click(screen.getByTestId("quick-action-find-doctor"));
    expect(props.onFindDoctor).toHaveBeenCalledTimes(1);

    await user.click(screen.getByTestId("quick-action-save"));
    expect(props.onSave).toHaveBeenCalledTimes(1);
  });

  it("calls onContinueChat from the Recent Activity card", async () => {
    const user = userEvent.setup();
    const props = setup();
    await user.click(screen.getByTestId("continue-chat"));
    expect(props.onContinueChat).toHaveBeenCalledTimes(1);
  });

  it("calls onAskAi from the floating action button", async () => {
    const user = userEvent.setup();
    const props = setup();
    await user.click(screen.getByTestId("home-fab"));
    expect(props.onAskAi).toHaveBeenCalledTimes(1);
  });
});

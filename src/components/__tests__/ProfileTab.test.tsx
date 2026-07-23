import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_PARENT_PROFILE, DEFAULT_PRIVACY_TOGGLES, KNOWLEDGE_CATALOG, createChild } from "@/lib/kinFlow";
import ProfileTab from "../ProfileTab";

function setup(overrides: Partial<React.ComponentProps<typeof ProfileTab>> = {}) {
  const props = {
    profile: DEFAULT_PARENT_PROFILE,
    onProfileChange: vi.fn(),
    children_: [createChild("Liam", "infant")],
    savedIds: new Set<string>(),
    onToggleSave: vi.fn(),
    privacy: DEFAULT_PRIVACY_TOGGLES,
    onTogglePrivacy: vi.fn(),
    onSaveChanges: vi.fn(),
    onRequestDeletion: vi.fn(),
    onOpenMenu: vi.fn(),
    onOpenNotifications: vi.fn(),
    onRestart: vi.fn(),
    ...overrides,
  };
  render(<ProfileTab {...props} />);
  return props;
}

describe("ProfileTab", () => {
  it("shows the parent name and a tagline reflecting child count", () => {
    setup({ children_: [createChild("Liam", "infant"), createChild("Maya", "toddler")] });
    expect(screen.getByText("Priya J")).toBeInTheDocument();
    expect(screen.getByText(/parent of 2 children/i)).toBeInTheDocument();
  });

  it("marks the Infant and Toddler stage cards as present when children are in those stages", () => {
    setup({ children_: [createChild("Liam", "infant"), createChild("Maya", "toddler")] });
    expect(screen.getByTestId("stage-infant")).toHaveClass("present");
    expect(screen.getByTestId("stage-toddler")).toHaveClass("present");
    expect(screen.getByTestId("stage-school")).not.toHaveClass("present");
  });

  it("calls onSaveChanges when Save Changes is clicked", async () => {
    const user = userEvent.setup();
    const props = setup();
    await user.click(screen.getByTestId("save-changes"));
    expect(props.onSaveChanges).toHaveBeenCalledTimes(1);
  });

  it("shows an empty state when nothing is saved, and the saved list when something is", () => {
    const first = KNOWLEDGE_CATALOG[0];
    const { rerender } = render(
      <ProfileTab
        profile={DEFAULT_PARENT_PROFILE}
        onProfileChange={() => {}}
        children_={[createChild("Liam", "infant")]}
        savedIds={new Set()}
        onToggleSave={() => {}}
        privacy={DEFAULT_PRIVACY_TOGGLES}
        onTogglePrivacy={() => {}}
        onSaveChanges={() => {}}
        onRequestDeletion={() => {}}
        onOpenMenu={() => {}}
        onOpenNotifications={() => {}}
        onRestart={() => {}}
      />
    );
    expect(screen.getByText(/nothing saved yet/i)).toBeInTheDocument();

    rerender(
      <ProfileTab
        profile={DEFAULT_PARENT_PROFILE}
        onProfileChange={() => {}}
        children_={[createChild("Liam", "infant")]}
        savedIds={new Set([first.id])}
        onToggleSave={() => {}}
        privacy={DEFAULT_PRIVACY_TOGGLES}
        onTogglePrivacy={() => {}}
        onSaveChanges={() => {}}
        onRequestDeletion={() => {}}
        onOpenMenu={() => {}}
        onOpenNotifications={() => {}}
        onRestart={() => {}}
      />
    );
    expect(screen.getByText(first.title)).toBeInTheDocument();
  });

  it("toggles a privacy switch and reflects aria-checked", async () => {
    const user = userEvent.setup();
    const props = setup();
    const toggle = screen.getByTestId("toggle-dataRetention");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    await user.click(toggle);
    expect(props.onTogglePrivacy).toHaveBeenCalledWith("dataRetention");
  });

  it("calls onRequestDeletion when the danger link is clicked", async () => {
    const user = userEvent.setup();
    const props = setup();
    await user.click(screen.getByTestId("request-deletion"));
    expect(props.onRequestDeletion).toHaveBeenCalledTimes(1);
  });
});

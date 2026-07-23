import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_PARENT_PROFILE, type Child } from "@/lib/kinFlow";
import OnboardingScreen from "../OnboardingScreen";

function setup(children_: Child[] = []) {
  const onProfileChange = vi.fn();
  const onAddChild = vi.fn();
  const onRemoveChild = vi.fn();
  const onContinue = vi.fn();
  render(
    <OnboardingScreen
      profile={DEFAULT_PARENT_PROFILE}
      onProfileChange={onProfileChange}
      children_={children_}
      onAddChild={onAddChild}
      onRemoveChild={onRemoveChild}
      onContinue={onContinue}
    />
  );
  return { onProfileChange, onAddChild, onRemoveChild, onContinue };
}

describe("OnboardingScreen", () => {
  it("disables Continue until at least one child is added", () => {
    setup([]);
    expect(screen.getByTestId("onboarding-continue")).toBeDisabled();
  });

  it("enables Continue once a child exists", () => {
    setup([{ id: "1", name: "Liam", age: "infant" }]);
    expect(screen.getByTestId("onboarding-continue")).toBeEnabled();
  });

  it("disables Add child until an age is chosen for the draft child", async () => {
    const user = userEvent.setup();
    const { onAddChild } = setup([]);
    expect(screen.getByTestId("add-child-btn")).toBeDisabled();

    await user.click(screen.getByTestId("draft-age-chip-toddler"));
    expect(screen.getByTestId("add-child-btn")).toBeEnabled();

    await user.click(screen.getByTestId("add-child-btn"));
    expect(onAddChild).toHaveBeenCalledWith(expect.objectContaining({ age: "toddler" }));
  });

  it("defaults an unnamed child to 'Child N' when added", async () => {
    const user = userEvent.setup();
    const { onAddChild } = setup([{ id: "existing", name: "Liam", age: "infant" }]);

    await user.click(screen.getByTestId("draft-age-chip-newborn"));
    await user.click(screen.getByTestId("add-child-btn"));

    expect(onAddChild).toHaveBeenCalledWith(expect.objectContaining({ name: "Child 2", age: "newborn" }));
  });

  it("lists added children and allows removing one", async () => {
    const user = userEvent.setup();
    const { onRemoveChild } = setup([{ id: "abc", name: "Liam", age: "infant" }]);

    expect(screen.getByTestId("child-chip-abc")).toHaveTextContent("Liam");
    await user.click(screen.getByRole("button", { name: /remove liam/i }));
    expect(onRemoveChild).toHaveBeenCalledWith("abc");
  });

  it("updates the parent profile fields via onProfileChange", async () => {
    const user = userEvent.setup();
    const { onProfileChange } = setup([]);

    await user.selectOptions(screen.getByLabelText(/your age/i), "30–39");
    expect(onProfileChange).toHaveBeenCalledWith(expect.objectContaining({ parentAgeBand: "30–39" }));
  });

  it("calls onContinue when Continue is clicked with a child present", async () => {
    const user = userEvent.setup();
    const { onContinue } = setup([{ id: "1", name: "Liam", age: "infant" }]);
    await user.click(screen.getByTestId("onboarding-continue"));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});

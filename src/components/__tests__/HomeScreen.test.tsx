import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OUTBREAK_ALERT, type Child } from "@/lib/kinFlow";
import HomeScreen from "../HomeScreen";

const children_: Child[] = [
  { id: "1", name: "Liam", age: "infant" },
  { id: "2", name: "Maya", age: "toddler" },
];

describe("HomeScreen", () => {
  it("shows the outbreak alert headline", () => {
    render(
      <HomeScreen
        children_={children_}
        languageCode="en"
        onChangeLanguage={() => {}}
        onSelectChild={() => {}}
        onOpenOutbreakAlert={() => {}}
      />
    );
    expect(screen.getByTestId("outbreak-banner")).toHaveTextContent(OUTBREAK_ALERT.headline);
  });

  it("calls onOpenOutbreakAlert when the banner is clicked", async () => {
    const user = userEvent.setup();
    const onOpenOutbreakAlert = vi.fn();
    render(
      <HomeScreen
        children_={children_}
        languageCode="en"
        onChangeLanguage={() => {}}
        onSelectChild={() => {}}
        onOpenOutbreakAlert={onOpenOutbreakAlert}
      />
    );
    await user.click(screen.getByTestId("outbreak-banner"));
    expect(onOpenOutbreakAlert).toHaveBeenCalledTimes(1);
  });

  it("lists every child added during onboarding", () => {
    render(
      <HomeScreen
        children_={children_}
        languageCode="en"
        onChangeLanguage={() => {}}
        onSelectChild={() => {}}
        onOpenOutbreakAlert={() => {}}
      />
    );
    expect(screen.getByTestId("select-child-1")).toHaveTextContent("Liam");
    expect(screen.getByTestId("select-child-2")).toHaveTextContent("Maya");
  });

  it("calls onSelectChild with the right child when clicked", async () => {
    const user = userEvent.setup();
    const onSelectChild = vi.fn();
    render(
      <HomeScreen
        children_={children_}
        languageCode="en"
        onChangeLanguage={() => {}}
        onSelectChild={onSelectChild}
        onOpenOutbreakAlert={() => {}}
      />
    );
    await user.click(screen.getByTestId("select-child-2"));
    expect(onSelectChild).toHaveBeenCalledWith(children_[1]);
  });

  it("calls onChangeLanguage when a new language is picked", async () => {
    const user = userEvent.setup();
    const onChangeLanguage = vi.fn();
    render(
      <HomeScreen
        children_={children_}
        languageCode="en"
        onChangeLanguage={onChangeLanguage}
        onSelectChild={() => {}}
        onOpenOutbreakAlert={() => {}}
      />
    );
    await user.selectOptions(screen.getByTestId("language-select"), "es");
    expect(onChangeLanguage).toHaveBeenCalledWith("es");
  });
});

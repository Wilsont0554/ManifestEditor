import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "@/components/shared/button";

describe("Button", () => {
  it("renders children and handles clicks", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Save</Button>);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("uses type=button by default", () => {
    render(<Button>Default Type</Button>);

    expect(screen.getByRole("button", { name: "Default Type" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("accepts type=submit override", () => {
    render(<Button type="submit">Submit</Button>);

    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute("type", "submit");
  });

  it("is disabled when disabled prop is passed", () => {
    render(<Button disabled>Disabled</Button>);

    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
  });

  it("merges custom className onto the button", () => {
    render(<Button className="my-custom-class">Styled</Button>);

    expect(screen.getByRole("button", { name: "Styled" })).toHaveClass("my-custom-class");
  });

  it("does not fire click handler when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button disabled onClick={handleClick}>No Click</Button>);

    await user.click(screen.getByRole("button", { name: "No Click" }));

    expect(handleClick).not.toHaveBeenCalled();
  });
});

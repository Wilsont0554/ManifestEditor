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
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginBox from "./LoginBox";

describe("LoginBox", () => {
  it("renders email and password fields plus the two action buttons", () => {
    render(<LoginBox onForgotPasswordClick={vi.fn()} />);

    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /forgot password/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("associates the email and password labels to the inputs via htmlFor", () => {
    render(<LoginBox onForgotPasswordClick={vi.fn()} />);

    const email = screen.getByLabelText(/your email/i);
    const password = screen.getByLabelText(/your password/i);

    expect(email).toHaveAttribute("type", "email");
    expect(password).toHaveAttribute("type", "password");
  });

  it("invokes onSubmit when the Sign in button is clicked", () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    render(<LoginBox onForgotPasswordClick={vi.fn()} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("prevents default form submission so the browser does not navigate", () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <LoginBox onForgotPasswordClick={vi.fn()} onSubmit={onSubmit} />,
    );

    const form = container.querySelector("form")!;
    const submitEvent = new Event("submit", {
      cancelable: true,
      bubbles: true,
    });
    form.dispatchEvent(submitEvent);

    expect(submitEvent.defaultPrevented).toBe(true);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("invokes onForgotPasswordClick when the Forgot password button is pressed", async () => {
    const onForgotPasswordClick = vi.fn();
    const onSubmit = vi.fn();
    render(
      <LoginBox
        onForgotPasswordClick={onForgotPasswordClick}
        onSubmit={onSubmit}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /forgot password/i }),
    );
    expect(onForgotPasswordClick).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("renders Forgot password as type=button so it does not submit the form", () => {
    render(<LoginBox onForgotPasswordClick={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /forgot password/i }),
    ).toHaveAttribute("type", "button");
  });

  it("renders Sign in as type=submit so the form gestures (Enter, button click) submit", () => {
    render(<LoginBox onForgotPasswordClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: /sign in/i })).toHaveAttribute(
      "type",
      "submit",
    );
  });
});

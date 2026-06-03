/**
 * LoginBox Accessibility Tests
 *
 * Dedicated a11y test scaffold for LoginBox — the email/password form
 * panel (two labeled inputs, Forgot password, Sign in).
 *
 *   - ARIA Labels and Roles: outer element is a native <form>; each
 *     input is paired with its Label via htmlFor/id (login-email,
 *     login-password); both buttons (Forgot password, Sign in) carry
 *     their own accessible names; type="submit" + type="button"
 *     differentiate the actions
 *   - Keyboard Navigation: Tab order is email → password →
 *     Forgot password → Sign in
 *   - Focus Management: each interactive element is its own tab stop
 *   - Screen Reader Support: variant="required" on the labels marks
 *     them as required visually (asterisk via CSS pseudo-element);
 *     the input type="email" / type="password" semantics are
 *     announced by AT
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginBox from "./LoginBox";

describe("LoginBox Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders a native <form> element", () => {
      const { container } = render(
        <LoginBox onForgotPasswordClick={vi.fn()} />,
      );

      expect(container.querySelector("form")).toBeInTheDocument();
    });

    it("email input is paired with its Label via htmlFor/id", () => {
      render(<LoginBox onForgotPasswordClick={vi.fn()} />);

      // getByLabelText computes the accessible name through the
      // label-input pairing.
      const emailInput = screen.getByLabelText(/Your email/);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("password input is paired with its Label via htmlFor/id", () => {
      render(<LoginBox onForgotPasswordClick={vi.fn()} />);

      const passwordInput = screen.getByLabelText(/Your password/);
      expect(passwordInput).toBeInTheDocument();
      // type="password" is the semantic surface that AT users hear as
      // "password field" — not just a styled text input.
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("Forgot password and Sign in buttons expose their own accessible names", () => {
      render(<LoginBox onForgotPasswordClick={vi.fn()} />);

      expect(
        screen.getByRole("button", { name: /Forgot password/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Sign in/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("Tab order: email → password → Show password → Forgot password → Sign in", async () => {
      const user = userEvent.setup();
      render(<LoginBox onForgotPasswordClick={vi.fn()} />);

      await user.tab();
      expect(screen.getByLabelText(/Your email/)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/Your password/)).toHaveFocus();

      // The Input primitive renders a built-in "Show password" toggle
      // button for type="password" — that surface sits between the
      // password field and the form-level controls in the tab order.
      await user.tab();
      expect(
        screen.getByRole("button", { name: /Show password/i }),
      ).toHaveFocus();

      await user.tab();
      expect(
        screen.getByRole("button", { name: /Forgot password/i }),
      ).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("button", { name: /Sign in/i })).toHaveFocus();
    });

    it("onForgotPasswordClick fires from keyboard activation", async () => {
      const user = userEvent.setup();
      const onForgotPasswordClick = vi.fn();
      render(<LoginBox onForgotPasswordClick={onForgotPasswordClick} />);

      screen.getByRole("button", { name: /Forgot password/i }).focus();
      await user.keyboard("{Enter}");

      expect(onForgotPasswordClick).toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("Forgot password is type='button' (won't submit the form)", () => {
      render(<LoginBox onForgotPasswordClick={vi.fn()} />);

      const forgotBtn = screen.getByRole("button", {
        name: /Forgot password/i,
      });
      // type="button" prevents the default form-submit on click — AT
      // users get the explicit action without an unexpected form
      // submission side-effect.
      expect(forgotBtn).toHaveAttribute("type", "button");
    });

    it("Sign in is type='submit' (triggers form submission)", () => {
      render(<LoginBox onForgotPasswordClick={vi.fn()} />);

      const signInBtn = screen.getByRole("button", { name: /Sign in/i });
      expect(signInBtn).toHaveAttribute("type", "submit");
    });
  });

  describe("Screen Reader Support", () => {
    it("onSubmit fires when Sign in is clicked", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn((e) => e.preventDefault());
      render(<LoginBox onForgotPasswordClick={vi.fn()} onSubmit={onSubmit} />);

      await user.click(screen.getByRole("button", { name: /Sign in/i }));

      expect(onSubmit).toHaveBeenCalled();
    });
  });
});

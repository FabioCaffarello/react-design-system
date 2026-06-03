/**
 * Form Accessibility Tests
 *
 * Dedicated a11y test scaffold for Form — the form-element wrapper
 * with optional error/success banners and react-hook-form integration.
 *
 *   - ARIA Labels and Roles: outer element is a native <form>; error
 *     and success banners render with role=alert so AT users hear them
 *     when they appear; `noValidate` is set so browser-native bubble
 *     errors don't compete with the inline error pattern
 *   - Keyboard Navigation: Enter inside a single-input form submits
 *     (standard HTML form behavior, preserved by the wrapper)
 *   - Focus Management: Form itself is not focusable; children own
 *     their own tab order
 *   - Screen Reader Support: error banner appears between children
 *     and is announced via role=alert
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "./Form";

describe("Form Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders as a native <form> element", () => {
      const { container } = render(
        <Form onSubmit={vi.fn()}>
          <input name="email" />
          <button type="submit">Submit</button>
        </Form>,
      );

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
    });

    it("sets noValidate to defer to inline error handling", () => {
      const { container } = render(
        <Form onSubmit={vi.fn()}>
          <input name="email" required />
        </Form>,
      );

      const form = container.querySelector("form");
      // noValidate prevents the browser-native bubble error from
      // competing with the inline ErrorMessage pattern.
      expect(form).toHaveAttribute("novalidate");
    });

    it("error prop renders a role=alert banner", () => {
      render(
        <Form onSubmit={vi.fn()} error="Submission failed">
          <input name="email" />
        </Form>,
      );

      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Submission failed");
    });

    it("success prop renders a role=alert banner", () => {
      render(
        <Form onSubmit={vi.fn()} success="Saved!">
          <input name="email" />
        </Form>,
      );

      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Saved!");
    });
  });

  describe("Keyboard Navigation", () => {
    it("Enter inside a single-input form submits", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <Form onSubmit={onSubmit}>
          <input name="email" aria-label="Email" />
        </Form>,
      );

      const input = screen.getByLabelText("Email");
      input.focus();
      await user.keyboard("{Enter}");
      expect(onSubmit).toHaveBeenCalled();
    });

    it("loading=true suppresses submission (handler not called)", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <Form onSubmit={onSubmit} loading>
          <button type="submit">Submit</button>
        </Form>,
      );

      await user.click(screen.getByRole("button", { name: "Submit" }));
      // While loading, the wrapper's handler short-circuits so we don't
      // fire a second submit on top of one already in flight.
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("form element itself has no tabindex", () => {
      const { container } = render(
        <Form onSubmit={vi.fn()}>
          <input name="email" />
        </Form>,
      );

      expect(container.querySelector("form")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("without error/success props, no alert region is in the AT tree", () => {
      render(
        <Form onSubmit={vi.fn()}>
          <input name="email" />
        </Form>,
      );

      // No phantom alert region — only fires when error/success props
      // are provided.
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});

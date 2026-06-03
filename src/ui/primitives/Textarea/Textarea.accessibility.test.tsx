/**
 * Textarea Accessibility Tests
 *
 * Dedicated a11y test scaffold for Textarea — the multi-line text
 * input. Same general shape as Input but with the canonical
 * "missing accessible name" warning paths: label / aria-label /
 * aria-labelledby / external <Label htmlFor>.
 *
 *   - ARIA Labels and Roles: label paired via htmlFor + id (when
 *     `label` prop is set); aria-invalid surfaces error;
 *     aria-describedby points at helper text region (or error id);
 *     dev-only console.warn fires when no accessible name source is
 *     present (axe `aria-input-field-name` guard)
 *   - Keyboard Navigation: native textarea behavior (Tab in/out;
 *     Enter inserts newline — does NOT submit forms by default)
 *   - Focus Management: enabled textarea is in the tab order;
 *     disabled is not
 *   - Screen Reader Support: helperText announced as description;
 *     external Label htmlFor pairing recognized by the dev warning
 *     (so consumers who use the separate Label primitive don't get
 *     a false positive)
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Textarea from "./Textarea";

describe("Textarea Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("label paired via htmlFor + id gives an accessible name", () => {
      render(<Textarea id="msg" label="Message" />);

      const ta = screen.getByRole("textbox", { name: "Message" });
      expect(ta.id).toBe("msg");
    });

    it("aria-invalid surfaces the error state", () => {
      render(
        <Textarea id="msg" label="Message" error helperText="Too short" />,
      );

      expect(screen.getByRole("textbox", { name: "Message" })).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("aria-describedby points at the helperText region (when provided)", () => {
      render(
        <Textarea id="msg" label="Message" helperText="Max 500 characters" />,
      );

      const ta = screen.getByRole("textbox", { name: "Message" });
      const describedById = ta.getAttribute("aria-describedby");
      expect(describedById).toBeTruthy();

      const helper = document.getElementById(describedById as string);
      expect(helper).toHaveTextContent("Max 500 characters");
    });

    it("aria-label is accepted as an accessible-name source (no console.warn)", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(<Textarea id="msg" aria-label="Message body" />);

      // No "Missing accessible name" warning when aria-label is set.
      expect(warn).not.toHaveBeenCalledWith(
        expect.stringContaining("Missing accessible name"),
      );
      warn.mockRestore();
    });

    it("dev console.warn fires when NO accessible name source is provided", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(<Textarea id="msg" />);

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("Missing accessible name"),
      );
      warn.mockRestore();
    });

    it("external <label htmlFor> pairing suppresses the missing-name warning", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(
        <>
          <label htmlFor="msg">Message</label>
          <Textarea id="msg" />
        </>,
      );

      // The dev warning checks for an external <label[for=id]> before
      // firing — preserving the canonical "consumer-managed label"
      // path without false positives.
      expect(warn).not.toHaveBeenCalledWith(
        expect.stringContaining("Missing accessible name"),
      );
      warn.mockRestore();
    });
  });

  describe("Keyboard Navigation", () => {
    it("Enter inserts a newline (does NOT submit a wrapping form)", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
      render(
        <form onSubmit={onSubmit}>
          <Textarea id="msg" label="Message" />
        </form>,
      );

      const ta = screen.getByRole("textbox", {
        name: "Message",
      }) as HTMLTextAreaElement;
      await user.type(ta, "line1{Enter}line2");

      // Textarea's Enter is newline insertion, not form submission —
      // contrast with Input where Enter triggers form submit. Asserting
      // this anchors the contract.
      expect(ta.value).toBe("line1\nline2");
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Focus Management", () => {
    it("disabled textarea is not in the tab order", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Textarea id="msg" label="Message" disabled />
          <button>After</button>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("helperText alone is announced as description (NO role=alert)", () => {
      render(<Textarea id="msg" label="Message" helperText="Max 500 chars" />);

      // Same contract as Input/Select: only error escalates to
      // role=alert; pure helper text stays a quiet description.
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});

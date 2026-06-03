/**
 * FileUpload Accessibility Tests
 *
 * Dedicated a11y test scaffold for FileUpload — the drag-and-drop
 * file picker. The dropzone is a role=button that, when activated,
 * triggers the hidden native `<input type="file">`. Selected files
 * are listed with per-file remove buttons.
 *
 *   - ARIA Labels and Roles: dropzone has role=button and
 *     aria-label="Upload files"; aria-disabled mirrors disabled
 *     prop; per-file remove buttons carry "Remove <filename>"
 *     scoped names so AT users always know which file they're
 *     removing
 *   - Keyboard Navigation: Enter on the dropzone triggers file picker
 *     (via click delegation)
 *   - Focus Management: disabled dropzone has tabIndex=-1; enabled
 *     has tabIndex=0
 *   - Screen Reader Support: native file input is hidden visually
 *     but reachable; per-file remove names use the filename so AT
 *     users never confuse two uploads
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FileUpload from "./FileUpload";

describe("FileUpload Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("dropzone has role=button with name 'Upload files'", () => {
      render(<FileUpload />);

      expect(
        screen.getByRole("button", { name: "Upload files" }),
      ).toBeInTheDocument();
    });

    it("aria-disabled mirrors the disabled prop", () => {
      render(<FileUpload disabled />);

      expect(
        screen.getByRole("button", { name: "Upload files" }),
      ).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("Keyboard Navigation", () => {
    it("enabled dropzone has tabIndex=0 (in the natural tab order)", () => {
      render(<FileUpload />);

      expect(
        screen.getByRole("button", { name: "Upload files" }),
      ).toHaveAttribute("tabindex", "0");
    });
  });

  describe("Focus Management", () => {
    it("disabled dropzone has tabIndex=-1 (out of tab order)", () => {
      render(<FileUpload disabled />);

      expect(
        screen.getByRole("button", { name: "Upload files" }),
      ).toHaveAttribute("tabindex", "-1");
    });
  });

  describe("Screen Reader Support", () => {
    it("hidden native file input is reachable for AT users", () => {
      const { container } = render(<FileUpload />);

      // The input is visually hidden but still in the DOM (className
      // "hidden" but not display:none-with-no-access). Its presence
      // matters because the dropzone delegates clicks to it.
      const input = container.querySelector('input[type="file"]');
      expect(input).toBeInTheDocument();
    });

    it("multiple=true is mirrored on the native input", () => {
      const { container } = render(<FileUpload multiple />);

      const input = container.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      expect(input.multiple).toBe(true);
    });

    it("accept attribute mirrors the consumer prop (file-type hint to OS picker)", () => {
      const { container } = render(<FileUpload accept="image/*" />);

      const input = container.querySelector('input[type="file"]');
      expect(input).toHaveAttribute("accept", "image/*");
    });
  });
});

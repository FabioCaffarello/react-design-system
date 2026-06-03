/**
 * Text Accessibility Tests
 *
 * Dedicated a11y test scaffold for Text — the polymorphic typography
 * primitive. The element it renders (`<p>`, `<h1>`, `<li>`, …) is
 * driven by `variant` or `as`, and that choice carries the a11y
 * semantics (headings expose role=heading at the right level, list
 * items need to live inside a list, paragraphs are body text).
 *
 *   - ARIA Labels and Roles: variant="heading" yields <h2>;
 *     variant="list" yields <li>; variant="paragraph" yields <p>;
 *     `as` prop overrides the tag choice without losing typography
 *   - Keyboard Navigation: non-interactive — never a tab stop
 *   - Focus Management: no tabindex by default
 *   - Screen Reader Support: heading role is announced at the right
 *     level; colorRole/colorShade are visual-only and don't change AT
 *     output
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Text from "./Text";

describe("Text Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("variant='heading' renders as <h2> (role=heading, level 2)", () => {
      render(<Text variant="heading">Section title</Text>);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Section title");
    });

    it("variant='paragraph' renders as <p>", () => {
      render(<Text variant="paragraph">Body copy.</Text>);

      const p = screen.getByText("Body copy.");
      expect(p.tagName).toBe("P");
    });

    it("variant='list' renders as <li>", () => {
      // <li> outside a list is still <li> in the DOM — Testing Library
      // queries it by element role only inside a list context, so we
      // assert the tag.
      const { container } = render(
        <ul>
          <Text variant="list">First</Text>
        </ul>,
      );

      const li = container.querySelector("li");
      expect(li).toBeInTheDocument();
      expect(li).toHaveTextContent("First");
    });

    it("`as` prop overrides the default tag (e.g. h1)", () => {
      render(
        <Text variant="heading" as="h1">
          Page title
        </Text>,
      );

      // `as="h1"` upgrades the heading level — variant="heading" gave
      // <h2> by default; the polymorphic prop wins.
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("Page title");
    });
  });

  describe("Keyboard Navigation", () => {
    it("is not in the tab order", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Text variant="paragraph">Body text</Text>
          <button>After</button>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      // Tab skips paragraph text — non-interactive.
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("has no tabindex by default", () => {
      render(<Text variant="paragraph">Body</Text>);

      expect(screen.getByText("Body")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("colorRole/colorShade are visual-only — AT output unchanged", () => {
      const { rerender } = render(
        <Text variant="paragraph" colorRole="success" colorShade="DEFAULT">
          Saved
        </Text>,
      );

      const successText = screen.getByText("Saved").tagName;

      rerender(
        <Text variant="paragraph" colorRole="error" colorShade="DEFAULT">
          Saved
        </Text>,
      );

      const errorText = screen.getByText("Saved").tagName;

      // Same tag, same accessible content — the color tone change is
      // purely visual.
      expect(successText).toBe(errorText);
    });

    it("heading level is reflected in the accessibility tree", () => {
      render(
        <>
          <Text variant="heading" as="h3">
            Subsection
          </Text>
        </>,
      );

      // Level-3 heading is exposed in the AT tree at the correct level.
      const h3 = screen.getByRole("heading", { level: 3 });
      expect(h3).toHaveTextContent("Subsection");
    });
  });
});

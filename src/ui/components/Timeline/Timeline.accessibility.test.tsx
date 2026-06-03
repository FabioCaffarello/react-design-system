/**
 * Timeline Accessibility Tests
 *
 * Dedicated a11y test scaffold for Timeline — the chronological event
 * sequence (horizontal or vertical).
 *
 *   - ARIA Labels and Roles: each item title renders as <h3>; the
 *     marker bubble carries identity (icon / check / number); pending
 *     bubbles get data-marker="pending" (anchors the AA-by-construction
 *     exception in .claude/rules/colors.md)
 *   - Keyboard Navigation: non-interactive — Timeline is a layout for
 *     content, not a control surface
 *   - Focus Management: items are not in the tab order
 *   - Screen Reader Support: titles are surfaced as level-3 headings;
 *     descriptions are read as body text; the marker bubble's visual
 *     state (completed/active/pending) doesn't carry a hidden role
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Timeline from "./Timeline";
import type { TimelineItem } from "./Timeline";

const sampleItems: TimelineItem[] = [
  {
    id: "1",
    title: "Created",
    description: "Initial event",
    status: "completed",
  },
  {
    id: "2",
    title: "In review",
    description: "Awaiting decision",
    status: "active",
  },
  { id: "3", title: "Ship", description: "Pending release", status: "default" },
];

describe("Timeline Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("each item title renders as a level-3 heading", () => {
      render(<Timeline items={sampleItems} />);

      const headings = screen.getAllByRole("heading", { level: 3 });
      expect(headings).toHaveLength(3);
      expect(headings[0]).toHaveTextContent("Created");
      expect(headings[1]).toHaveTextContent("In review");
      expect(headings[2]).toHaveTextContent("Ship");
    });

    it("descriptions render as body text adjacent to the heading", () => {
      render(<Timeline items={sampleItems} />);

      expect(screen.getByText("Initial event")).toBeInTheDocument();
      expect(screen.getByText("Awaiting decision")).toBeInTheDocument();
      expect(screen.getByText("Pending release")).toBeInTheDocument();
    });

    it("pending items carry data-marker='pending' (anchors the AA exception)", () => {
      const { container } = render(<Timeline items={sampleItems} />);

      // The pending bubble uses fg-quaternary over surface-base, which
      // doesn't pass AA over white — but this is the documented
      // AA-by-construction exception. The data-marker attribute is the
      // selector anchor that survives a future restyle (see
      // .claude/rules/colors.md "fg-quaternary: AA-by-construction
      // exception").
      const pendingMarkers = container.querySelectorAll(
        '[data-marker="pending"]',
      );
      // Exactly one item has status="default" (which Timeline treats as
      // pending) → exactly one pending marker.
      expect(pendingMarkers).toHaveLength(1);
    });
  });

  describe("Keyboard Navigation", () => {
    it("is not in the tab order (layout, not control)", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Timeline items={sampleItems} />
          <button>After</button>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();
      // Tab skips Timeline — it's a presentational layout, not an
      // interactive control.
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("marker bubbles have no tabindex", () => {
      const { container } = render(<Timeline items={sampleItems} />);

      const pendingMarker = container.querySelector('[data-marker="pending"]');
      expect(pendingMarker).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("orientation prop is visual-only — same headings/descriptions are surfaced", () => {
      const { rerender } = render(<Timeline items={sampleItems} />);

      const verticalHeadings = screen
        .getAllByRole("heading", { level: 3 })
        .map((h) => h.textContent);

      rerender(<Timeline items={sampleItems} orientation="horizontal" />);

      const horizontalHeadings = screen
        .getAllByRole("heading", { level: 3 })
        .map((h) => h.textContent);

      // Same headings in the AT tree regardless of layout orientation.
      expect(verticalHeadings).toEqual(horizontalHeadings);
    });
  });
});

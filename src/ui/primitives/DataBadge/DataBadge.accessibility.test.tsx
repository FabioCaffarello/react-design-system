/**
 * DataBadge Accessibility Tests
 *
 * Four-section layout mirroring Header.accessibility.test.tsx. DataBadge is
 * a non-interactive inline metadata chip: its accessible name is its visible
 * text (label, then source), the separator and any icon are decorative, and
 * it carries no live-region role (metadata is static, not announced).
 */

import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataBadge from "./DataBadge";

describe("DataBadge Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("does not impose a live-region status role by default", () => {
      render(<DataBadge label="L2" source="Câmara" />);
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("keeps the decorative separator out of the accessible content", () => {
      render(<DataBadge label="L2" source="Câmara" />);
      expect(screen.getByText("·")).toHaveAttribute("aria-hidden", "true");
    });

    it("hides the icon from assistive technology", () => {
      render(<DataBadge label="L2" icon={<svg data-testid="ic" />} />);
      expect(
        screen.getByTestId("ic").closest("[aria-hidden='true']"),
      ).not.toBeNull();
    });

    it("honors a consumer-supplied grouping role and name", () => {
      render(
        <DataBadge role="group" aria-label="Confidence level L2" label="L2" />,
      );
      expect(
        screen.getByRole("group", { name: "Confidence level L2" }),
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("does not steal focus on mount", () => {
      render(<DataBadge label="L2" />);
      expect(document.body).toHaveFocus();
    });

    it("is not in the tab order by default (non-interactive)", async () => {
      const user = userEvent.setup();
      render(<DataBadge label="L2" />);
      await user.tab();
      expect(document.body).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("supports programmatic focus through the forwarded ref when made focusable", () => {
      const ref = createRef<HTMLSpanElement>();
      render(<DataBadge ref={ref} tabIndex={-1} label="L2" />);
      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("exposes the label and source as readable text", () => {
      render(<DataBadge label="L2" source="Portal Transparência" />);
      expect(screen.getByText("L2")).toBeVisible();
      expect(screen.getByText("Portal Transparência")).toBeVisible();
    });

    it("reads only the label when there is no source", () => {
      render(<DataBadge label="Aprovada" />);
      expect(screen.getByText("Aprovada")).toBeVisible();
      expect(screen.queryByText("·")).not.toBeInTheDocument();
    });
  });
});

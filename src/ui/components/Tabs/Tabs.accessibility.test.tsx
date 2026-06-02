/**
 * Tabs Accessibility Tests
 *
 * Dedicated a11y test scaffold for Tabs. The main `Tabs.test.tsx`
 * already covers Arrow/Home/End navigation and the activation-mode
 * split; this file focuses on the structural a11y invariants:
 *
 *   - ARIA Labels and Roles: tablist / tab / tabpanel roles,
 *     aria-orientation reflects the active orientation,
 *     aria-controls/aria-labelledby wire each tab to its panel
 *   - Keyboard Navigation: disabled tabs are skipped (verified via
 *     the tab-order semantics, not by repeated keystroke counting),
 *     wrap-around at boundaries
 *   - Focus Management: roving tabindex — only the active tab has
 *     tabIndex=0, others are tabIndex=-1
 *   - Screen Reader Support: each tab has an accessible name from
 *     its child text; aria-selected is mutually exclusive
 *
 * Mirrors the structure of Header.accessibility.test.tsx as the
 * canonical scaffold for component-level a11y suites.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tabs from "./Tabs";

const basicTabs = (
  <Tabs defaultValue="alpha">
    <Tabs.List>
      <Tabs.Trigger value="alpha">Alpha</Tabs.Trigger>
      <Tabs.Trigger value="beta">Beta</Tabs.Trigger>
      <Tabs.Trigger value="gamma">Gamma</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="alpha">Alpha panel</Tabs.Content>
    <Tabs.Content value="beta">Beta panel</Tabs.Content>
    <Tabs.Content value="gamma">Gamma panel</Tabs.Content>
  </Tabs>
);

describe("Tabs Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders tablist, tab, and tabpanel roles", () => {
      render(basicTabs);

      expect(screen.getByRole("tablist")).toBeInTheDocument();
      expect(screen.getAllByRole("tab")).toHaveLength(3);
      // Only the active panel is mounted by default.
      expect(screen.getByRole("tabpanel")).toBeInTheDocument();
    });

    it("reflects orientation via aria-orientation", () => {
      const { rerender } = render(
        <Tabs defaultValue="alpha" orientation="horizontal">
          <Tabs.List>
            <Tabs.Trigger value="alpha">Alpha</Tabs.Trigger>
            <Tabs.Trigger value="beta">Beta</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="alpha">Alpha panel</Tabs.Content>
        </Tabs>,
      );

      expect(screen.getByRole("tablist")).toHaveAttribute(
        "aria-orientation",
        "horizontal",
      );

      rerender(
        <Tabs defaultValue="alpha" orientation="vertical">
          <Tabs.List>
            <Tabs.Trigger value="alpha">Alpha</Tabs.Trigger>
            <Tabs.Trigger value="beta">Beta</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="alpha">Alpha panel</Tabs.Content>
        </Tabs>,
      );

      expect(screen.getByRole("tablist")).toHaveAttribute(
        "aria-orientation",
        "vertical",
      );
    });

    it("wires aria-controls and aria-labelledby between tab and panel", () => {
      render(basicTabs);

      const activeTab = screen.getByRole("tab", { name: "Alpha" });
      const activePanel = screen.getByRole("tabpanel");

      const controlsId = activeTab.getAttribute("aria-controls");
      expect(controlsId).toBeTruthy();
      expect(activePanel.id).toBe(controlsId);

      const labelledById = activePanel.getAttribute("aria-labelledby");
      expect(labelledById).toBeTruthy();
      expect(activeTab.id).toBe(labelledById);
    });

    it("aria-selected is mutually exclusive across tabs", () => {
      render(basicTabs);

      const tabs = screen.getAllByRole("tab");
      const selected = tabs.filter(
        (tab) => tab.getAttribute("aria-selected") === "true",
      );
      expect(selected).toHaveLength(1);
      expect(selected[0]).toHaveTextContent("Alpha");
    });
  });

  describe("Keyboard Navigation", () => {
    it("ArrowRight on the last tab wraps to the first", async () => {
      const user = userEvent.setup();
      render(basicTabs);

      const gamma = screen.getByRole("tab", { name: "Gamma" });
      gamma.focus();
      await user.keyboard("{ArrowRight}");

      const alpha = screen.getByRole("tab", { name: "Alpha" });
      expect(alpha).toHaveFocus();
    });

    it("ArrowLeft on the first tab wraps to the last", async () => {
      const user = userEvent.setup();
      render(basicTabs);

      const alpha = screen.getByRole("tab", { name: "Alpha" });
      alpha.focus();
      await user.keyboard("{ArrowLeft}");

      const gamma = screen.getByRole("tab", { name: "Gamma" });
      expect(gamma).toHaveFocus();
    });

    it("disabled tabs are excluded from arrow navigation", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="alpha">
          <Tabs.List>
            <Tabs.Trigger value="alpha">Alpha</Tabs.Trigger>
            <Tabs.Trigger value="beta" disabled>
              Beta (disabled)
            </Tabs.Trigger>
            <Tabs.Trigger value="gamma">Gamma</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="alpha">Alpha panel</Tabs.Content>
          <Tabs.Content value="beta">Beta panel</Tabs.Content>
          <Tabs.Content value="gamma">Gamma panel</Tabs.Content>
        </Tabs>,
      );

      const alpha = screen.getByRole("tab", { name: "Alpha" });
      alpha.focus();
      await user.keyboard("{ArrowRight}");

      // Should skip Beta and land on Gamma.
      expect(screen.getByRole("tab", { name: "Gamma" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("uses roving tabindex — only the active tab is tabIndex 0", () => {
      render(basicTabs);

      const tabs = screen.getAllByRole("tab");
      const active = tabs.find(
        (tab) => tab.getAttribute("aria-selected") === "true",
      );
      const inactive = tabs.filter(
        (tab) => tab.getAttribute("aria-selected") !== "true",
      );

      expect(active).toHaveAttribute("tabindex", "0");
      inactive.forEach((tab) => {
        expect(tab).toHaveAttribute("tabindex", "-1");
      });
    });

    it("Tab from outside lands on the active tab, not the first one", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Tabs defaultValue="beta">
            <Tabs.List>
              <Tabs.Trigger value="alpha">Alpha</Tabs.Trigger>
              <Tabs.Trigger value="beta">Beta</Tabs.Trigger>
              <Tabs.Trigger value="gamma">Gamma</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="beta">Beta panel</Tabs.Content>
          </Tabs>
        </>,
      );

      screen.getByRole("button", { name: "Before" }).focus();
      await user.tab();

      // The roving-tabindex contract: external Tab lands on the active
      // tab (Beta), not the first (Alpha).
      expect(screen.getByRole("tab", { name: "Beta" })).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("each tab carries the visible text as its accessible name", () => {
      render(basicTabs);

      // getByRole with `name` performs the accessible-name computation —
      // if a future refactor breaks it (icon-only tab with no aria-label),
      // these queries fail loudly.
      expect(screen.getByRole("tab", { name: "Alpha" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Beta" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Gamma" })).toBeInTheDocument();
    });

    it("disabled tabs are still in the tablist with aria-disabled or disabled attr", () => {
      render(
        <Tabs defaultValue="alpha">
          <Tabs.List>
            <Tabs.Trigger value="alpha">Alpha</Tabs.Trigger>
            <Tabs.Trigger value="beta" disabled>
              Beta
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="alpha">Alpha panel</Tabs.Content>
        </Tabs>,
      );

      // A disabled tab still announces as a tab (so users hear "tab 2 of 2,
      // dimmed"), it just isn't activatable. We assert it is present in
      // the tablist, then that the disabled state is conveyed via the
      // native disabled attribute (which AT maps to aria-disabled).
      const beta = screen.getByRole("tab", { name: "Beta" });
      expect(beta).toBeInTheDocument();
      expect(beta).toBeDisabled();
    });
  });
});

/**
 * HeroSection Accessibility Tests
 *
 * Real WCAG 2.1 AA contract for HeroSection, in the canonical four-section
 * layout mirrored from Header.accessibility.test.tsx (ARIA Labels and Roles /
 * Keyboard Navigation / Focus Management / Screen Reader Support).
 *
 * The hero is presentational: its own a11y surface is the named `<section>`
 * region + the `<h1>` title. Interactivity is supplied by consumer children
 * in the `actions` slot, so the keyboard/focus sections assert that those
 * children remain reachable and that the hero never traps or steals focus.
 */

import { createRef } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeroSection from "./HeroSection";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("HeroSection Accessibility", () => {
  describe("ARIA Labels and Roles", () => {
    it("renders the root as a named region landmark", () => {
      render(<HeroSection title="Painel de transparência" />);
      const region = screen.getByRole("region", {
        name: "Painel de transparência",
      });
      expect(region.tagName).toBe("SECTION");
    });

    it("renders the title as a single level-1 heading", () => {
      render(<HeroSection title="Congresso em tempo real" />);
      const headings = screen.getAllByRole("heading", { level: 1 });
      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent("Congresso em tempo real");
    });

    it("lets a consumer aria-label override the derived name", () => {
      render(<HeroSection title="Visible" aria-label="Authoritative name" />);
      expect(
        screen.getByRole("region", { name: "Authoritative name" }),
      ).toBeInTheDocument();
    });

    it("names the region via aria-labelledby without emitting a redundant aria-label", () => {
      render(
        <>
          <h2 id="hero-name">External heading</h2>
          <HeroSection title={<span>Rich</span>} aria-labelledby="hero-name" />
        </>,
      );
      const region = screen.getByRole("region", { name: "External heading" });
      expect(region).toHaveAttribute("aria-labelledby", "hero-name");
      expect(region).not.toHaveAttribute("aria-label");
    });
  });

  describe("Keyboard Navigation", () => {
    it("does not steal focus on mount", () => {
      render(<HeroSection title="No autofocus" />);
      expect(document.body).toHaveFocus();
    });

    it("keeps interactive children in the actions slot reachable via Tab", async () => {
      const user = userEvent.setup();
      render(
        <HeroSection
          title="With actions"
          actions={
            <>
              <button>Primary</button>
              <button>Secondary</button>
            </>
          }
        />,
      );

      await user.tab();
      expect(screen.getByRole("button", { name: "Primary" })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("button", { name: "Secondary" })).toHaveFocus();
    });

    it("is not itself in the tab order by default", async () => {
      const user = userEvent.setup();
      render(
        <HeroSection title="Static hero" actions={<button>Only</button>} />,
      );
      // First Tab lands on the action, never on the <section> wrapper.
      await user.tab();
      expect(screen.getByRole("button", { name: "Only" })).toHaveFocus();
    });
  });

  describe("Focus Management", () => {
    it("supports programmatic focus through the forwarded ref", () => {
      const ref = createRef<HTMLElement>();
      render(<HeroSection ref={ref} title="Focusable" tabIndex={-1} />);
      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });

  describe("Screen Reader Support", () => {
    it("exposes every text slot to assistive technology", () => {
      render(
        <HeroSection
          kicker="Transparência"
          title="Acompanhe o Congresso"
          description="Proposições e votações em um só lugar."
          meta="Atualizado diariamente"
        />,
      );
      expect(screen.getByText("Transparência")).toBeVisible();
      expect(
        screen.getByRole("heading", { name: "Acompanhe o Congresso" }),
      ).toBeVisible();
      expect(
        screen.getByText("Proposições e votações em um só lugar."),
      ).toBeVisible();
      expect(screen.getByText("Atualizado diariamente")).toBeVisible();
    });

    it("still renders a rich (non-string) title for AT, and warns it needs a name", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(
        <HeroSection
          title={
            <>
              Linha 1 <strong>destaque</strong>
            </>
          }
        />,
      );
      // The heading text is intact for screen readers...
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Linha 1 destaque");
      // ...but the unnamed landmark is flagged in development.
      expect(warn).toHaveBeenCalledOnce();
    });
  });
});

/**
 * HeroSection Behavior Tests
 *
 * Render, slots (presence + collapse), variants, alignment, accessible-name
 * derivation, ref forwarding, and DOM passthrough. The dedicated a11y
 * contract lives in HeroSection.accessibility.test.tsx.
 */

import { createRef } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroSection from "./HeroSection";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("HeroSection", () => {
  describe("rendering", () => {
    it("renders the title as a level-1 heading", () => {
      render(<HeroSection title="Acompanhe o Congresso" />);
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: "Acompanhe o Congresso",
        }),
      ).toBeInTheDocument();
    });

    it("renders the root as a <section> landmark", () => {
      render(<HeroSection title="Painel" />);
      // A named <section> is exposed as a region landmark.
      expect(screen.getByRole("region", { name: "Painel" }).tagName).toBe(
        "SECTION",
      );
    });
  });

  describe("optional slots", () => {
    it("renders the kicker when provided", () => {
      render(<HeroSection title="Title" kicker="Transparência" />);
      expect(screen.getByText("Transparência")).toBeInTheDocument();
    });

    it("renders the description when provided", () => {
      render(<HeroSection title="Title" description="Subtitle copy" />);
      expect(screen.getByText("Subtitle copy")).toBeInTheDocument();
    });

    it("renders the actions slot when provided", () => {
      render(<HeroSection title="Title" actions={<button>Começar</button>} />);
      expect(
        screen.getByRole("button", { name: "Começar" }),
      ).toBeInTheDocument();
    });

    it("renders the kpis slot when provided", () => {
      render(
        <HeroSection
          title="Title"
          kpis={<div data-testid="kpis">stats</div>}
        />,
      );
      expect(screen.getByTestId("kpis")).toBeInTheDocument();
    });

    it("renders the meta slot when provided", () => {
      render(<HeroSection title="Title" meta="Atualizado diariamente" />);
      expect(screen.getByText("Atualizado diariamente")).toBeInTheDocument();
    });

    it("collapses absent slots — only the title text column renders", () => {
      render(<HeroSection title="Lonely title" />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.queryByText("Transparência")).not.toBeInTheDocument();
      // No empty wrapper leaks: the region's only child element is the text
      // column holding the heading.
      const region = screen.getByRole("region", { name: "Lonely title" });
      expect(region.querySelectorAll("div").length).toBe(1);
    });
  });

  describe("variant", () => {
    it("plain (default) applies no gradient classes", () => {
      render(<HeroSection title="Plain" />);
      const region = screen.getByRole("region", { name: "Plain" });
      expect(region).not.toHaveClass("hero-gradient");
      expect(region).not.toHaveClass("hero-glow");
    });

    it("gradient applies the gradient wash", () => {
      render(<HeroSection title="Grad" variant="gradient" />);
      const region = screen.getByRole("region", { name: "Grad" });
      expect(region).toHaveClass("hero-gradient");
      expect(region).not.toHaveClass("hero-glow");
    });

    it("gradient-glow applies both the wash and the glow", () => {
      render(<HeroSection title="Glow" variant="gradient-glow" />);
      const region = screen.getByRole("region", { name: "Glow" });
      expect(region).toHaveClass("hero-gradient");
      expect(region).toHaveClass("hero-glow");
    });
  });

  describe("align", () => {
    it("start (default) left-aligns the section text", () => {
      render(<HeroSection title="Start" />);
      expect(screen.getByRole("region", { name: "Start" })).toHaveClass(
        "text-left",
      );
    });

    it("center centers the section text and the actions row", () => {
      render(
        <HeroSection
          title="Centered"
          align="center"
          actions={<button>Go</button>}
        />,
      );
      const region = screen.getByRole("region", { name: "Centered" });
      expect(region).toHaveClass("text-center");
      // The actions wrapper centers its row on the main axis.
      expect(
        screen.getByRole("button", { name: "Go" }).parentElement,
      ).toHaveClass("justify-center");
    });
  });

  describe("accessible name derivation", () => {
    it("uses a string title as the section's accessible name", () => {
      render(<HeroSection title="Derived name" />);
      expect(
        screen.getByRole("region", { name: "Derived name" }),
      ).toBeInTheDocument();
    });

    it("lets an explicit aria-label override the derived name", () => {
      render(<HeroSection title="Visible title" aria-label="Override" />);
      expect(
        screen.getByRole("region", { name: "Override" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("region", { name: "Visible title" }),
      ).not.toBeInTheDocument();
    });

    it("warns (dev) when a non-string title has no accessible name", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<HeroSection title={<span>Rich title</span>} />);
      expect(warn).toHaveBeenCalledOnce();
      expect(warn.mock.calls[0][0]).toContain("[HeroSection]");
    });

    it("does not warn when a non-string title is named via aria-labelledby", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(
        <>
          <h2 id="ext">External name</h2>
          <HeroSection title={<span>Rich title</span>} aria-labelledby="ext" />
        </>,
      );
      expect(warn).not.toHaveBeenCalled();
    });

    it("does not warn for a plain string title", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<HeroSection title="Plain string" />);
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe("DOM contract", () => {
    it("forwards the ref to the root <section>", () => {
      const ref = createRef<HTMLElement>();
      render(<HeroSection ref={ref} title="Ref" />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe("SECTION");
    });

    it("merges className and spreads arbitrary attributes onto the root", () => {
      render(
        <HeroSection title="Spread" className="custom-x" data-testid="hero" />,
      );
      const region = screen.getByTestId("hero");
      expect(region).toHaveClass("custom-x");
      // Token-derived base class still present alongside the custom one.
      expect(region).toHaveClass("flex");
    });
  });
});

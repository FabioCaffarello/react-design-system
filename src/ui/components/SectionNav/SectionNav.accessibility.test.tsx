"use client";

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionNav } from "./SectionNav";
import { Vote, Wallet } from "lucide-react";

vi.mock("../../hooks/useScrollSpy", () => ({
  useScrollSpy: vi.fn(() => null),
}));

import { useScrollSpy } from "../../hooks/useScrollSpy";
const mockUseScrollSpy = vi.mocked(useScrollSpy);

const items = [
  {
    id: "votos",
    label: "Votações",
    icon: <Vote aria-hidden="true" size={16} />,
  },
  {
    id: "gastos",
    label: "Gastos",
    icon: <Wallet aria-hidden="true" size={16} />,
  },
];

describe("SectionNav Accessibility", () => {
  beforeEach(() => {
    mockUseScrollSpy.mockReturnValue(null);
  });

  describe("ARIA Labels and Roles", () => {
    it("renders as a navigation landmark", () => {
      render(<SectionNav items={items} aria-label="Page sections" />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("navigation landmark has an accessible name via aria-label", () => {
      render(<SectionNav items={items} aria-label="Page sections" />);
      expect(
        screen.getByRole("navigation", { name: "Page sections" }),
      ).toBeInTheDocument();
    });

    it("navigation landmark can be named via aria-labelledby", () => {
      render(
        <>
          <h2 id="nav-heading">Seções</h2>
          <SectionNav items={items} aria-labelledby="nav-heading" />
        </>,
      );
      expect(
        screen.getByRole("navigation", { name: "Seções" }),
      ).toBeInTheDocument();
    });

    it("active link has aria-current=true", () => {
      mockUseScrollSpy.mockReturnValue("votos");
      render(<SectionNav items={items} aria-label="Page sections" />);
      expect(screen.getByRole("link", { name: "Votações" })).toHaveAttribute(
        "aria-current",
        "true",
      );
    });

    it("inactive links do not have aria-current", () => {
      mockUseScrollSpy.mockReturnValue("votos");
      render(<SectionNav items={items} aria-label="Page sections" />);
      expect(screen.getByRole("link", { name: "Gastos" })).not.toHaveAttribute(
        "aria-current",
      );
    });

    it("all links have valid href anchor targets", () => {
      render(<SectionNav items={items} aria-label="Page sections" />);
      expect(screen.getByRole("link", { name: "Votações" })).toHaveAttribute(
        "href",
        "#votos",
      );
      expect(screen.getByRole("link", { name: "Gastos" })).toHaveAttribute(
        "href",
        "#gastos",
      );
    });

    it("icons are aria-hidden and do not affect link accessible name", () => {
      render(<SectionNav items={items} aria-label="Page sections" />);
      // Link name comes from the text span, not the icon
      const link = screen.getByRole("link", { name: "Votações" });
      expect(link).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("all links are keyboard-focusable (no tabindex=-1)", () => {
      render(<SectionNav items={items} aria-label="Page sections" />);
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).not.toHaveAttribute("tabindex", "-1");
      });
    });

    it("links are natively focusable anchor elements", () => {
      render(<SectionNav items={items} aria-label="Page sections" />);
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link.tagName).toBe("A");
      });
    });
  });

  describe("Focus Management", () => {
    it("nav is not itself focusable", () => {
      render(<SectionNav items={items} aria-label="Page sections" />);
      const nav = screen.getByRole("navigation");
      expect(nav).not.toHaveAttribute("tabindex");
    });

    it("sticky positioning does not affect focusability", () => {
      render(
        <SectionNav
          items={items}
          aria-label="Page sections"
          stickyTop="3.5rem"
        />,
      );
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("sticky");
      expect(nav).not.toHaveAttribute("tabindex");
    });
  });

  describe("Screen Reader Support", () => {
    it("link labels are readable as text", () => {
      render(<SectionNav items={items} aria-label="Page sections" />);
      expect(screen.getByText("Votações")).toBeInTheDocument();
      expect(screen.getByText("Gastos")).toBeInTheDocument();
    });

    it("active state change is communicated via aria-current", () => {
      const { rerender } = render(
        <SectionNav items={items} aria-label="Page sections" />,
      );
      expect(
        screen.getByRole("link", { name: "Votações" }),
      ).not.toHaveAttribute("aria-current");

      mockUseScrollSpy.mockReturnValue("votos");
      rerender(<SectionNav items={items} aria-label="Page sections" />);
      expect(screen.getByRole("link", { name: "Votações" })).toHaveAttribute(
        "aria-current",
        "true",
      );
    });

    it("renders with no links without crashing or invalid markup", () => {
      render(<SectionNav items={[]} aria-label="Page sections" />);
      const nav = screen.getByRole("navigation", { name: "Page sections" });
      expect(nav).toBeInTheDocument();
      expect(screen.queryAllByRole("link")).toHaveLength(0);
    });
  });
});

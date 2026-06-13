/**
 * TabsAsLinks Behavior Tests
 *
 * Link rendering, active marking (aria-current), variants, icon/count slots,
 * the linkComponent escape hatch, ref forwarding, and DOM passthrough. The
 * dedicated a11y contract lives in TabsAsLinks.accessibility.test.tsx.
 */

import { createRef } from "react";
import type { AnchorHTMLAttributes } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TabsAsLinks, { type TabAsLink } from "./TabsAsLinks";

afterEach(() => {
  vi.restoreAllMocks();
});

const items: TabAsLink[] = [
  { label: "Overview", href: "/painel?tab=overview", active: true },
  { label: "Alerts", href: "/painel?tab=alerts", count: 3 },
  { label: "Settings", href: "/painel?tab=settings" },
];

describe("TabsAsLinks", () => {
  describe("rendering", () => {
    it("renders one link per item with the right href", () => {
      render(<TabsAsLinks aria-label="Painel" items={items} />);
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(3);
      expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
        "href",
        "/painel?tab=overview",
      );
    });

    it("renders the root as a <nav> landmark named by aria-label", () => {
      render(<TabsAsLinks aria-label="Painel" items={items} />);
      expect(screen.getByRole("navigation", { name: "Painel" }).tagName).toBe(
        "NAV",
      );
    });

    it("renders nothing but an empty nav when items is empty", () => {
      render(<TabsAsLinks aria-label="Empty" items={[]} />);
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
      expect(
        screen.getByRole("navigation", { name: "Empty" }),
      ).toBeInTheDocument();
    });
  });

  describe("active marking", () => {
    it("sets aria-current='page' only on the active tab", () => {
      render(<TabsAsLinks aria-label="Painel" items={items} />);
      expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(screen.getByRole("link", { name: /alerts/i })).not.toHaveAttribute(
        "aria-current",
      );
    });

    it("applies the active brand-underline classes to the active tab", () => {
      render(<TabsAsLinks aria-label="Painel" items={items} />);
      expect(screen.getByRole("link", { name: "Overview" })).toHaveClass(
        "border-line-brand",
      );
    });
  });

  describe("variant", () => {
    it("default uses the strong track line", () => {
      render(<TabsAsLinks aria-label="P" items={items} />);
      expect(screen.getByRole("navigation", { name: "P" })).toHaveClass(
        "border-line-default",
      );
    });

    it("sub uses the muted track line", () => {
      render(<TabsAsLinks aria-label="P" variant="sub" items={items} />);
      expect(screen.getByRole("navigation", { name: "P" })).toHaveClass(
        "border-line-muted",
      );
    });
  });

  describe("icon and count slots", () => {
    it("renders a decorative icon marked aria-hidden", () => {
      render(
        <TabsAsLinks
          aria-label="P"
          items={[
            {
              label: "Home",
              href: "/",
              icon: <svg data-testid="icon" />,
            },
          ]}
        />,
      );
      const icon = screen.getByTestId("icon");
      expect(icon.parentElement).toHaveAttribute("aria-hidden", "true");
    });

    it("renders the count when provided", () => {
      render(<TabsAsLinks aria-label="P" items={items} />);
      expect(screen.getByRole("link", { name: /alerts/i })).toHaveTextContent(
        "3",
      );
    });
  });

  describe("linkComponent escape hatch", () => {
    it("renders each tab as the provided component, defaulting to <a>", () => {
      function CustomLink({
        children,
        ...rest
      }: AnchorHTMLAttributes<HTMLAnchorElement>) {
        return (
          <a data-custom="yes" {...rest}>
            {children}
          </a>
        );
      }
      render(
        <TabsAsLinks aria-label="P" linkComponent={CustomLink} items={items} />,
      );
      const link = screen.getByRole("link", { name: "Overview" });
      expect(link).toHaveAttribute("data-custom", "yes");
      expect(link).toHaveAttribute("href", "/painel?tab=overview");
      expect(link).toHaveAttribute("aria-current", "page");
    });
  });

  describe("accessible name warning", () => {
    it("warns (dev) when neither aria-label nor aria-labelledby is given", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<TabsAsLinks items={items} />);
      expect(warn).toHaveBeenCalledOnce();
      expect(warn.mock.calls[0][0]).toContain("[TabsAsLinks]");
    });

    it("does not warn when named via aria-label", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<TabsAsLinks aria-label="Painel" items={items} />);
      expect(warn).not.toHaveBeenCalled();
    });

    it("does not warn when named via aria-labelledby", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(
        <>
          <h2 id="t">Painel</h2>
          <TabsAsLinks aria-labelledby="t" items={items} />
        </>,
      );
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe("DOM contract", () => {
    it("forwards the ref to the root <nav>", () => {
      const ref = createRef<HTMLElement>();
      render(<TabsAsLinks ref={ref} aria-label="P" items={items} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe("NAV");
    });

    it("merges className and spreads arbitrary attributes onto the root", () => {
      render(
        <TabsAsLinks
          aria-label="P"
          items={items}
          className="custom-x"
          data-testid="bar"
        />,
      );
      const nav = screen.getByTestId("bar");
      expect(nav).toHaveClass("custom-x");
      expect(nav).toHaveClass("flex");
    });
  });
});

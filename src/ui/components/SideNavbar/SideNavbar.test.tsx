import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SideNavbar from "./SideNavbar";
import { useSideNavbarStateRequired } from "./contexts/SideNavbarStateContext";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("SideNavbar", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe("Basic Rendering", () => {
    it("renders navigation and content correctly", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar>
            <div>Nav Items</div>
          </SideNavbar.Navbar>
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Content>
              <div>Content</div>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>,
      );

      expect(screen.getByText("Nav Items")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("renders with default width of 320px", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const sidebar = screen.getByRole("complementary");
      expect(sidebar).toHaveStyle({ width: "320px" });
    });

    it("renders with custom width", () => {
      render(
        <SideNavbar width="400px">
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const sidebar = screen.getByRole("complementary");
      expect(sidebar).toHaveStyle({ width: "400px" });
    });

    it("renders toggle button by default", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      expect(
        screen.getByRole("button", { name: /collapse sidebar/i }),
      ).toBeInTheDocument();
    });

    it("hides toggle when showToggle is false", () => {
      render(
        <SideNavbar showToggle={false}>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      expect(
        screen.queryByRole("button", { name: /collapse sidebar/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Collapse Behavior", () => {
    it("starts expanded by default", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const sidebar = screen.getByRole("complementary");
      expect(sidebar).toHaveStyle({ width: "320px" });
    });

    it("starts collapsed when defaultCollapsed is true", () => {
      render(
        <SideNavbar defaultCollapsed navigationWidth="56px">
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const sidebar = screen.getByRole("complementary");
      expect(sidebar).toHaveStyle({ width: "56px" });
    });

    it("toggles sidebar when toggle button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <SideNavbar navigationWidth="56px">
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const sidebar = screen.getByRole("complementary");
      expect(sidebar).toHaveStyle({ width: "320px" });

      const toggleButton = screen.getByRole("button", {
        name: /collapse sidebar/i,
      });
      await act(async () => {
        await user.click(toggleButton);
      });

      expect(sidebar).toHaveStyle({ width: "56px" });
    });

    it("calls onCollapseChange when collapse state changes", async () => {
      const user = userEvent.setup();
      const onCollapseChange = vi.fn();

      render(
        <SideNavbar onCollapseChange={onCollapseChange}>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const toggleButton = screen.getByRole("button", {
        name: /collapse sidebar/i,
      });
      await act(async () => {
        await user.click(toggleButton);
      });

      expect(onCollapseChange).toHaveBeenCalledWith(true);
    });

    it("respects controlled collapsed prop", () => {
      render(
        <SideNavbar collapsed={true} navigationWidth="56px">
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const sidebar = screen.getByRole("complementary");
      expect(sidebar).toHaveStyle({ width: "56px" });
    });
  });

  describe("Header Component", () => {
    it("renders header with title", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header title="Settings" />
          </SideNavbar.Sidebar>
        </SideNavbar>,
      );

      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("renders header with title and subtitle", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header
              title="Settings"
              subtitle="Manage your preferences"
            />
          </SideNavbar.Sidebar>
        </SideNavbar>,
      );

      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByText("Manage your preferences")).toBeInTheDocument();
    });

    it("hides header when sidebar is collapsed", () => {
      render(
        <SideNavbar defaultCollapsed>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Header title="Settings" />
          </SideNavbar.Sidebar>
        </SideNavbar>,
      );

      // Header returns null when collapsed, so it should not be in the document
      expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    });
  });

  describe("Content Component", () => {
    it("renders content", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Content>
              <div>My Content</div>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>,
      );

      expect(screen.getByText("My Content")).toBeInTheDocument();
    });

    it("hides content when sidebar is collapsed", () => {
      render(
        <SideNavbar defaultCollapsed>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Content>
              <div data-testid="content-text">My Content</div>
            </SideNavbar.Sidebar.Content>
          </SideNavbar.Sidebar>
        </SideNavbar>,
      );

      // Content returns null when collapsed, so it should not be in the document
      expect(screen.queryByTestId("content-text")).not.toBeInTheDocument();
    });
  });

  describe("Footer Component", () => {
    it("renders footer", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Footer>
              <button>Save</button>
            </SideNavbar.Sidebar.Footer>
          </SideNavbar.Sidebar>
        </SideNavbar>,
      );

      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("hides footer when sidebar is collapsed", () => {
      render(
        <SideNavbar defaultCollapsed>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
          <SideNavbar.Sidebar>
            <SideNavbar.Sidebar.Footer data-testid="sidebar-footer">
              <button>Save</button>
            </SideNavbar.Sidebar.Footer>
          </SideNavbar.Sidebar>
        </SideNavbar>,
      );

      // Footer returns null when collapsed, so it should not be in the document
      expect(screen.queryByTestId("sidebar-footer")).not.toBeInTheDocument();
    });
  });

  describe("Toggle Component", () => {
    it("renders PanelLeftClose icon when expanded", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const toggleButton = screen.getByRole("button", {
        name: /collapse sidebar/i,
      });
      expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    });

    it("renders PanelLeftOpen icon when collapsed", () => {
      render(
        <SideNavbar defaultCollapsed>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const toggleButton = screen.getByRole("button", {
        name: /expand sidebar/i,
      });
      expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    });

    it("has correct aria-controls attribute", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const toggleButton = screen.getByRole("button", {
        name: /collapse sidebar/i,
      });
      expect(toggleButton).toHaveAttribute(
        "aria-controls",
        "side-navbar-sidebar",
      );
    });
  });

  describe("Variants", () => {
    it("applies default variant", () => {
      render(
        <SideNavbar variant="default">
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const sidebar = screen.getByRole("complementary");
      expect(sidebar).toBeInTheDocument();
    });

    it("applies compact variant", () => {
      render(
        <SideNavbar variant="compact">
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const sidebar = screen.getByRole("complementary");
      expect(sidebar.className).toContain("text-sm");
    });

    it("applies elevated variant", () => {
      render(
        <SideNavbar variant="elevated">
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const sidebar = screen.getByRole("complementary");
      expect(sidebar.className).toContain("shadow-lg");
    });
  });

  describe("Persistence", () => {
    it("persists collapsed state to localStorage", async () => {
      const user = userEvent.setup();

      render(
        <SideNavbar storageKey="test-sidebar">
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const toggleButton = screen.getByRole("button", {
        name: /collapse sidebar/i,
      });
      await act(async () => {
        await user.click(toggleButton);
      });

      expect(localStorageMock.getItem("test-sidebar-collapsed")).toBe("true");
    });

    it("loads collapsed state from localStorage", () => {
      localStorageMock.setItem("test-sidebar-collapsed", "true");

      render(
        <SideNavbar storageKey="test-sidebar" navigationWidth="56px">
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const sidebar = screen.getByRole("complementary");
      expect(sidebar).toHaveStyle({ width: "56px" });
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(
        <SideNavbar aria-label="Main sidebar">
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const sidebar = screen.getByRole("complementary");
      expect(sidebar).toHaveAttribute("aria-label", "Main sidebar");
    });

    it("has default aria-label when not provided", () => {
      render(
        <SideNavbar>
          <SideNavbar.Navbar>
            <div>Nav</div>
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      const sidebar = screen.getByRole("complementary");
      expect(sidebar).toHaveAttribute("aria-label", "Sidebar navigation");
    });
  });

  describe("useSideNavbarStateRequired Hook", () => {
    it("provides sidebar state context", () => {
      const TestComponent = () => {
        const { collapsed, toggle } = useSideNavbarStateRequired();
        return (
          <div>
            <span>Collapsed: {collapsed ? "yes" : "no"}</span>
            <button onClick={toggle}>Toggle</button>
          </div>
        );
      };

      render(
        <SideNavbar>
          <SideNavbar.Navbar>
            <TestComponent />
          </SideNavbar.Navbar>
        </SideNavbar>,
      );

      expect(screen.getByText("Collapsed: no")).toBeInTheDocument();
    });

    it("throws error when used outside context", () => {
      const TestComponent = () => {
        useSideNavbarStateRequired();
        return <div>Test</div>;
      };

      expect(() => render(<TestComponent />)).toThrow(
        "useSideNavbarStateRequired must be used within SideNavbarStateProvider",
      );
    });
  });

  /**
   * Per-Navbar override of the main toggle (Phase 2C Treatment 2).
   *
   * Render-driven (no effect, no state, no new context): SideNavbarRoot
   * inspects its direct `children` synchronously during render, finds
   * the first <SideNavbar.Navbar> carrying `showMainToggle` and/or
   * `mainTogglePosition`, and uses those values to resolve the show /
   * position of the global toggle it renders at the <aside> level.
   *
   * Selector convention here: the toggle carries a `data-position`
   * attribute (set in SideNavbarToggle.tsx) — far more stable than a
   * role+name regex, and survives changes to the button's label /
   * tooltip text.
   */
  describe("Navbar main-toggle override (Phase 2C, render-driven)", () => {
    function findMainToggle(container: HTMLElement): HTMLElement | null {
      return container.querySelector("aside [data-position]");
    }

    // Caso 1 — visibility override hides the toggle.
    it("showMainToggle={false} on a Navbar hides the main toggle", () => {
      const { container } = render(
        <SideNavbar showToggle>
          <SideNavbar.Navbar showMainToggle={false}>
            <SideNavbar.Navbar.Item icon={<div />} label="Home" id="home" />
          </SideNavbar.Navbar>
        </SideNavbar>,
      );
      expect(findMainToggle(container)).toBeNull();
    });

    // Caso 2 — position override moves the toggle's data-position.
    it("mainTogglePosition='bottom' moves the toggle's data-position", () => {
      const { container } = render(
        <SideNavbar showToggle togglePosition="floating">
          <SideNavbar.Navbar mainTogglePosition="bottom">
            <SideNavbar.Navbar.Item icon={<div />} label="Home" id="home" />
          </SideNavbar.Navbar>
        </SideNavbar>,
      );
      const toggle = findMainToggle(container);
      expect(toggle).not.toBeNull();
      expect(toggle).toHaveAttribute("data-position", "bottom");
    });

    // Caso 3 — no override falls back to the global toggle context.
    it("no override → toggle uses SideNavbar root's togglePosition", () => {
      const { container } = render(
        <SideNavbar showToggle togglePosition="top">
          <SideNavbar.Navbar>
            <SideNavbar.Navbar.Item icon={<div />} label="Home" id="home" />
          </SideNavbar.Navbar>
        </SideNavbar>,
      );
      expect(findMainToggle(container)).toHaveAttribute("data-position", "top");
    });

    // Caso 4 — multi-Navbar with overrides: single toggle from the
    // first child in tree order, plus dev warning.
    it("multiple Navbars with overrides → single toggle from first; dev warning fires", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const { container } = render(
        <SideNavbar showToggle togglePosition="floating">
          <SideNavbar.Navbar mainTogglePosition="top">
            <SideNavbar.Navbar.Item icon={<div />} label="A" id="a" />
          </SideNavbar.Navbar>
          <SideNavbar.Navbar mainTogglePosition="bottom">
            <SideNavbar.Navbar.Item icon={<div />} label="B" id="b" />
          </SideNavbar.Navbar>
        </SideNavbar>,
      );
      const toggles = container.querySelectorAll("aside [data-position]");
      expect(toggles).toHaveLength(1);
      expect(toggles[0]).toHaveAttribute("data-position", "top");
      // toHaveBeenCalledWith (NOT exact count: StrictMode double-renders
      // would inflate count; the property we care about is "warning
      // surfaced", not arity).
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "multiple <SideNavbar.Navbar> children set main-toggle overrides",
        ),
      );
      consoleErrorSpy.mockRestore();
    });

    // Caso 5 — mixed (one override, one without): toggle from the
    // overriding Navbar, no multi-override warning.
    it("mixed (one override, one without) → toggle from overriding Navbar; no warning", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const { container } = render(
        <SideNavbar showToggle togglePosition="floating">
          <SideNavbar.Navbar mainTogglePosition="bottom">
            <SideNavbar.Navbar.Item icon={<div />} label="A" id="a" />
          </SideNavbar.Navbar>
          <SideNavbar.Navbar>
            <SideNavbar.Navbar.Item icon={<div />} label="B" id="b" />
          </SideNavbar.Navbar>
        </SideNavbar>,
      );
      expect(findMainToggle(container)).toHaveAttribute(
        "data-position",
        "bottom",
      );
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(
        expect.stringContaining(
          "multiple <SideNavbar.Navbar> children set main-toggle overrides",
        ),
      );
      consoleErrorSpy.mockRestore();
    });

    // Caso 6 — DOM guard: toggle always lives in <aside>, never in
    // <nav>. Pins the property against regression to a model-B-style
    // implementation that would relocate the DOM.
    it("main toggle always lives in <aside>, never in <nav>", () => {
      const { container } = render(
        <SideNavbar showToggle togglePosition="floating">
          <SideNavbar.Navbar mainTogglePosition="bottom">
            <SideNavbar.Navbar.Item icon={<div />} label="Home" id="home" />
          </SideNavbar.Navbar>
        </SideNavbar>,
      );
      const toggle = findMainToggle(container);
      expect(toggle).not.toBeNull();
      const asideAncestor = toggle!.closest("aside");
      const navAncestor = toggle!.closest("nav");
      expect(asideAncestor).not.toBeNull();
      if (navAncestor !== null) {
        expect(navAncestor.contains(toggle!)).toBe(false);
      }
    });

    // Caso 7 — render-driven guard: override applies synchronously on
    // first render, without any waitFor / act / effect running. Traps
    // any regression to an effect-driven implementation that would
    // reintroduce SSR hydration mismatches.
    it("override applies synchronously on first render (no waitFor / no effects required)", () => {
      const { container } = render(
        <SideNavbar showToggle togglePosition="floating">
          <SideNavbar.Navbar mainTogglePosition="bottom">
            <SideNavbar.Navbar.Item icon={<div />} label="Home" id="home" />
          </SideNavbar.Navbar>
        </SideNavbar>,
      );
      // Query runs immediately after render() — no await, no waitFor,
      // no act(). If the implementation needed an effect to resolve
      // the override, this assertion would fail: the toggle would
      // still show togglePosition="floating" on first commit and only
      // flip to "bottom" after the effect ran.
      const toggle = findMainToggle(container);
      expect(toggle).toHaveAttribute("data-position", "bottom");
    });

    // Caso 8 — wrapper-nesting guard: a Navbar wrapped in another
    // element is NOT inspected (only direct children are). The
    // override falls back to global, AND dev mode warns about the
    // miswiring so the failure isn't silent.
    it("Navbar override wrapped inside a non-Navbar element → fallback + dev warning", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const { container } = render(
        <SideNavbar showToggle togglePosition="top">
          <div data-testid="wrapper">
            <SideNavbar.Navbar mainTogglePosition="bottom">
              <SideNavbar.Navbar.Item icon={<div />} label="Home" id="home" />
            </SideNavbar.Navbar>
          </div>
        </SideNavbar>,
      );
      // Fallback to the root's togglePosition — the override was not
      // picked up because the Navbar isn't a direct child.
      expect(findMainToggle(container)).toHaveAttribute("data-position", "top");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "a <SideNavbar.Navbar> with a main-toggle override appears nested inside a wrapper element",
        ),
      );
      consoleErrorSpy.mockRestore();
    });
  });
});

import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import Tooltip from "./Tooltip";
import Button from "../Button/Button";

describe("Tooltip", () => {
  describe("rendering", () => {
    it("renders children", () => {
      render(
        <Tooltip content="Tooltip content">
          <Button>Button</Button>
        </Tooltip>,
      );

      expect(screen.getByText("Button")).toBeInTheDocument();
    });

    it("does not render the tooltip body until shown", () => {
      render(
        <Tooltip content="Tooltip content">
          <Button>Button</Button>
        </Tooltip>,
      );

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("wraps children in a relative span by default", () => {
      const { container } = render(
        <Tooltip content="x">
          <Button>Button</Button>
        </Tooltip>,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("relative");
      expect(wrapper).toHaveClass("inline-block");
    });

    it("uses static positioning when preservePositioning is true", () => {
      const { container } = render(
        <Tooltip content="x" preservePositioning>
          <Button>Button</Button>
        </Tooltip>,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("static");
      expect(wrapper).not.toHaveClass("relative");
    });
  });

  describe("hover interaction", () => {
    it("shows tooltip on hover", async () => {
      render(
        <Tooltip content="Tooltip content" delay={0}>
          <Button>Button</Button>
        </Tooltip>,
      );

      const button = screen.getByText("Button");
      fireEvent.mouseEnter(button);

      await waitFor(() => {
        expect(screen.getByText("Tooltip content")).toBeInTheDocument();
      });
    });

    it("hides tooltip on mouse leave", async () => {
      render(
        <Tooltip content="Tooltip content" delay={0}>
          <Button>Button</Button>
        </Tooltip>,
      );

      const button = screen.getByText("Button");
      fireEvent.mouseEnter(button);

      await waitFor(() => {
        expect(screen.getByText("Tooltip content")).toBeInTheDocument();
      });

      fireEvent.mouseLeave(button);

      await waitFor(() => {
        expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
      });
    });

    it("respects the delay before showing on hover", async () => {
      vi.useFakeTimers();
      try {
        render(
          <Tooltip content="Tooltip content" delay={500}>
            <Button>Button</Button>
          </Tooltip>,
        );

        fireEvent.mouseEnter(screen.getByText("Button"));
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

        act(() => {
          vi.advanceTimersByTime(499);
        });
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

        act(() => {
          vi.advanceTimersByTime(1);
        });
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });

    it("cancels the pending show when mouse leaves before the delay elapses", () => {
      vi.useFakeTimers();
      try {
        render(
          <Tooltip content="Tooltip content" delay={500}>
            <Button>Button</Button>
          </Tooltip>,
        );

        const button = screen.getByText("Button");
        fireEvent.mouseEnter(button);
        fireEvent.mouseLeave(button);
        act(() => {
          vi.advanceTimersByTime(1000);
        });

        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe("keyboard interaction", () => {
    it("shows tooltip immediately on focus (no delay for keyboard users)", () => {
      render(
        <Tooltip content="Tooltip content" delay={500}>
          <Button>Button</Button>
        </Tooltip>,
      );

      fireEvent.focus(screen.getByText("Button"));
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("hides tooltip on blur", () => {
      render(
        <Tooltip content="Tooltip content">
          <Button>Button</Button>
        </Tooltip>,
      );

      const button = screen.getByText("Button");
      fireEvent.focus(button);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      fireEvent.blur(button);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("closes the tooltip on Escape", () => {
      render(
        <Tooltip content="Tooltip content">
          <Button>Button</Button>
        </Tooltip>,
      );

      const button = screen.getByText("Button");
      fireEvent.focus(button);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      fireEvent.keyDown(button, { key: "Escape" });
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("renders the tooltip popup with role=tooltip", () => {
      render(
        <Tooltip content="Help" delay={0}>
          <Button>Button</Button>
        </Tooltip>,
      );

      fireEvent.focus(screen.getByText("Button"));
      const tip = screen.getByRole("tooltip");
      expect(tip).toHaveTextContent("Help");
      expect(tip).toHaveAttribute("aria-live", "polite");
    });

    it("links the trigger to the tooltip via aria-describedby while visible", () => {
      render(
        <Tooltip content="Help">
          <Button>Button</Button>
        </Tooltip>,
      );

      const button = screen.getByText("Button");
      expect(button).not.toHaveAttribute("aria-describedby");

      fireEvent.focus(button);
      const describedBy = button.getAttribute("aria-describedby");
      expect(describedBy).toBeTruthy();
      expect(screen.getByRole("tooltip")).toHaveAttribute("id", describedBy!);
    });
  });

  describe("position variants", () => {
    const positions = ["top", "bottom", "left", "right"] as const;

    it.each(positions)("renders a tooltip for position=%s", (position) => {
      render(
        <Tooltip content="x" position={position}>
          <Button>Button</Button>
        </Tooltip>,
      );

      fireEvent.focus(screen.getByText("Button"));
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  describe("existing handler preservation", () => {
    it("does not swallow the original onMouseEnter / onMouseLeave on the child", () => {
      const onEnter = vi.fn();
      const onLeave = vi.fn();
      render(
        <Tooltip content="x" delay={0}>
          <Button onMouseEnter={onEnter} onMouseLeave={onLeave}>
            Button
          </Button>
        </Tooltip>,
      );

      const button = screen.getByText("Button");
      fireEvent.mouseEnter(button);
      fireEvent.mouseLeave(button);
      expect(onEnter).toHaveBeenCalledTimes(1);
      expect(onLeave).toHaveBeenCalledTimes(1);
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to the wrapper div (the root element)", () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Tooltip ref={ref} content="x">
          <Button>Button</Button>
        </Tooltip>,
      );
      // The wrapper sits outside the trigger; it's where layout
      // anchoring (relative / static) happens. Consumers reaching
      // for the ref typically want to measure / position around it.
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.classList.contains("inline-block")).toBe(true);
    });

    it("forwards a consumer ref on the trigger child to the underlying element", () => {
      // Tooltip clones the trigger child to attach mouse/focus handlers
      // and merges its own internal ref with whatever the consumer
      // supplied. The merge happens through mergeRefs(triggerRef,
      // existingRef) — this test guards against a future cloneElement
      // refactor silently dropping the existing-ref leg.
      const triggerRef = createRef<HTMLButtonElement>();
      render(
        <Tooltip content="x">
          <Button ref={triggerRef}>Button</Button>
        </Tooltip>,
      );
      expect(triggerRef.current).not.toBeNull();
      expect(triggerRef.current).toBe(screen.getByText("Button"));
    });
  });

  describe("ReactNode content", () => {
    it("renders a plain string content (backward compat)", () => {
      render(
        <Tooltip content="Simple string" delay={0}>
          <Button>Hover me</Button>
        </Tooltip>,
      );
      fireEvent.focus(screen.getByText("Hover me"));
      expect(screen.getByRole("tooltip")).toHaveTextContent("Simple string");
    });

    it("renders a ReactNode content with rich markup", () => {
      render(
        <Tooltip
          content={
            <>
              <strong>Title</strong>
              <p>Description paragraph</p>
              <a href="#">Link</a>
            </>
          }
          delay={0}
        >
          <Button>Hover me</Button>
        </Tooltip>,
      );
      fireEvent.focus(screen.getByText("Hover me"));
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip.querySelector("strong")).toHaveTextContent("Title");
      expect(tooltip.querySelector("p")).toHaveTextContent(
        "Description paragraph",
      );
      expect(tooltip.querySelector("a")).toHaveTextContent("Link");
    });
  });

  describe("interactive mode", () => {
    it("stays visible when mouse enters the tooltip panel (grace period bridged)", async () => {
      vi.useFakeTimers();
      try {
        render(
          <Tooltip content="Panel content" delay={0} interactive>
            <Button>Trigger</Button>
          </Tooltip>,
        );
        const button = screen.getByText("Trigger");

        // Show tooltip
        fireEvent.mouseEnter(button);
        act(() => vi.advanceTimersByTime(0));
        expect(screen.getByRole("tooltip")).toBeInTheDocument();

        // Mouse leaves trigger — grace period starts (150ms)
        fireEvent.mouseLeave(button);
        // Panel not gone yet
        expect(screen.getByRole("tooltip")).toBeInTheDocument();

        // Mouse enters the panel before grace period expires
        fireEvent.mouseEnter(screen.getByRole("tooltip"));
        act(() => vi.advanceTimersByTime(200));

        // Panel should still be visible (grace-period timer was cancelled)
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });

    it("closes when mouse leaves the tooltip panel in interactive mode", async () => {
      render(
        <Tooltip content="Panel content" delay={0} interactive>
          <Button>Trigger</Button>
        </Tooltip>,
      );
      const button = screen.getByText("Trigger");

      fireEvent.mouseEnter(button);
      await waitFor(() =>
        expect(screen.getByRole("tooltip")).toBeInTheDocument(),
      );

      const panel = screen.getByRole("tooltip");
      fireEvent.mouseEnter(panel);
      fireEvent.mouseLeave(panel);

      await waitFor(() =>
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument(),
      );
    });

    it("stays open when focus moves from trigger to a link inside the tooltip", () => {
      render(
        <Tooltip content={<a href="#">Inside link</a>} delay={0} interactive>
          <Button>Trigger</Button>
        </Tooltip>,
      );
      const button = screen.getByText("Trigger");
      fireEvent.focus(button);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      const link = screen.getByRole("link", { name: "Inside link" });
      // Simulate blur where relatedTarget is the link inside the tooltip
      fireEvent.blur(button, { relatedTarget: link });
      // Tooltip must remain open because focus moved into the panel
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("closes when focus leaves both trigger and tooltip in interactive mode", () => {
      render(
        <>
          <Tooltip content={<a href="#">Inside link</a>} delay={0} interactive>
            <Button>Trigger</Button>
          </Tooltip>
          <button>Outside</button>
        </>,
      );
      const button = screen.getByText("Trigger");
      fireEvent.focus(button);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      const outside = screen.getByText("Outside");
      fireEvent.blur(button, { relatedTarget: outside });
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });
});

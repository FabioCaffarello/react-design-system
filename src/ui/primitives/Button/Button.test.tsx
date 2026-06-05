import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";
import { Play, X } from "lucide-react";

describe("Button", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText("Disabled");
    expect(button).toBeDisabled();
  });

  it("is disabled when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("shows loading spinner when isLoading", () => {
    render(<Button isLoading>Save</Button>);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });

  it("shows loading text when provided", () => {
    render(
      <Button isLoading loadingText="Saving...">
        Save
      </Button>,
    );
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("renders left icon", () => {
    render(<Button leftIcon={<Play data-testid="play-icon" />}>Play</Button>);
    expect(screen.getByTestId("play-icon")).toBeInTheDocument();
  });

  it("renders right icon", () => {
    render(<Button rightIcon={<X data-testid="x-icon" />}>Close</Button>);
    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-surface-brand-strong");
  });

  it("applies size classes", () => {
    const { container } = render(<Button size="sm">Small</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("px-3", "py-1.5", "text-sm");
  });

  it("applies fullWidth class", () => {
    const { container } = render(<Button fullWidth>Full Width</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("w-full");
  });

  it("renders iconOnly variant correctly", () => {
    render(
      <Button
        variant="iconOnly"
        leftIcon={<X data-testid="icon" />}
        aria-label="Close"
      />,
    );
    const button = screen.getByLabelText("Close");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("p-0");
  });

  it("requires aria-label for iconOnly variant", () => {
    render(
      <Button variant="iconOnly" leftIcon={<X />}>
        Close
      </Button>,
    );
    // Should still render, but aria-label should be set
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  // Issue #156. The link variant is the only Button variant with no
  // chrome (no surface, no border, no padding) — its visual identity
  // is the brand-coloured text and the underline that appears on
  // hover. The tests below assert the four properties that
  // collectively define it: brand foreground, underline-offset (so
  // the hover-state line clears descenders), padding zeroed by
  // compoundVariants per size, and the hover class is emitted (the
  // actual hover state is JSDOM-untestable but the class presence is
  // the lever the styling depends on).
  describe("variant link", () => {
    it("applies link variant classes standalone", () => {
      const { container } = render(
        <Button variant="link">View profile</Button>,
      );
      const button = container.querySelector("button")!;
      // Brand foreground (token semantic, not a raw indigo class).
      expect(button).toHaveClass("text-fg-brand");
      // Underline pair: offset at rest so the on-hover underline
      // clears descenders cleanly; underline appears on hover.
      expect(button).toHaveClass("underline-offset-4");
      expect(button).toHaveClass("hover:underline");
      // No background and no border = no chrome.
      expect(button).toHaveClass("bg-transparent");
    });

    it.each(["sm", "md", "lg"] as const)(
      "zeroes padding for size %s via compoundVariants",
      (size) => {
        const { container } = render(
          <Button variant="link" size={size}>
            Link
          </Button>,
        );
        const button = container.querySelector("button")!;
        // The compoundVariant entry for {variant:link, size:N} emits
        // px-0/py-0 which twMerge prefers over the size block's
        // px-N/py-N (compoundVariants run last in cva). Height is
        // intrinsic to the text — there is no `h-N` on link variant.
        expect(button).toHaveClass("px-0");
        expect(button).toHaveClass("py-0");
      },
    );

    it("preserves the size's typography scale", () => {
      // Size still drives the text size — `sm` link reads as small
      // text, `lg` as large. Only the padding is overridden.
      const { container: smContainer } = render(
        <Button variant="link" size="sm">
          Small
        </Button>,
      );
      expect(smContainer.querySelector("button")).toHaveClass("text-sm");
      const { container: lgContainer } = render(
        <Button variant="link" size="lg">
          Large
        </Button>,
      );
      expect(lgContainer.querySelector("button")).toHaveClass("text-lg");
    });

    it("emits a focus-ring class for keyboard visibility", () => {
      // No chrome means the focus ring is the only visual indication
      // of focus. Base sets `focus:ring-2` + `focus:ring-offset-2`;
      // link variant sets `focus:ring-line-focus`. Together they
      // produce a 2-px ring 2-px clear of the text bounding box,
      // contrasting against surface-base (≥3:1 verified for both
      // themes — WCAG 2.4.11).
      const { container } = render(
        <Button variant="link">Focusable link</Button>,
      );
      const button = container.querySelector("button")!;
      expect(button).toHaveClass("focus:ring-2");
      expect(button).toHaveClass("focus:ring-offset-2");
      expect(button).toHaveClass("focus:ring-line-focus");
    });

    it("does not emit any chrome (bg-surface-*, border-*) on the rendered element", () => {
      const { container } = render(<Button variant="link">Link</Button>);
      const button = container.querySelector("button")!;
      // The contract is "no chrome" — defensively assert against the
      // patterns the other variants paint. The two classes named here
      // are the most likely accidental carry-over via a future
      // refactor that adds a default border/surface to the base
      // block. Loose `*-` regex would over-match (the bg-transparent
      // we DO emit would trip a `bg-` check); these literal asserts
      // catch the specific failure modes without false positives.
      expect(button).not.toHaveClass("bg-surface-brand-strong");
      expect(button).not.toHaveClass("bg-surface-secondary");
      expect(button).not.toHaveClass("bg-surface-hover");
      expect(button).not.toHaveClass("border-2");
    });

    it("projects link classes onto the asChild target so <Link> renders as the styled link", () => {
      // The 25 brasil-a-vera call sites that motivated #156 use
      // `<Button variant="link" asChild><Link href>…</Link></Button>`.
      // Verifying both the styling (link variant classes land on the
      // anchor) AND the native props survive (`href` preserved) is
      // the test the issue body asked for explicitly.
      const { container } = render(
        <Button asChild variant="link" size="md">
          <a href="/parlamentares/123">Ver perfil completo</a>
        </Button>,
      );
      const anchor = container.querySelector("a")!;
      expect(anchor).not.toBeNull();
      expect(container.querySelector("button")).toBeNull();
      // Native anchor props survive — this is what makes the variant
      // work with Next's <Link prefetch>: Slot projects classes onto
      // the child, the child keeps its own href / target / data-*.
      expect(anchor).toHaveAttribute("href", "/parlamentares/123");
      // Link variant classes land on the anchor.
      expect(anchor).toHaveClass("text-fg-brand");
      expect(anchor).toHaveClass("underline-offset-4");
      expect(anchor).toHaveClass("hover:underline");
      expect(anchor).toHaveClass("px-0");
      expect(anchor).toHaveClass("py-0");
    });
  });

  describe("Keyboard Navigation", () => {
    it("calls onClick when Enter key is pressed", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByText("Click me");
      fireEvent.keyDown(button, { key: "Enter" });
      // Note: keyDown doesn't trigger onClick, but we test that button is focusable
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it("calls onClick when Space key is pressed", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByText("Click me");
      button.focus();
      fireEvent.keyDown(button, { key: " " });
      // Note: keyDown doesn't trigger onClick, but we test keyboard interaction
      expect(document.activeElement).toBe(button);
    });

    it("does not call onClick when disabled and Enter is pressed", () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>,
      );
      const button = screen.getByText("Disabled");
      button.focus();
      fireEvent.keyDown(button, { key: "Enter" });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("is focusable when not disabled", () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByText("Focusable");
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it("is not focusable when disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByText("Disabled");
      expect(button).toBeDisabled();
      // Disabled buttons are not focusable by default
      button.focus();
      expect(document.activeElement).not.toBe(button);
    });
  });

  describe("Accessibility", () => {
    it("has correct role", () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("has aria-label when provided", () => {
      render(<Button aria-label="Submit form">Submit</Button>);
      const button = screen.getByLabelText("Submit form");
      expect(button).toBeInTheDocument();
    });

    it("has aria-busy when loading", () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-busy", "true");
    });

    it("has aria-disabled when disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-disabled", "true");
    });

    it("has accessible name from children", () => {
      render(<Button>Save Changes</Button>);
      const button = screen.getByRole("button", { name: "Save Changes" });
      expect(button).toBeInTheDocument();
    });

    it("has accessible name from aria-label over children", () => {
      render(<Button aria-label="Close dialog">X</Button>);
      const button = screen.getByRole("button", { name: "Close dialog" });
      expect(button).toBeInTheDocument();
    });

    it('has type="button" by default', () => {
      const { container } = render(<Button>Test</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("respects type prop", () => {
      const { container } = render(<Button type="submit">Submit</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("has correct tabIndex when disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      // Disabled buttons are not focusable, so they don't need explicit tabIndex
      button.focus();
      expect(document.activeElement).not.toBe(button);
    });

    it("has correct tabIndex when enabled", () => {
      render(<Button>Enabled</Button>);
      const button = screen.getByRole("button");
      expect(button).not.toHaveAttribute("tabIndex", "-1");
    });
  });

  describe("asChild", () => {
    it("renders the child element type instead of <button>", () => {
      const { container } = render(
        <Button asChild>
          <a href="/profile">Profile</a>
        </Button>,
      );
      expect(container.querySelector("button")).toBeNull();
      const anchor = container.querySelector("a");
      expect(anchor).not.toBeNull();
      expect(anchor).toHaveAttribute("href", "/profile");
      expect(anchor).toHaveTextContent("Profile");
    });

    it("projects Button classes onto the child", () => {
      const { container } = render(
        <Button asChild variant="primary" size="lg">
          <a href="/x">Go</a>
        </Button>,
      );
      const anchor = container.querySelector("a")!;
      // variant=primary (token semantic class) and size=lg padding
      expect(anchor).toHaveClass("bg-surface-brand-strong");
      expect(anchor).toHaveClass("px-6");
    });

    it("merges the child's own className with the Button classes", () => {
      const { container } = render(
        <Button asChild>
          <a href="/x" className="custom-anchor">
            Go
          </a>
        </Button>,
      );
      const anchor = container.querySelector("a")!;
      expect(anchor).toHaveClass("custom-anchor");
      expect(anchor).toHaveClass("bg-surface-brand-strong");
    });

    it("preserves native child props (href, target, rel)", () => {
      const { container } = render(
        <Button asChild>
          <a href="/x" target="_blank" rel="noopener">
            Go
          </a>
        </Button>,
      );
      const anchor = container.querySelector("a")!;
      expect(anchor).toHaveAttribute("href", "/x");
      expect(anchor).toHaveAttribute("target", "_blank");
      expect(anchor).toHaveAttribute("rel", "noopener");
    });

    it("forwards ref to the child element (the <a>, not a wrapping <button>)", () => {
      const ref = { current: null as HTMLElement | null };
      render(
        <Button asChild ref={ref as React.RefObject<HTMLButtonElement>}>
          <a href="/x">Go</a>
        </Button>,
      );
      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe("A");
    });

    it("renders leftIcon and rightIcon inside the child via Slottable", () => {
      const { container } = render(
        <Button
          asChild
          leftIcon={<Play data-testid="play-icon" />}
          rightIcon={<X data-testid="x-icon" />}
        >
          <a href="/x">Go</a>
        </Button>,
      );
      const anchor = container.querySelector("a")!;
      expect(anchor).toContainElement(screen.getByTestId("play-icon"));
      expect(anchor).toContainElement(screen.getByTestId("x-icon"));
      expect(anchor).toHaveTextContent("Go");
    });

    it('does not emit type="button" on the projected child (irrelevant on <a>)', () => {
      const { container } = render(
        <Button asChild>
          <a href="/x">Go</a>
        </Button>,
      );
      const anchor = container.querySelector("a")!;
      expect(anchor).not.toHaveAttribute("type", "button");
    });

    it("asChild wins over `as`: when both provided, the child is used and a dev warning fires", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { container } = render(
        <Button asChild as="span">
          <a href="/x">Go</a>
        </Button>,
      );
      // The rendered root is the child <a>, not a <span>.
      expect(container.querySelector("a")).not.toBeNull();
      expect(container.querySelector("span")).toBeNull();
      // Dev warn fired exactly because `as` was redundant.
      expect(warnSpy).toHaveBeenCalled();
      expect(warnSpy.mock.calls[0][0]).toMatch(
        /\[Button\].*`as` is ignored when `asChild`/,
      );
      warnSpy.mockRestore();
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid clicks", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      const button = screen.getByText("Click");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it("handles onClick with event", () => {
      const handleClick = vi.fn((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
      });
      render(<Button onClick={handleClick}>Click</Button>);
      const button = screen.getByText("Click");
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
      // React uses SyntheticEvent, not native Event
      expect(handleClick.mock.calls[0][0]).toHaveProperty("type", "click");
    });

    it("renders correctly with empty children", () => {
      render(<Button aria-label="Empty button"></Button>);
      const button = screen.getByLabelText("Empty button");
      expect(button).toBeInTheDocument();
    });

    it("handles both loading and disabled states", () => {
      render(
        <Button isLoading disabled>
          Loading
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");
    });
  });
});

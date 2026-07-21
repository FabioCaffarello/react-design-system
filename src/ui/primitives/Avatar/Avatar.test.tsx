import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Avatar from "./Avatar";
import { AvatarGroup } from "./AvatarGroup";

describe("Avatar", () => {
  it("renders avatar with fallback text", () => {
    render(<Avatar fallback="JD" alt="John Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders avatar with image when src is provided", () => {
    render(<Avatar src="/test.jpg" alt="Test User" />);
    const img = screen.getByAltText("Test User");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test.jpg");
  });

  it("shows fallback when image fails to load", async () => {
    const { container } = render(
      <Avatar src="/invalid.jpg" fallback="JD" alt="John Doe" />,
    );

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();

    if (img) {
      fireEvent.error(img);
    }

    await waitFor(() => {
      expect(screen.getByText("JD")).toBeInTheDocument();
    });
  });

  // Regression: issue #263 — an eager, above-the-fold image can finish loading
  // (or fail) BEFORE React hydrates and attaches onLoad/onError. Those events
  // fire into the void, so the component must sync to the <img>'s real
  // readiness on mount instead of waiting for events that will never come.
  describe("SSR hydration race (issue #263)", () => {
    it("reveals an image that completed loading before mount (no load event)", () => {
      const completeSpy = vi
        .spyOn(HTMLImageElement.prototype, "complete", "get")
        .mockReturnValue(true);
      const naturalWidthSpy = vi
        .spyOn(HTMLImageElement.prototype, "naturalWidth", "get")
        .mockReturnValue(120);

      const { container } = render(<Avatar src="/loaded.jpg" alt="User" />);
      const img = container.querySelector("img");

      // No load event was fired — yet the image must be revealed, not stuck at
      // opacity-0.
      expect(img).toHaveClass("opacity-100");
      expect(img).not.toHaveClass("opacity-0");

      completeSpy.mockRestore();
      naturalWidthSpy.mockRestore();
    });

    it("shows the fallback for an image that failed before mount (no error event)", () => {
      const completeSpy = vi
        .spyOn(HTMLImageElement.prototype, "complete", "get")
        .mockReturnValue(true);
      const naturalWidthSpy = vi
        .spyOn(HTMLImageElement.prototype, "naturalWidth", "get")
        .mockReturnValue(0);

      render(<Avatar src="/broken.jpg" fallback="JD" alt="John Doe" />);

      // complete=true with naturalWidth=0 means the load failed; the initials
      // fallback must appear even though no error event fired.
      expect(screen.getByText("JD")).toBeInTheDocument();

      completeSpy.mockRestore();
      naturalWidthSpy.mockRestore();
    });

    it("re-attempts loading when src changes from a broken to a valid image", async () => {
      const { container, rerender } = render(
        <Avatar src="/broken.jpg" fallback="JD" alt="User" />,
      );
      const img = container.querySelector("img");
      if (img) fireEvent.error(img);
      await waitFor(() => expect(screen.getByText("JD")).toBeInTheDocument());

      // Swapping to a valid src must reset the error state so the <img> renders
      // again instead of being permanently stuck on the fallback.
      rerender(<Avatar src="/valid.jpg" fallback="JD" alt="User" />);
      expect(container.querySelector("img")).toBeInTheDocument();
      expect(container.querySelector("img")).toHaveAttribute(
        "src",
        "/valid.jpg",
      );
    });
  });

  describe("size prop", () => {
    it("applies correct size classes for all sizes", () => {
      const { container, rerender } = render(
        <Avatar fallback="JD" size="xs" />,
      );
      let avatar = container.querySelector('div[role="img"]');
      expect(avatar).toHaveClass("h-6", "w-6", "text-xs");

      rerender(<Avatar fallback="JD" size="sm" />);
      avatar = container.querySelector('div[role="img"]');
      expect(avatar).toHaveClass("h-8", "w-8", "text-sm");

      rerender(<Avatar fallback="JD" size="md" />);
      avatar = container.querySelector('div[role="img"]');
      expect(avatar).toHaveClass("h-10", "w-10", "text-base");

      rerender(<Avatar fallback="JD" size="lg" />);
      avatar = container.querySelector('div[role="img"]');
      expect(avatar).toHaveClass("h-12", "w-12", "text-lg");

      rerender(<Avatar fallback="JD" size="xl" />);
      avatar = container.querySelector('div[role="img"]');
      expect(avatar).toHaveClass("h-16", "w-16", "text-xl");

      rerender(<Avatar fallback="JD" size="2xl" />);
      avatar = container.querySelector('div[role="img"]');
      expect(avatar).toHaveClass("h-24", "w-24", "text-3xl");

      rerender(<Avatar fallback="JD" size="3xl" />);
      avatar = container.querySelector('div[role="img"]');
      expect(avatar).toHaveClass("h-28", "w-28", "text-4xl");
    });

    it("md is the default size", () => {
      const { container } = render(<Avatar fallback="JD" />);
      const avatar = container.querySelector('div[role="img"]');
      expect(avatar).toHaveClass("h-10", "w-10");
    });
  });

  it("applies correct variant classes", () => {
    const { container, rerender } = render(
      <Avatar fallback="JD" variant="circle" />,
    );
    let avatar = container.querySelector('div[role="img"]');
    expect(avatar).toHaveClass("rounded-full");

    rerender(<Avatar fallback="JD" variant="square" />);
    avatar = container.querySelector('div[role="img"]');
    expect(avatar).toHaveClass("rounded-none");

    rerender(<Avatar fallback="JD" variant="rounded" />);
    avatar = container.querySelector('div[role="img"]');
    expect(avatar).toHaveClass("rounded-md");
  });

  it("truncates fallback text to 2 characters", () => {
    render(<Avatar fallback="John Doe" />);
    expect(screen.getByText("JO")).toBeInTheDocument();
  });

  it("shows question mark when no fallback is provided", () => {
    render(<Avatar alt="User" />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("has correct aria-label", () => {
    render(<Avatar fallback="JD" alt="John Doe" />);
    const avatar = screen.getByLabelText("John Doe");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("role", "img");
  });

  it("uses custom aria-label when provided", () => {
    render(<Avatar fallback="JD" aria-label="Custom label" />);
    const avatar = screen.getByLabelText("Custom label");
    expect(avatar).toBeInTheDocument();
  });

  it("uses default aria-label when neither alt nor aria-label is provided", () => {
    render(<Avatar fallback="JD" />);
    const avatar = screen.getByLabelText("User avatar");
    expect(avatar).toBeInTheDocument();
  });

  it("handles ReactNode fallback", () => {
    render(
      <Avatar fallback={<span data-testid="custom-fallback">Custom</span>} />,
    );
    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Avatar fallback="JD" className="custom-class" />,
    );
    const avatar = container.querySelector('div[role="img"]');
    expect(avatar).toHaveClass("custom-class");
  });

  it("passes through HTML attributes", () => {
    const { container } = render(<Avatar fallback="JD" data-testid="avatar" />);
    const avatar = container.querySelector('[data-testid="avatar"]');
    expect(avatar).toBeInTheDocument();
  });

  describe("loading prop", () => {
    it("default loading is eager (no attribute or attribute='eager')", () => {
      const { container } = render(<Avatar src="/user.jpg" alt="User" />);
      const img = container.querySelector("img");
      // Browsers treat "eager" as the default; both absent and explicit "eager"
      // are equivalent. We just verify "lazy" is NOT set by default.
      expect(img?.getAttribute("loading")).not.toBe("lazy");
    });

    it("loading='lazy' is forwarded to the <img> element", () => {
      const { container } = render(
        <Avatar src="/user.jpg" alt="User" loading="lazy" />,
      );
      const img = container.querySelector("img");
      expect(img).toHaveAttribute("loading", "lazy");
    });

    it("loading='eager' is forwarded to the <img> element", () => {
      const { container } = render(
        <Avatar src="/user.jpg" alt="User" loading="eager" />,
      );
      const img = container.querySelector("img");
      expect(img).toHaveAttribute("loading", "eager");
    });

    it("loading has no effect when src is absent (no img rendered)", () => {
      // When there is no src the <img> is not mounted, so loading is a no-op.
      const { container } = render(<Avatar fallback="JD" loading="lazy" />);
      expect(container.querySelector("img")).not.toBeInTheDocument();
      // Fallback is shown instead.
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("loading does NOT land on the wrapper <div>", () => {
      // The wrapper spreads ...props (HTMLDivElement attrs). `loading` must
      // NOT leak there — it's a named prop consumed before the spread.
      const { container } = render(
        <Avatar src="/user.jpg" alt="User" loading="lazy" />,
      );
      const wrapper = container.querySelector('div[role="img"]');
      expect(wrapper).not.toHaveAttribute("loading");
    });
  });
});

describe("AvatarGroup", () => {
  it("renders multiple avatars", () => {
    render(
      <AvatarGroup>
        <Avatar fallback="U1" alt="User 1" />
        <Avatar fallback="U2" alt="User 2" />
        <Avatar fallback="U3" alt="User 3" />
      </AvatarGroup>,
    );

    expect(screen.getByText("U1")).toBeInTheDocument();
    expect(screen.getByText("U2")).toBeInTheDocument();
    expect(screen.getByText("U3")).toBeInTheDocument();
  });

  it("shows overflow indicator when max is exceeded", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar fallback="U1" alt="User 1" />
        <Avatar fallback="U2" alt="User 2" />
        <Avatar fallback="U3" alt="User 3" />
        <Avatar fallback="U4" alt="User 4" />
      </AvatarGroup>,
    );

    expect(screen.getByText("U1")).toBeInTheDocument();
    expect(screen.getByText("U2")).toBeInTheDocument();
    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.queryByText("U3")).not.toBeInTheDocument();
    expect(screen.queryByText("U4")).not.toBeInTheDocument();
  });

  it("applies correct spacing classes", () => {
    const { container, rerender } = render(
      <AvatarGroup spacing="none">
        <Avatar fallback="U1" />
        <Avatar fallback="U2" />
      </AvatarGroup>,
    );
    let group = container.querySelector('div[role="group"]');
    expect(group).not.toHaveClass("-space-x-1", "-space-x-2", "-space-x-3");

    rerender(
      <AvatarGroup spacing="sm">
        <Avatar fallback="U1" />
        <Avatar fallback="U2" />
      </AvatarGroup>,
    );
    group = container.querySelector('div[role="group"]');
    expect(group).toHaveClass("-space-x-1");

    rerender(
      <AvatarGroup spacing="md">
        <Avatar fallback="U1" />
        <Avatar fallback="U2" />
      </AvatarGroup>,
    );
    group = container.querySelector('div[role="group"]');
    expect(group).toHaveClass("-space-x-2");

    rerender(
      <AvatarGroup spacing="lg">
        <Avatar fallback="U1" />
        <Avatar fallback="U2" />
      </AvatarGroup>,
    );
    group = container.querySelector('div[role="group"]');
    expect(group).toHaveClass("-space-x-3");
  });

  it("has correct aria-label with avatar count", () => {
    render(
      <AvatarGroup>
        <Avatar fallback="U1" />
        <Avatar fallback="U2" />
        <Avatar fallback="U3" />
      </AvatarGroup>,
    );

    const group = screen.getByLabelText("3 avatars");
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute("role", "group");
  });

  it("applies size and variant to overflow avatar", () => {
    render(
      <AvatarGroup max={1} size="lg" variant="square">
        <Avatar fallback="U1" />
        <Avatar fallback="U2" />
      </AvatarGroup>,
    );

    const overflowAvatar = screen.getByText("+1");
    const overflowContainer = overflowAvatar.closest('div[role="img"]');
    expect(overflowContainer).toHaveClass(
      "h-12",
      "w-12",
      "text-lg",
      "rounded-none",
    );
  });

  it("handles empty children gracefully", () => {
    const { container } = render(<AvatarGroup>{null}</AvatarGroup>);
    const group = container.querySelector('div[role="group"]');
    expect(group).toBeInTheDocument();
    expect(group?.children.length).toBe(0);
  });

  it("applies custom className", () => {
    const { container } = render(
      <AvatarGroup className="custom-group">
        <Avatar fallback="U1" />
      </AvatarGroup>,
    );
    const group = container.querySelector('div[role="group"]');
    expect(group).toHaveClass("custom-group");
  });

  it("accepts hero sizes (2xl, 3xl) via size prop", () => {
    const { rerender } = render(
      <AvatarGroup size="2xl">
        <Avatar fallback="U1" />
        <Avatar fallback="U2" />
      </AvatarGroup>,
    );
    // AvatarGroup clones children with the group size — overflow avatar
    // must also reflect the hero size.
    rerender(
      <AvatarGroup max={1} size="2xl">
        <Avatar fallback="U1" />
        <Avatar fallback="U2" />
      </AvatarGroup>,
    );
    const overflowAvatar = screen.getByText("+1");
    const overflowContainer = overflowAvatar.closest('div[role="img"]');
    expect(overflowContainer).toHaveClass("h-24", "w-24");
  });
});

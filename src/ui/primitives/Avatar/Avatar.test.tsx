import { describe, it, expect } from "vitest";
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

    // Simulate image error
    if (img) {
      fireEvent.error(img);
    }

    await waitFor(() => {
      expect(screen.getByText("JD")).toBeInTheDocument();
    });
  });

  it("applies correct size classes", () => {
    const { container, rerender } = render(<Avatar fallback="JD" size="xs" />);
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
});

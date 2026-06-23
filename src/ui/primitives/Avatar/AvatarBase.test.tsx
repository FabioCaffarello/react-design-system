import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AvatarBase from "./AvatarBase";

describe("AvatarBase", () => {
  // ── Fallback (no src) ─────────────────────────────────────────────────────

  it("renders initials fallback when src is absent", () => {
    render(<AvatarBase fallback="João Silva" alt="João Silva" />);
    expect(screen.getByText("JO")).toBeInTheDocument();
  });

  it("renders fallback when src is undefined", () => {
    const { container } = render(
      <AvatarBase src={undefined} fallback="AB" alt="A B" />,
    );
    expect(screen.getByText("AB")).toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("uppercases and slices fallback string to 2 chars", () => {
    render(<AvatarBase fallback="fabio caffarello" alt="Fabio" />);
    expect(screen.getByText("FA")).toBeInTheDocument();
  });

  it("renders '?' when src is absent and no fallback is provided", () => {
    render(<AvatarBase alt="Unknown" />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("renders a ReactNode fallback", () => {
    render(
      <AvatarBase fallback={<span data-testid="icon">★</span>} alt="Star" />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  // ── With src ──────────────────────────────────────────────────────────────

  it("renders an img when src is provided", () => {
    const { container } = render(<AvatarBase src="/photo.jpg" alt="User" />);
    // The wrapper div has role="img"; use querySelector to target the <img> element.
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/photo.jpg");
    expect(img).toHaveAttribute("alt", "User");
  });

  it("does NOT show fallback when src is provided", () => {
    render(<AvatarBase src="/photo.jpg" fallback="AB" alt="A B" />);
    expect(screen.queryByText("AB")).not.toBeInTheDocument();
  });

  it("forwards the loading attribute to the img", () => {
    const { container } = render(
      <AvatarBase src="/photo.jpg" alt="User" loading="lazy" />,
    );
    expect(container.querySelector("img")).toHaveAttribute("loading", "lazy");
  });

  it("defaults loading to 'eager'", () => {
    const { container } = render(<AvatarBase src="/photo.jpg" alt="User" />);
    expect(container.querySelector("img")).toHaveAttribute("loading", "eager");
  });

  // ── No JS fallback on 404 (server-safe trade-off) ────────────────────────

  it("does NOT hold state — no imageError recovery (server-safe trade-off)", () => {
    // AvatarBase has no onError handler, so a broken src stays broken.
    // This is the documented trade-off vs Avatar (issue #250).
    const { container } = render(
      <AvatarBase src="/broken.jpg" fallback="FB" alt="Fallback Test" />,
    );
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    // The fallback span must NOT exist alongside the img
    expect(screen.queryByText("FB")).not.toBeInTheDocument();
  });

  // ── Accessible label ──────────────────────────────────────────────────────

  it("uses alt as the aria-label on the wrapper when no aria-label is given", () => {
    render(<AvatarBase alt="Maria" />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "Maria");
  });

  it("uses an explicit aria-label over alt", () => {
    render(<AvatarBase alt="Maria" aria-label="Foto de Maria Souza" />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Foto de Maria Souza",
    );
  });

  it("falls back to 'User avatar' when neither alt nor aria-label is provided", () => {
    render(<AvatarBase />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "User avatar",
    );
  });

  // ── Sizes ─────────────────────────────────────────────────────────────────

  it.each([
    ["xs", "h-6 w-6"],
    ["sm", "h-8 w-8"],
    ["md", "h-10 w-10"],
    ["lg", "h-12 w-12"],
    ["xl", "h-16 w-16"],
    ["2xl", "h-24 w-24"],
    ["3xl", "h-28 w-28"],
  ] as const)("size %s applies correct dimension classes", (size, classes) => {
    const { container } = render(
      <AvatarBase size={size} alt={`Avatar ${size}`} />,
    );
    const [h, w] = classes.split(" ");
    expect(container.firstChild).toHaveClass(h);
    expect(container.firstChild).toHaveClass(w);
  });

  // ── Variants ──────────────────────────────────────────────────────────────

  it("applies circle variant (rounded-full) by default", () => {
    const { container } = render(<AvatarBase alt="Test" />);
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("applies square variant (rounded-none)", () => {
    const { container } = render(<AvatarBase alt="Test" variant="square" />);
    expect(container.firstChild).toHaveClass("rounded-none");
  });

  it("applies rounded variant (rounded-md)", () => {
    const { container } = render(<AvatarBase alt="Test" variant="rounded" />);
    expect(container.firstChild).toHaveClass("rounded-md");
  });

  // ── Ref forwarding ────────────────────────────────────────────────────────

  it("forwards ref to the wrapper div", () => {
    let capturedRef: HTMLDivElement | null = null;
    render(
      <AvatarBase
        ref={(el) => {
          capturedRef = el;
        }}
        alt="Ref test"
      />,
    );
    expect(capturedRef).toBeInstanceOf(HTMLDivElement);
  });

  // ── Extra props ───────────────────────────────────────────────────────────

  it("spreads extra HTML attributes onto the wrapper div", () => {
    render(<AvatarBase alt="Test" data-testid="avatar-wrapper" />);
    expect(screen.getByTestId("avatar-wrapper")).toBeInTheDocument();
  });

  it("merges custom className with internal classes", () => {
    const { container } = render(
      <AvatarBase alt="Test" className="my-custom" />,
    );
    expect(container.firstChild).toHaveClass("my-custom");
    expect(container.firstChild).toHaveClass("inline-flex");
  });
});

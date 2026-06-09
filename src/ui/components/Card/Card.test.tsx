import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Card from "./Card";
import { CardHeader, CardTitle, CardSubtitle, CardActions, CardBody } from ".";

describe("Card", () => {
  it("renders with children", () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders with default variant", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass(
      "bg-surface-base",
      "rounded-lg",
      "border",
      "border-line-default",
    );
  });

  it("applies hover variant classes", () => {
    const { container } = render(<Card variant="hover">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass(
      "hover:shadow-md",
      "transition-shadow",
      "cursor-pointer",
    );
  });

  it("applies selected variant classes", () => {
    const { container } = render(<Card variant="selected">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("border-line-brand", "shadow-md");
  });

  it("applies medium padding by default", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("p-4");
  });

  it("applies small padding", () => {
    const { container } = render(<Card padding="small">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("p-1"); // xs spacing is p-1
  });

  it("applies large padding", () => {
    const { container } = render(<Card padding="large">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("p-6");
  });

  it("applies no padding", () => {
    const { container } = render(<Card padding="none">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).not.toHaveClass("p-2", "p-4", "p-6");
  });

  it("applies custom className", () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("custom-class");
  });

  describe("ARIA interactivity (decoupled from variant=hover)", () => {
    // `variant="hover"` is a visual hover style only — NOT an ARIA
    // interactivity signal. The previous coupling (`isInteractive =
    // onClick || variant === "hover"`) made hover cards `role="button"
    // tabindex=0` even when the consumer composed real Buttons inside,
    // triggering axe `nested-interactive`. The fix below ties role/
    // tabindex to `onClick` only. Re-coupling regresses the violation;
    // these tests guard against that.

    it("variant=hover WITHOUT onClick has no role and no tabIndex", () => {
      const { container } = render(<Card variant="hover">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveAttribute("role");
      expect(card).not.toHaveAttribute("tabIndex");
    });

    it("variant=hover WITH onClick has role=button + tabindex=0", () => {
      const { container } = render(
        <Card variant="hover" onClick={() => {}} aria-label="Clickable">
          Content
        </Card>,
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute("role", "button");
      expect(card).toHaveAttribute("tabIndex", "0");
    });

    it("variant=default WITH onClick still gets role=button + tabindex=0", () => {
      const { container } = render(
        <Card onClick={() => {}} aria-label="Clickable">
          Content
        </Card>,
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute("role", "button");
      expect(card).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("non-interactive Card emits no role / tabIndex (issue #160)", () => {
    // A non-interactive Card (no `onClick`) must emit a plain <div>
    // with no ARIA interactivity surface. The RSC failure mode that
    // motivated this guard — an always-on `onKeyDown` closure assigned
    // to the `<div>` — is NOT testable from JSDOM: React attaches
    // event handlers via its own delegation system, never as DOM
    // attributes, so `hasAttribute("onkeydown")` returns false even
    // when the handler IS being passed. The gate that exercises the
    // RSC failure mode end-to-end lives in
    // `fixtures/next-smoke/app/page.tsx`: rendering `<Card>` (no
    // onClick) inside a Next 16 Server Component fails `next build`
    // with "Event handlers cannot be passed to Client Component props"
    // if `onKeyDown={isInteractive ? handleKeyDown : undefined}`
    // regresses back to `onKeyDown={handleKeyDown}`. The role and
    // tabIndex assertions below are the JSDOM-visible companions to
    // the same intent; they DO catch a regression where the guard
    // pattern is removed from the role/tabIndex lines as well.

    it("Card without onClick has no role and no tabIndex", () => {
      const { container } = render(<Card>Static content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveAttribute("role");
      expect(card).not.toHaveAttribute("tabIndex");
    });
  });

  describe("compound subcomponents (#165)", () => {
    it("exposes subcomponents via dot-notation", () => {
      expect(Card.Header).toBe(CardHeader);
      expect(Card.Title).toBe(CardTitle);
      expect(Card.Subtitle).toBe(CardSubtitle);
      expect(Card.Actions).toBe(CardActions);
      expect(Card.Body).toBe(CardBody);
    });

    it("renders the full compound surface", () => {
      render(
        <Card>
          <Card.Header>
            <Card.Title>Title text</Card.Title>
            <Card.Subtitle>Subtitle text</Card.Subtitle>
            <Card.Actions>
              <button type="button">Edit</button>
            </Card.Actions>
          </Card.Header>
          <Card.Body>Body text</Card.Body>
        </Card>,
      );
      expect(screen.getByText("Title text")).toBeInTheDocument();
      expect(screen.getByText("Subtitle text")).toBeInTheDocument();
      expect(screen.getByText("Body text")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    });

    it("collapses absent slots: header alone is fine without actions or subtitle", () => {
      render(
        <Card>
          <Card.Header>
            <Card.Title>Only title</Card.Title>
          </Card.Header>
          <Card.Body>Body</Card.Body>
        </Card>,
      );
      expect(screen.getByText("Only title")).toBeInTheDocument();
      expect(screen.getByText("Body")).toBeInTheDocument();
    });

    it("body alone is fine without header", () => {
      render(
        <Card>
          <Card.Body>Body only</Card.Body>
        </Card>,
      );
      expect(screen.getByText("Body only")).toBeInTheDocument();
    });

    it("CardTitle renders icon, text, and badge in order", () => {
      render(
        <Card.Title
          icon={<span data-testid="ico">i</span>}
          badge={<span data-testid="bdg">B</span>}
        >
          Parlamentares
        </Card.Title>,
      );
      const ico = screen.getByTestId("ico");
      const bdg = screen.getByTestId("bdg");
      const txt = screen.getByText("Parlamentares");
      expect(ico).toBeInTheDocument();
      expect(bdg).toBeInTheDocument();
      // DOM order: ico → text → badge
      const positionIco = ico.compareDocumentPosition(txt);
      const positionBdg = txt.compareDocumentPosition(bdg);
      expect(positionIco & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(positionBdg & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it("CardTitle defaults to h2 and accepts as prop", () => {
      const { rerender } = render(<Card.Title>Default</Card.Title>);
      expect(
        screen.getByRole("heading", { level: 2, name: "Default" }),
      ).toBeInTheDocument();
      rerender(<Card.Title as="h3">Deep</Card.Title>);
      expect(
        screen.getByRole("heading", { level: 3, name: "Deep" }),
      ).toBeInTheDocument();
    });

    it("CardActions carries data-card-actions for header layout switch", () => {
      const { container } = render(<Card.Actions>act</Card.Actions>);
      const root = container.firstChild as HTMLElement;
      expect(root).toHaveAttribute("data-card-actions");
    });
  });

  describe("asSection (#165)", () => {
    it("default is false: root is a <div>", () => {
      const { container } = render(<Card>Plain</Card>);
      const root = container.firstChild as HTMLElement;
      expect(root.tagName).toBe("DIV");
    });

    it("asSection={true} with aria-labelledby renders <section>", () => {
      const { container } = render(
        <Card asSection aria-labelledby="t">
          <Card.Header>
            <Card.Title id="t">Titled</Card.Title>
          </Card.Header>
        </Card>,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.tagName).toBe("SECTION");
      expect(root).toHaveAttribute("aria-labelledby", "t");
    });
  });
});

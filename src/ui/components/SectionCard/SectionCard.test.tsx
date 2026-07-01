import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionCard } from "./SectionCard";
import Badge from "../../primitives/Badge/Badge";
import { FileText } from "lucide-react";

describe("SectionCard", () => {
  it("renders title and children", () => {
    render(
      <SectionCard id="section-1" title="Votações">
        <p>Content here</p>
      </SectionCard>,
    );
    expect(screen.getByText("Votações")).toBeInTheDocument();
    expect(screen.getByText("Content here")).toBeInTheDocument();
  });

  it("renders as a section element", () => {
    const { container } = render(
      <SectionCard id="test-section" title="Test">
        Content
      </SectionCard>,
    );
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("sets the id on the root element for anchor navigation", () => {
    const { container } = render(
      <SectionCard id="my-anchor" title="My Section">
        Content
      </SectionCard>,
    );
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "my-anchor");
  });

  it("wires aria-labelledby to the title heading", () => {
    const { container } = render(
      <SectionCard id="votos" title="Votações Recentes">
        Content
      </SectionCard>,
    );
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("aria-labelledby", "votos-title");

    const heading = container.querySelector("#votos-title");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Votações Recentes");
  });

  it("renders subtitle when provided", () => {
    render(
      <SectionCard id="s1" title="Title" subtitle="Last 30 days">
        Content
      </SectionCard>,
    );
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
  });

  it("does not render subtitle when omitted", () => {
    const { container } = render(
      <SectionCard id="s1" title="Title">
        Content
      </SectionCard>,
    );
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });

  it("renders icon in the header", () => {
    render(
      <SectionCard
        id="s1"
        title="Title"
        icon={<FileText aria-hidden="true" data-testid="icon" />}
      >
        Content
      </SectionCard>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders badge in the header", () => {
    render(
      <SectionCard
        id="s1"
        title="Title"
        badge={<Badge data-testid="badge">L1</Badge>}
      >
        Content
      </SectionCard>,
    );
    expect(screen.getByTestId("badge")).toBeInTheDocument();
  });

  it("applies scrollOffset as scrollMarginTop style", () => {
    const { container } = render(
      <SectionCard id="s1" title="Title" scrollOffset="3.5rem">
        Content
      </SectionCard>,
    );
    const section = container.querySelector("section");
    expect(section).toHaveStyle({ scrollMarginTop: "3.5rem" });
  });

  it("defaults scrollMarginTop to 0 when scrollOffset is omitted", () => {
    const { container } = render(
      <SectionCard id="s1" title="Title">
        Content
      </SectionCard>,
    );
    const section = container.querySelector("section");
    expect(section).toHaveStyle({ scrollMarginTop: "0" });
  });

  it("merges custom style with scrollMarginTop", () => {
    const { container } = render(
      <SectionCard
        id="s1"
        title="Title"
        scrollOffset="56px"
        style={{ opacity: 0.9 }}
      >
        Content
      </SectionCard>,
    );
    const section = container.querySelector("section");
    expect(section).toHaveStyle({ scrollMarginTop: "56px", opacity: "0.9" });
  });

  it("renders without children (no CardBody)", () => {
    const { container } = render(<SectionCard id="s1" title="Empty Section" />);
    expect(screen.getByText("Empty Section")).toBeInTheDocument();
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("forwards additional HTML attributes to the root", () => {
    const { container } = render(
      <SectionCard id="s1" title="Title" data-testid="my-section">
        Content
      </SectionCard>,
    );
    expect(
      container.querySelector("[data-testid='my-section']"),
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <SectionCard id="s1" title="Title" className="my-custom-class">
        Content
      </SectionCard>,
    );
    const section = container.querySelector("section");
    expect(section).toHaveClass("my-custom-class");
  });
});

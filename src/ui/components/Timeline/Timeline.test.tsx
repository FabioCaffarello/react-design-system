import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Timeline from "./Timeline";

const mockItems = [
  {
    id: "1",
    title: "Event 1",
    description: "Description 1",
    timestamp: "2024-01-01",
  },
  {
    id: "2",
    title: "Event 2",
    description: "Description 2",
    timestamp: "2024-01-02",
  },
  {
    id: "3",
    title: "Event 3",
    description: "Description 3",
    timestamp: "2024-01-03",
  },
];

describe("Timeline", () => {
  it("renders correctly", () => {
    render(<Timeline items={mockItems} />);
    expect(screen.getByText("Event 1")).toBeInTheDocument();
    expect(screen.getByText("Event 2")).toBeInTheDocument();
  });

  it("displays timestamps when provided", () => {
    render(<Timeline items={mockItems} />);
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
  });

  it("displays descriptions when provided", () => {
    render(<Timeline items={mockItems} />);
    expect(screen.getByText("Description 1")).toBeInTheDocument();
  });

  it("handles horizontal orientation", () => {
    render(<Timeline items={mockItems} orientation="horizontal" />);
    expect(screen.getByText("Event 1")).toBeInTheDocument();
  });

  it("handles vertical orientation", () => {
    render(<Timeline items={mockItems} orientation="vertical" />);
    expect(screen.getByText("Event 1")).toBeInTheDocument();
  });

  it("handles status prop", () => {
    const itemsWithStatus = [
      { ...mockItems[0], status: "completed" as const },
      { ...mockItems[1], status: "active" as const },
      { ...mockItems[2], status: "error" as const },
    ];
    render(<Timeline items={itemsWithStatus} />);
    expect(screen.getByText("Event 1")).toBeInTheDocument();
  });
});

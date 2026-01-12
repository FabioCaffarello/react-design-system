import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import Tooltip from "./Tooltip";
import Button from "../Button/Button";

describe("Tooltip", () => {
  it("renders children", () => {
    render(
      <Tooltip content="Tooltip content">
        <Button>Button</Button>
      </Tooltip>
    );
    
    expect(screen.getByText("Button")).toBeInTheDocument();
  });

  it("shows tooltip on hover", async () => {
    render(
      <Tooltip content="Tooltip content" delay={0}>
        <Button>Button</Button>
      </Tooltip>
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
      </Tooltip>
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
});

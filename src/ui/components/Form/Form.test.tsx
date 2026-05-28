import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Form from "./Form";
import { Input, Button } from "../../primitives";

describe("Form", () => {
  it("renders form with children", () => {
    const { container } = render(
      <Form>
        <Input name="test" />
      </Form>,
    );
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", () => {
    const handleSubmit = vi.fn();
    const { container } = render(
      <Form onSubmit={handleSubmit}>
        <Button type="submit">Submit</Button>
      </Form>,
    );
    const form = container.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("displays error message when error prop is provided", () => {
    render(
      <Form error="Something went wrong">
        <Input name="test" />
      </Form>,
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toHaveAttribute(
      "role",
      "alert",
    );
  });

  it("displays success message when success prop is provided", () => {
    render(
      <Form success="Form submitted successfully!">
        <Input name="test" />
      </Form>,
    );
    expect(
      screen.getByText("Form submitted successfully!"),
    ).toBeInTheDocument();
    expect(screen.getByText("Form submitted successfully!")).toHaveAttribute(
      "role",
      "alert",
    );
  });

  it("does not call onSubmit when loading", () => {
    const handleSubmit = vi.fn();
    const { container } = render(
      <Form onSubmit={handleSubmit} loading={true}>
        <Button type="submit">Submit</Button>
      </Form>,
    );
    const form = container.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Form className="custom-class">
        <Input name="test" />
      </Form>,
    );
    const form = container.querySelector("form");
    expect(form).toHaveClass("custom-class");
  });

  it("has noValidate attribute", () => {
    const { container } = render(
      <Form>
        <Input name="test" />
      </Form>,
    );
    const form = container.querySelector("form");
    expect(form).toHaveAttribute("noValidate");
  });
});

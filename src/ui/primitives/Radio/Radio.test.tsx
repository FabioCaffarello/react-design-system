import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Radio from "./Radio";

describe("Radio", () => {
  describe("basic rendering", () => {
    it("renders radio with label", () => {
      render(<Radio name="test" label="Test radio" value="test" />);
      expect(screen.getByLabelText("Test radio")).toBeInTheDocument();
    });

    it("respects a caller-provided id and associates the label via htmlFor", () => {
      render(<Radio id="custom-id" name="test" label="Test" value="test" />);
      const input = screen.getByRole("radio");
      expect(input).toHaveAttribute("id", "custom-id");
      expect(screen.getByText("Test").closest("label")).toHaveAttribute(
        "for",
        "custom-id",
      );
    });

    it("generates a stable id and links the label when none is provided", () => {
      render(<Radio name="test" label="Auto" value="test" />);
      const input = screen.getByRole("radio");
      const id = input.getAttribute("id");
      expect(id).toMatch(/^radio-/);
      expect(screen.getByText("Auto").closest("label")).toHaveAttribute(
        "for",
        id!,
      );
    });

    it("forwards ref to the underlying input element", () => {
      const ref = createRef<HTMLInputElement>();
      render(<Radio ref={ref} name="test" value="test" />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe("radio");
    });
  });

  describe("interaction", () => {
    it("handles click events", async () => {
      const handleChange = vi.fn();
      render(
        <Radio name="test" label="Test" value="test" onChange={handleChange} />,
      );

      const radio = screen.getByLabelText("Test");
      await userEvent.click(radio);

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("is disabled when disabled prop is true", () => {
      render(<Radio name="test" label="Test" value="test" disabled />);
      expect(screen.getByRole("radio")).toBeDisabled();
    });
  });

  describe("validation feedback", () => {
    it("shows error state with helperText surfaced as the error message", () => {
      render(
        <Radio
          name="test"
          label="Test"
          value="test"
          error
          helperText="Error message"
        />,
      );
      expect(screen.getByText("Error message")).toBeInTheDocument();
      expect(screen.getByRole("radio")).toHaveAttribute("aria-invalid", "true");
    });

    it("error message carries role=alert for screen-reader announcement", () => {
      render(<Radio name="test" label="x" value="x" error helperText="bad" />);
      expect(screen.getByText("bad")).toHaveAttribute("role", "alert");
    });

    it("renders neutral helper text without role=alert", () => {
      render(
        <Radio
          name="test"
          label="x"
          value="x"
          helperText="Pick the right option"
        />,
      );
      const helper = screen.getByText("Pick the right option");
      expect(helper).toBeInTheDocument();
      expect(helper).not.toHaveAttribute("role");
    });

    it("falls back to a default error message when error is set without helperText", () => {
      render(<Radio name="test" label="x" value="x" error />);
      expect(screen.getByText("This field has an error")).toBeInTheDocument();
    });

    it("links the input to the feedback message via aria-describedby", () => {
      render(<Radio name="test" label="x" value="x" helperText="hint" />);
      const input = screen.getByRole("radio");
      const describedBy = input.getAttribute("aria-describedby");
      expect(describedBy).toBeTruthy();
      expect(screen.getByText("hint")).toHaveAttribute("id", describedBy!);
    });
  });

  describe("accessibility fallback", () => {
    it("uses 'Radio button' as the accessible name when no label is provided", () => {
      render(<Radio name="test" value="test" />);
      expect(screen.getByRole("radio")).toHaveAttribute(
        "aria-label",
        "Radio button",
      );
    });

    it("does not emit aria-label when a visible label is provided", () => {
      render(<Radio name="test" label="Named" value="test" />);
      expect(screen.getByRole("radio")).not.toHaveAttribute("aria-label");
    });
  });
});

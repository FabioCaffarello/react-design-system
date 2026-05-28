import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchInput from "./SearchInput";

describe("SearchInput", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<SearchInput />);
    const input =
      screen.getByRole("searchbox") ||
      screen.getByRole("textbox") ||
      document.querySelector('input[type="search"]');
    expect(input).toBeInTheDocument();
  });

  it("calls onSearch with debounce", async () => {
    const handleSearch = vi.fn();
    render(<SearchInput onSearch={handleSearch} debounceMs={300} />);

    const input =
      screen.getByRole("searchbox") ||
      screen.getByRole("textbox") ||
      (document.querySelector('input[type="search"]') as HTMLInputElement);
    expect(input).toBeInTheDocument();

    act(() => {
      fireEvent.change(input, { target: { value: "test" } });
    });

    expect(handleSearch).not.toHaveBeenCalled();

    // Advance timers for debounce - need to advance more than debounceMs
    act(() => {
      vi.advanceTimersByTime(350);
    });

    // Run all pending timers to ensure debounce completes
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // Check if callback was called
    expect(handleSearch).toHaveBeenCalledWith("test");
  }, 10000);

  it("calls onSearch on Enter key", () => {
    const handleSearch = vi.fn();
    render(<SearchInput onSearch={handleSearch} defaultValue="test" />);

    const input =
      screen.getByRole("searchbox") ||
      screen.getByRole("textbox") ||
      (document.querySelector('input[type="search"]') as HTMLInputElement);
    fireEvent.keyDown(input, { key: "Enter" });

    expect(handleSearch).toHaveBeenCalledWith("test");
  });

  it("shows clear button when value exists", () => {
    render(<SearchInput defaultValue="test" showClearButton />);
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("calls onClear when clear button is clicked", () => {
    const handleClear = vi.fn();
    render(<SearchInput defaultValue="test" onClear={handleClear} />);

    const clearButton = screen.getByLabelText("Clear search");
    fireEvent.click(clearButton);

    expect(handleClear).toHaveBeenCalled();
  });

  it("shows loading state", () => {
    render(<SearchInput loading />);
    const input =
      screen.getByRole("searchbox") ||
      screen.getByRole("textbox") ||
      document.querySelector('input[type="search"]');
    expect(input).toBeInTheDocument();
    // Check for loading indicator (spinner)
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });
});

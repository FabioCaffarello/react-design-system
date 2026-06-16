import { describe, it, expect } from "vitest";
import {
  CHART_PALETTE_SIZE,
  CHART_PALETTE_TOKENS,
  getChartColor,
  getChartColorClass,
} from "./chart";

describe("chart palette tokens", () => {
  it("exposes exactly CHART_PALETTE_SIZE tokens in 1-based order", () => {
    expect(CHART_PALETTE_TOKENS).toHaveLength(CHART_PALETTE_SIZE);
    CHART_PALETTE_TOKENS.forEach((token, i) => {
      expect(token.index).toBe(i + 1);
      expect(token.var).toBe(`var(--color-chart-${i + 1})`);
      expect(token.bg).toBe(`bg-chart-${i + 1}`);
      expect(token.text).toBe(`text-chart-${i + 1}`);
      expect(token.name).toBeTruthy();
    });
  });
});

describe("getChartColor", () => {
  it("maps 0-based series index to 1-based chart var", () => {
    expect(getChartColor(0)).toBe("var(--color-chart-1)");
    expect(getChartColor(7)).toBe("var(--color-chart-8)");
  });

  it("wraps modulo the palette size for indices beyond the palette", () => {
    expect(getChartColor(8)).toBe("var(--color-chart-1)");
    expect(getChartColor(9)).toBe("var(--color-chart-2)");
    expect(getChartColor(16)).toBe("var(--color-chart-1)");
  });

  it("wraps negative indices correctly", () => {
    expect(getChartColor(-1)).toBe("var(--color-chart-8)");
    expect(getChartColor(-8)).toBe("var(--color-chart-1)");
  });

  it("truncates fractional indices", () => {
    expect(getChartColor(2.9)).toBe("var(--color-chart-3)");
  });
});

describe("getChartColorClass", () => {
  it("defaults to a bg-chart class", () => {
    expect(getChartColorClass(0)).toBe("bg-chart-1");
    expect(getChartColorClass(8)).toBe("bg-chart-1");
  });

  it("returns a text-chart class when asked", () => {
    expect(getChartColorClass(2, "text")).toBe("text-chart-3");
  });
});

import { describe, it, expect } from "vitest";
import {
  variant,
  size,
  state,
  responsive,
  typography,
  radius,
  combine,
} from "./variants";

describe("variant helpers", () => {
  describe("variant", () => {
    it("creates color variant classes", () => {
      const result = variant("primary", "DEFAULT", "bg");
      expect(result).toContain("bg-");
    });

    it("handles different color types", () => {
      expect(variant("error", "DEFAULT", "text")).toContain("text-");
      expect(variant("success", "DEFAULT", "border")).toContain("border-");
    });
  });

  describe("size", () => {
    it("creates spacing classes", () => {
      const result = size("md", "px");
      expect(result).toContain("px-");
    });

    it("handles different directions", () => {
      expect(size("sm", "py")).toContain("py-");
      expect(size("lg", "gap")).toContain("gap-");
    });
  });

  describe("state", () => {
    it("creates hover state classes", () => {
      const result = state("hover", "primary", "light", "bg");
      expect(result).toContain("hover:");
    });

    it("creates focus state classes", () => {
      const result = state("focus", "error", "DEFAULT", "border");
      expect(result).toContain("focus:");
    });

    it("creates active state classes", () => {
      const result = state("active", "primary", "DEFAULT", "bg");
      expect(result).toContain("active:");
    });

    it("creates disabled state classes", () => {
      const result = state("disabled", "neutral", "DEFAULT", "text");
      expect(result).toContain("disabled:");
    });
  });

  describe("responsive", () => {
    it("creates responsive classes", () => {
      const result = responsive("md", "flex", "hidden");
      expect(result).toContain("hidden");
      expect(result).toContain("md:flex");
    });

    it("handles base classes only", () => {
      const result = responsive("lg", "text-lg");
      expect(result).toContain("lg:text-lg");
    });
  });

  describe("typography", () => {
    it("creates typography classes", () => {
      const result = typography("body");
      expect(result).toBeTruthy();
    });

    it("handles sizeOnly option", () => {
      const result = typography("body", { sizeOnly: true });
      expect(result).toContain("text-");
    });

    it("handles weightOnly option", () => {
      const result = typography("label", { weightOnly: true });
      expect(result).toContain("font-");
    });
  });

  describe("radius", () => {
    it("creates radius classes", () => {
      expect(radius("md")).toContain("rounded-");
      expect(radius("full")).toContain("rounded-full");
    });
  });

  describe("combine", () => {
    it("combines multiple classes", () => {
      const result = combine(
        variant("primary", "DEFAULT", "bg"),
        size("md", "px"),
        "custom-class",
      );
      expect(result).toContain("bg-");
      expect(result).toContain("px-");
      expect(result).toContain("custom-class");
    });

    it("handles undefined and null", () => {
      const result = combine("base", undefined, null, "class");
      expect(result).toBe("base class");
    });
  });
});

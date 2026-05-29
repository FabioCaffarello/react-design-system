import { describe, it, expect } from "vitest";
import rule from "./rule.js";
import plugin from "../index.js";

describe("no-raw-color-classes — scaffold", () => {
  it("rule exports proper meta shape", () => {
    expect(rule).toBeDefined();
    expect(rule.meta?.type).toBe("problem");
    expect(rule.meta?.messages?.rawColorClass).toBeTruthy();
    expect(rule.meta?.messages?.arbitraryVarSyntax).toBeTruthy();
    expect(typeof rule.create).toBe("function");
  });

  it("plugin index exposes the rule under its canonical name", () => {
    expect(plugin.rules["no-raw-color-classes"]).toBe(rule);
    expect(plugin.meta?.name).toBe("eslint-plugin-ds-color");
  });
});

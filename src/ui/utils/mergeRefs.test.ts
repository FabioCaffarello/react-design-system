import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { mergeRefs } from "./mergeRefs";

describe("mergeRefs", () => {
  it("invokes callback refs with the node", () => {
    const cb = vi.fn();
    const node = document.createElement("div");
    mergeRefs<HTMLDivElement>(cb)(node);
    expect(cb).toHaveBeenCalledWith(node);
  });

  it("writes the node into object refs", () => {
    const ref = createRef<HTMLDivElement>();
    const node = document.createElement("div");
    mergeRefs<HTMLDivElement>(ref)(node);
    expect(ref.current).toBe(node);
  });

  it("composes callback and object refs in one call", () => {
    const cb = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const node = document.createElement("div");
    mergeRefs<HTMLDivElement>(cb, ref)(node);
    expect(cb).toHaveBeenCalledWith(node);
    expect(ref.current).toBe(node);
  });

  it("ignores undefined and null entries", () => {
    const ref = createRef<HTMLDivElement>();
    const node = document.createElement("div");
    expect(() =>
      mergeRefs<HTMLDivElement>(undefined, ref, null)(node),
    ).not.toThrow();
    expect(ref.current).toBe(node);
  });

  it("propagates a null node on unmount-style invocation", () => {
    const cb = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const node = document.createElement("div");
    const merged = mergeRefs<HTMLDivElement>(cb, ref);
    merged(node);
    merged(null);
    expect(cb).toHaveBeenLastCalledWith(null);
    expect(ref.current).toBe(null);
  });
});

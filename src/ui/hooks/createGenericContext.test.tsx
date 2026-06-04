import { describe, it, expect, expectTypeOf } from "vitest";
import { renderHook } from "@testing-library/react";
import { type ReactNode } from "react";
import { createGenericContext } from "./createGenericContext";
import { useContextSelector } from "./useContextSelector";

interface BaseValue<T = string> {
  payload: T;
  loading: boolean;
}

interface MyShape {
  id: number;
  name: string;
}

describe("createGenericContext", () => {
  it("Provider + useContextRequired round-trip with TBase", () => {
    const ctx = createGenericContext<BaseValue>({
      displayName: "TestContext",
      errorMessage: "useTest must be inside Provider",
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ctx.Provider value={{ payload: "hello", loading: false }}>
        {children}
      </ctx.Provider>
    );

    const { result } = renderHook(() => ctx.useContextRequired(), { wrapper });
    expect(result.current).toEqual({ payload: "hello", loading: false });
  });

  it("preserves per-call TSpecific generic at the consumer hook", () => {
    const ctx = createGenericContext<BaseValue>({
      displayName: "TestContext",
      errorMessage: "useTest must be inside Provider",
    });

    const concrete: BaseValue<MyShape> = {
      payload: { id: 1, name: "row-1" },
      loading: false,
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ctx.Provider value={concrete}>{children}</ctx.Provider>
    );

    const { result } = renderHook(
      () => ctx.useContextRequired<BaseValue<MyShape>>(),
      { wrapper },
    );

    // Runtime: the per-call generic value is returned verbatim.
    expect(result.current.payload).toEqual({ id: 1, name: "row-1" });

    // Type-level: the hook return is typed at the per-call TSpecific,
    // not TBase. Without this assertion the helper would silently fall
    // back to BaseValue<string>, masking the very bug the factory exists
    // to prevent.
    expectTypeOf(result.current).toEqualTypeOf<BaseValue<MyShape>>();
    expectTypeOf(result.current.payload).toEqualTypeOf<MyShape>();
  });

  it("useContextRequired throws errorMessage when used outside Provider", () => {
    const ctx = createGenericContext<BaseValue>({
      displayName: "TestContext",
      errorMessage: "useTest must be inside Provider",
    });

    expect(() => renderHook(() => ctx.useContextRequired())).toThrow(
      "useTest must be inside Provider",
    );
  });

  it("useContextOptional returns undefined outside Provider", () => {
    const ctx = createGenericContext<BaseValue>({
      displayName: "TestContext",
      errorMessage: "should not throw",
    });

    const { result } = renderHook(() => ctx.useContextOptional());
    expect(result.current).toBeUndefined();
  });

  it("useContextOptional returns the value inside Provider with TSpecific type", () => {
    const ctx = createGenericContext<BaseValue>({
      displayName: "TestContext",
      errorMessage: "n/a",
    });

    const concrete: BaseValue<MyShape> = {
      payload: { id: 2, name: "row-2" },
      loading: true,
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ctx.Provider value={concrete}>{children}</ctx.Provider>
    );

    const { result } = renderHook(
      () => ctx.useContextOptional<BaseValue<MyShape>>(),
      { wrapper },
    );

    expect(result.current).toEqual(concrete);
    expectTypeOf(result.current).toEqualTypeOf<
      BaseValue<MyShape> | undefined
    >();
  });

  it("sets Context.displayName for React DevTools", () => {
    const ctx = createGenericContext<BaseValue>({
      displayName: "MyFancyContext",
      errorMessage: "n/a",
    });
    expect(ctx.Context.displayName).toBe("MyFancyContext");
  });

  it("Context object is compatible with useContextSelector", () => {
    // useContextSelector is the perf-focused alternative to useContext.
    // It must keep working against a Context produced by this factory —
    // CLAUDE.md tokens.md / hooks docs reference selector usage on Table
    // and Form contexts, both of which now flow through this helper.
    const ctx = createGenericContext<BaseValue>({
      displayName: "SelectorTest",
      errorMessage: "n/a",
    });

    const value: BaseValue<MyShape> = {
      payload: { id: 7, name: "selector-row" },
      loading: true,
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ctx.Provider value={value}>{children}</ctx.Provider>
    );

    const { result } = renderHook(
      () =>
        useContextSelector(ctx.Context, (v) =>
          v ? (v as BaseValue<MyShape>).payload.name : null,
        ),
      { wrapper },
    );

    expect(result.current).toBe("selector-row");
  });
});

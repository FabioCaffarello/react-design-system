"use client";

import {
  createContext,
  useContext,
  type Context,
  type JSX,
  type ReactNode,
} from "react";

/**
 * Options for createGenericContext.
 */
export interface CreateGenericContextOptions {
  /**
   * displayName surfaced in React DevTools for the underlying Context.
   */
  displayName: string;
  /**
   * Error thrown by the required hook when called outside the Provider
   * tree. Keep this verbatim to whatever the legacy hook threw — it is
   * a behavioural contract consumers rely on.
   */
  errorMessage: string;
}

/**
 * Surface returned by createGenericContext.
 *
 * @typeParam TBase - The "default" shape stored in the underlying
 *  React Context. For generic context families this is the type fully
 *  instantiated at the default generic argument (e.g. for
 *  `XxxContextValue<TGeneric extends Base = Base>` use
 *  `XxxContextValue` — no argument — which TS resolves to the default).
 */
export interface GenericContext<TBase> {
  /**
   * Raw React Context object. Exposed unchanged so existing consumers
   * (especially `useContextSelector`) keep working. `useContext(Context)`
   * returns `TBase | undefined`; the typed hooks below carry the
   * per-call generic.
   */
  Context: Context<TBase | undefined>;
  /**
   * Generic Provider. Accepts `value` typed at the per-call `TSpecific`,
   * not at `TBase`, so each call site is cast-free.
   *
   * Inside, the single `as TBase` assignment encodes the cost of React's
   * invariant Context typing — see the implementation comment for the
   * full reason.
   */
  Provider: <TSpecific = TBase>(props: {
    value: TSpecific;
    children: ReactNode;
  }) => JSX.Element;
  // Note: TSpecific is intentionally unconstrained — see implementation
  // comment for the invariance reason. The two casts inside the helper
  // are the entire price; consumer sites stay cast-free.
  /**
   * Required hook. Returns the context value typed at the per-call
   * `TSpecific` (defaults to `TBase`). Throws `options.errorMessage`
   * when called outside the Provider tree.
   */
  useContextRequired: <TSpecific = TBase>() => TSpecific;
  /**
   * Optional variant — returns `undefined` outside the Provider tree
   * instead of throwing.
   */
  useContextOptional: <TSpecific = TBase>() => TSpecific | undefined;
}

/**
 * Build a React Context family where the value carries a per-call
 * generic that is preserved at the Provider and at the consuming hook
 * site, without spreading `as unknown as` casts through every consumer.
 *
 * The motivation: React's `Context<T>` is invariant in `T`. A generic
 * value type whose generic flows into an invariant inner position
 * (e.g. `UseFormReturn<T>` inside `FormContextValue<T>`, or
 * `TableColumn<T>` / `(row: T) => …` inside `TableContextValue<T>`)
 * cannot be made structurally assignable to its default-generic
 * counterpart. The cast is irreducible. This factory confines it to
 * three sites inside the helper — the Provider value and both hook
 * returns — and consumers stay cast-free.
 *
 * @example
 * ```ts
 * const formContext = createGenericContext<FormContextValue>({
 *   displayName: "FormContext",
 *   errorMessage: "useFormContext must be used within a Form …",
 * });
 *
 * export const FormContext = formContext.Context;
 * export function useFormContext<T extends FieldValues = FieldValues>() {
 *   return formContext.useContextRequired<FormContextValue<T>>();
 * }
 * ```
 */
export function createGenericContext<TBase>(
  options: CreateGenericContextOptions,
): GenericContext<TBase> {
  const Context = createContext<TBase | undefined>(undefined);
  Context.displayName = options.displayName;

  function Provider<TSpecific = TBase>({
    value,
    children,
  }: {
    value: TSpecific;
    children: ReactNode;
  }): JSX.Element {
    // React.Context is invariant in its value type. TSpecific is whatever
    // the per-call site uses (e.g. FormContextValue<MyForm>); TBase is
    // the same family at its default generic (FormContextValue<FieldValues>).
    // When the per-call generic flows into an invariant inner position
    // (UseFormReturn<T> inside FormContextValue<T>; TableColumn<T> inside
    // TableContextValue<T>), the two types have no structural overlap
    // from TS's perspective — TS itself recommends going through
    // `unknown`. We do, but we confine it here so every consumer site
    // stays cast-free.
    return (
      <Context.Provider value={value as unknown as TBase}>
        {children}
      </Context.Provider>
    );
  }

  function useContextRequired<TSpecific = TBase>(): TSpecific {
    const value = useContext(Context);
    if (value === undefined) {
      throw new Error(options.errorMessage);
    }
    // Symmetric to the Provider cast — same invariance reason.
    return value as unknown as TSpecific;
  }

  function useContextOptional<TSpecific = TBase>(): TSpecific | undefined {
    return useContext(Context) as unknown as TSpecific | undefined;
  }

  return { Context, Provider, useContextRequired, useContextOptional };
}

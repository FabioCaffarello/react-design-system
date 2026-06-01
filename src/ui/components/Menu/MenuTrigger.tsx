"use client";

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type HTMLAttributes,
  type MouseEvent,
  type Ref,
} from "react";
import { useMenuContext } from "./MenuContext";

export interface MenuTriggerProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /**
   * Controls whether MenuTrigger merges its trigger semantics (`role`,
   * `aria-haspopup`, `aria-expanded`, `tabIndex`, `onClick`, `ref`) onto
   * its single child, or wraps the child in a `<div role="button">`.
   *
   * - `true` — always clone the (single, valid) child. Throws via
   *   `React.Children.only` if children aren't a single element.
   * - `false` — always wrap in a `<div role="button">` (legacy behavior).
   * - `undefined` (default) — infer: clone when there is exactly one
   *   valid React element child; otherwise wrap. This default avoids
   *   nested-interactive when the canonical
   *   `<MenuTrigger><Button/></MenuTrigger>` pattern is used.
   *
   * Note on history: prior versions accepted this prop but never altered
   * the rendered DOM (the wrapper rendered unconditionally) AND a stale
   * `if (!asChild) setIsOpen(...)` gate suppressed the toggle when
   * `asChild={true}` was set. Both were broken contracts — this version
   * implements `asChild` structurally and removes the gate.
   */
  asChild?: boolean;
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): Ref<T> {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as { current: T | null }).current = node;
    }
  };
}

/**
 * MenuTrigger Component
 *
 * The trigger element that opens/closes the menu. Must be used within a
 * `<Menu>`. By default, when given a single valid React element child,
 * merges trigger semantics onto that child (no wrapper) — so the typical
 * `<MenuTrigger><Button>Open</Button></MenuTrigger>` renders a single
 * `<button>` instead of a `<div role="button">` wrapping a `<button>`.
 */
const MenuTrigger = forwardRef<HTMLElement, MenuTriggerProps>(
  function MenuTrigger({ children, asChild, onClick, ...props }, ref) {
    const { isOpen, setIsOpen } = useMenuContext();

    const handleClick = (e: MouseEvent<HTMLElement>) => {
      onClick?.(e);
      setIsOpen(!isOpen);
    };

    const single = Children.count(children) === 1 && isValidElement(children);
    const shouldClone = asChild === true || (asChild === undefined && single);

    if (shouldClone) {
      const child = Children.only(children) as ReactElement<
        HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> }
      >;
      const childOnClick = child.props.onClick;
      const composedClick = (e: MouseEvent<HTMLElement>) => {
        childOnClick?.(e);
        if (!e.defaultPrevented) handleClick(e);
      };
      return cloneElement(child, {
        ...props,
        role: child.props.role ?? "button",
        tabIndex: child.props.tabIndex ?? 0,
        "aria-haspopup": "menu",
        "aria-expanded": isOpen,
        onClick: composedClick,
        ref: mergeRefs(ref, child.props.ref),
      });
    }

    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        {...props}
      >
        {children}
      </div>
    );
  },
);

MenuTrigger.displayName = "MenuTrigger";

export default MenuTrigger;

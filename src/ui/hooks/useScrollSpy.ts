"use client";

import { useEffect, useState } from "react";

/**
 * Options for `useScrollSpy`.
 */
export interface UseScrollSpyOptions {
  /**
   * `IntersectionObserver` `rootMargin`. Shrinks the effective viewport
   * the observer reports on. The default `"0px 0px -50% 0px"` shrinks
   * the bottom edge by half — a section is considered "in view" only
   * when part of it sits in the upper half of the viewport, which is
   * the canonical "table-of-contents follows the scroll" behaviour. To
   * compensate for a sticky header, prefix the top with a negative
   * pixel value, e.g. `"-56px 0px -50% 0px"`.
   *
   * @default "0px 0px -50% 0px"
   */
  rootMargin?: string;
  /**
   * `IntersectionObserver` `threshold`. With the default `0`, the
   * observer fires when any part of the target enters the (margin-
   * shrunken) viewport.
   *
   * @default 0
   */
  threshold?: number | number[];
}

/**
 * Track which section of a long scroll surface is currently in view,
 * suitable for a table-of-contents nav that highlights the active section
 * (the classic "scroll spy" pattern).
 *
 * The hook resolves each `id` to a DOM element via
 * `document.getElementById`, observes those elements with a single
 * `IntersectionObserver`, and returns the **id of the topmost visible
 * section**. Returns `null` when nothing has reported as visible yet —
 * including on the server, during the first render before the effect
 * runs, and any frame where no observed section intersects the
 * (margin-shrunken) viewport.
 *
 * ### Behavioural contract
 *
 * - **Return value.** `string | null`. `null` until at least one section
 *   has been reported intersecting; never falls back to a "first id"
 *   heuristic. Consumers that want a default highlight should fall back
 *   themselves: `active ?? ids[0]`.
 * - **Tie-breaking.** When multiple sections intersect simultaneously,
 *   the hook picks the one **closest to the top of the viewport**
 *   (smallest `boundingClientRect.top`). This matches the user's
 *   expectation that scrolling DOWN advances the highlight forward, not
 *   backward.
 * - **Missing ids.** An id that resolves to no element is skipped
 *   silently. The observer is created only when at least one element
 *   resolves; an empty `ids` array (or one with all-missing ids) leaves
 *   `activeId` as `null` and creates no observer.
 * - **Cleanup.** The observer is disconnected on unmount and when the
 *   `ids` set changes, before a new observer is created. No leaks.
 * - **Re-observation on `ids` change.** The hook detects changes via a
 *   string sentinel `ids.join("|")`. Pass `ids` as a stable reference
 *   (constant module-scope array, or `useMemo`) to avoid recreating the
 *   observer on every render. The hook does not memoise `ids` for you
 *   because the consumer typically already knows whether the array is
 *   stable.
 * - **SSR safety.** `IntersectionObserver` and `document` are accessed
 *   only inside `useEffect`, which never runs on the server. The hook
 *   returns `null` during server rendering and the first client render
 *   pre-commit. A `typeof window` guard inside the effect protects
 *   older runtimes that evaluate `useEffect` outside a browser.
 * - **`useState` initial value.** Always `null`. Returning the first id
 *   would highlight a section that the user has not yet seen and
 *   contradict the SSR/hydration contract.
 *
 * ### Why this lives in the design system as a hook, not as a component
 *
 * The visual surface (a sticky nav with highlighted active item) is
 * already covered by `Navigation` + `NavLink` with the `active` prop. A
 * `<ScrollSpy>` component would fuse behaviour and visual, restrict
 * layout choice, and couple to a sibling component (`SectionCard`) via
 * an opaque id-string convention. As a hook the consumer keeps the
 * `ids` constant in one place and composes the nav however they want:
 * vertical, horizontal, sticky, in a drawer, etc.
 *
 * @example
 * ```tsx
 * "use client";
 * import { useScrollSpy, Navigation, NavLink } from "@fabio.caffarello/react-design-system";
 *
 * const SECTIONS = ["intro", "votos", "gastos"];
 *
 * function ProfileToc() {
 *   const active = useScrollSpy(SECTIONS, { rootMargin: "-56px 0px -50% 0px" });
 *   return (
 *     <nav className="sticky top-14">
 *       <Navigation orientation="vertical">
 *         {SECTIONS.map((id) => (
 *           <NavLink
 *             key={id}
 *             href={`#${id}`}
 *             active={id === active}
 *             aria-current={id === active ? "location" : undefined}
 *           >
 *             {id}
 *           </NavLink>
 *         ))}
 *       </Navigation>
 *     </nav>
 *   );
 * }
 * ```
 *
 * @param ids - Element ids to observe, in document order. Stable
 *   reference recommended (constant or `useMemo`).
 * @param options - Optional `IntersectionObserver` overrides — see
 *   {@link UseScrollSpyOptions}.
 * @returns The id of the topmost visible section, or `null` when
 *   nothing is reported visible yet.
 */
export function useScrollSpy(
  ids: string[],
  options: UseScrollSpyOptions = {},
): string | null {
  const { rootMargin = "0px 0px -50% 0px", threshold = 0 } = options;
  const [activeId, setActiveId] = useState<string | null>(null);

  // The dependency sentinel: `ids.join("|")` collapses a stable array
  // content to a stable string, so passing `["a","b","c"]` literally on
  // every render does not recreate the observer. The pipe is safe as a
  // separator because HTML id syntax does not allow it (per the HTML
  // spec, an id may not contain whitespace; pipes are not whitespace
  // but are also not produced by any conventional id-generation
  // strategy in this codebase). If a consumer ever generates ids with
  // pipes, `ids` should be memoised by the consumer and the sentinel
  // would still detect the array-identity change via render-trigger.
  const idsKey = ids.join("|");

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin, threshold },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // The dependency list intentionally watches the string sentinel
    // (idsKey), not the array itself, so a fresh array with identical
    // content does NOT recreate the observer. rootMargin/threshold are
    // primitive comparisons.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, rootMargin, threshold]);

  return activeId;
}

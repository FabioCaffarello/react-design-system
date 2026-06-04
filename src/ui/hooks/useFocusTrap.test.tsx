import { describe, it, expect, afterEach } from "vitest";
import { useRef } from "react";
import { renderHook } from "@testing-library/react";
import { useFocusTrap } from "./useFocusTrap";

/**
 * Test helper: render the hook against a freshly-built container with
 * the given button labels. Returns the container, the rendered button
 * elements, and a rerender function for toggling `isActive`.
 *
 * jsdom does NOT simulate the browser's native Tab focus traversal. The
 * hook's contract is therefore tested by:
 *   - explicitly setting `document.activeElement` to a known element,
 *   - firing a synthetic `keydown` Tab/Shift+Tab event at document level
 *     (matching the hook's `addEventListener("keydown", ...)` scope),
 *   - asserting that `document.activeElement` after the dispatch
 *     reflects the hook's intervention (cycled, or unchanged for
 *     non-boundary cases).
 *
 * Native browser default for middle-element Tabs is not exercised here
 * — the hook explicitly does NOT preventDefault those, so behaviour is
 * delegated to the platform. The test confirms non-intervention by
 * asserting `event.defaultPrevented === false` for those keystrokes.
 *
 * jsdom offsetParent caveat: jsdom returns `null` for `offsetParent` on
 * every connected element (no layout engine), which would make the
 * hook's visibility filter exclude everything. In real browsers,
 * `offsetParent !== null` is essential — it filters out hidden buttons
 * (display: none / visibility: hidden / detached). The production
 * filter stays; tests mock `offsetParent` on each helper-created button
 * to simulate the real-browser "visible" case.
 */
function makeVisible(el: HTMLElement): void {
  // Mock offsetParent to match real-browser behaviour for a visible,
  // connected, non-hidden element. jsdom doesn't compute layout, so we
  // assert visibility via this property explicitly.
  Object.defineProperty(el, "offsetParent", {
    configurable: true,
    get: () => document.body,
  });
}
function buildTrap(labels: string[], isActive = true) {
  const container = document.createElement("div");
  const buttons: HTMLButtonElement[] = [];
  for (const label of labels) {
    const btn = document.createElement("button");
    btn.textContent = label;
    container.appendChild(btn);
    buttons.push(btn);
  }
  document.body.appendChild(container);
  // Mock offsetParent on every button after container is connected to
  // body (otherwise jsdom would report every element as "hidden").
  for (const btn of buttons) makeVisible(btn);

  const { rerender, unmount } = renderHook(
    ({ active }: { active: boolean }) => {
      const ref = useRef<HTMLElement | null>(container);
      useFocusTrap(ref, active);
    },
    { initialProps: { active: isActive } },
  );

  return { container, buttons, rerender, unmount };
}

function fireTabAtDocument(opts: { shift: boolean } = { shift: false }) {
  const event = new KeyboardEvent("keydown", {
    key: "Tab",
    shiftKey: opts.shift,
    bubbles: true,
    cancelable: true,
  });
  document.dispatchEvent(event);
  return event;
}

describe("useFocusTrap", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("Tab on last focusable cycles to first", () => {
    const { buttons } = buildTrap(["A", "B", "C"]);
    buttons[2].focus();
    expect(document.activeElement).toBe(buttons[2]);

    const event = fireTabAtDocument({ shift: false });

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(buttons[0]);
  });

  it("Shift+Tab on first focusable cycles to last", () => {
    const { buttons } = buildTrap(["A", "B", "C"]);
    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);

    const event = fireTabAtDocument({ shift: true });

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(buttons[2]);
  });

  it("Tab on a middle element does not intervene (browser default)", () => {
    const { buttons } = buildTrap(["A", "B", "C"]);
    buttons[1].focus();
    expect(document.activeElement).toBe(buttons[1]);

    const event = fireTabAtDocument({ shift: false });

    // Hook explicitly does NOT preventDefault for non-boundary Tabs —
    // platform handles sequential focus navigation in real browsers.
    expect(event.defaultPrevented).toBe(false);
  });

  it("Shift+Tab on a middle element does not intervene (browser default)", () => {
    const { buttons } = buildTrap(["A", "B", "C"]);
    buttons[1].focus();

    const event = fireTabAtDocument({ shift: true });

    expect(event.defaultPrevented).toBe(false);
  });

  it("zero focusables: Tab and Shift+Tab are both prevented (no escape)", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    renderHook(() => {
      const ref = useRef<HTMLElement | null>(container);
      useFocusTrap(ref, true);
    });

    const tab = fireTabAtDocument({ shift: false });
    expect(tab.defaultPrevented).toBe(true);

    const shiftTab = fireTabAtDocument({ shift: true });
    expect(shiftTab.defaultPrevented).toBe(true);
  });

  it("disabled focusables are excluded from boundary calculation", () => {
    const container = document.createElement("div");
    const a = document.createElement("button");
    a.textContent = "A";
    const b = document.createElement("button");
    b.textContent = "B (disabled)";
    b.disabled = true;
    const c = document.createElement("button");
    c.textContent = "C";
    container.append(a, b, c);
    document.body.appendChild(container);
    // Note: B is left visible too; the production filter rejects it on
    // the `.disabled` check, not on visibility.
    makeVisible(a);
    makeVisible(b);
    makeVisible(c);

    renderHook(() => {
      const ref = useRef<HTMLElement | null>(container);
      useFocusTrap(ref, true);
    });

    // C is the last enabled focusable. Tab on it should cycle to A
    // (skipping B even though B is structurally between them).
    c.focus();
    const event = fireTabAtDocument({ shift: false });
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(a);
  });

  it("isActive=false: hook does not intervene (Tab leaks out)", () => {
    const { buttons } = buildTrap(["A", "B", "C"], false);
    buttons[2].focus();

    const event = fireTabAtDocument({ shift: false });
    expect(event.defaultPrevented).toBe(false);
    // No focus change driven by the hook — activeElement stays.
    expect(document.activeElement).toBe(buttons[2]);
  });

  it("toggling isActive false → true re-engages the trap", () => {
    const { buttons, rerender } = buildTrap(["A", "B", "C"], false);
    buttons[2].focus();

    let event = fireTabAtDocument({ shift: false });
    expect(event.defaultPrevented).toBe(false);

    rerender({ active: true });

    event = fireTabAtDocument({ shift: false });
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(buttons[0]);
  });

  it("non-Tab keys are ignored", () => {
    const { buttons } = buildTrap(["A", "B"]);
    buttons[1].focus();

    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(buttons[1]);
  });

  it("unmount removes the document keydown listener (no zombie traps)", () => {
    const { buttons, unmount } = buildTrap(["A", "B", "C"]);
    unmount();

    buttons[2].focus();
    const event = fireTabAtDocument({ shift: false });
    // Hook is gone — should be no preventDefault and no focus change
    // attributable to the hook.
    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(buttons[2]);
  });

  // ---------------------------------------------------------------------
  // Focus-outside-container guard. Boundary-only intervention is not
  // enough — if the consumer doesn't auto-focus the trap container on
  // open (or auto-focus is delayed / decoupled), focus is still on
  // whatever was outside the trap when the user presses Tab. Without
  // this guard, the browser advances to the next document-order element
  // — which is BEHIND the overlay. These two tests pin the fix; the
  // existing DialogContent inline trap silently has this gap and got
  // away with it because Dialog always auto-focuses on open.
  // ---------------------------------------------------------------------

  it("focus outside container: Tab pulls focus to first focusable inside trap", () => {
    const { buttons } = buildTrap(["A", "B", "C"]);

    // Set up an "outside" button — exists in the document but NOT a
    // child of the trap container. Focus it before firing Tab.
    const outside = document.createElement("button");
    outside.textContent = "Outside";
    document.body.appendChild(outside);
    makeVisible(outside);
    outside.focus();
    expect(document.activeElement).toBe(outside);

    const event = fireTabAtDocument({ shift: false });

    // The hook must intervene: preventDefault and pull focus to the
    // FIRST focusable inside the trap. Without the guard, the browser
    // would have advanced from `outside` to the next document-order
    // focusable, which is `A` only because the trap happens to be next
    // — in a real overlay scenario the next document focusable is
    // something behind the overlay.
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(buttons[0]);
  });

  it("focus outside container: Shift+Tab pulls focus to last focusable inside trap", () => {
    const { buttons } = buildTrap(["A", "B", "C"]);

    const outside = document.createElement("button");
    outside.textContent = "Outside";
    document.body.appendChild(outside);
    makeVisible(outside);
    outside.focus();
    expect(document.activeElement).toBe(outside);

    const event = fireTabAtDocument({ shift: true });

    // Shift+Tab from outside should pull to the LAST focusable inside
    // (the "tail" of the trap, mirroring Shift+Tab's reverse direction).
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(buttons[2]);
  });
});

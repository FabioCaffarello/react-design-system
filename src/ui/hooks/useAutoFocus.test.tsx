import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { useRef } from "react";
import { renderHook, act } from "@testing-library/react";
import { useAutoFocus } from "./useAutoFocus";

/**
 * jsdom offsetParent caveat: jsdom returns `null` for `offsetParent`
 * on every connected element (no layout engine). The hook's filter
 * `offsetParent !== null` is essential in real browsers but rejects
 * every node in jsdom. Tests stub `offsetParent` on the elements they
 * care about via `Object.defineProperty`, mirroring the pattern
 * established in `useFocusTrap.test.tsx`.
 */
function makeVisible(el: HTMLElement): void {
  Object.defineProperty(el, "offsetParent", {
    configurable: true,
    get: () => document.body,
  });
}

function buildContainer(labels: string[]): {
  container: HTMLDivElement;
  buttons: HTMLButtonElement[];
} {
  const container = document.createElement("div");
  const buttons: HTMLButtonElement[] = [];
  for (const label of labels) {
    const btn = document.createElement("button");
    btn.textContent = label;
    container.appendChild(btn);
    buttons.push(btn);
  }
  document.body.appendChild(container);
  for (const btn of buttons) makeVisible(btn);
  return { container, buttons };
}

describe("useAutoFocus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("focuses first focusable on isActive rising edge", () => {
    const { container, buttons } = buildContainer(["A", "B", "C"]);

    renderHook(() => {
      const ref = useRef<HTMLElement | null>(container);
      useAutoFocus(ref, true);
    });

    // Auto-focus is deferred — pre-flush, nothing has happened yet.
    expect(document.activeElement).toBe(document.body);

    act(() => {
      vi.runAllTimers();
    });

    expect(document.activeElement).toBe(buttons[0]);
  });

  it("isActive=false does not move focus", () => {
    const { container } = buildContainer(["A", "B"]);

    const outsideTrigger = document.createElement("button");
    outsideTrigger.textContent = "Trigger";
    document.body.appendChild(outsideTrigger);
    makeVisible(outsideTrigger);
    outsideTrigger.focus();

    renderHook(() => {
      const ref = useRef<HTMLElement | null>(container);
      useAutoFocus(ref, false);
    });

    act(() => {
      vi.runAllTimers();
    });

    // Focus stays where it was — hook only runs on rising edge.
    expect(document.activeElement).toBe(outsideTrigger);
  });

  it("toggling isActive false → true triggers auto-focus", () => {
    const { container, buttons } = buildContainer(["A", "B"]);

    const { rerender } = renderHook(
      ({ active }: { active: boolean }) => {
        const ref = useRef<HTMLElement | null>(container);
        useAutoFocus(ref, active);
      },
      { initialProps: { active: false } },
    );

    act(() => {
      vi.runAllTimers();
    });
    expect(document.activeElement).toBe(document.body);

    rerender({ active: true });
    act(() => {
      vi.runAllTimers();
    });

    expect(document.activeElement).toBe(buttons[0]);
  });

  it("no focusable children: focuses container itself with tabindex=-1", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    makeVisible(container);

    renderHook(() => {
      const ref = useRef<HTMLElement | null>(container);
      useAutoFocus(ref, true);
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(container.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(container);
  });

  it("container with pre-existing tabindex: doesn't overwrite", () => {
    const container = document.createElement("div");
    container.setAttribute("tabindex", "0");
    document.body.appendChild(container);
    makeVisible(container);

    renderHook(() => {
      const ref = useRef<HTMLElement | null>(container);
      useAutoFocus(ref, true);
    });

    act(() => {
      vi.runAllTimers();
    });

    // Pre-existing tabindex preserved — the fallback only writes when
    // no tabindex was authored.
    expect(container.getAttribute("tabindex")).toBe("0");
    expect(document.activeElement).toBe(container);
  });

  it("disabled focusable is skipped, first enabled is focused", () => {
    const container = document.createElement("div");
    const a = document.createElement("button");
    a.textContent = "A (disabled)";
    a.disabled = true;
    const b = document.createElement("button");
    b.textContent = "B";
    const c = document.createElement("button");
    c.textContent = "C";
    container.append(a, b, c);
    document.body.appendChild(container);
    makeVisible(a);
    makeVisible(b);
    makeVisible(c);

    renderHook(() => {
      const ref = useRef<HTMLElement | null>(container);
      useAutoFocus(ref, true);
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(document.activeElement).toBe(b);
  });

  it("unmount before timer fires: no focus side effect", () => {
    const { container, buttons } = buildContainer(["A", "B"]);

    const outsideTrigger = document.createElement("button");
    outsideTrigger.textContent = "Trigger";
    document.body.appendChild(outsideTrigger);
    makeVisible(outsideTrigger);
    outsideTrigger.focus();

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLElement | null>(container);
      useAutoFocus(ref, true);
    });

    unmount();
    act(() => {
      vi.runAllTimers();
    });

    // Timer was cleared on unmount; focus never moved off the trigger.
    expect(document.activeElement).toBe(outsideTrigger);
    expect(document.activeElement).not.toBe(buttons[0]);
  });

  it("ref.current null at timer fire: no-op (does not throw)", () => {
    renderHook(() => {
      const ref = useRef<HTMLElement | null>(null);
      useAutoFocus(ref, true);
    });

    expect(() => {
      act(() => {
        vi.runAllTimers();
      });
    }).not.toThrow();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFocusRestore } from "./useFocusRestore";

describe("useFocusRestore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("snapshots document.activeElement when isOpen flips true", () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Trigger";
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const { rerender } = renderHook(({ isOpen }) => useFocusRestore(isOpen), {
      initialProps: { isOpen: false },
    });

    // Open the overlay — snapshot should occur.
    rerender({ isOpen: true });
    // Move focus away (simulating an autofocus inside the now-open
    // overlay onto its first focusable).
    const insideOverlay = document.createElement("button");
    document.body.appendChild(insideOverlay);
    insideOverlay.focus();
    expect(document.activeElement).toBe(insideOverlay);

    // Close — restoration runs in setTimeout(0).
    rerender({ isOpen: false });
    act(() => {
      vi.runAllTimers();
    });

    expect(document.activeElement).toBe(trigger);
  });

  it("restore is deferred by setTimeout(0) — matches DialogProvider timing", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender } = renderHook(({ isOpen }) => useFocusRestore(isOpen), {
      initialProps: { isOpen: false },
    });

    rerender({ isOpen: true });

    const distraction = document.createElement("button");
    document.body.appendChild(distraction);
    distraction.focus();

    rerender({ isOpen: false });

    // Synchronously after the rerender — restore has NOT yet run.
    // (Dialog.test.tsx:221 depends on this exact deferral shape.)
    expect(document.activeElement).toBe(distraction);

    act(() => {
      vi.runAllTimers();
    });
    expect(document.activeElement).toBe(trigger);
  });

  it("no-op when isOpen stays false (no spurious restore)", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    renderHook(() => useFocusRestore(false));
    act(() => {
      vi.runAllTimers();
    });

    expect(document.activeElement).toBe(trigger);
  });

  it("does not throw if the snapshotted element was removed before restore", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender } = renderHook(({ isOpen }) => useFocusRestore(isOpen), {
      initialProps: { isOpen: false },
    });

    rerender({ isOpen: true });
    // Simulate the trigger being unmounted while the overlay is open.
    trigger.remove();
    rerender({ isOpen: false });

    // Detached `.focus()` is a no-op in browsers and jsdom — should not
    // throw, should not crash the consumer.
    expect(() =>
      act(() => {
        vi.runAllTimers();
      }),
    ).not.toThrow();
  });

  it("restore target on first open is the element focused at that moment, not at mount time", () => {
    const firstTrigger = document.createElement("button");
    firstTrigger.textContent = "First";
    const secondTrigger = document.createElement("button");
    secondTrigger.textContent = "Second";
    document.body.appendChild(firstTrigger);
    document.body.appendChild(secondTrigger);

    // Focus the FIRST trigger before mount.
    firstTrigger.focus();
    const { rerender } = renderHook(({ isOpen }) => useFocusRestore(isOpen), {
      initialProps: { isOpen: false },
    });

    // BEFORE opening, the user moves focus to the SECOND trigger.
    secondTrigger.focus();
    expect(document.activeElement).toBe(secondTrigger);

    // Now open: snapshot should capture secondTrigger, not firstTrigger.
    rerender({ isOpen: true });
    const insideOverlay = document.createElement("button");
    document.body.appendChild(insideOverlay);
    insideOverlay.focus();

    rerender({ isOpen: false });
    act(() => {
      vi.runAllTimers();
    });

    expect(document.activeElement).toBe(secondTrigger);
  });

  it("restores focus on unmount-while-open ({isOpen && <Overlay/>} pattern)", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    // Mount already open — the overlay subtree only exists while open.
    const { unmount } = renderHook(({ isOpen }) => useFocusRestore(isOpen), {
      initialProps: { isOpen: true },
    });

    const insideOverlay = document.createElement("button");
    document.body.appendChild(insideOverlay);
    insideOverlay.focus();
    expect(document.activeElement).toBe(insideOverlay);

    // Regression: closing `{isOpen && <Overlay/>}` unmounts the hook with
    // isOpen still true — there is no isOpen=false render. The restore
    // must run from the effect cleanup, not a falling-edge branch, or
    // focus is stranded on <body> (WCAG 2.4.3).
    unmount();
    act(() => {
      vi.runAllTimers();
    });

    expect(document.activeElement).toBe(trigger);
  });
});

/**
 * useScrollSpy tests
 *
 * jsdom does not ship IntersectionObserver, so each test installs a
 * controllable stub via `vi.stubGlobal`. The stub captures the
 * constructor callback and exposes a `fire(entries)` helper so the
 * tests drive intersection state synchronously instead of waiting for
 * the browser to do it for them. Cleanup is mandatory: leaving the
 * stub installed leaks into neighbouring tests because
 * IntersectionObserver does not exist in the default jsdom global.
 */

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useScrollSpy } from "./useScrollSpy";

interface ObserverInstance {
  callback: IntersectionObserverCallback;
  observed: Element[];
  disconnect: Mock;
}

let instances: ObserverInstance[] = [];

function installObserverStub() {
  instances = [];
  class StubObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    private callback: IntersectionObserverCallback;
    private observed: Element[] = [];
    public disconnect: Mock = vi.fn(() => {
      this.observed = [];
    });

    constructor(
      callback: IntersectionObserverCallback,
      _options?: IntersectionObserverInit,
    ) {
      this.callback = callback;
      instances.push({
        callback,
        observed: this.observed,
        disconnect: this.disconnect,
      });
    }
    observe(el: Element): void {
      this.observed.push(el);
    }
    unobserve(el: Element): void {
      this.observed = this.observed.filter((e) => e !== el);
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", StubObserver);
}

function uninstallObserverStub() {
  vi.unstubAllGlobals();
  instances = [];
}

/** Build a fake `IntersectionObserverEntry` for the captured callback. */
function entry(target: Element, top: number, isIntersecting: boolean) {
  return {
    target,
    isIntersecting,
    boundingClientRect: { top } as DOMRectReadOnly,
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    time: 0,
  } as IntersectionObserverEntry;
}

function mountSections(ids: string[]): HTMLElement[] {
  return ids.map((id) => {
    const el = document.createElement("section");
    el.id = id;
    document.body.appendChild(el);
    return el;
  });
}

describe("useScrollSpy", () => {
  beforeEach(() => {
    installObserverStub();
  });

  afterEach(() => {
    uninstallObserverStub();
    document.body.innerHTML = "";
  });

  it("returns null before any intersection is reported", () => {
    mountSections(["intro", "votos"]);
    const { result } = renderHook(() => useScrollSpy(["intro", "votos"]));
    expect(result.current).toBeNull();
  });

  it("updates activeId when the observer reports an intersection", () => {
    const [intro, votos] = mountSections(["intro", "votos"]);
    const { result } = renderHook(() => useScrollSpy(["intro", "votos"]));

    expect(instances).toHaveLength(1);
    act(() => {
      instances[0]!.callback(
        [entry(intro, 10, true), entry(votos, 600, false)],
        instances[0] as unknown as IntersectionObserver,
      );
    });
    expect(result.current).toBe("intro");
  });

  it("ties broken by smallest boundingClientRect.top (topmost wins)", () => {
    const [a, b, c] = mountSections(["a", "b", "c"]);
    const { result } = renderHook(() => useScrollSpy(["a", "b", "c"]));

    act(() => {
      instances[0]!.callback(
        [
          // Three sections all intersecting; b is closer to the top
          // than a, but c is even closer. Topmost (smallest top) wins.
          entry(a, 100, true),
          entry(b, 50, true),
          entry(c, 5, true),
        ],
        instances[0] as unknown as IntersectionObserver,
      );
    });
    expect(result.current).toBe("c");
  });

  it("ignores non-existent ids without crashing or creating no-op observers", () => {
    mountSections(["only-real"]); // "ghost" id is absent from the DOM
    const { result } = renderHook(() => useScrollSpy(["ghost", "only-real"]));

    // One observer was created (because at least one element resolved).
    expect(instances).toHaveLength(1);
    // It observes only the real element, not the ghost.
    expect(instances[0]!.observed).toHaveLength(1);
    expect(result.current).toBeNull();
  });

  it("creates no observer when every id is missing", () => {
    // No sections mounted.
    renderHook(() => useScrollSpy(["x", "y"]));
    expect(instances).toHaveLength(0);
  });

  it("creates no observer when ids is empty", () => {
    renderHook(() => useScrollSpy([]));
    expect(instances).toHaveLength(0);
  });

  it("disconnects the observer on unmount", () => {
    mountSections(["intro"]);
    const { unmount } = renderHook(() => useScrollSpy(["intro"]));
    const disconnect = instances[0]!.disconnect;
    expect(disconnect).not.toHaveBeenCalled();
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("re-observes when the ids set changes (same length, different content)", () => {
    mountSections(["a", "b"]);
    const { rerender } = renderHook(
      ({ ids }: { ids: string[] }) => useScrollSpy(ids),
      { initialProps: { ids: ["a"] } },
    );
    expect(instances).toHaveLength(1);
    expect(instances[0]!.observed).toHaveLength(1);

    rerender({ ids: ["b"] });
    // Previous observer disconnected, new one created.
    expect(instances).toHaveLength(2);
    expect(instances[0]!.disconnect).toHaveBeenCalledTimes(1);
    expect(instances[1]!.observed).toHaveLength(1);
    expect(instances[1]!.observed[0]).toBe(document.getElementById("b"));
  });

  it("does NOT recreate the observer when ids content is identical (sentinel stability)", () => {
    mountSections(["a", "b"]);
    const { rerender } = renderHook(
      ({ ids }: { ids: string[] }) => useScrollSpy(ids),
      { initialProps: { ids: ["a", "b"] } },
    );
    expect(instances).toHaveLength(1);

    // Fresh array instance, identical content. Sentinel "a|b" is the
    // same string both renders — the effect should NOT re-run.
    rerender({ ids: ["a", "b"] });
    expect(instances).toHaveLength(1);
    expect(instances[0]!.disconnect).not.toHaveBeenCalled();
  });

  it("forwards rootMargin and threshold options to IntersectionObserver", () => {
    mountSections(["intro"]);

    const ObserverSpy = vi.fn().mockImplementation(function (
      this: IntersectionObserver,
      callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit,
    ) {
      // Record into our captured instances list so cleanup still works.
      instances.push({
        callback,
        observed: [],
        disconnect: vi.fn(),
      });
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
        takeRecords: vi.fn().mockReturnValue([]),
        root: null,
        rootMargin: options?.rootMargin ?? "",
        thresholds: [],
      } as unknown as IntersectionObserver;
    });
    vi.stubGlobal("IntersectionObserver", ObserverSpy);

    renderHook(() =>
      useScrollSpy(["intro"], {
        rootMargin: "-56px 0px -50% 0px",
        threshold: 0.25,
      }),
    );

    expect(ObserverSpy).toHaveBeenCalledTimes(1);
    const opts = ObserverSpy.mock.calls[0]![1] as IntersectionObserverInit;
    expect(opts.rootMargin).toBe("-56px 0px -50% 0px");
    expect(opts.threshold).toBe(0.25);
  });
});

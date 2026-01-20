import "@testing-library/jest-dom";

// Mock ResizeObserver for tests
if (typeof (globalThis as unknown).ResizeObserver === 'undefined') {
  (globalThis as unknown).ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

// Mock localStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock SVGElement.getBBox for tests (used by @xyflow/react)
if (typeof SVGElement !== 'undefined' && !SVGElement.prototype.getBBox) {
  SVGElement.prototype.getBBox = function(): DOMRect {
    return new DOMRect(0, 0, 100, 100);
  };
}

// Mock SVGTextElement.getBBox specifically for edge text
if (typeof SVGTextElement !== 'undefined' && !SVGTextElement.prototype.getBBox) {
  SVGTextElement.prototype.getBBox = function(): DOMRect {
    return new DOMRect(0, 0, 50, 20);
  };
}

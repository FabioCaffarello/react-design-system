import "@testing-library/jest-dom";

// Mock ResizeObserver for tests
if (typeof global.ResizeObserver === 'undefined') {
   
  global.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  } as typeof ResizeObserver;
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
  SVGElement.prototype.getBBox = function() {
    return {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
  };
}

// Mock SVGTextElement.getBBox specifically for edge text
if (typeof SVGTextElement !== 'undefined' && !SVGTextElement.prototype.getBBox) {
  SVGTextElement.prototype.getBBox = function() {
    return {
      x: 0,
      y: 0,
      width: 50,
      height: 20,
    };
  };
}

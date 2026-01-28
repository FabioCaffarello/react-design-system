import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/react-vite";
import * as projectAnnotations from "./preview";

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);

// Suppress browser connection errors globally
if (typeof globalThis !== "undefined") {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const message = args[0];
    if (
      typeof message === "string" &&
      (message.includes("Browser connection was closed") ||
        message.includes("rpc is closed") ||
        message.includes("createTesters") ||
        message.includes("[birpc] rpc is closed"))
    ) {
      // Silently ignore browser connection errors
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

// Suppress unhandled browser connection errors that are non-critical
// These errors occur during teardown when the WebSocket connection is closed
// before the RPC cleanup is complete - this is a known issue with Vitest browser mode
if (typeof process !== "undefined") {
  const originalEmit = process.emit;
  process.emit = function (event: string | symbol, ...args: unknown[]) {
    // Suppress uncaughtException and unhandledRejection for browser connection errors
    if (event === "uncaughtException" || event === "unhandledRejection") {
      const error = args[0];
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string" &&
        (error.message.includes("Browser connection was closed") ||
          error.message.includes("rpc is closed") ||
          error.message.includes("createTesters") ||
          error.message.includes("[birpc] rpc is closed") ||
          error.message.includes("Browser connection") ||
          error.message.includes("rpc is closed"))
      ) {
        // Silently ignore browser connection errors - they're non-critical
        return false;
      }
    }
    return originalEmit.apply(process, [event, ...args]);
  };

  // Also handle unhandledRejection events
  const originalOn = process.on;
  process.on = function (
    event: string | symbol,
    listener: (...args: unknown[]) => void,
  ) {
    if (event === "unhandledRejection") {
      return originalOn.call(process, event, (reason) => {
        if (
          typeof reason === "object" &&
          reason !== null &&
          "message" in reason &&
          typeof reason.message === "string" &&
          (reason.message.includes("Browser connection was closed") ||
            reason.message.includes("rpc is closed") ||
            reason.message.includes("createTesters") ||
            reason.message.includes("[birpc] rpc is closed") ||
            reason.message.includes("Browser connection") ||
            reason.message.includes("rpc is closed"))
        ) {
          // Silently ignore browser connection errors - they're non-critical
          return;
        }
        // Call original listener for other errors
        if (typeof listener === "function") {
          listener(reason);
        }
      });
    }
    return originalOn.call(process, event, listener);
  };
}

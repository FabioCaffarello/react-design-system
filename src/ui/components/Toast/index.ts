/**
 * Toast Components
 *
 * Toast notification system with provider, hook, and container.
 *
 * NOTE: ToastProvider and ToastContext have been moved to src/ui/providers/
 * to avoid circular dependencies. They are exported from src/ui/index.ts.
 *
 * IMPORTANT: Do NOT re-export providers here to avoid duplicate exports
 * that create circular dependencies in Turbopack/Next.js bundling.
 * Import providers directly from the main package entry point:
 *
 * ```ts
 * import { ToastProvider } from '@fabio.caffarello/react-design-system';
 * ```
 */

// Export toast components
export { ToastContainer } from "./ToastContainer";
export { Toast } from "./Toast";
export { useToast } from "./useToast";

export type { ToastContainerProps } from "./ToastContainer";
export type { ToastProps } from "./Toast";
export type { ToastOptions } from "./useToast";
export type { Toast as ToastType } from "../../providers/ToastContext";

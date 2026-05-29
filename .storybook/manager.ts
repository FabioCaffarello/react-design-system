/// <reference types="vite/client" />
import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";
import brandImage from "./brand-logo.svg";

// Manager chrome theme. Hex values mirror DS light-mode tokens — the manager
// UI lives outside Tailwind's CSS-vars cascade, so we cannot reference vars
// directly. Phase 13d if a dark-mode toggle ships: duplicate as `themeDark`
// using fg-primary inverse, or bridge via the preview iframe.
const theme = create({
  base: "light",

  brandTitle: "react-design-system",
  brandImage,
  brandUrl: "/",
  brandTarget: "_self",

  colorPrimary: "#0f172a", // slate-900 — fg-primary
  colorSecondary: "#4f46e5", // indigo-600 — fg-brand-emphasis (selected/highlight)

  appBg: "#ffffff", // surface-base
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appBorderColor: "#e2e8f0", // slate-200 — line-default
  appBorderRadius: 6,

  textColor: "#0f172a",
  textMutedColor: "#64748b", // slate-500 — fg-tertiary
  textInverseColor: "#ffffff",

  barTextColor: "#64748b",
  barHoverColor: "#0f172a",
  barSelectedColor: "#0f172a",
  barBg: "#ffffff",

  inputBg: "#ffffff",
  inputBorder: "#e2e8f0",
  inputTextColor: "#0f172a",
  inputBorderRadius: 6,

  fontBase: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  fontCode:
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
});

addons.setConfig({ theme });

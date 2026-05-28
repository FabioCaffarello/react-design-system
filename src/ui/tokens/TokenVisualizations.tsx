/**
 * Token Visualization Components
 *
 * React components for visualizing design tokens in Storybook
 */

import {
  COLOR_TOKENS_LIGHT,
  SPACING_TOKENS,
  SHADOW_TOKENS,
  RADIUS_TOKENS,
  ANIMATION_TOKENS,
  Z_INDEX_TOKENS,
  OPACITY_TOKENS,
  GRADIENT_TOKENS,
} from "./index";
import type { ColorRole } from "./colors";

/**
 * Color Palette Visualization
 */
export function ColorPalette() {
  const colorRoles: ColorRole[] = [
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
    "info",
    "neutral",
  ];

  return (
    <div className="space-y-6">
      {colorRoles.map((role) => {
        const color = COLOR_TOKENS_LIGHT[role];
        return (
          <div key={role} className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 capitalize">
              {role}
            </h3>
            <div className="flex gap-2">
              <ColorSwatch
                label="light"
                color={color.light.hex}
                textColor="#000"
              />
              <ColorSwatch
                label="DEFAULT"
                color={color.DEFAULT.hex}
                textColor="#fff"
              />
              <ColorSwatch
                label="dark"
                color={color.dark.hex}
                textColor="#fff"
              />
              <ColorSwatch
                label="contrast"
                color={color.contrast.hex}
                textColor={color.DEFAULT.hex}
              />
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>
                Light: {color.light.hex} ({color.light.tailwind})
              </div>
              <div>
                Default: {color.DEFAULT.hex} ({color.DEFAULT.tailwind})
              </div>
              <div>
                Dark: {color.dark.hex} ({color.dark.tailwind})
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ColorSwatch({
  label,
  color,
  textColor,
}: {
  label: string;
  color: string;
  textColor: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-20 h-20 rounded-md border border-gray-200 flex items-center justify-center text-xs font-medium"
        style={{ backgroundColor: color, color: textColor }}
      >
        {label}
      </div>
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  );
}

/**
 * Spacing Reference Visualization
 */
export function SpacingReference() {
  const spacingEntries = Object.entries(SPACING_TOKENS);

  return (
    <div className="space-y-4">
      {spacingEntries.map(([key, token]) => (
        <div key={key} className="flex items-center gap-4">
          <div className="w-32 text-sm font-medium text-gray-700">{key}</div>
          <div className="flex-1 flex items-center gap-2">
            <div className="bg-indigo-500 h-4" style={{ width: token.px }} />
            <span className="text-xs text-gray-600">
              {token.px} ({token.rem})
            </span>
          </div>
          <div className="w-24 text-xs text-gray-500 font-mono">
            {token.tailwind}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Typography Reference Visualization
 */
export function TypographyReference() {
  const typographyEntries = [
    { name: "h1", size: "4xl", weight: "bold", lineHeight: "tight" },
    { name: "h2", size: "3xl", weight: "bold", lineHeight: "tight" },
    { name: "h3", size: "2xl", weight: "semibold", lineHeight: "snug" },
    { name: "body", size: "base", weight: "normal", lineHeight: "relaxed" },
    { name: "label", size: "sm", weight: "medium", lineHeight: "normal" },
    { name: "caption", size: "xs", weight: "normal", lineHeight: "normal" },
  ];

  return (
    <div className="space-y-4">
      {typographyEntries.map(({ name, size, weight, lineHeight }) => (
        <div key={name} className="border-b border-gray-200 pb-4">
          <div className="flex items-baseline gap-4">
            <div className="w-24 text-sm font-medium text-gray-700">{name}</div>
            <div
              className={`text-${size} font-${weight} leading-${lineHeight}`}
            >
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Size: {size} | Weight: {weight} | Line Height: {lineHeight}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Shadow Reference Visualization
 */
export function ShadowReference() {
  const shadowEntries = Object.entries(SHADOW_TOKENS);

  return (
    <div className="grid grid-cols-2 gap-4">
      {shadowEntries.map(([key, token]) => (
        <div key={key} className="space-y-2">
          <div className="text-sm font-medium text-gray-700">{key}</div>
          <div
            className="w-full h-20 bg-white rounded-md flex items-center justify-center"
            style={{ boxShadow: token.value }}
          >
            <span className="text-xs text-gray-600">{token.description}</span>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            {token.tailwind}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Radius Reference Visualization
 */
export function RadiusReference() {
  const radiusEntries = Object.entries(RADIUS_TOKENS);

  return (
    <div className="grid grid-cols-4 gap-4">
      {radiusEntries.map(([key, token]) => (
        <div key={key} className="space-y-2">
          <div className="text-sm font-medium text-gray-700">{key}</div>
          <div
            className="w-20 h-20 bg-indigo-500"
            style={{ borderRadius: token.px }}
          />
          <div className="text-xs text-gray-500">{token.px}</div>
          <div className="text-xs text-gray-500 font-mono">
            {token.tailwind}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Animation Reference Visualization
 */
export function AnimationReference() {
  const animationEntries = Object.entries(ANIMATION_TOKENS);

  return (
    <div className="space-y-4">
      {animationEntries.map(([key, token]) => {
        // Type guard to check if it's an AnimationToken
        const isAnimationToken =
          "easing" in token &&
          "duration" in token &&
          typeof token.duration === "object";

        if (isAnimationToken) {
          const animToken = token as import("./animations").AnimationToken;
          return (
            <div key={key} className="border-b border-gray-200 pb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">
                {key}
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div>
                  Duration: {animToken.duration.value} ({animToken.duration.ms}
                  ms)
                </div>
                <div>Easing: {animToken.easing.description}</div>
                <div className="font-mono">
                  {animToken.duration.tailwind} {animToken.easing.tailwind}
                </div>
              </div>
            </div>
          );
        } else {
          const transToken = token as import("./animations").TransitionToken;
          return (
            <div key={key} className="border-b border-gray-200 pb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">
                {key}
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div>Property: {transToken.property}</div>
                <div>Duration: {transToken.duration}</div>
                <div>Timing: {transToken.timingFunction}</div>
                <div className="font-mono">{transToken.tailwind}</div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}

/**
 * Z-Index Reference Visualization
 */
export function ZIndexReference() {
  const zIndexEntries = Object.entries(Z_INDEX_TOKENS).sort(
    (a, b) => b[1].value - a[1].value,
  );

  return (
    <div className="space-y-2">
      {zIndexEntries.map(([key, token]) => (
        <div
          key={key}
          className="flex items-center gap-4 border-b border-gray-200 pb-2"
        >
          <div className="w-32 text-sm font-medium text-gray-700">{key}</div>
          <div className="flex-1">
            <div className="text-xs text-gray-600">{token.description}</div>
          </div>
          <div className="w-24 text-xs text-gray-500 font-mono">
            {token.tailwind}
          </div>
          <div className="w-16 text-xs text-gray-500 text-right">
            {token.value}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Opacity Reference Visualization
 */
export function OpacityReference() {
  const opacityEntries = Object.entries(OPACITY_TOKENS);

  return (
    <div className="grid grid-cols-5 gap-4">
      {opacityEntries.map(([key, token]) => (
        <div key={key} className="space-y-2">
          <div className="text-sm font-medium text-gray-700">{key}</div>
          <div
            className="w-full h-16 bg-indigo-500 rounded-md"
            style={{ opacity: token.decimal }}
          />
          <div className="text-xs text-gray-500">{token.value}%</div>
          <div className="text-xs text-gray-500 font-mono">
            {token.tailwind}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Gradient Reference Visualization
 */
export function GradientReference() {
  const gradientEntries = Object.entries(GRADIENT_TOKENS);

  return (
    <div className="grid grid-cols-2 gap-4">
      {gradientEntries.map(([key, token]) => (
        <div key={key} className="space-y-2">
          <div className="text-sm font-medium text-gray-700">{key}</div>
          <div
            className="w-full h-20 rounded-md"
            style={{ background: token.value }}
          />
          <div className="text-xs text-gray-500">{token.description}</div>
          <div className="text-xs text-gray-500 font-mono break-all">
            {token.tailwind}
          </div>
        </div>
      ))}
    </div>
  );
}

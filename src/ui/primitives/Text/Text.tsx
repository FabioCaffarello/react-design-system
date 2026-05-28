import type {
  ComponentPropsWithoutRef,
  ElementType,
  HTMLAttributes,
  JSX,
} from "react";
import { forwardRef } from "react";
import { getTypographyClasses } from "../../tokens/typography";
import { cn } from "../../utils";

type TextColorRole =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";
type TextColorShade = "light" | "DEFAULT" | "dark" | "contrast";

// Lookup table: literal Tailwind classes so v4 can detect them at build.
// Brand/feedback DEFAULT cells use semantic tokens; light/dark cells stay
// primitive (no semantic equivalent for shade variants). Neutral cells
// use the Phase 7 semantic suggestions (text-fg-{primary,secondary,...}).
const TEXT_COLOR_CLASSES: Record<
  TextColorRole,
  Record<TextColorShade, string>
> = {
  primary: {
    light: "text-indigo-400",
    DEFAULT: "text-fg-brand",
    dark: "text-indigo-600",
    contrast: "text-fg-inverse",
  },
  secondary: {
    light: "text-pink-300",
    DEFAULT: "text-fg-brand-secondary",
    dark: "text-pink-600",
    contrast: "text-fg-inverse",
  },
  success: {
    light: "text-green-300",
    DEFAULT: "text-fg-success",
    dark: "text-success-dark",
    contrast: "text-fg-inverse",
  },
  warning: {
    light: "text-yellow-300",
    DEFAULT: "text-fg-warning",
    dark: "text-warning-dark",
    contrast: "text-fg-inverse",
  },
  error: {
    light: "text-red-300",
    DEFAULT: "text-fg-error",
    dark: "text-error-dark",
    contrast: "text-fg-inverse",
  },
  info: {
    light: "text-blue-300",
    DEFAULT: "text-fg-info",
    dark: "text-info-dark",
    contrast: "text-fg-inverse",
  },
  neutral: {
    light: "text-fg-tertiary",
    DEFAULT: "text-fg-secondary",
    dark: "text-fg-primary",
    contrast: "text-fg-inverse",
  },
};

interface Props<T extends ElementType>
  extends HTMLAttributes<JSX.IntrinsicElements> {
  variant?:
    | "heading"
    | "list"
    | "paragraph"
    | "body"
    | "bodySmall"
    | "bodyLarge"
    | "caption"
    | "label";
  as?: T;
  bold?: boolean;
  italic?: boolean;
  color?: string;
  colorRole?: TextColorRole;
  colorShade?: TextColorShade;
}

type ReturnProps<P extends ElementType> = Props<P> &
  Omit<ComponentPropsWithoutRef<P>, keyof Props<P>>;

function TextComponent<T extends ElementType = "p">(
  {
    variant = "paragraph",
    bold,
    italic,
    className,
    as,
    color,
    colorRole = "neutral",
    colorShade = "dark",
    ...rest
  }: ReturnProps<T>,
  ref: React.Ref<unknown>,
) {
  const classNames: string[] = [];
  let Tag: ElementType;

  if (as) {
    Tag = as;
  } else {
    switch (variant) {
      case "heading":
        Tag = "h2";
        break;
      case "list":
        Tag = "li";
        break;
      case "paragraph":
      default:
        Tag = "p";
        break;
    }
  }

  // Apply typography tokens based on variant
  if (variant === "heading") {
    classNames.push(getTypographyClasses("h2"));
  } else if (variant === "body" || variant === "paragraph") {
    classNames.push(getTypographyClasses("body"));
  } else if (variant === "bodySmall") {
    classNames.push(getTypographyClasses("bodySmall"));
  } else if (variant === "bodyLarge") {
    classNames.push(getTypographyClasses("bodyLarge"));
  } else if (variant === "caption") {
    classNames.push(getTypographyClasses("caption"));
  } else if (variant === "label") {
    classNames.push(getTypographyClasses("label"));
  } else {
    // Default to body for list and other variants
    classNames.push(getTypographyClasses("body"));
  }

  // Override font weight if bold is specified
  if (bold) {
    classNames.push("font-bold");
  }

  if (italic) {
    classNames.push("italic");
  }

  // Apply color via lookup table. `color` prop is accepted for API
  // back-compat but Tailwind v4 can't generate dynamic `text-${color}`
  // classes, so it has no visual effect — colorRole/colorShade are
  // the supported channel.
  void color;
  classNames.push(TEXT_COLOR_CLASSES[colorRole][colorShade]);

  return <Tag ref={ref} className={cn(...classNames, className)} {...rest} />;
}

// Use forwardRef with proper typing for polymorphic component
const Text = forwardRef(TextComponent) as <T extends ElementType = "p">(
  props: ReturnProps<T> & { ref?: React.Ref<HTMLElement> },
) => JSX.Element;

export default Text;

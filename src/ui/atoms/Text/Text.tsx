import type {
  ComponentPropsWithoutRef,
  ElementType,
  HTMLAttributes,
  JSX,
} from "react";
import { forwardRef } from "react";
import { getTypographyClasses } from '../../tokens/typography';
import { getColorClass } from '../../tokens/colors';
import { cn } from '../../utils';

interface Props<T extends ElementType>
  extends HTMLAttributes<JSX.IntrinsicElements> {
  variant?: "heading" | "list" | "paragraph" | "body" | "bodySmall" | "bodyLarge" | "caption" | "label";
  as?: T;
  bold?: boolean;
  italic?: boolean;
  color?: string;
  colorRole?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  colorShade?: 'light' | 'DEFAULT' | 'dark' | 'contrast';
}

type ReturnProps<P extends ElementType> = Props<P> &
  Omit<ComponentPropsWithoutRef<P>, keyof Props<P>>;

function TextComponent<T extends ElementType = "p">({
  variant = "paragraph",
  bold,
  italic,
  className,
  as,
  color,
  colorRole = 'neutral',
  colorShade = 'dark',
  ...rest
}: ReturnProps<T>, ref: React.Ref<unknown>) {
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
    classNames.push(getTypographyClasses('h2'));
  } else if (variant === "body" || variant === "paragraph") {
    classNames.push(getTypographyClasses('body'));
  } else if (variant === "bodySmall") {
    classNames.push(getTypographyClasses('bodySmall'));
  } else if (variant === "bodyLarge") {
    classNames.push(getTypographyClasses('bodyLarge'));
  } else if (variant === "caption") {
    classNames.push(getTypographyClasses('caption'));
  } else if (variant === "label") {
    classNames.push(getTypographyClasses('label'));
  } else {
    // Default to body for list and other variants
    classNames.push(getTypographyClasses('body'));
  }

  // Override font weight if bold is specified
  if (bold) {
    classNames.push("font-bold");
  }

  if (italic) {
    classNames.push("italic");
  }

  // Apply color - prefer semantic colorRole/colorShade over custom color
  if (colorRole && colorShade) {
    classNames.push(getColorClass(colorRole, colorShade, 'text'));
  } else if (color) {
    // Fallback to custom color if provided
    // Note: Custom colors should use complete class names that Tailwind can detect
    // For dynamic colors, consider using inline styles or adding to safelist
    // This is a limitation - we can't dynamically construct Tailwind classes
    // For now, we'll use inline style as fallback for custom colors
    // classNames.push(`text-${color}`); // This won't work with Tailwind v4
    // Instead, we'll apply it as inline style if needed
    // For now, fallback to default if custom color is provided
    classNames.push(getColorClass('neutral', 'dark', 'text'));
  } else {
    // Default color
    classNames.push(getColorClass('neutral', 'dark', 'text'));
  }

  return <Tag ref={ref} className={cn(...classNames, className)} {...rest} />;
}

// Use forwardRef with proper typing for polymorphic component
const Text = forwardRef(TextComponent) as <T extends ElementType = "p">(
  props: ReturnProps<T> & { ref?: React.Ref<HTMLElement> }
) => JSX.Element;

export default Text;
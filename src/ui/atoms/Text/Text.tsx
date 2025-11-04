import type {
  ComponentPropsWithoutRef,
  ElementType,
  HTMLAttributes,
  JSX,
} from "react";

interface Props<T extends ElementType>
  extends HTMLAttributes<JSX.IntrinsicElements> {
  variant?: "heading" | "list" | "paragraph";
  as?: T;
  bold?: boolean;
  italic?: boolean;
  color?: string;
}

type ReturnProps<P extends ElementType> = Props<P> &
  Omit<ComponentPropsWithoutRef<P>, keyof Props<P>>;

export default function Text<T extends ElementType = "p">({
  variant,
  bold,
  italic,
  className,
  as,
  color,
  ...rest
}: ReturnProps<T>) {
  const classNames = [className];
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

  if (bold) {
    classNames.push("font-bold");
  }

  if (italic) {
    classNames.push("italic");
  }

  if (color) {
    classNames.push(`text-${color}`);
  }

  return <Tag className={classNames.join(" ")} {...rest} />;
}
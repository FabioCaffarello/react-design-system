import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils";
import { getSpacingClass } from "../../tokens/spacing";

export type CardTitleAs = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  /**
   * Optional icon rendered before the title text.
   */
  icon?: ReactNode;
  /**
   * Optional badge rendered after the title text.
   */
  badge?: ReactNode;
  /**
   * Heading level. Default `h2` — the typical depth for a card title
   * inside a page that already has an `h1`. Use `h3` (or deeper) when
   * the card sits inside a nested section.
   * @default 'h2'
   */
  as?: CardTitleAs;
}

export function CardTitle({
  children,
  icon,
  badge,
  as: As = "h2",
  className,
  ...props
}: CardTitleProps) {
  return (
    <As
      className={cn(
        "text-base font-semibold text-fg-primary",
        "flex items-center",
        getSpacingClass("sm", "gap"),
        className,
      )}
      {...props}
    >
      {icon ? <span className="shrink-0 inline-flex">{icon}</span> : null}
      <span>{children}</span>
      {badge ? <span className="inline-flex">{badge}</span> : null}
    </As>
  );
}

export default CardTitle;

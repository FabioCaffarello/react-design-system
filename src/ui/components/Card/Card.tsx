import { memo, type FC, type HTMLAttributes } from "react";
import { cn, cva } from "../../utils";
import { getRadiusClass, getShadowClass, getSpacingClass } from "../../tokens";
import { CardHeader } from "./CardHeader";
import { CardTitle } from "./CardTitle";
import { CardSubtitle } from "./CardSubtitle";
import { CardActions } from "./CardActions";
import { CardBody } from "./CardBody";

// Ambient declaration so the dev-only warn typechecks without pulling
// @types/node into the app tsconfig. At runtime the consumer's bundler
// replaces `process.env.NODE_ENV` with a literal; the `typeof process`
// guard keeps the branch safe in browser/edge runtimes where `process`
// doesn't exist. Mirrors the precedent in Button.tsx.
declare const process: { env: { NODE_ENV?: string } };

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "selected";
  padding?: "none" | "small" | "medium" | "large";
  onClick?: () => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /**
   * Render the root as a semantic `<section>` instead of `<div>`.
   * When `true`, the Card becomes a landmark — a screen-reader-visible
   * region in the document outline — so it MUST carry an accessible
   * name (either `aria-labelledby` pointing to a `Card.Title` `id` or
   * `aria-label`). A dev-only warning is emitted when this contract
   * isn't met; an anonymous landmark hurts navigation by announcing
   * "region" without a name.
   * @default false
   */
  asSection?: boolean;
}

/**
 * Card — versatile container.
 *
 * Supports the compound pattern via dot-notation:
 *
 * ```tsx
 * <Card asSection aria-labelledby="parlamentares-title">
 *   <Card.Header>
 *     <Card.Title id="parlamentares-title" icon={<Users />} badge={<Badge>Beta</Badge>}>
 *       Parlamentares
 *     </Card.Title>
 *     <Card.Subtitle>Câmara e Senado</Card.Subtitle>
 *     <Card.Actions>
 *       <Button variant="ghost">Editar</Button>
 *     </Card.Actions>
 *   </Card.Header>
 *   <Card.Body>{children}</Card.Body>
 * </Card>
 * ```
 *
 * Backward compat: the flat form (`<Card>{children}</Card>`) and the
 * interactive form (`<Card onClick={...}>`) are unchanged.
 *
 * Server/client boundary: every subcomponent (Card, Card.Header,
 * Card.Title, Card.Subtitle, Card.Actions, Card.Body) is presentational
 * and ships in `./server`. Interactive children (Button with onClick,
 * Link, etc.) supplied via `<Card.Actions>` cross the RSC boundary
 * naturally — the wrapper stays server-safe.
 */
function CardComponent({
  variant = "default",
  padding = "medium",
  className = "",
  onClick,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  asSection = false,
  children,
  ...props
}: CardProps) {
  if (
    typeof process !== "undefined" &&
    process.env.NODE_ENV !== "production" &&
    asSection &&
    !ariaLabel &&
    !ariaLabelledBy
  ) {
    console.warn(
      "[Card] `asSection={true}` requires an accessible name. Pass `aria-labelledby` pointing to your Card.Title `id`, or `aria-label`. A <section> without a name is an anonymous landmark that hurts screen-reader navigation.",
    );
  }

  const cardVariants = cva(
    cn(
      "bg-surface-base",
      getRadiusClass("lg"),
      "border",
      "border-line-default",
      getShadowClass("sm"),
    ),
    {
      variants: {
        variant: {
          default: "",
          hover: cn(
            `hover:${getShadowClass("md")}`,
            "transition-shadow",
            "cursor-pointer",
          ),
          selected: cn("border-line-brand", getShadowClass("md")),
        },
        padding: {
          none: "",
          small: getSpacingClass("xs", "p"),
          medium: getSpacingClass("base", "p"),
          large: getSpacingClass("lg", "p"),
        },
      },
      defaultVariants: {
        variant: "default",
        padding: "medium",
      },
    },
  );

  // ARIA interactivity is driven by `onClick` ONLY. `variant="hover"` is
  // a visual style (hover shadow + cursor hint via cardVariants) — not a
  // declaration that the card is clickable. The previous coupling made
  // any `variant="hover"` Card a `role="button" tabindex=0` outer, which
  // triggered axe `nested-interactive` whenever the consumer composed
  // Buttons inside. Decoupling fixes that without changing the visual
  // behavior. Stories that want a clickable card already pass `onClick`.
  const isInteractive = onClick !== undefined;
  const role = isInteractive ? "button" : undefined;
  const tabIndex = isInteractive ? 0 : undefined;

  const classes = cn(cardVariants({ variant, padding }), className);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (isInteractive && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick?.();
    }
  };

  // Polymorphic root: <section> when asSection, <div> otherwise. Both
  // accept the same HTMLAttributes via `...props` (HTMLDivElement and
  // HTMLElement attribute sets overlap on the props we use).
  const commonProps = {
    className: classes,
    role,
    tabIndex,
    onClick,
    onKeyDown: isInteractive ? handleKeyDown : undefined,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...props,
  } as const;

  if (asSection) {
    return <section {...commonProps}>{children}</section>;
  }
  return <div {...commonProps}>{children}</div>;
}

const MemoCard = memo(CardComponent);
MemoCard.displayName = "Card";

// Compound components (dot-notation). Pattern follows Tabs.tsx — define
// the function, attach subcomponents, cast to a type that exposes them.
type CardCompound = FC<CardProps> & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Subtitle: typeof CardSubtitle;
  Actions: typeof CardActions;
  Body: typeof CardBody;
};

const Card = MemoCard as unknown as CardCompound;
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Actions = CardActions;
Card.Body = CardBody;

export default Card;

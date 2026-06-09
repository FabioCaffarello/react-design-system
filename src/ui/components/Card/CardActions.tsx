import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils";
import { getSpacingClass } from "../../tokens/spacing";

export interface CardActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * CardActions — wrapper that hosts consumer-supplied action buttons
 * within a `Card.Header`.
 *
 * The `data-card-actions` attribute is the structural marker `CardHeader`
 * uses (via Tailwind v4 `:has()` selectors) to switch its grid layout
 * from a single column to `[1fr auto]` when actions are present, so
 * Title/Subtitle stack in column 1 and the action row spans both rows
 * in column 2. Consumers should not override this attribute.
 *
 * This component is presentational: it emits no handlers on the DOM
 * itself. The action elements (typically `<Button>`) are consumer-supplied
 * and React's RSC boundary keeps them as client references — the
 * wrapper stays server-safe.
 */
export function CardActions({
  children,
  className,
  ...props
}: CardActionsProps) {
  return (
    <div
      data-card-actions=""
      className={cn(
        "flex items-center self-start",
        getSpacingClass("sm", "gap"),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default CardActions;

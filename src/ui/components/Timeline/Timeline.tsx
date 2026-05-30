"use client";

import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { getSpacingClass } from "../../tokens/spacing";
import { getRadiusClass } from "../../tokens/radius";

export type TimelineOrientation = "horizontal" | "vertical";

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  content?: ReactNode;
  timestamp?: string;
  icon?: ReactNode;
  status?: "default" | "active" | "completed" | "error";
}

export interface TimelineProps {
  items: TimelineItem[];
  orientation?: TimelineOrientation;
  className?: string;
}

/**
 * Timeline Component
 *
 * A timeline component for displaying events in chronological order.
 * Supports horizontal and vertical orientations.
 * Follows Atomic Design principles as an Organism component.
 *
 * @example
 * ```tsx
 * <Timeline
 *   items={[
 *     { id: '1', title: 'Event 1', description: 'Description 1', timestamp: '2024-01-01' },
 *     { id: '2', title: 'Event 2', description: 'Description 2', timestamp: '2024-01-02' },
 *   ]}
 * />
 * ```
 */
export default function Timeline({
  items,
  orientation = "vertical",
  className = "",
}: TimelineProps) {
  if (orientation === "horizontal") {
    return (
      <div className={`flex items-start ${className}`}>
        {items.map((item, index) => {
          const status =
            item.status ||
            (index === 0
              ? "active"
              : index < items.findIndex((i) => i.status === "active")
                ? "completed"
                : "default");
          const isLast = index === items.length - 1;

          return (
            <div key={item.id} className="flex items-start flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Icon/Indicator */}
                <div
                  // data-marker="pending" — see .claude/rules/colors.md
                  // "fg-quaternary: AA-by-construction exception".
                  {...(status === "default"
                    ? { "data-marker": "pending" }
                    : {})}
                  className={`
                  flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  ${getRadiusClass("full")}
                  border-2
                  ${
                    status === "completed"
                      ? "bg-success border-success text-fg-inverse"
                      : status === "active"
                        ? "bg-surface-brand-strong border-line-brand text-fg-inverse"
                        : status === "error"
                          ? "bg-error border-error text-fg-inverse"
                          : "bg-surface-base border-line-emphasis text-fg-quaternary"
                  }
                `}
                >
                  {item.icon ||
                    (status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      index + 1
                    ))}
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={`
                      w-full
                      h-0.5
                      mt-2
                      ${status === "completed" ? "bg-success" : "bg-line-emphasis"}
                    `}
                  />
                )}

                {/* Content */}
                <div
                  className={`mt-4 text-center ${getSpacingClass("base", "px")}`}
                >
                  {item.timestamp && (
                    <p className="text-xs text-fg-tertiary mb-1">
                      {item.timestamp}
                    </p>
                  )}
                  <h3 className="text-sm font-semibold text-fg-primary">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-fg-secondary mt-1">
                      {item.description}
                    </p>
                  )}
                  {item.content && <div className="mt-2">{item.content}</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical orientation
  return (
    <div className={`space-y-0 ${className}`}>
      {items.map((item, index) => {
        const status =
          item.status ||
          (index === 0
            ? "active"
            : index < items.findIndex((i) => i.status === "active")
              ? "completed"
              : "default");
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className="flex items-start gap-4">
            {/* Timeline Line & Icon */}
            <div className="flex flex-col items-center">
              <div
                // data-marker="pending" — see .claude/rules/colors.md
                // "fg-quaternary: AA-by-construction exception".
                {...(status === "default" ? { "data-marker": "pending" } : {})}
                className={`
                flex
                items-center
                justify-center
                w-10
                h-10
                ${getRadiusClass("full")}
                border-2
                ${
                  status === "completed"
                    ? "bg-success border-success text-fg-inverse"
                    : status === "active"
                      ? "bg-surface-brand-strong border-line-brand text-fg-inverse"
                      : status === "error"
                        ? "bg-error border-error text-fg-inverse"
                        : "bg-surface-base border-line-emphasis text-fg-quaternary"
                }
              `}
              >
                {item.icon ||
                  (status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    index + 1
                  ))}
              </div>
              {!isLast && (
                <div
                  className={`
                    w-0.5
                    flex-1
                    min-h-16
                    mt-2
                    ${status === "completed" ? "bg-success" : "bg-line-emphasis"}
                  `}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              {item.timestamp && (
                <p className="text-xs text-fg-tertiary mb-1">
                  {item.timestamp}
                </p>
              )}
              <h3
                className={`
                text-base
                font-semibold
                ${status === "active" ? "text-fg-brand-emphasis" : "text-fg-primary"}
              `}
              >
                {item.title}
              </h3>
              {item.description && (
                <p className="text-sm text-fg-secondary mt-1">
                  {item.description}
                </p>
              )}
              {item.content && <div className="mt-3">{item.content}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

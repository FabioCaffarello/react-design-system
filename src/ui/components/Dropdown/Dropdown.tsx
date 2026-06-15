"use client";

import type { HTMLAttributes, ReactNode, KeyboardEvent } from "react";
import React, { useState, useRef, useEffect, useId } from "react";
import { cn, mergeRefs } from "../../utils";
import {
  getRadiusClass,
  getSpacingClass,
  getTypographySize,
  getShadowClass,
} from "../../tokens";

export interface DropdownItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}

/**
 * Shape of the props the trigger element accepts when cloned. Limits
 * what cloneElement is allowed to override and what `props.ref` is
 * permitted to be — both essential for React 19's tighter
 * ReactElement<unknown> typing.
 */
type TriggerChildProps = {
  onClick?: (e: React.MouseEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  "aria-label"?: string;
  "aria-haspopup"?: React.AriaAttributes["aria-haspopup"];
  "aria-expanded"?: React.AriaAttributes["aria-expanded"];
  "aria-controls"?: React.AriaAttributes["aria-controls"];
  id?: string;
  ref?: React.Ref<HTMLElement>;
};

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  variant?: "default" | "minimal";
  "aria-label"?: string;
}

/**
 * Dropdown Component
 *
 * A dropdown menu component for displaying actions and options.
 *
 * @example
 * ```tsx
 * <Dropdown
 *   trigger={<Button>Actions</Button>}
 *   items={[
 *     { label: "Edit", onClick: () => handleEdit() },
 *     { label: "Delete", onClick: () => handleDelete(), variant: "danger" },
 *   ]}
 * />
 * ```
 */
export default function Dropdown({
  trigger,
  items,
  align = "right",
  variant: _variant = "default",
  className = "",
  "aria-label": ariaLabel,
  ...props
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Stable per-instance IDs. Math.random() at the call site regenerated
  // both IDs on every render, so aria-controls / aria-labelledby (which
  // pair the trigger with the menu) silently desynced across renders.
  // useId is SSR-safe and stable per component instance.
  const reactId = useId();
  const menuId = `dropdown-menu-${reactId}`;
  const triggerId = `dropdown-trigger-${reactId}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Focus first item when opening
      setTimeout(() => {
        const firstEnabledIndex = items.findIndex((item) => !item.disabled);
        if (firstEnabledIndex >= 0) {
          setActiveIndex(firstEnabledIndex);
          itemRefs.current[firstEnabledIndex]?.focus();
        }
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, items]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const enabledItems = items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !item.disabled);
      const currentEnabledIndex = enabledItems.findIndex(
        ({ index }) => index === activeIndex,
      );

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex =
            currentEnabledIndex < enabledItems.length - 1
              ? enabledItems[currentEnabledIndex + 1].index
              : enabledItems[0].index;
          setActiveIndex(nextIndex);
          itemRefs.current[nextIndex]?.focus();
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prevIndex =
            currentEnabledIndex > 0
              ? enabledItems[currentEnabledIndex - 1].index
              : enabledItems[enabledItems.length - 1].index;
          setActiveIndex(prevIndex);
          itemRefs.current[prevIndex]?.focus();
          break;
        }
        case "Home": {
          e.preventDefault();
          const firstIndex = enabledItems[0].index;
          setActiveIndex(firstIndex);
          itemRefs.current[firstIndex]?.focus();
          break;
        }
        case "End": {
          e.preventDefault();
          const lastIndex = enabledItems[enabledItems.length - 1].index;
          setActiveIndex(lastIndex);
          itemRefs.current[lastIndex]?.focus();
          break;
        }
        case "Enter":
        case " ":
          e.preventDefault();
          if (activeIndex >= 0 && !items[activeIndex].disabled) {
            handleItemClick(items[activeIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setActiveIndex(-1);
          // Restore focus to trigger after closing
          setTimeout(() => {
            triggerRef.current?.focus();
          }, 0);
          break;
      }
    };

    const menuElement = menuRef.current;
    if (menuElement) {
      const typedHandleKeyDown = handleKeyDown as unknown as (e: Event) => void;
      menuElement.addEventListener("keydown", typedHandleKeyDown);
      return () => {
        menuElement.removeEventListener("keydown", typedHandleKeyDown);
      };
    }
  }, [isOpen, activeIndex, items]);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
      setActiveIndex(-1);
      // Restore focus to trigger after item selection
      setTimeout(() => {
        triggerRef.current?.focus();
      }, 0);
    }
  };

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
    setActiveIndex(-1);
  };

  const handleTriggerKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const alignClasses = align === "right" ? "right-0" : "left-0";

  // Clone trigger to add accessibility props. Handles both Button and
  // native elements. React 19 surfaces consumer-supplied refs via
  // `child.props.ref` (no longer on the element itself), so mergeRefs
  // composes the parent's internal triggerRef with whatever the
  // consumer attached.
  const triggerWithProps = React.isValidElement<TriggerChildProps>(trigger) ? (
    React.cloneElement(trigger, {
      onClick: (e: React.MouseEvent) => {
        handleTriggerClick();
        trigger.props.onClick?.(e);
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        handleTriggerKeyDown(e);
        trigger.props.onKeyDown?.(e);
      },
      "aria-haspopup": "menu",
      "aria-expanded": isOpen,
      "aria-controls": menuId,
      "aria-label": ariaLabel || trigger.props["aria-label"] || "Open menu",
      id: triggerId,
      ref: mergeRefs<HTMLElement>(triggerRef, trigger.props.ref),
    })
  ) : (
    <div
      ref={(node) => {
        // Else-branch: trigger is a plain ReactNode (string/fragment/etc),
        // so we wrap it in a div. Forward the div node into the shared
        // HTMLElement-typed triggerRef via callback (RefObject is invariant
        // — direct assignment of RefObject<HTMLElement> to a HTMLDivElement
        // ref slot does not typecheck).
        triggerRef.current = node;
      }}
      onClick={handleTriggerClick}
      onKeyDown={handleTriggerKeyDown}
      role="button"
      tabIndex={0}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={menuId}
      aria-label={ariaLabel || "Open menu"}
      id={triggerId}
    >
      {trigger}
    </div>
  );

  return (
    <div
      className={cn("relative", "inline-block", className)}
      ref={dropdownRef}
      {...props}
    >
      {triggerWithProps}

      {isOpen && (
        <>
          <div
            // micro-z: dropdown click-outside backdrop internal to dropdown scope
            className={cn("fixed", "inset-0", "z-10")}
            onClick={() => {
              setIsOpen(false);
              setActiveIndex(-1);
            }}
            aria-hidden="true"
          />
          <div
            ref={menuRef}
            id={menuId}
            className={cn(
              "absolute",
              // micro-z: dropdown content above its own backdrop
              "z-20",
              getSpacingClass("sm", "mt"),
              "w-48", // Fixed width for dropdown menu - justified as layout constraint
              getRadiusClass("md"),
              getShadowClass("lg"),
              "bg-surface-overlay",
              "ring-1",
              "ring-line-strong",
              "ring-opacity-5",
              alignClasses,
            )}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby={triggerId}
            aria-activedescendant={
              activeIndex >= 0 ? `${menuId}-item-${activeIndex}` : undefined
            }
          >
            <div className={cn(getSpacingClass("xs", "py"))} role="none">
              {items.map((item, index) => {
                const itemClasses = cn(
                  "block",
                  getSpacingClass("base", "px"),
                  getSpacingClass("xs", "py"),
                  getTypographySize("bodySmall"),
                  "w-full",
                  "text-left",
                  "focus:outline-none",
                  item.disabled
                    ? cn("text-fg-disabled", "cursor-not-allowed", "opacity-50")
                    : item.variant === "danger"
                      ? cn(
                          "text-error-dark",
                          "hover:bg-error-bg-emphasis",
                          "focus:bg-error-bg-emphasis",
                        )
                      : cn(
                          "text-fg-primary",
                          "hover:bg-surface-hover",
                          "focus:bg-surface-hover",
                        ),
                );

                return (
                  <button
                    key={index}
                    id={`${menuId}-item-${index}`}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    type="button"
                    className={itemClasses}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    role="menuitem"
                    aria-disabled={item.disabled}
                    tabIndex={
                      item.disabled ? -1 : activeIndex === index ? 0 : -1
                    }
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

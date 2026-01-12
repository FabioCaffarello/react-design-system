'use client';

import type { HTMLAttributes, ReactNode, KeyboardEvent } from "react";
import React, { useState, useRef, useEffect } from "react";

export interface DropdownItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  variant?: "default" | "minimal";
  'aria-label'?: string;
}

/**
 * Dropdown Component
 * 
 * A dropdown menu component for displaying actions and options.
 * Follows Atomic Design principles as a Molecule component.
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
  variant = "default",
  className = "",
  'aria-label': ariaLabel,
  ...props
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Generate unique IDs
  const menuId = `dropdown-menu-${Math.random().toString(36).substr(2, 9)}`;
  const triggerId = `dropdown-trigger-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Focus first item when opening
      setTimeout(() => {
        const firstEnabledIndex = items.findIndex(item => !item.disabled);
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
      const enabledItems = items.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled);
      const currentEnabledIndex = enabledItems.findIndex(({ index }) => index === activeIndex);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = currentEnabledIndex < enabledItems.length - 1 
            ? enabledItems[currentEnabledIndex + 1].index 
            : enabledItems[0].index;
          setActiveIndex(nextIndex);
          itemRefs.current[nextIndex]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = currentEnabledIndex > 0 
            ? enabledItems[currentEnabledIndex - 1].index 
            : enabledItems[enabledItems.length - 1].index;
          setActiveIndex(prevIndex);
          itemRefs.current[prevIndex]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          const firstIndex = enabledItems[0].index;
          setActiveIndex(firstIndex);
          itemRefs.current[firstIndex]?.focus();
          break;
        case 'End':
          e.preventDefault();
          const lastIndex = enabledItems[enabledItems.length - 1].index;
          setActiveIndex(lastIndex);
          itemRefs.current[lastIndex]?.focus();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (activeIndex >= 0 && !items[activeIndex].disabled) {
            handleItemClick(items[activeIndex]);
          }
          break;
        case 'Escape':
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
      menuElement.addEventListener('keydown', typedHandleKeyDown);
      return () => {
        menuElement.removeEventListener('keydown', typedHandleKeyDown);
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

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const alignClasses = align === "right" ? "right-0" : "left-0";

  // Clone trigger to add accessibility props
  // Handle both Button component and native button elements
  const triggerWithProps = React.isValidElement(trigger)
    ? React.cloneElement(trigger as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent) => {
          handleTriggerClick();
          // Call original onClick if it exists
          if (trigger.props.onClick) {
            trigger.props.onClick(e);
          }
        },
        onKeyDown: (e: React.KeyboardEvent) => {
          handleTriggerKeyDown(e);
          // Call original onKeyDown if it exists
          if (trigger.props.onKeyDown) {
            trigger.props.onKeyDown(e);
          }
        },
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen,
        'aria-controls': menuId,
        'aria-label': ariaLabel || trigger.props['aria-label'] || 'Open menu',
        id: triggerId,
        ref: (node: HTMLElement | null) => {
          triggerRef.current = node;
          // Forward ref if trigger has one
          if (typeof trigger.ref === 'function') {
            trigger.ref(node);
          } else if (trigger.ref) {
            (trigger.ref as React.MutableRefObject<HTMLElement | null>).current = node;
          }
        },
      })
    : <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={ariaLabel || 'Open menu'}
        id={triggerId}
      >
        {trigger}
      </div>;

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef} {...props}>
      {triggerWithProps}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              setActiveIndex(-1);
            }}
            aria-hidden="true"
          />
          <div
            ref={menuRef}
            id={menuId}
            className={`absolute z-20 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${alignClasses}`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby={triggerId}
            aria-activedescendant={activeIndex >= 0 ? `${menuId}-item-${activeIndex}` : undefined}
          >
            <div className="py-1" role="none">
              {items.map((item, index) => {
                const itemClasses = [
                  "block",
                  "px-4",
                  "py-2",
                  "text-sm",
                  "w-full",
                  "text-left",
                  "focus:outline-none",
                  "focus:bg-gray-100",
                  item.disabled
                    ? "text-gray-400 cursor-not-allowed opacity-50"
                    : item.variant === "danger"
                    ? "text-red-700 hover:bg-red-50 focus:bg-red-50"
                    : "text-gray-700 hover:bg-gray-100",
                ].filter(Boolean).join(" ");

                return (
                  <button
                    key={index}
                    id={`${menuId}-item-${index}`}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    type="button"
                    className={itemClasses}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    role="menuitem"
                    aria-disabled={item.disabled}
                    tabIndex={item.disabled ? -1 : activeIndex === index ? 0 : -1}
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

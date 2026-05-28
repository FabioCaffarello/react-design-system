"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Search, Command } from "lucide-react";
import { getColorClass } from "../../tokens/colors";
import { getSpacingClass } from "../../tokens/spacing";
import { getRadiusClass } from "../../tokens/radius";
import { getShadowClass } from "../../tokens/shadows";
import { getZIndexClass } from "../../tokens/z-index";
import { getAnimationClass } from "../../tokens/animations";
import Input from "../../primitives/Input/Input";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  keywords?: string[];
  group?: string;
  action: () => void;
}

export interface CommandPaletteProps {
  items: CommandItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

/**
 * CommandPalette Component
 *
 * A command palette component for quick command search and execution.
 * Supports keyboard navigation, grouping, and filtering.
 * Follows Atomic Design principles as an Organism component.
 *
 * @example
 * ```tsx
 * <CommandPalette
 *   items={[
 *     { id: '1', label: 'New File', action: () => console.log('New File') },
 *     { id: '2', label: 'Save', action: () => console.log('Save') },
 *   ]}
 * />
 * ```
 */
export default function CommandPalette({
  items,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trigger,
  placeholder = "Type a command or search...",
  emptyMessage = "No commands found",
  className = "",
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  // Filter items based on search query
  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const matchesLabel = item.label.toLowerCase().includes(query);
    const matchesDescription = item.description?.toLowerCase().includes(query);
    const matchesKeywords = item.keywords?.some((keyword) =>
      keyword.toLowerCase().includes(query),
    );
    return matchesLabel || matchesDescription || matchesKeywords;
  });

  // Group items
  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      const group = item.group || "Other";
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    },
    {} as Record<string, CommandItem[]>,
  );

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
      if (newOpen) {
        setSearchQuery("");
        setSelectedIndex(0);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    },
    [isControlled, onOpenChange],
  );

  const handleSelect = (item: CommandItem) => {
    item.action();
    handleOpenChange(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleOpenChange(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
      return;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedElement = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`,
      );
      if (
        selectedElement &&
        typeof selectedElement.scrollIntoView === "function"
      ) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        handleOpenChange(!isOpen);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown as unknown as EventListener,
    );
    return () =>
      document.removeEventListener(
        "keydown",
        handleKeyDown as unknown as EventListener,
      );
  }, [isOpen, handleOpenChange]);

  const commandPaletteContent = isOpen ? (
    <div
      className={`
        fixed
        inset-0
        ${getZIndexClass("modal-backdrop")}
        bg-black
        bg-opacity-50
        flex
        items-start
        justify-center
        pt-[20vh]
        ${getAnimationClass("base")}
      `}
      onClick={() => handleOpenChange(false)}
    >
      <div
        className={`
          w-full
          max-w-2xl
          ${getSpacingClass("base", "mx")}
          bg-white
          ${getRadiusClass("lg")}
          ${getShadowClass("xl")}
          ${getZIndexClass("modal")}
          ${getAnimationClass("base")}
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div
          className={`
          flex
          items-center
          gap-3
          ${getSpacingClass("base", "p")}
          border-b
          border-gray-200
        `}
        >
          <Search
            className={`h-5 w-5 ${getColorClass("neutral", "DEFAULT", "text")}`}
          />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 border-0 focus:ring-0"
            autoFocus
          />
          <div
            className={`
            flex
            items-center
            gap-1
            ${getSpacingClass("sm", "px")}
            ${getSpacingClass("xs", "py")}
            ${getRadiusClass("sm")}
            bg-gray-100
            text-xs
            text-gray-500
          `}
          >
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className={`
            max-h-96
            overflow-y-auto
            ${getSpacingClass("sm", "py")}
          `}
        >
          {Object.keys(groupedItems).length === 0 ? (
            <div
              className={`
              ${getSpacingClass("lg", "p")}
              text-center
              text-sm
              ${getColorClass("neutral", "DEFAULT", "text")}
            `}
            >
              {emptyMessage}
            </div>
          ) : (
            Object.entries(groupedItems).map(([group, groupItems]) => (
              <div key={group}>
                {group !== "Other" && (
                  <div
                    className={`
                    ${getSpacingClass("sm", "px")}
                    ${getSpacingClass("xs", "py")}
                    text-xs
                    font-semibold
                    ${getColorClass("neutral", "DEFAULT", "text")}
                    uppercase
                    tracking-wider
                  `}
                  >
                    {group}
                  </div>
                )}
                {groupItems.map((item, _index) => {
                  const globalIndex = filteredItems.indexOf(item);
                  const isSelected = globalIndex === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-index={globalIndex}
                      onClick={() => handleSelect(item)}
                      className={`
                        w-full
                        flex
                        items-center
                        gap-3
                        ${getSpacingClass("base", "px")}
                        ${getSpacingClass("md", "py")}
                        text-left
                        ${getAnimationClass("base")}
                        ${
                          isSelected
                            ? getColorClass("primary", "light", "bg")
                            : "hover:bg-gray-50"
                        }
                      `}
                    >
                      {item.icon && (
                        <div
                          className={`
                          ${
                            isSelected
                              ? getColorClass("primary", "DEFAULT", "text")
                              : getColorClass("neutral", "DEFAULT", "text")
                          }
                        `}
                        >
                          {item.icon}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div
                          className={`
                          text-sm
                          font-medium
                          ${
                            isSelected
                              ? getColorClass("primary", "DEFAULT", "text")
                              : "text-gray-900"
                          }
                        `}
                        >
                          {item.label}
                        </div>
                        {item.description && (
                          <div
                            className={`text-xs text-gray-500 ${getSpacingClass("0.5", "mt")}`}
                          >
                            {item.description}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {trigger ? (
        <div onClick={() => handleOpenChange(true)}>{trigger}</div>
      ) : null}
      {typeof window !== "undefined" &&
        createPortal(commandPaletteContent, document.body)}
    </>
  );
}

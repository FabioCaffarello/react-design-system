'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { getColorClass } from '../../tokens/colors';
import { getSpacingClass } from '../../tokens/spacing';
import { getAnimationClass } from '../../tokens/animations';
import { getTypographyClasses } from '../../tokens/typography';

export type AccordionType = 'single' | 'multiple';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: AccordionType;
  defaultOpen?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
}

/**
 * Accordion Component
 * 
 * A collapsible content component that can display multiple items.
 * Supports single and multiple selection modes.
 * Follows Atomic Design principles as an Atom component.
 * 
 * @example
 * ```tsx
 * <Accordion
 *   type="single"
 *   items={[
 *     { id: '1', title: 'Item 1', content: 'Content 1' },
 *     { id: '2', title: 'Item 2', content: 'Content 2' },
 *   ]}
 * />
 * ```
 */
export default function Accordion({
  items,
  type = 'single',
  defaultOpen,
  onValueChange,
  className = '',
}: AccordionProps) {
  const getInitialOpen = (): string[] => {
    if (defaultOpen === undefined) return [];
    return Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen];
  };

  const [openItems, setOpenItems] = useState<string[]>(getInitialOpen);

  const handleToggle = (itemId: string) => {
    if (items.find(item => item.id === itemId)?.disabled) return;

    let newOpenItems: string[];

    if (type === 'single') {
      newOpenItems = openItems.includes(itemId) ? [] : [itemId];
    } else {
      newOpenItems = openItems.includes(itemId)
        ? openItems.filter(id => id !== itemId)
        : [...openItems, itemId];
    }

    setOpenItems(newOpenItems);
    onValueChange?.(type === 'single' ? newOpenItems[0] || '' : newOpenItems);
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        const isDisabled = item.disabled;

        return (
          <div
            key={item.id}
            className="border border-gray-200 rounded-md overflow-hidden"
          >
            <button
              type="button"
              onClick={() => handleToggle(item.id)}
              disabled={isDisabled}
              className={`
                w-full
                flex
                items-center
                justify-between
                ${getSpacingClass('base', 'px')}
                ${getSpacingClass('md', 'py')}
                ${getTypographyClasses('label')}
                text-left
                ${getColorClass('neutral', 'dark', 'text')}
              bg-white
                hover:bg-gray-50
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                ${getColorClass('primary', 'DEFAULT', 'focus:ring')}
                ${getAnimationClass('base')}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              aria-disabled={isDisabled}
            >
              <span>{item.title}</span>
              <ChevronDown
                className={`
                  ${getSpacingClass('sm', 'ml')}
                  ${getAnimationClass('base')}
                  ${isOpen ? 'transform rotate-180' : ''}
                  ${isDisabled ? 'opacity-50' : ''}
                `}
                aria-hidden="true"
              />
            </button>
            <div
              id={`accordion-content-${item.id}`}
              className={`
                overflow-hidden
                ${getAnimationClass('base')}
                ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
              `}
              aria-hidden={!isOpen}
            >
              <div className={`
                ${getSpacingClass('base', 'px')}
                ${getSpacingClass('md', 'py')}
                ${getColorClass('neutral', 'DEFAULT', 'text')}
              `}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

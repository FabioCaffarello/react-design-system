'use client';

import { type ReactNode, type HTMLAttributes, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSideNavbarStateRequired } from '../contexts/SideNavbarStateContext';
import { useSideNavbarThemeRequired } from '../contexts/SideNavbarThemeContext';
import Collapsible from '../../../atoms/Collapsible/Collapsible';
import { getSpacingClass, getColorClass } from '../../../tokens';

export interface SideNavbarGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Unique identifier for the group
   */
  id: string;

  /**
   * Group header title
   */
  title?: string;

  /**
   * Header icon (rendered before title)
   */
  icon?: ReactNode;

  /**
   * Header action buttons (rendered after title)
   */
  actions?: ReactNode;

  /**
   * Whether the group can be collapsed
   * @default true
   */
  collapsible?: boolean;

  /**
   * Default collapsed state (only used if group state not in context)
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * Whether to show a border at the bottom
   * @default true
   */
  showBorder?: boolean;

  /**
   * Padding size for the content
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * Children content
   */
  children: ReactNode;
}

/**
 * SideNavbar Group Component
 *
 * Collapsible section within SideNavbar.Content.
 * Uses the Collapsible atom for animations and state management.
 *
 * @example
 * ```tsx
 * <SideNavbar.Sidebar.Content>
 *   <SideNavbar.Sidebar.Group id="filters" title="Filters" icon={<Filter />}>
 *     <FilterList />
 *   </SideNavbar.Sidebar.Group>
 *
 *   <SideNavbar.Sidebar.Group id="settings" title="Settings" defaultCollapsed>
 *     <SettingsForm />
 *   </SideNavbar.Sidebar.Group>
 * </SideNavbar.Sidebar.Content>
 * ```
 */
export default function SideNavbarGroup({
  id,
  title,
  icon,
  actions,
  collapsible = true,
  defaultCollapsed = false,
  showBorder = true,
  padding = 'md',
  children,
  className = '',
  ...props
}: SideNavbarGroupProps) {
  const { groupStates, toggleGroup, setGroupCollapsed } = useSideNavbarStateRequired();
  const { animationDuration } = useSideNavbarThemeRequired();
  const hasInitialized = useRef(false);

  // Get collapsed state from context, fallback to default
  const isCollapsed = groupStates[id] ?? defaultCollapsed;

  // Initialize group state on mount (only once)
  useEffect(() => {
    if (!hasInitialized.current && groupStates[id] === undefined) {
      hasInitialized.current = true;
      setGroupCollapsed(id, defaultCollapsed);
    }
  }, [id, defaultCollapsed, groupStates, setGroupCollapsed]);

  const handleToggle = () => {
    if (collapsible) {
      toggleGroup(id);
    }
  };

  const paddingClass = padding !== 'none' ? getSpacingClass(padding, 'p') : '';

  return (
    <div
      className={`
        ${showBorder ? `border-b ${getColorClass('neutral', 'DEFAULT', 'border')}` : ''}
        ${className}
      `}
      data-group-id={id}
      {...props}
    >
      {/* Group Header */}
      {title && (
        <button
          type="button"
          onClick={handleToggle}
          disabled={!collapsible}
          className={`
            flex items-center justify-between w-full
            ${getSpacingClass('sm', 'px')}
            ${getSpacingClass('xs', 'py')}
            text-left
            transition-colors
            ${collapsible ? 'hover:bg-neutral-100 cursor-pointer' : 'cursor-default'}
            disabled:cursor-default
          `}
          aria-expanded={!isCollapsed}
          aria-controls={`group-content-${id}`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {icon && (
              <span className={`flex-shrink-0 ${getColorClass('neutral', 'dark', 'text')}`}>
                {icon}
              </span>
            )}
            <span className={`font-medium text-sm truncate ${getColorClass('neutral', 'darker', 'text')}`}>
              {title}
            </span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {actions && (
              <div
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {actions}
              </div>
            )}
            {collapsible && (
              <ChevronDown
                className={`
                  h-4 w-4
                  ${getColorClass('neutral', 'DEFAULT', 'text')}
                  transition-transform
                  ${isCollapsed ? '-rotate-90' : 'rotate-0'}
                `}
                style={{ transitionDuration: `${animationDuration}ms` }}
                aria-hidden="true"
              />
            )}
          </div>
        </button>
      )}

      {/* Group Content */}
      <Collapsible
        open={!isCollapsed}
        duration={animationDuration}
      >
        <div
          id={`group-content-${id}`}
          className={paddingClass}
        >
          {children}
        </div>
      </Collapsible>
    </div>
  );
}

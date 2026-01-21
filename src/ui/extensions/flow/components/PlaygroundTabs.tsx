/**
 * Playground Tabs Component
 * 
 * Wrapper for Tabs component from design system.
 * Manages main category tabs for the playground.
 * Uses design system tokens for consistent styling.
 * Enhanced with better visual indicators and animations.
 */

/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { 
  BarChart3, 
  Palette, 
  Layers, 
  Layout, 
  CheckCircle2, 
  Code, 
  Settings 
} from 'lucide-react';
import Tabs from '../../../molecules/Tabs/Tabs';
import Tooltip from '../../../atoms/Tooltip/Tooltip';
import { getSpacingClass, getTypographyClasses, getColorClass } from '../../../tokens';

export type PlaygroundTabId = 
  | 'nodes-edges'
  | 'canvas'
  | 'background'
  | 'layout'
  | 'validation'
  | 'code'
  | 'settings';

export interface PlaygroundTab {
  id: PlaygroundTabId;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  shortcut?: string;
}

export const playgroundTabs: PlaygroundTab[] = [
  { 
    id: 'nodes-edges', 
    label: 'Nodes & Edges', 
    icon: <BarChart3 className="h-5 w-5" />,
    description: 'Configure nodes and edges, select templates, and edit properties',
    shortcut: '1'
  },
  { 
    id: 'canvas', 
    label: 'Canvas', 
    icon: <Palette className="h-5 w-5" />,
    description: 'Configure React Flow canvas settings and interactions',
    shortcut: '2'
  },
  { 
    id: 'background', 
    label: 'Background', 
    icon: <Layers className="h-5 w-5" />,
    description: 'Customize background patterns and styles',
    shortcut: '3'
  },
  { 
    id: 'layout', 
    label: 'Layout', 
    icon: <Layout className="h-5 w-5" />,
    description: 'Apply automatic layout algorithms',
    shortcut: '4'
  },
  { 
    id: 'validation', 
    label: 'Validation', 
    icon: <CheckCircle2 className="h-5 w-5" />,
    description: 'Validate flow structure and rules',
    shortcut: '5'
  },
  { 
    id: 'code', 
    label: 'Code', 
    icon: <Code className="h-5 w-5" />,
    description: 'Preview and export generated code',
    shortcut: '6'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: <Settings className="h-5 w-5" />,
    description: 'General playground settings and preferences',
    shortcut: '7'
  },
];

export interface PlaygroundTabsProps {
  activeTab: PlaygroundTabId;
  onTabChange: (tabId: PlaygroundTabId) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'full' | 'compact';
}

export function PlaygroundTabs({
  activeTab,
  onTabChange,
  orientation = 'vertical',
  variant = 'full',
}: PlaygroundTabsProps) {
  const isCompact = variant === 'compact';
  
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as PlaygroundTabId)}>
      <Tabs.List 
        orientation={orientation}
        variant={isCompact ? 'compact' : 'default'}
        className={`
          ${isCompact && orientation === 'vertical' ? 'w-full' : ''}
          ${isCompact ? getSpacingClass('xs', 'gap') : getSpacingClass('xs', 'gap')}
          ${isCompact ? getSpacingClass('sm', 'p') : ''}
        `}
      >
        {playgroundTabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const tabInfo = playgroundTabs.find(t => t.id === tab.id);
          const tooltipContent = tabInfo?.description 
            ? `${tabInfo.description}${tabInfo.shortcut ? ` (Alt+${tabInfo.shortcut})` : ''}`
            : undefined;
          
          if (isCompact) {
            // Compact variant: only icons
            return (
              <Tooltip
                key={tab.id}
                content={tooltipContent || tab.label}
                position="right"
                delay={300}
              >
                <Tabs.Trigger
                  value={tab.id}
                  className={`
                    w-full
                    aspect-square
                    flex items-center justify-center
                    ${getSpacingClass('sm', 'p')}
                    transition-all duration-300 ease-in-out
                    rounded-md
                    relative
                    ${isActive 
                      ? `${getColorClass('secondary', 'DEFAULT', 'bg')} ${getColorClass('secondary', 'contrast', 'text')} shadow-sm` 
                      : `hover:${getColorClass('neutral', 'light', 'bg')}`
                    }
                  `}
                >
                  {isActive && (
                    <span
                      className={`absolute left-0 top-0 bottom-0 w-1 ${getColorClass('secondary', 'DEFAULT', 'bg')} rounded-r`}
                      aria-hidden="true"
                    />
                  )}
                  {tab.icon && (
                    <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                      {tab.icon}
                    </span>
                  )}
                </Tabs.Trigger>
              </Tooltip>
            );
          }
          
          // Full variant: icon + label + shortcut
          return (
            <Tooltip
              key={tab.id}
              content={tooltipContent || tab.label}
              position={orientation === 'vertical' ? 'right' : 'bottom'}
              delay={300}
            >
              <Tabs.Trigger
                value={tab.id}
                className={`
                  ${orientation === 'vertical' ? 'w-full justify-start' : 'justify-center'}
                  ${getSpacingClass('md', 'px')}
                  ${getSpacingClass('sm', 'py')}
                  ${getTypographyClasses('label')}
                  transition-all duration-300 ease-in-out
                  rounded-md
                  relative
                  ${isActive 
                    ? `${getColorClass('secondary', 'DEFAULT', 'bg')} ${getColorClass('secondary', 'contrast', 'text')} shadow-sm` 
                    : `hover:${getColorClass('neutral', 'light', 'bg')}`
                  }
                  ${isActive ? 'transform scale-[1.02]' : ''}
                `}
                style={{
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {isActive && (
                  <span
                    className={`
                      absolute left-0 top-0 bottom-0 w-1
                      ${getColorClass('secondary', 'DEFAULT', 'bg')}
                      rounded-r
                    `}
                    aria-hidden="true"
                  />
                )}
                <span className="flex items-center gap-2">
                  {tab.icon && (
                    <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                      {tab.icon}
                    </span>
                  )}
                  <span>{tab.label}</span>
                  {tab.shortcut && (
                    <span
                      id={`tab-shortcut-${tab.id}`}
                      className={`
                        ml-auto
                        ${getTypographyClasses('caption')}
                        ${isActive 
                          ? getColorClass('secondary', 'light', 'text')
                          : getColorClass('neutral', 'DEFAULT', 'text')
                        }
                        opacity-60
                        px-1.5 py-0.5
                        rounded
                        bg-black/5
                      `}
                      aria-label={`Keyboard shortcut: Alt+${tab.shortcut}`}
                    >
                      {tab.shortcut}
                    </span>
                  )}
                </span>
              </Tabs.Trigger>
            </Tooltip>
          );
        })}
      </Tabs.List>
    </Tabs>
  );
}

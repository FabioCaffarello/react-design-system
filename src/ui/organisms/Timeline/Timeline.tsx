'use client';

import type { ReactNode } from 'react';
import { getColorClass } from '../../tokens/colors';
import { getSpacingClass } from '../../tokens/spacing';
import { getRadiusClass } from '../../tokens/radius';

export type TimelineOrientation = 'horizontal' | 'vertical';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  content?: ReactNode;
  timestamp?: string;
  icon?: ReactNode;
  status?: 'default' | 'active' | 'completed' | 'error';
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
  orientation = 'vertical',
  className = '',
}: TimelineProps) {
  if (orientation === 'horizontal') {
    return (
      <div className={`flex items-start ${className}`}>
        {items.map((item, index) => {
          const status = item.status || (index === 0 ? 'active' : index < items.findIndex(i => i.status === 'active') ? 'completed' : 'default');
          const isLast = index === items.length - 1;

          return (
            <div key={item.id} className="flex items-start flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Icon/Indicator */}
                <div className={`
                  flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  ${getRadiusClass('full')}
                  border-2
                  ${status === 'completed'
                    ? `${getColorClass('success', 'DEFAULT', 'bg')} ${getColorClass('success', 'DEFAULT', 'border')} text-white`
                    : status === 'active'
                    ? `${getColorClass('primary', 'DEFAULT', 'bg')} ${getColorClass('primary', 'DEFAULT', 'border')} text-white`
                    : status === 'error'
                    ? `${getColorClass('error', 'DEFAULT', 'bg')} ${getColorClass('error', 'DEFAULT', 'border')} text-white`
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}>
                  {item.icon || (status === 'completed' ? '✓' : index + 1)}
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={`
                      w-full
                      h-0.5
                      mt-2
                      ${status === 'completed' ? getColorClass('success', 'DEFAULT', 'bg') : 'bg-gray-300'}
                    `}
                  />
                )}

                {/* Content */}
                <div className={`mt-4 text-center ${getSpacingClass('base', 'px')}`}>
                  {item.timestamp && (
                    <p className="text-xs text-gray-500 mb-1">{item.timestamp}</p>
                  )}
                  <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                  )}
                  {item.content && (
                    <div className="mt-2">{item.content}</div>
                  )}
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
        const status = item.status || (index === 0 ? 'active' : index < items.findIndex(i => i.status === 'active') ? 'completed' : 'default');
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className="flex items-start gap-4">
            {/* Timeline Line & Icon */}
            <div className="flex flex-col items-center">
              <div className={`
                flex
                items-center
                justify-center
                w-10
                h-10
                ${getRadiusClass('full')}
                border-2
                ${status === 'completed'
                  ? `${getColorClass('success', 'DEFAULT', 'bg')} ${getColorClass('success', 'DEFAULT', 'border')} text-white`
                  : status === 'active'
                  ? `${getColorClass('primary', 'DEFAULT', 'bg')} ${getColorClass('primary', 'DEFAULT', 'border')} text-white`
                  : status === 'error'
                  ? `${getColorClass('error', 'DEFAULT', 'bg')} ${getColorClass('error', 'DEFAULT', 'border')} text-white`
                  : 'bg-white border-gray-300 text-gray-400'
                }
              `}>
                {item.icon || (status === 'completed' ? '✓' : index + 1)}
              </div>
              {!isLast && (
                <div
                  className={`
                    w-0.5
                    flex-1
                    min-h-[60px]
                    mt-2
                    ${status === 'completed' ? getColorClass('success', 'DEFAULT', 'bg') : 'bg-gray-300'}
                  `}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              {item.timestamp && (
                <p className="text-xs text-gray-500 mb-1">{item.timestamp}</p>
              )}
              <h3 className={`
                text-base
                font-semibold
                ${status === 'active' ? getColorClass('primary', 'DEFAULT', 'text') : 'text-gray-900'}
              `}>
                {item.title}
              </h3>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              )}
              {item.content && (
                <div className="mt-3">{item.content}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

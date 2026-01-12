'use client';

import { Children, type HTMLAttributes, ReactNode, isValidElement, cloneElement } from 'react';
import Avatar, { type AvatarProps } from './Avatar';

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  max?: number; // Maximum number of avatars to show before collapsing
  size?: AvatarProps['size'];
  variant?: AvatarProps['variant'];
  spacing?: 'none' | 'sm' | 'md' | 'lg'; // Negative margin between avatares
}

/**
 * AvatarGroup Component
 * 
 * Container for displaying multiple avatars in a group.
 * Supports collapsing when there are too many avatars.
 * 
 * @example
 * ```tsx
 * <AvatarGroup max={3}>
 *   <Avatar src="/user1.jpg" alt="User 1" />
 *   <Avatar src="/user2.jpg" alt="User 2" />
 *   <Avatar src="/user3.jpg" alt="User 3" />
 *   <Avatar src="/user4.jpg" alt="User 4" />
 * </AvatarGroup>
 * ```
 */
export function AvatarGroup({
  children,
  max = 3,
  size = 'md',
  variant = 'circle',
  spacing = 'md',
  className = '',
  ...props
}: AvatarGroupProps) {
  const spacingClasses = {
    none: '',
    sm: '-space-x-1',
    md: '-space-x-2',
    lg: '-space-x-3',
  };

  // Convert children to array and filter out null/undefined
  const avatars = Children.toArray(children).filter(Boolean);
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div
      className={`
        flex
        items-center
        ${spacingClasses[spacing]}
        ${className}
      `}
      role="group"
      aria-label={`${avatars.length} avatars`}
      {...props}
    >
      {visibleAvatars.map((avatar, index) => {
        // Clone avatar with consistent size and variant if needed
        let avatarElement = avatar;
        if (isValidElement(avatar) && avatar.type === Avatar) {
          const avatarProps = avatar.props as AvatarProps;
          avatarElement = cloneElement(avatar as React.ReactElement<AvatarProps>, {
            size: avatarProps.size || size,
            variant: avatarProps.variant || variant,
          });
        }

        return (
          <div
            key={index}
            className="ring-2 ring-white"
            style={{ zIndex: avatars.length - index }}
          >
            {avatarElement}
          </div>
        );
      })}
      {remainingCount > 0 && (
        <Avatar
          size={size}
          variant={variant}
          fallback={`+${remainingCount}`}
          aria-label={`${remainingCount} more avatars`}
          className="ring-2 ring-white"
          style={{ zIndex: 0 }}
        />
      )}
    </div>
  );
}

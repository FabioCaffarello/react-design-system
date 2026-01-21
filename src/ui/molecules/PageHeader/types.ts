/**
 * PageHeader Types
 * 
 * Type definitions for the PageHeader component.
 */

import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '../Breadcrumb/Breadcrumb';

/**
 * PageHeader Variant
 */
export type PageHeaderVariant = 'default' | 'compact';

/**
 * PageHeader Props
 * 
 * @see EPIC-004: PageHeader Component (Molecule)
 */
export interface PageHeaderProps {
  /**
   * Page title (required)
   */
  title: string;

  /**
   * Page description (optional)
   */
  description?: string;

  /**
   * Breadcrumb items (optional)
   */
  breadcrumb?: BreadcrumbItem[];

  /**
   * Action buttons or content (optional)
   */
  actions?: ReactNode;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: PageHeaderVariant;

  /**
   * Additional CSS classes
   */
  className?: string;
}

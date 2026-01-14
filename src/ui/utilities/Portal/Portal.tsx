import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  /**
   * Content to render in the portal
   */
  children: React.ReactNode;
  /**
   * Container element ID. If not provided, creates a new div
   * @default 'portal-root'
   */
  containerId?: string;
  /**
   * Whether to append to body directly
   * @default false
   */
  appendToBody?: boolean;
}

/**
 * Portal component for rendering content outside the DOM hierarchy
 * 
 * Useful for modals, tooltips, dropdowns that need to escape parent overflow/stacking contexts.
 * 
 * @example
 * ```tsx
 * <Portal>
 *   <Modal>Content</Modal>
 * </Portal>
 * ```
 */
export function Portal({ children, containerId = 'portal-root', appendToBody = false }: PortalProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element: HTMLElement | null = null;

    if (appendToBody) {
      // Append directly to body
      element = document.body;
    } else {
      // Find or create container
      element = document.getElementById(containerId);
      
      if (!element) {
        element = document.createElement('div');
        element.id = containerId;
        document.body.appendChild(element);
      }
    }

    setContainer(element);

    // Cleanup: remove created container on unmount
    return () => {
      if (!appendToBody && element && element.id === containerId && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [containerId, appendToBody]);

  if (!container) {
    return null;
  }

  return createPortal(children, container);
}

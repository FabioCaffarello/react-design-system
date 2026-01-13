/**
 * Viewport Logger Component
 * 
 * Displays current viewport state (x, y, zoom) in real-time
 */

import React, { useState, useEffect } from 'react';
import { Card } from '../../../molecules';
import { useFlowContext } from '../organisms/FlowContext';
import { 
  getSpacingClass, 
  getTypographyClasses 
} from '../../../tokens';

export function ViewportLogger() {
  const { reactFlowInstance } = useFlowContext();
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

  useEffect(() => {
    if (reactFlowInstance) {
      const updateViewport = () => {
        const viewport = reactFlowInstance.getViewport();
        setViewport(viewport);
      };
      
      // Initial update
      updateViewport();
      
      // Listen to viewport changes
      reactFlowInstance.on('viewportchange', updateViewport);
      
      return () => {
        reactFlowInstance.off('viewportchange', updateViewport);
      };
    }
  }, [reactFlowInstance]);

  return (
    <div>
      <h3
        className={`
          ${getTypographyClasses('label')}
          ${getSpacingClass('sm', 'mb')}
          m-0
        `}
      >
        Viewport
      </h3>
      <pre
        className={`
          ${getSpacingClass('sm', 'p')}
          rounded
          text-xs
          font-mono
          overflow-auto
          m-0
        `}
        style={{
          backgroundColor: '#1f2937',
          color: '#f9fafb',
        }}
      >
        {JSON.stringify(viewport, null, 2)}
      </pre>
    </div>
  );
}

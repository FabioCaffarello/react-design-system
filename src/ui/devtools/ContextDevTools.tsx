'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { useConfig } from '../providers/ConfigProvider';

/**
 * Context information for debugging
 */
interface ContextInfo {
  name: string;
  value: unknown;
  timestamp: number;
}

/**
 * ContextDevTools Props
 */
export interface ContextDevToolsProps {
  /**
   * Whether devtools are enabled
   */
  enabled?: boolean;
  
  /**
   * Position of devtools panel
   */
  position?: 'top' | 'bottom' | 'left' | 'right';
  
  /**
   * Custom contexts to track (optional)
   */
  contexts?: Array<{
    name: string;
    context: React.Context<unknown>;
    selector?: (value: unknown) => unknown;
  }>;
}

/**
 * ContextDevTools Component
 * 
 * DevTools panel for inspecting React contexts in Storybook.
 * Provides visualization of context hierarchy, values, and changes.
 * 
 * @example
 * ```tsx
 * <ContextDevTools enabled={true} position="bottom" />
 * ```
 */
export function ContextDevTools({
  enabled = false,
  position = 'bottom',
  contexts = [],
}: ContextDevToolsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [contextHistory, setContextHistory] = useState<ContextInfo[]>([]);
  const historyRef = useRef<ContextInfo[]>([]);
  
  // Track built-in contexts
  const theme = useTheme();
  const config = useConfig();
  
  // Update history when contexts change
  useEffect(() => {
    if (!enabled) return;
    
    const newHistory: ContextInfo[] = [
      {
        name: 'Theme',
        value: {
          theme: theme.theme,
          isDark: theme.isDark,
          colors: Object.keys(theme.colors),
        },
        timestamp: Date.now(),
      },
      {
        name: 'Config',
        value: {
          breakpoints: Object.keys(config.config.breakpoints),
          features: config.config.features,
          behavior: config.config.behavior,
        },
        timestamp: Date.now(),
      },
    ];
    
    // Add custom contexts
    contexts.forEach(({ name, context, selector }) => {
      try {
        // This is a simplified version - in a real implementation,
        // you'd need to access the context value properly
        newHistory.push({
          name,
          value: selector ? selector({}) : {},
          timestamp: Date.now(),
        });
      } catch (error) {
        // Context not available
      }
    });
    
    historyRef.current = newHistory;
    setContextHistory(newHistory);
  }, [enabled, theme, config, contexts]);
  
  if (!enabled) {
    return null;
  }
  
  const positionClasses = {
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
    left: 'left-0 top-0 bottom-0 w-80',
    right: 'right-0 top-0 bottom-0 w-80',
  };
  
  return (
    <div className={`fixed ${positionClasses[position]} z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-left flex items-center justify-between"
        aria-label="Toggle Context DevTools"
      >
        <span className="font-semibold text-sm">Context DevTools</span>
        <span className="text-xs text-gray-500">{isOpen ? '▼' : '▲'}</span>
      </button>
      
      {/* Panel Content */}
      {isOpen && (
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Context Hierarchy</h3>
              <div className="text-xs font-mono space-y-1">
                <div>AppProvider</div>
                <div className="ml-4">├── ThemeProvider</div>
                <div className="ml-4">├── ConfigProvider</div>
                <div className="ml-4">└── ComponentProviders</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-sm mb-2">Context Values</h3>
              <div className="space-y-2">
                {contextHistory.map((info, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-2">
                    <div className="font-semibold text-xs mb-1">{info.name}</div>
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(info.value, null, 2)}
                    </pre>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(info.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-sm mb-2">Actions</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setContextHistory([])}
                  className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
                >
                  Clear History
                </button>
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(contextHistory, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `context-devtools-${Date.now()}.json`;
                    link.click();
                  }}
                  className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

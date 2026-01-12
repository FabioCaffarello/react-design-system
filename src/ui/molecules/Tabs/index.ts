/**
 * Tabs Components
 * 
 * Tabs component with compound components pattern and full accessibility support.
 */

export { default as Tabs } from './Tabs';
export type { TabsProps } from './Tabs';

export { TabsList } from './TabsList';
export type { TabsListProps } from './TabsList';

export { TabsTrigger } from './TabsTrigger';
export type { TabsTriggerProps } from './TabsTrigger';

export { TabsContent } from './TabsContent';
export type { TabsContentProps } from './TabsContent';

export { TabsProvider } from './TabsProvider';
export type { TabsProviderProps } from './TabsProvider';

export { TabsContext, useTabsContext, useTabsContextOptional } from './TabsContext';
export type { TabsContextValue } from './TabsContext';

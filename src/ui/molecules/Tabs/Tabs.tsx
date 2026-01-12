'use client';

import React, { type ReactNode } from 'react';
import { TabsProvider, type TabsProviderProps } from './TabsProvider';
import { TabsList } from './TabsList';
import { TabsTrigger } from './TabsTrigger';
import { TabsContent } from './TabsContent';

export interface TabsProps extends Omit<TabsProviderProps, 'children'> {
  children: ReactNode;
}

/**
 * Tabs Component
 * 
 * A flexible tabs component with compound components pattern.
 * Supports horizontal and vertical orientations, automatic and manual activation modes.
 * Fully accessible with ARIA attributes and keyboard navigation.
 * 
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <Tabs.List>
 *     <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
 *     <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="tab1">Content 1</Tabs.Content>
 *   <Tabs.Content value="tab2">Content 2</Tabs.Content>
 * </Tabs>
 * ```
 */
function TabsComponent({
  children,
  ...providerProps
}: TabsProps) {
  return (
    <TabsProvider {...providerProps}>
      {children}
    </TabsProvider>
  );
}

// Compound components
TabsComponent.List = TabsList;
TabsComponent.Trigger = TabsTrigger;
TabsComponent.Content = TabsContent;

// Type declaration for compound components
export interface TabsComponentType extends React.FC<TabsProps> {
  List: typeof TabsList;
  Trigger: typeof TabsTrigger;
  Content: typeof TabsContent;
}

// Cast to include compound components
const Tabs: TabsComponentType = TabsComponent as TabsComponentType;

export default Tabs;

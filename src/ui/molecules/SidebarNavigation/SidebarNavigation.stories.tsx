import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SidebarNavigation from './SidebarNavigation';
import Tabs from '../Tabs/Tabs';
import { BarChart3, Palette, Settings } from 'lucide-react';
import { Button } from '../../atoms';

const meta: Meta<typeof SidebarNavigation> = {
  title: 'Molecules/SidebarNavigation',
  component: SidebarNavigation,
  parameters: {
    docs: {
      description: {
        component: 'A reusable component for the narrow navigation column (typically 56px) with icons. Supports fixed and collapsible variants.',
      },
    },
    layout: 'padded',
  },
  argTypes: {
    width: {
      control: 'text',
      description: 'Width of the navigation column',
    },
    variant: {
      control: 'select',
      options: ['fixed', 'collapsible'],
      description: 'Variant of the navigation',
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Orientation of navigation items',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SidebarNavigation>;

const NavigationContent = () => (
  <Tabs defaultValue="tab1">
    <Tabs.List orientation="vertical" variant="compact" className="w-full p-2 gap-1">
      <Tabs.Trigger
        value="tab1"
        className="w-full aspect-square flex items-center justify-center p-2 rounded-md"
      >
        <BarChart3 className="h-5 w-5" />
      </Tabs.Trigger>
      <Tabs.Trigger
        value="tab2"
        className="w-full aspect-square flex items-center justify-center p-2 rounded-md"
      >
        <Palette className="h-5 w-5" />
      </Tabs.Trigger>
      <Tabs.Trigger
        value="tab3"
        className="w-full aspect-square flex items-center justify-center p-2 rounded-md"
      >
        <Settings className="h-5 w-5" />
      </Tabs.Trigger>
    </Tabs.List>
  </Tabs>
);

export const Default: Story = {
  args: {
    width: '56px',
    variant: 'fixed',
    orientation: 'vertical',
    children: <NavigationContent />,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px', display: 'flex' }}>
        <Story />
        <div className="flex-1 p-4 bg-gray-100">
          <p>Main content area</p>
        </div>
      </div>
    ),
  ],
};

export const Collapsible: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    
    return (
      <div style={{ height: '400px', display: 'flex' }}>
        <SidebarNavigation
          width="56px"
          variant="collapsible"
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
        >
          <NavigationContent />
        </SidebarNavigation>
        <div className="flex-1 p-4 bg-gray-100">
          <Button onClick={() => setCollapsed(!collapsed)} className="mb-4">
            {collapsed ? 'Expand' : 'Collapse'} Navigation
          </Button>
          <p>Main content area</p>
        </div>
      </div>
    );
  },
};

export const CustomWidth: Story = {
  args: {
    width: '80px',
    variant: 'fixed',
    children: <NavigationContent />,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px', display: 'flex' }}>
        <Story />
        <div className="flex-1 p-4 bg-gray-100">
          <p>Main content area with wider navigation</p>
        </div>
      </div>
    ),
  ],
};

export const Horizontal: Story = {
  args: {
    width: '100%',
    variant: 'fixed',
    orientation: 'horizontal',
    children: (
      <Tabs defaultValue="tab1">
        <Tabs.List orientation="horizontal" variant="compact" className="w-full p-2 gap-1">
          <Tabs.Trigger value="tab1" className="flex items-center gap-2 p-2 rounded-md">
            <BarChart3 className="h-5 w-5" />
            <span>Tab 1</span>
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2" className="flex items-center gap-2 p-2 rounded-md">
            <Palette className="h-5 w-5" />
            <span>Tab 2</span>
          </Tabs.Trigger>
          <Tabs.Trigger value="tab3" className="flex items-center gap-2 p-2 rounded-md">
            <Settings className="h-5 w-5" />
            <span>Tab 3</span>
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%' }}>
        <Story />
        <div className="p-4 bg-gray-100">
          <p>Content below horizontal navigation</p>
        </div>
      </div>
    ),
  ],
};

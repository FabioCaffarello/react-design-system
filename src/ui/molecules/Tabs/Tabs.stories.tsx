import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Tabs from './Tabs';
import Card from '../Card/Card';

const meta: Meta<typeof Tabs> = {
  title: 'Molecules/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: 'A flexible tabs component with compound components pattern. Supports horizontal and vertical orientations, automatic and manual activation modes. Fully accessible with ARIA attributes and keyboard navigation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Default active tab value',
    },
    value: {
      control: 'text',
      description: 'Controlled active tab value',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the tabs',
    },
    activationMode: {
      control: 'select',
      options: ['automatic', 'manual'],
      description: 'Activation mode: automatic (on focus) or manual (on Enter/Space)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Overview</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Settings</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Billing</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Overview</h3>
          <p>This is the overview content. Here you can see a summary of your account.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Settings</h3>
          <p>Manage your account settings and preferences here.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Billing</h3>
          <p>View and manage your billing information and subscription.</p>
        </Card>
      </Tabs.Content>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tabs defaultValue="tab1" orientation="vertical">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Profile</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Security</Tabs.Trigger>
          <Tabs.Trigger value="tab3">Notifications</Tabs.Trigger>
        </Tabs.List>
      </Tabs>
      <div className="flex-1">
        <Tabs defaultValue="tab1" orientation="vertical">
          <Tabs.Content value="tab1">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Profile</h3>
              <p>Edit your profile information and preferences.</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Security</h3>
              <p>Manage your security settings and passwords.</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab3">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Notifications</h3>
              <p>Configure your notification preferences.</p>
            </Card>
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  ),
};

export const ManualActivation: Story = {
  render: () => (
    <Tabs defaultValue="tab1" activationMode="manual">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <Card className="p-4">
          <p>Tab 1 content. In manual mode, tabs only activate on Enter/Space, not on focus.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <Card className="p-4">
          <p>Tab 2 content.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <Card className="p-4">
          <p>Tab 3 content.</p>
        </Card>
      </Tabs.Content>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story: 'In manual activation mode, tabs only activate when Enter or Space is pressed, not on focus.',
      },
    },
  },
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Active</Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled>
          Disabled
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3">Available</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <Card className="p-4">
          <p>This is the active tab content.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <Card className="p-4">
          <p>This tab is disabled and should not be accessible.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <Card className="p-4">
          <p>This is another available tab.</p>
        </Card>
      </Tabs.Content>
    </Tabs>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState('tab1');

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('tab1')}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Set Tab 1
          </button>
          <button
            onClick={() => setActiveTab('tab2')}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Set Tab 2
          </button>
          <button
            onClick={() => setActiveTab('tab3')}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Set Tab 3
          </button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">
            <Card className="p-4">
              <p>Controlled tab 1 content. Active tab: {activeTab}</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <Card className="p-4">
              <p>Controlled tab 2 content. Active tab: {activeTab}</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab3">
            <Card className="p-4">
              <p>Controlled tab 3 content. Active tab: {activeTab}</p>
            </Card>
          </Tabs.Content>
        </Tabs>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of controlled tabs where the active tab is managed externally.',
      },
    },
  },
};

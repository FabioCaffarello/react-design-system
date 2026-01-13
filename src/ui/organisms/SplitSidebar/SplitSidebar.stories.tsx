import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SplitSidebar from './SplitSidebar';
import Tabs from '../../molecules/Tabs/Tabs';
import { BarChart3, Palette, Layers, Layout, CheckCircle2, Code, Settings } from 'lucide-react';
import Card from '../../molecules/Card/Card';
import { Button } from '../../atoms';

const meta: Meta<typeof SplitSidebar> = {
  title: 'Organisms/SplitSidebar',
  component: SplitSidebar,
  parameters: {
    docs: {
      description: {
        component: 'A sidebar component that combines narrow navigation column with content area. Supports collapsible navigation with smooth transitions.',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    width: {
      control: 'text',
      description: 'Total width of the sidebar',
    },
    navigationWidth: {
      control: 'text',
      description: 'Width of the navigation column',
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether the sidebar can be collapsed',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact'],
      description: 'Variant of the sidebar',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SplitSidebar>;

const NavigationTabs = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => (
  <Tabs value={activeTab} onValueChange={onTabChange}>
    <Tabs.List orientation="vertical" variant="compact" className="w-full p-2 gap-1">
      <Tabs.Trigger
        value="nodes-edges"
        className="w-full aspect-square flex items-center justify-center p-2 rounded-md"
      >
        <BarChart3 className="h-5 w-5" />
      </Tabs.Trigger>
      <Tabs.Trigger
        value="canvas"
        className="w-full aspect-square flex items-center justify-center p-2 rounded-md"
      >
        <Palette className="h-5 w-5" />
      </Tabs.Trigger>
      <Tabs.Trigger
        value="background"
        className="w-full aspect-square flex items-center justify-center p-2 rounded-md"
      >
        <Layers className="h-5 w-5" />
      </Tabs.Trigger>
      <Tabs.Trigger
        value="layout"
        className="w-full aspect-square flex items-center justify-center p-2 rounded-md"
      >
        <Layout className="h-5 w-5" />
      </Tabs.Trigger>
      <Tabs.Trigger
        value="validation"
        className="w-full aspect-square flex items-center justify-center p-2 rounded-md"
      >
        <CheckCircle2 className="h-5 w-5" />
      </Tabs.Trigger>
      <Tabs.Trigger
        value="code"
        className="w-full aspect-square flex items-center justify-center p-2 rounded-md"
      >
        <Code className="h-5 w-5" />
      </Tabs.Trigger>
      <Tabs.Trigger
        value="settings"
        className="w-full aspect-square flex items-center justify-center p-2 rounded-md"
      >
        <Settings className="h-5 w-5" />
      </Tabs.Trigger>
    </Tabs.List>
  </Tabs>
);

export const Default: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('nodes-edges');
    const tabLabels: Record<string, string> = {
      'nodes-edges': 'Nodes & Edges',
      'canvas': 'Canvas',
      'background': 'Background',
      'layout': 'Layout',
      'validation': 'Validation',
      'code': 'Code',
      'settings': 'Settings',
    };

    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <SplitSidebar width="320px">
          <SplitSidebar.Navigation>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SplitSidebar.Navigation>
          <SplitSidebar.Content title={tabLabels[activeTab] || 'Settings'}>
            <div className="space-y-4">
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">Section 1</h3>
                <p className="text-sm text-gray-600">Content for {tabLabels[activeTab]} tab.</p>
              </Card>
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">Section 2</h3>
                <p className="text-sm text-gray-600">More content here.</p>
              </Card>
            </div>
          </SplitSidebar.Content>
        </SplitSidebar>
        <div className="flex-1 p-8 bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
          <p>This is the main content area next to the sidebar.</p>
        </div>
      </div>
    );
  },
};

export const Collapsible: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('nodes-edges');
    const [collapsed, setCollapsed] = useState(false);
    const tabLabels: Record<string, string> = {
      'nodes-edges': 'Nodes & Edges',
      'canvas': 'Canvas',
      'background': 'Background',
      'layout': 'Layout',
      'validation': 'Validation',
      'code': 'Code',
      'settings': 'Settings',
    };

    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <SplitSidebar 
          width="320px" 
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
        >
          <SplitSidebar.Navigation>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SplitSidebar.Navigation>
          <SplitSidebar.Content title={tabLabels[activeTab] || 'Settings'}>
            <div className="space-y-4">
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">Section 1</h3>
                <p className="text-sm text-gray-600">Content for {tabLabels[activeTab]} tab.</p>
              </Card>
            </div>
          </SplitSidebar.Content>
        </SplitSidebar>
        <div className="flex-1 p-8 bg-gray-50">
          <Button onClick={() => setCollapsed(!collapsed)} className="mb-4">
            {collapsed ? 'Expand' : 'Collapse'} Sidebar
          </Button>
          <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
          <p>Click the button to collapse/expand the sidebar.</p>
        </div>
      </div>
    );
  },
};

export const LongContent: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('nodes-edges');

    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <SplitSidebar width="320px">
          <SplitSidebar.Navigation>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SplitSidebar.Navigation>
          <SplitSidebar.Content title="Scrollable Content" scrollable={true}>
            <div className="space-y-4">
              {Array.from({ length: 30 }, (_, i) => (
                <Card key={i} padding="md">
                  <h3 className="text-sm font-semibold mb-2">Item {i + 1}</h3>
                  <p className="text-sm text-gray-600">
                    This is a long content item to demonstrate scrolling behavior.
                  </p>
                </Card>
              ))}
            </div>
          </SplitSidebar.Content>
        </SplitSidebar>
        <div className="flex-1 p-8 bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
        </div>
      </div>
    );
  },
};

export const WithoutHeader: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('nodes-edges');

    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <SplitSidebar width="320px">
          <SplitSidebar.Navigation>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SplitSidebar.Navigation>
          <SplitSidebar.Content showHeader={false}>
            <div className="space-y-4">
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">Content without header</h3>
                <p className="text-sm text-gray-600">This sidebar content doesn't have a header.</p>
              </Card>
            </div>
          </SplitSidebar.Content>
        </SplitSidebar>
        <div className="flex-1 p-8 bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
        </div>
      </div>
    );
  },
};

export const WithToggle: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('nodes-edges');
    const tabLabels: Record<string, string> = {
      'nodes-edges': 'Nodes & Edges',
      'canvas': 'Canvas',
      'background': 'Background',
      'layout': 'Layout',
      'validation': 'Validation',
      'code': 'Code',
      'settings': 'Settings',
    };

    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <SplitSidebar width="320px">
          <SplitSidebar.Navigation>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SplitSidebar.Navigation>
          <SplitSidebar.Content title={tabLabels[activeTab] || 'Settings'}>
            <SplitSidebar.Toggle position="top" />
            <div className="space-y-4">
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">Section 1</h3>
                <p className="text-sm text-gray-600">Content with toggle button.</p>
              </Card>
            </div>
          </SplitSidebar.Content>
        </SplitSidebar>
        <div className="flex-1 p-8 bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
          <p>Use Ctrl+B (or Cmd+B on Mac) to toggle the sidebar.</p>
        </div>
      </div>
    );
  },
};

export const Resizable: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('nodes-edges');
    const [width, setWidth] = useState(320);
    const tabLabels: Record<string, string> = {
      'nodes-edges': 'Nodes & Edges',
      'canvas': 'Canvas',
      'background': 'Background',
      'layout': 'Layout',
      'validation': 'Validation',
      'code': 'Code',
      'settings': 'Settings',
    };

    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <SplitSidebar
          width={width}
          resizable={true}
          minWidth={200}
          maxWidth={600}
          snapPoints={[200, 320, 480]}
          onWidthChange={setWidth}
        >
          <SplitSidebar.Navigation>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SplitSidebar.Navigation>
          <SplitSidebar.Content title={tabLabels[activeTab] || 'Settings'}>
            <div className="space-y-4">
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">Resizable Sidebar</h3>
                <p className="text-sm text-gray-600">
                  Drag the right edge to resize. Current width: {width}px
                </p>
              </Card>
            </div>
          </SplitSidebar.Content>
        </SplitSidebar>
        <div className="flex-1 p-8 bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
          <p>Drag the sidebar edge to resize it.</p>
        </div>
      </div>
    );
  },
};

export const Responsive: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('nodes-edges');
    const tabLabels: Record<string, string> = {
      'nodes-edges': 'Nodes & Edges',
      'canvas': 'Canvas',
      'background': 'Background',
      'layout': 'Layout',
      'validation': 'Validation',
      'code': 'Code',
      'settings': 'Settings',
    };

    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <SplitSidebar
          width="320px"
          responsive={true}
          mobileBreakpoint={768}
          mobileVariant="overlay"
          overlayBackdrop={true}
        >
          <SplitSidebar.Navigation>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SplitSidebar.Navigation>
          <SplitSidebar.Content title={tabLabels[activeTab] || 'Settings'}>
            <SplitSidebar.Toggle position="top" />
            <div className="space-y-4">
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">Responsive Sidebar</h3>
                <p className="text-sm text-gray-600">
                  Resize the window to see mobile overlay behavior.
                </p>
              </Card>
            </div>
          </SplitSidebar.Content>
        </SplitSidebar>
        <div className="flex-1 p-8 bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
          <p>Resize the browser window to see responsive behavior.</p>
        </div>
      </div>
    );
  },
};

export const WithStates: Story = {
  render: () => {
    const [state, setState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');
    const [activeTab, setActiveTab] = useState('nodes-edges');

    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <SplitSidebar width="320px">
          <SplitSidebar.Navigation>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SplitSidebar.Navigation>
          <SplitSidebar.Content
            title="States Demo"
            loading={state === 'loading'}
            empty={state === 'empty'}
            emptyMessage="No content available"
            error={state === 'error' ? new Error('Something went wrong') : null}
            onRetry={() => setState('normal')}
          >
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button size="sm" onClick={() => setState('normal')}>Normal</Button>
                <Button size="sm" onClick={() => setState('loading')}>Loading</Button>
                <Button size="sm" onClick={() => setState('empty')}>Empty</Button>
                <Button size="sm" onClick={() => setState('error')}>Error</Button>
              </div>
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">Content</h3>
                <p className="text-sm text-gray-600">This is normal content.</p>
              </Card>
            </div>
          </SplitSidebar.Content>
        </SplitSidebar>
        <div className="flex-1 p-8 bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
        </div>
      </div>
    );
  },
};

export const Variants: Story = {
  render: () => {
    const [variant, setVariant] = useState<'default' | 'compact' | 'minimal' | 'elevated' | 'bordered'>('default');
    const [activeTab, setActiveTab] = useState('nodes-edges');

    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <SplitSidebar width="320px" variant={variant}>
          <SplitSidebar.Navigation>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SplitSidebar.Navigation>
          <SplitSidebar.Content title="Variants">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button size="sm" variant={variant === 'default' ? 'primary' : 'ghost'} onClick={() => setVariant('default')}>
                  Default
                </Button>
                <Button size="sm" variant={variant === 'compact' ? 'primary' : 'ghost'} onClick={() => setVariant('compact')}>
                  Compact
                </Button>
                <Button size="sm" variant={variant === 'minimal' ? 'primary' : 'ghost'} onClick={() => setVariant('minimal')}>
                  Minimal
                </Button>
                <Button size="sm" variant={variant === 'elevated' ? 'primary' : 'ghost'} onClick={() => setVariant('elevated')}>
                  Elevated
                </Button>
                <Button size="sm" variant={variant === 'bordered' ? 'primary' : 'ghost'} onClick={() => setVariant('bordered')}>
                  Bordered
                </Button>
              </div>
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">Current Variant: {variant}</h3>
              </Card>
            </div>
          </SplitSidebar.Content>
        </SplitSidebar>
        <div className="flex-1 p-8 bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
        </div>
      </div>
    );
  },
};

export const WithPersistence: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('nodes-edges');
    const tabLabels: Record<string, string> = {
      'nodes-edges': 'Nodes & Edges',
      'canvas': 'Canvas',
      'background': 'Background',
      'layout': 'Layout',
      'validation': 'Validation',
      'code': 'Code',
      'settings': 'Settings',
    };

    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <SplitSidebar
          width="320px"
          storageKey="storybook-sidebar"
          persistState="localStorage"
          persistWidth={true}
        >
          <SplitSidebar.Navigation>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SplitSidebar.Navigation>
          <SplitSidebar.Content title={tabLabels[activeTab] || 'Settings'}>
            <div className="space-y-4">
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">Persistent Sidebar</h3>
                <p className="text-sm text-gray-600">
                  Collapse/expand state and width are saved to localStorage.
                  Refresh the page to see persistence in action.
                </p>
              </Card>
            </div>
          </SplitSidebar.Content>
        </SplitSidebar>
        <div className="flex-1 p-8 bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
          <p>State persists across page refreshes.</p>
        </div>
      </div>
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('nodes-edges');
    const tabLabels: Record<string, string> = {
      'nodes-edges': 'Nodes & Edges',
      'canvas': 'Canvas',
      'background': 'Background',
      'layout': 'Layout',
      'validation': 'Validation',
      'code': 'Code',
      'settings': 'Settings',
    };

    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <SplitSidebar width="320px">
          <SplitSidebar.Navigation>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SplitSidebar.Navigation>
          <SplitSidebar.Content title={tabLabels[activeTab] || 'Settings'}>
            <div className="space-y-4">
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">Section 1</h3>
                <p className="text-sm text-gray-600">Content for {tabLabels[activeTab]} tab.</p>
              </Card>
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">Section 2</h3>
                <p className="text-sm text-gray-600">More content here.</p>
              </Card>
            </div>
          </SplitSidebar.Content>
          <SplitSidebar.Footer>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-gray-500">Last saved: 2 min ago</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Cancel</Button>
                <Button size="sm" variant="primary">Save Changes</Button>
              </div>
            </div>
          </SplitSidebar.Footer>
        </SplitSidebar>
        <div className="flex-1 p-8 bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
          <p>Sidebar with footer containing action buttons and status information.</p>
        </div>
      </div>
    );
  },
};

export const CollapsibleWithFooter: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('nodes-edges');
    const [collapsed, setCollapsed] = useState(false);
    const tabLabels: Record<string, string> = {
      'nodes-edges': 'Nodes & Edges',
      'canvas': 'Canvas',
      'background': 'Background',
      'layout': 'Layout',
      'validation': 'Validation',
      'code': 'Code',
      'settings': 'Settings',
    };

    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <SplitSidebar 
          width="320px" 
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
          collapsible={true}
        >
          <SplitSidebar.Navigation>
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </SplitSidebar.Navigation>
          <SplitSidebar.Content title={tabLabels[activeTab] || 'Settings'}>
            <SplitSidebar.Toggle position="top" />
            <div className="space-y-4">
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">Section 1</h3>
                <p className="text-sm text-gray-600">Content for {tabLabels[activeTab]} tab.</p>
              </Card>
              <Card padding="md">
                <h3 className="text-sm font-semibold mb-2">Section 2</h3>
                <p className="text-sm text-gray-600">More content here.</p>
              </Card>
            </div>
          </SplitSidebar.Content>
          <SplitSidebar.Footer>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-gray-500">Last saved: 2 min ago</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Cancel</Button>
                <Button size="sm" variant="primary">Save Changes</Button>
              </div>
            </div>
          </SplitSidebar.Footer>
        </SplitSidebar>
        <div className="flex-1 p-8 bg-gray-50">
          <div className="mb-4">
            <Button onClick={() => setCollapsed(!collapsed)} className="mb-4">
              {collapsed ? 'Expand' : 'Collapse'} Sidebar
            </Button>
          </div>
          <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
          <p>
            When collapsed, only the navigation buttons remain visible. 
            The content and footer recolhe (collapse) to the side.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Use Ctrl+B (or Cmd+B on Mac) to toggle, or click the button above.
          </p>
        </div>
      </div>
    );
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import CommandPalette from './CommandPalette';
import Button from '../../atoms/Button/Button';
import {
  FileText,
  Folder,
  Settings,
  Search,
  User,
  LogOut,
  Moon,
  Sun,
  Bell,
} from 'lucide-react';

const meta: Meta<typeof CommandPalette> = {
  title: 'Organisms/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

const basicCommands = [
  { id: '1', label: 'New File', action: () => alert('New File') },
  { id: '2', label: 'Open File', action: () => alert('Open File') },
  { id: '3', label: 'Save', action: () => alert('Save') },
  { id: '4', label: 'Save As', action: () => alert('Save As') },
];

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={basicCommands}
          open={open}
          onOpenChange={setOpen}
        />
        <p className="mt-4 text-sm text-gray-600">
          Press Cmd/Ctrl + K to open, or click the button above
        </p>
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const commandsWithIcons = [
      { id: '1', label: 'New File', icon: <FileText className="h-4 w-4" />, action: () => alert('New File') },
      { id: '2', label: 'Open Folder', icon: <Folder className="h-4 w-4" />, action: () => alert('Open Folder') },
      { id: '3', label: 'Search', icon: <Search className="h-4 w-4" />, action: () => alert('Search') },
      { id: '4', label: 'Settings', icon: <Settings className="h-4 w-4" />, action: () => alert('Settings') },
    ];
    
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={commandsWithIcons}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    );
  },
};

export const WithGroups: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const groupedCommands = [
      { id: '1', label: 'New File', group: 'File', action: () => alert('New File') },
      { id: '2', label: 'Open File', group: 'File', action: () => alert('Open File') },
      { id: '3', label: 'Save', group: 'File', action: () => alert('Save') },
      { id: '4', label: 'User Settings', group: 'Settings', action: () => alert('User Settings') },
      { id: '5', label: 'Preferences', group: 'Settings', action: () => alert('Preferences') },
      { id: '6', label: 'Search', group: 'Actions', action: () => alert('Search') },
    ];
    
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={groupedCommands}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    );
  },
};

export const WithDescriptions: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const commandsWithDescriptions = [
      {
        id: '1',
        label: 'New File',
        description: 'Create a new file',
        icon: <FileText className="h-4 w-4" />,
        action: () => alert('New File'),
      },
      {
        id: '2',
        label: 'Open File',
        description: 'Open an existing file',
        icon: <Folder className="h-4 w-4" />,
        action: () => alert('Open File'),
      },
      {
        id: '3',
        label: 'User Profile',
        description: 'View and edit your profile',
        icon: <User className="h-4 w-4" />,
        action: () => alert('User Profile'),
      },
      {
        id: '4',
        label: 'Notifications',
        description: 'View your notifications',
        icon: <Bell className="h-4 w-4" />,
        action: () => alert('Notifications'),
      },
    ];
    
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={commandsWithDescriptions}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    );
  },
};

export const WithKeywords: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const commandsWithKeywords = [
      {
        id: '1',
        label: 'Toggle Dark Mode',
        description: 'Switch between light and dark theme',
        keywords: ['dark', 'theme', 'mode', 'light'],
        icon: <Moon className="h-4 w-4" />,
        action: () => alert('Toggle Dark Mode'),
      },
      {
        id: '2',
        label: 'Toggle Light Mode',
        description: 'Switch to light theme',
        keywords: ['light', 'theme', 'mode', 'bright'],
        icon: <Sun className="h-4 w-4" />,
        action: () => alert('Toggle Light Mode'),
      },
      {
        id: '3',
        label: 'Sign Out',
        description: 'Sign out of your account',
        keywords: ['logout', 'exit', 'signout', 'leave'],
        icon: <LogOut className="h-4 w-4" />,
        action: () => alert('Sign Out'),
      },
    ];
    
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={commandsWithKeywords}
          open={open}
          onOpenChange={setOpen}
        />
        <p className="mt-4 text-sm text-gray-600">
          Try searching for "dark", "theme", "logout", etc.
        </p>
      </div>
    );
  },
};

export const ManyCommands: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const manyCommands = Array.from({ length: 50 }, (_, i) => ({
      id: String(i + 1),
      label: `Command ${i + 1}`,
      description: `Description for command ${i + 1}`,
      group: `Group ${Math.floor(i / 10) + 1}`,
      action: () => alert(`Command ${i + 1}`),
    }));
    
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette
          items={manyCommands}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    );
  },
};

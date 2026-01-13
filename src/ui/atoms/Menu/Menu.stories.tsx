import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Menu, { MenuTrigger, MenuContent, MenuItem, MenuSeparator } from './Menu';
import Button from '../Button/Button';
import { Settings, User, LogOut, Edit, Trash2, Copy, MoreVertical } from 'lucide-react';

const meta: Meta<typeof Menu> = {
  title: 'Atoms/Menu',
  component: Menu,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>Open Menu</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>Account</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem icon={<User className="h-4 w-4" />}>Profile</MenuItem>
        <MenuItem icon={<Settings className="h-4 w-4" />}>Settings</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<LogOut className="h-4 w-4" />}>Logout</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const WithSeparators: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>Actions</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem icon={<Edit className="h-4 w-4" />}>Edit</MenuItem>
        <MenuItem icon={<Copy className="h-4 w-4" />}>Copy</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Trash2 className="h-4 w-4" />}>Delete</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>Actions</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem>Enabled Item</MenuItem>
        <MenuItem disabled>Disabled Item</MenuItem>
        <MenuItem>Another Enabled Item</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>More Options</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem>Item 1</MenuItem>
        <MenuItem hasSubmenu>Item with Submenu</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex justify-center">
        <Menu placement="top">
          <MenuTrigger>
            <Button>Top Placement</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
            <MenuItem>Item 2</MenuItem>
          </MenuContent>
        </Menu>
      </div>
      <div className="flex justify-center">
        <Menu placement="bottom">
          <MenuTrigger>
            <Button>Bottom Placement</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
            <MenuItem>Item 2</MenuItem>
          </MenuContent>
        </Menu>
      </div>
      <div className="flex justify-center gap-4">
        <Menu placement="left">
          <MenuTrigger>
            <Button>Left Placement</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
            <MenuItem>Item 2</MenuItem>
          </MenuContent>
        </Menu>
        <Menu placement="right">
          <MenuTrigger>
            <Button>Right Placement</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem>Item 1</MenuItem>
            <MenuItem>Item 2</MenuItem>
          </MenuContent>
        </Menu>
      </div>
    </div>
  ),
};

export const TableActions: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem icon={<Edit className="h-4 w-4" />}>Edit</MenuItem>
        <MenuItem icon={<Copy className="h-4 w-4" />}>Duplicate</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Trash2 className="h-4 w-4" />}>Delete</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="space-y-4">
        <Button onClick={() => setOpen(!open)}>
          {open ? 'Close Menu' : 'Open Menu'}
        </Button>
        <Menu open={open} onOpenChange={setOpen}>
          <MenuTrigger>
            <Button>Controlled Menu</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem onClick={() => setOpen(false)}>Close on Click</MenuItem>
            <MenuItem>Item 2</MenuItem>
          </MenuContent>
        </Menu>
      </div>
    );
  },
};

export const WithOnClick: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>Actions</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem
          onClick={() => {
            alert('Edit clicked!');
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            alert('Delete clicked!');
          }}
        >
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
};

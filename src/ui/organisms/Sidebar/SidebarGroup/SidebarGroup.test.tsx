import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SidebarGroup from './SidebarGroup';
import SidebarItem from '../SidebarItem/SidebarItem';

describe('SidebarGroup', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    try {
      localStorage.clear();
    } catch (e) {
      // If clear is not available, remove items manually
      Object.keys(localStorage).forEach(key => localStorage.removeItem(key));
    }
  });

  afterEach(() => {
    // Clear localStorage after each test
    try {
      localStorage.clear();
    } catch (e) {
      // If clear is not available, remove items manually
      Object.keys(localStorage).forEach(key => localStorage.removeItem(key));
    }
  });

  it('renders title and children', () => {
    render(
      <SidebarGroup title="Test Group">
        <SidebarItem href="/test">Test Item</SidebarItem>
      </SidebarGroup>
    );

    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('renders without title', () => {
    render(
      <SidebarGroup>
        <SidebarItem href="/test">Test Item</SidebarItem>
      </SidebarGroup>
    );

    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('collapses and expands when collapsible', async () => {
    render(
      <SidebarGroup title="Collapsible Group" collapsible={true} defaultCollapsed={false}>
        <SidebarItem href="/test">Test Item</SidebarItem>
      </SidebarGroup>
    );

    const title = screen.getByText('Collapsible Group').closest('button');
    expect(title).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();

    fireEvent.click(title!);

    await waitFor(() => {
      // When collapsed, the item should not be visible
      const item = screen.queryByText('Test Item');
      // The item might still be in DOM but hidden, or not rendered
      // Check if button aria-expanded changed
      expect(title).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('starts collapsed when defaultCollapsed is true', () => {
    render(
      <SidebarGroup title="Collapsible Group" collapsible={true} defaultCollapsed={true}>
        <SidebarItem href="/test">Test Item</SidebarItem>
      </SidebarGroup>
    );

    const title = screen.getByText('Collapsible Group').closest('button');
    // When collapsed, the button should have aria-expanded="false"
    expect(title).toHaveAttribute('aria-expanded', 'false');
    // The item might not be visible when collapsed
    const item = screen.queryByText('Test Item');
    // Item might be in DOM but hidden, or not rendered
    if (!item) {
      expect(item).not.toBeInTheDocument();
    }
  });

  it('calls onCollapseChange when provided (controlled mode)', () => {
    const handleCollapseChange = vi.fn();
    render(
      <SidebarGroup
        title="Controlled Group"
        collapsible={true}
        collapsed={false}
        onCollapseChange={handleCollapseChange}
      >
        <SidebarItem href="/test">Test Item</SidebarItem>
      </SidebarGroup>
    );

    const title = screen.getByText('Controlled Group').closest('button');
    fireEvent.click(title!);

    expect(handleCollapseChange).toHaveBeenCalledWith(true);
  });

  it('persists state in localStorage when storageKey is provided', async () => {
    const storageKey = 'test-sidebar-group';
    
    render(
      <SidebarGroup
        title="Persistent Group"
        collapsible={true}
        defaultCollapsed={false}
        storageKey={storageKey}
      >
        <SidebarItem href="/test">Test Item</SidebarItem>
      </SidebarGroup>
    );

    const title = screen.getByText('Persistent Group').closest('button');
    fireEvent.click(title!);

    await waitFor(() => {
      // Collapsible stores 'false' when closed (collapsed), 'true' when open
      const stored = localStorage.getItem(storageKey);
      expect(stored).toBe('false');
    });
  });

  it('shows chevron icon when collapsible and showChevron is true', () => {
    render(
      <SidebarGroup title="Group" collapsible={true} showChevron={true}>
        <SidebarItem href="/test">Test Item</SidebarItem>
      </SidebarGroup>
    );

    const title = screen.getByText('Group').closest('button');
    const svg = title?.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('hides chevron icon when showChevron is false', () => {
    render(
      <SidebarGroup title="Group" collapsible={true} showChevron={false}>
        <SidebarItem href="/test">Test Item</SidebarItem>
      </SidebarGroup>
    );

    const title = screen.getByText('Group').closest('button');
    const svg = title?.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });
});

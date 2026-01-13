import { render, screen } from '@testing-library/react';
import SidebarContent from './SidebarContent';

describe('SidebarContent', () => {
  it('renders children correctly', () => {
    render(
      <SidebarContent>
        <div>Test content</div>
      </SidebarContent>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <SidebarContent title="Test Title">
        <div>Content</div>
      </SidebarContent>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('does not render header when showHeader is false', () => {
    render(
      <SidebarContent title="Test Title" showHeader={false}>
        <div>Content</div>
      </SidebarContent>
    );
    
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('applies correct padding class', () => {
    const { container } = render(
      <SidebarContent padding="md">
        <div>Content</div>
      </SidebarContent>
    );
    
    const contentDiv = container.querySelector('.flex-1.overflow-y-auto');
    expect(contentDiv).toHaveClass('p-3'); // md = 12px = p-3
  });

  it('applies no padding when padding is none', () => {
    const { container } = render(
      <SidebarContent padding="none">
        <div>Content</div>
      </SidebarContent>
    );
    
    const contentDiv = container.querySelector('.flex-1.overflow-y-auto');
    expect(contentDiv).not.toHaveClass(/^p-/);
  });

  it('applies scrollable classes when scrollable is true', () => {
    const { container } = render(
      <SidebarContent scrollable={true}>
        <div>Content</div>
      </SidebarContent>
    );
    
    const contentDiv = container.querySelector('.flex-1');
    expect(contentDiv).toHaveClass('overflow-y-auto');
    expect(contentDiv).toHaveClass('overflow-x-hidden');
    expect(contentDiv).toHaveClass('min-h-0');
  });

  it('does not apply scrollable classes when scrollable is false', () => {
    const { container } = render(
      <SidebarContent scrollable={false}>
        <div>Content</div>
      </SidebarContent>
    );
    
    const contentDiv = container.querySelector('.flex-1');
    expect(contentDiv).not.toHaveClass('overflow-y-auto');
    expect(contentDiv).not.toHaveClass('overflow-x-hidden');
  });

  it('applies custom className', () => {
    const { container } = render(
      <SidebarContent className="custom-class">
        <div>Content</div>
      </SidebarContent>
    );
    
    const rootDiv = container.firstChild;
    expect(rootDiv).toHaveClass('custom-class');
  });
});

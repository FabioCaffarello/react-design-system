import { render, screen } from '@testing-library/react';
import SidebarNavigation from './SidebarNavigation';

describe('SidebarNavigation', () => {
  it('renders children correctly', () => {
    render(
      <SidebarNavigation>
        <div>Navigation content</div>
      </SidebarNavigation>
    );
    
    expect(screen.getByText('Navigation content')).toBeInTheDocument();
  });

  it('applies default width', () => {
    const { container } = render(
      <SidebarNavigation>
        <div>Content</div>
      </SidebarNavigation>
    );
    
    const nav = container.firstChild as HTMLElement;
    expect(nav.style.width).toBe('56px');
  });

  it('applies custom width', () => {
    const { container } = render(
      <SidebarNavigation width="80px">
        <div>Content</div>
      </SidebarNavigation>
    );
    
    const nav = container.firstChild as HTMLElement;
    expect(nav.style.width).toBe('80px');
  });

  it('applies numeric width', () => {
    const { container } = render(
      <SidebarNavigation width={100}>
        <div>Content</div>
      </SidebarNavigation>
    );
    
    const nav = container.firstChild as HTMLElement;
    expect(nav.style.width).toBe('100px');
  });

  it('hides content when collapsed in collapsible variant', () => {
    const { container } = render(
      <SidebarNavigation variant="collapsible" collapsed={true}>
        <div>Content</div>
      </SidebarNavigation>
    );
    
    const nav = container.firstChild as HTMLElement;
    expect(nav.style.width).toBe('0px');
    expect(nav).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows content when not collapsed in collapsible variant', () => {
    const { container } = render(
      <SidebarNavigation variant="collapsible" collapsed={false} width="56px">
        <div>Content</div>
      </SidebarNavigation>
    );
    
    const nav = container.firstChild as HTMLElement;
    expect(nav.style.width).toBe('56px');
    expect(nav).toHaveAttribute('aria-hidden', 'false');
  });

  it('does not collapse when variant is fixed', () => {
    const { container } = render(
      <SidebarNavigation variant="fixed" width="56px">
        <div>Content</div>
      </SidebarNavigation>
    );
    
    const nav = container.firstChild as HTMLElement;
    expect(nav.style.width).toBe('56px');
    expect(nav).toHaveAttribute('aria-hidden', 'false');
  });

  it('applies custom className', () => {
    const { container } = render(
      <SidebarNavigation className="custom-class">
        <div>Content</div>
      </SidebarNavigation>
    );
    
    const nav = container.firstChild;
    expect(nav).toHaveClass('custom-class');
  });

  it('applies transition classes', () => {
    const { container } = render(
      <SidebarNavigation>
        <div>Content</div>
      </SidebarNavigation>
    );
    
    const nav = container.firstChild;
    expect(nav).toHaveClass('transition-all');
    expect(nav).toHaveClass('duration-300');
  });
});

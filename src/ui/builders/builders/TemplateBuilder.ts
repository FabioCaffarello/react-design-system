/**
 * Template Builder
 * 
 * Builder for creating template components.
 */

import type { ComponentBuilderConfig, BuiltComponent, ComponentFactoryOptions } from '../types';
import { OrganismBuilder } from './OrganismBuilder';

/**
 * Template Builder
 * 
 * Builder for creating template components that combine organisms.
 */
export class TemplateBuilder {
  /**
   * Build a template component
   */
  static build(
    config: ComponentBuilderConfig,
    options: ComponentFactoryOptions = {}
  ): BuiltComponent {
    const code = this.generateComponentCode(config);
    const types = this.generateTypes(config);
    const stories = options.includeStories ? this.generateStories(config) : undefined;
    const tests = options.includeTests ? this.generateTests(config) : undefined;

    return {
      name: config.name,
      category: 'template',
      code,
      types,
      stories,
      tests,
      config,
    };
  }

  /**
   * Generate component code
   */
  private static generateComponentCode(config: ComponentBuilderConfig): string {
    return `import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils';
// Import organisms, molecules, and atoms as needed
// import { Header, Footer } from '../../organisms';
// import { Card } from '../../molecules';

export interface ${config.name}Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  ${config.children ? 'children?: React.ReactNode;' : ''}
}

/**
 * ${config.name} Component
 * 
 * ${config.description || 'Template component that combines organisms'}
 */
export const ${config.name} = forwardRef<HTMLDivElement, ${config.name}Props>(
  ({ className, ${config.children ? 'children, ' : ''}...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('', className)}
        {...props}
      >
        ${config.children ? '{children}' : ''}
      </div>
    );
  }
);

${config.name}.displayName = '${config.name}';

export default ${config.name};
`;
  }

  /**
   * Generate Storybook stories
   */
  private static generateStories(config: ComponentBuilderConfig): string {
    return `import type { Meta, StoryObj } from '@storybook/react';
import ${config.name} from './${config.name}';

const meta: Meta<typeof ${config.name}> = {
  title: 'UI/Templates/${config.name}',
  component: ${config.name},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ${config.name}>;

export const Primary: Story = {
  args: {
    ${config.children ? 'children: "Hello World"' : ''}
  },
};
`;
  }

  /**
   * Generate TypeScript types
   */
  private static generateTypes(config: ComponentBuilderConfig): string {
    return `export interface ${config.name}Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  ${config.children ? 'children?: React.ReactNode;' : ''}
}`;
  }

  /**
   * Generate tests
   */
  private static generateTests(config: ComponentBuilderConfig): string {
    return `import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ${config.name} from './${config.name}';

describe('${config.name}', () => {
  it('renders correctly', () => {
    render(<${config.name} />);
    expect(screen.getByRole('generic')).toBeInTheDocument();
  });
});
`;
  }
}

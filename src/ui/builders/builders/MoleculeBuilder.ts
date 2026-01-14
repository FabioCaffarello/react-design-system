/**
 * Molecule Builder
 * 
 * Builder for creating molecule components.
 */

import type { ComponentBuilderConfig, BuiltComponent, ComponentFactoryOptions } from '../types';
import { AtomBuilder } from './AtomBuilder';

/**
 * Molecule Builder
 * 
 * Builder for creating molecule components that combine atoms.
 */
export class MoleculeBuilder {
  /**
   * Build a molecule component
   */
  static build(
    config: ComponentBuilderConfig,
    options: ComponentFactoryOptions = {}
  ): BuiltComponent {
    // Molecules can use similar structure to atoms but may import atoms
    const code = this.generateComponentCode(config);
    const types = this.generateTypes(config);
    const stories = options.includeStories ? this.generateStories(config) : undefined;
    const tests = options.includeTests ? this.generateTests(config) : undefined;

    return {
      name: config.name,
      category: 'molecule',
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
// Import atoms as needed
// import { Button, Input } from '../../atoms';

export interface ${config.name}Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  ${config.children ? 'children?: React.ReactNode;' : ''}
}

/**
 * ${config.name} Component
 * 
 * ${config.description || 'Molecule component that combines atoms'}
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
  title: 'UI/Molecules/${config.name}',
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

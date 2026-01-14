/**
 * Atom Builder
 * 
 * Builder for creating atom components.
 */

import type { ComponentBuilderConfig, BuiltComponent, ComponentFactoryOptions } from '../types';

/**
 * Atom Builder
 * 
 * Builder for creating atom components following design system patterns.
 */
export class AtomBuilder {
  /**
   * Build an atom component
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
      category: 'atom',
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
    const props = this.generatePropsInterface(config);
    const variants = config.variants ? this.generateVariants(config.variants) : '';
    const sizes = config.sizes ? this.generateSizes(config.sizes) : '';
    const accessibility = config.accessibility ? this.generateAccessibility(config.accessibility) : '';

    return `import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn, cva } from '../../utils';

${props}

/**
 * ${config.name} Component
 * 
 * ${config.description || 'Atom component'}
 */
export const ${config.name} = forwardRef<HTMLDivElement, ${config.name}Props>(
  ({ className, ${this.generatePropsList(config)}, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(${variants || '""'}, ${sizes || '""'}, className)}
        ${accessibility}
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
   * Generate props interface
   */
  private static generatePropsInterface(config: ComponentBuilderConfig): string {
    const props: string[] = ['className?: string'];
    
    if (config.variants) {
      props.push(`variant?: '${config.variants.join("' | '")}'`);
    }
    
    if (config.sizes) {
      props.push(`size?: '${config.sizes.join("' | '")}'`);
    }
    
    if (config.children) {
      props.push('children?: React.ReactNode');
    }

    return `export interface ${config.name}Props extends HTMLAttributes<HTMLDivElement> {
  ${props.join(';\n  ')}
}`;
  }

  /**
   * Generate variants
   */
  private static generateVariants(variants: string[]): string {
    return `variants({
  variant: {
    ${variants.map((v) => `${v}: '...'`).join(',\n    ')}
  }
})`;
  }

  /**
   * Generate sizes
   */
  private static generateSizes(sizes: string[]): string {
    return `variants({
  size: {
    ${sizes.map((s) => `${s}: '...'`).join(',\n    ')}
  }
})`;
  }

  /**
   * Generate accessibility attributes
   */
  private static generateAccessibility(accessibility: ComponentBuilderConfig['accessibility']): string {
    const attrs: string[] = [];
    
    if (accessibility?.ariaLabel) {
      attrs.push('aria-label={ariaLabel}');
    }

    return attrs.join('\n        ');
  }

  /**
   * Generate props list
   */
  private static generatePropsList(config: ComponentBuilderConfig): string {
    const props: string[] = [];
    
    if (config.variants) {
      props.push('variant');
    }
    
    if (config.sizes) {
      props.push('size');
    }
    
    if (config.children) {
      props.push('children');
    }

    return props.join(', ');
  }

  /**
   * Generate TypeScript types
   */
  private static generateTypes(config: ComponentBuilderConfig): string {
    return this.generatePropsInterface(config);
  }

  /**
   * Generate Storybook stories
   */
  private static generateStories(config: ComponentBuilderConfig): string {
    return `import type { Meta, StoryObj } from '@storybook/react';
import ${config.name} from './${config.name}';

const meta: Meta<typeof ${config.name}> = {
  title: 'UI/Atoms/${config.name}',
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

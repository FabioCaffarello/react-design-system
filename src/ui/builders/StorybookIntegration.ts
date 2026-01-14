/**
 * Storybook Integration for Component Builder
 * 
 * Utilities for generating stories from Component Builder configurations.
 */

import type { ComponentBuilderConfig, BuiltComponent } from './types';
import { ComponentBuilder } from './ComponentBuilder';

/**
 * Generate Storybook story code from component configuration
 */
export function generateStoryFromConfig(config: ComponentBuilderConfig): string {
  const builder = ComponentBuilder[config.category as 'atom'](config.name);
  
  if (config.variants) {
    builder.withVariants(config.variants);
  }
  
  if (config.sizes) {
    builder.withSizes(config.sizes);
  }

  const built = builder.build();

  return generateStoryCode(built);
}

/**
 * Generate complete story file code
 */
function generateStoryCode(built: BuiltComponent): string {
  const componentName = built.name;
  const category = built.config.category;
  const title = `UI/${category.charAt(0).toUpperCase() + category.slice(1)}s/${componentName}`;

  let storiesCode = '';

  // Generate variant stories
  if (built.config.variants && built.config.variants.length > 0) {
    built.config.variants.forEach((variant) => {
      storiesCode += `
export const ${variant.charAt(0).toUpperCase() + variant.slice(1)}: Story = {
  args: {
    variant: '${variant}',
    ${built.config.children ? "children: 'Button Text'," : ''}
  },
};
`;
    });
  } else {
    storiesCode += `
export const Primary: Story = {
  args: {
    ${built.config.children ? "children: 'Button Text'," : ''}
  },
};
`;
  }

  // Generate size stories
  if (built.config.sizes && built.config.sizes.length > 0) {
    built.config.sizes.forEach((size) => {
      storiesCode += `
export const Size${size.charAt(0).toUpperCase() + size.slice(1)}: Story = {
  args: {
    size: '${size}',
    ${built.config.children ? "children: 'Button Text'," : ''}
  },
};
`;
    });
  }

  return `import type { Meta, StoryObj } from '@storybook/react';
import ${componentName} from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: '${title}',
  component: ${componentName},
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: \`
## ${componentName}

${built.config.description || `${componentName} component`}

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | Component events | - | - |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| default | Default state | Initial | Normal |
        \`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;
${storiesCode}
`;
}

/**
 * Generate story file path
 */
export function getStoryFilePath(config: ComponentBuilderConfig): string {
  const category = config.category;
  const name = config.name;
  return `src/ui/${category}s/${name}/${name}.stories.tsx`;
}

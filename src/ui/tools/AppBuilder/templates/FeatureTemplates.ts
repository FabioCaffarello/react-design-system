/**
 * Feature Templates
 * 
 * Pre-configured feature templates for common use cases
 */

import type { FeatureConfig } from '../types';

/**
 * Generate unique ID for feature
 */
function generateFeatureId(name: string): string {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
}

/**
 * Generate unique ID for component
 */
function generateComponentId(name: string): string {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Dashboard Feature Template
 */
export function createDashboardTemplate(): FeatureConfig {
  return {
    id: generateFeatureId('Dashboard'),
    name: 'Dashboard',
    description: 'A complete dashboard page with cards and metrics',
    category: 'page',
    components: [
      {
        id: generateComponentId('Container'),
        type: 'layout',
        name: 'Container',
        props: {
          maxWidth: 'xl',
          paddingX: 'base',
          paddingY: 'base',
        },
        children: [
          {
            id: generateComponentId('Stack'),
            type: 'layout',
            name: 'Stack',
            props: {
              spacing: 'lg',
            },
            children: [
              {
                id: generateComponentId('Card1'),
                type: 'molecule',
                name: 'Card',
                props: {
                  title: 'Welcome to Dashboard',
                  description: 'This is a sample dashboard feature',
                },
              },
            ],
          },
        ],
      },
    ],
    layout: {
      type: 'container',
      config: {
        maxWidth: 'xl',
        padding: 'base',
      },
    },
    metadata: {
      tags: ['dashboard', 'page', 'template'],
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    },
  };
}

/**
 * Auth Feature Template (Login/Register)
 */
export function createAuthTemplate(): FeatureConfig {
  return {
    id: generateFeatureId('Auth'),
    name: 'Authentication',
    description: 'Login and registration page',
    category: 'page',
    components: [
      {
        id: generateComponentId('Container'),
        type: 'layout',
        name: 'Container',
        props: {
          maxWidth: 'md',
          paddingX: 'base',
          paddingY: 'lg',
        },
        children: [
          {
            id: generateComponentId('Card'),
            type: 'molecule',
            name: 'Card',
            props: {
              title: 'Sign In',
            },
            children: [
              {
                id: generateComponentId('Form'),
                type: 'molecule',
                name: 'Form',
                props: {},
                children: [
                  {
                    id: generateComponentId('Input-Email'),
                    type: 'atom',
                    name: 'Input',
                    props: {
                      type: 'email',
                      label: 'Email',
                      placeholder: 'Enter your email',
                    },
                  },
                  {
                    id: generateComponentId('Input-Password'),
                    type: 'atom',
                    name: 'Input',
                    props: {
                      type: 'password',
                      label: 'Password',
                      placeholder: 'Enter your password',
                    },
                  },
                  {
                    id: generateComponentId('Button'),
                    type: 'atom',
                    name: 'Button',
                    props: {
                      variant: 'primary',
                      children: 'Sign In',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    layout: {
      type: 'container',
      config: {
        maxWidth: 'md',
        padding: 'lg',
      },
    },
    metadata: {
      tags: ['auth', 'login', 'page', 'template'],
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    },
  };
}

/**
 * Form Feature Template
 */
export function createFormTemplate(): FeatureConfig {
  return {
    id: generateFeatureId('Form'),
    name: 'Form',
    description: 'A generic form feature',
    category: 'module',
    components: [
      {
        id: generateComponentId('Form'),
        type: 'molecule',
        name: 'Form',
        props: {},
        children: [
          {
            id: generateComponentId('Input-Name'),
            type: 'atom',
            name: 'Input',
            props: {
              label: 'Name',
              placeholder: 'Enter your name',
            },
          },
          {
            id: generateComponentId('Textarea'),
            type: 'atom',
            name: 'Textarea',
            props: {
              label: 'Description',
              placeholder: 'Enter description',
            },
          },
          {
            id: generateComponentId('Button-Submit'),
            type: 'atom',
            name: 'Button',
            props: {
              variant: 'primary',
              children: 'Submit',
            },
          },
        ],
      },
    ],
    layout: {
      type: 'stack',
      config: {
        spacing: 'md',
      },
    },
    metadata: {
      tags: ['form', 'module', 'template'],
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    },
  };
}

/**
 * List Feature Template
 */
export function createListTemplate(): FeatureConfig {
  return {
    id: generateFeatureId('List'),
    name: 'List',
    description: 'A list view with items',
    category: 'module',
    components: [
      {
        id: generateComponentId('Container'),
        type: 'layout',
        name: 'Container',
        props: {
          maxWidth: 'xl',
          paddingX: 'base',
          paddingY: 'base',
        },
        children: [
          {
            id: generateComponentId('Stack'),
            type: 'layout',
            name: 'Stack',
            props: {
              spacing: 'md',
            },
            children: [
              {
                id: generateComponentId('Card-Item1'),
                type: 'molecule',
                name: 'Card',
                props: {
                  title: 'Item 1',
                  description: 'Description for item 1',
                },
              },
              {
                id: generateComponentId('Card-Item2'),
                type: 'molecule',
                name: 'Card',
                props: {
                  title: 'Item 2',
                  description: 'Description for item 2',
                },
              },
            ],
          },
        ],
      },
    ],
    layout: {
      type: 'stack',
      config: {
        spacing: 'md',
      },
    },
    metadata: {
      tags: ['list', 'module', 'template'],
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    },
  };
}

/**
 * Detail Feature Template
 */
export function createDetailTemplate(): FeatureConfig {
  return {
    id: generateFeatureId('Detail'),
    name: 'Detail',
    description: 'A detail view page',
    category: 'page',
    components: [
      {
        id: generateComponentId('Container'),
        type: 'layout',
        name: 'Container',
        props: {
          maxWidth: 'xl',
          paddingX: 'base',
          paddingY: 'base',
        },
        children: [
          {
            id: generateComponentId('Card'),
            type: 'molecule',
            name: 'Card',
            props: {
              title: 'Detail View',
              description: 'This is a detail view template',
            },
            children: [
              {
                id: generateComponentId('Stack'),
                type: 'layout',
                name: 'Stack',
                props: {
                  spacing: 'sm',
                },
                children: [
                  {
                    id: generateComponentId('Text'),
                    type: 'atom',
                    name: 'Text',
                    props: {
                      children: 'Content goes here',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    layout: {
      type: 'container',
      config: {
        maxWidth: 'xl',
        padding: 'base',
      },
    },
    metadata: {
      tags: ['detail', 'page', 'template'],
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    },
  };
}

/**
 * Wizard Feature Template
 */
export function createWizardTemplate(): FeatureConfig {
  return {
    id: generateFeatureId('Wizard'),
    name: 'Wizard',
    description: 'A multi-step wizard flow',
    category: 'flow',
    components: [
      {
        id: generateComponentId('Container'),
        type: 'layout',
        name: 'Container',
        props: {
          maxWidth: 'lg',
          paddingX: 'base',
          paddingY: 'base',
        },
        children: [
          {
            id: generateComponentId('Stepper'),
            type: 'organism',
            name: 'Stepper',
            props: {
              currentStep: 1,
              steps: [
                { label: 'Step 1', description: 'First step' },
                { label: 'Step 2', description: 'Second step' },
                { label: 'Step 3', description: 'Final step' },
              ],
            },
          },
          {
            id: generateComponentId('Card'),
            type: 'molecule',
            name: 'Card',
            props: {
              title: 'Step 1',
            },
            children: [
              {
                id: generateComponentId('Form'),
                type: 'molecule',
                name: 'Form',
                props: {},
                children: [
                  {
                    id: generateComponentId('Input'),
                    type: 'atom',
                    name: 'Input',
                    props: {
                      label: 'Field 1',
                      placeholder: 'Enter value',
                    },
                  },
                  {
                    id: generateComponentId('Button-Next'),
                    type: 'atom',
                    name: 'Button',
                    props: {
                      variant: 'primary',
                      children: 'Next',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    layout: {
      type: 'stack',
      config: {
        spacing: 'lg',
      },
    },
    metadata: {
      tags: ['wizard', 'flow', 'template'],
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    },
  };
}

/**
 * Get all available templates
 */
export function getFeatureTemplates(): Array<{
  name: string;
  description: string;
  category: FeatureConfig['category'];
  create: () => FeatureConfig;
}> {
  return [
    {
      name: 'Dashboard',
      description: 'A complete dashboard page with cards and metrics',
      category: 'page',
      create: createDashboardTemplate,
    },
    {
      name: 'Authentication',
      description: 'Login and registration page',
      category: 'page',
      create: createAuthTemplate,
    },
    {
      name: 'Form',
      description: 'A generic form feature',
      category: 'module',
      create: createFormTemplate,
    },
    {
      name: 'List',
      description: 'A list view with items',
      category: 'module',
      create: createListTemplate,
    },
    {
      name: 'Detail',
      description: 'A detail view page',
      category: 'page',
      create: createDetailTemplate,
    },
    {
      name: 'Wizard',
      description: 'A multi-step wizard flow',
      category: 'flow',
      create: createWizardTemplate,
    },
  ];
}

/**
 * Advanced Story Template for Design System Components
 * 
 * This template provides a standardized structure for creating stories
 * with events, states, and comprehensive documentation.
 */

import type { Meta, StoryObj, ArgTypes } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import type { ReactElement } from 'react';

/**
 * Event definition for component documentation
 */
export interface EventDefinition {
  name: string;
  description: string;
  parameters: string;
  whenFired: string;
  type?: string;
}

/**
 * State definition for component documentation
 */
export interface StateDefinition {
  name: string;
  description: string;
  howToActivate: string;
  visual: string;
}

/**
 * Configuration for creating a component story
 */
export interface ComponentStoryConfig {
  title: string;
  component: React.ComponentType<any>;
  description: string;
  events?: EventDefinition[];
  states?: StateDefinition[];
  argTypes?: ArgTypes;
  defaultArgs?: Record<string, any>;
}

/**
 * Generate Events documentation table in markdown format
 */
export function generateEventsTable(events: EventDefinition[]): string {
  if (!events || events.length === 0) return '';

  const rows = events.map(
    (event) =>
      `| \`${event.name}\` | ${event.description} | \`${event.parameters}\` | ${event.whenFired} |`
  );

  return `
### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
${rows.join('\n')}
`;
}

/**
 * Generate States documentation table in markdown format
 */
export function generateStatesTable(states: StateDefinition[]): string {
  if (!states || states.length === 0) return '';

  const rows = states.map(
    (state) =>
      `| \`${state.name}\` | ${state.description} | ${state.howToActivate} | ${state.visual} |`
  );

  return `
### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
${rows.join('\n')}
`;
}

/**
 * Create argTypes for events
 */
export function createEventArgTypes(events: EventDefinition[]): ArgTypes {
  const argTypes: ArgTypes = {};

  events.forEach((event) => {
    argTypes[event.name] = {
      description: event.description,
      action: event.name,
      table: {
        type: { summary: event.parameters },
        category: 'Events',
      },
    };
  });

  return argTypes;
}

/**
 * Create a complete Meta configuration for a component story
 */
export function createComponentMeta(config: ComponentStoryConfig): Meta<any> {
  const { title, component, description, events = [], states = [], argTypes = {} } = config;

  // Generate documentation with events and states
  const eventsTable = generateEventsTable(events);
  const statesTable = generateStatesTable(states);

  const fullDescription = `
## ${title.split('/').pop()}

${description}
${eventsTable}
${statesTable}
  `.trim();

  // Merge event argTypes with provided argTypes
  const eventArgTypes = createEventArgTypes(events);
  const mergedArgTypes = { ...eventArgTypes, ...argTypes };

  return {
    title,
    component,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component: fullDescription,
        },
      },
    },
    argTypes: mergedArgTypes,
  };
}

/**
 * Create a story that demonstrates events
 */
export function createEventStory(
  component: React.ComponentType<any>,
  eventName: string,
  props: Record<string, any> = {}
): StoryObj<any> {
  return {
    render: () => {
      const eventHandler = fn((...args: any[]) => {
        console.log(`${eventName} fired:`, args);
      });

      return React.createElement(component, {
        ...props,
        [eventName]: eventHandler,
      });
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      // Try to find interactive element
      const button = canvas.queryByRole('button') || canvas.queryByRole('textbox') || canvas.queryByRole('checkbox');
      
      if (button) {
        await userEvent.click(button);
        // Event will be logged in Actions panel
      }
    },
  };
}

/**
 * Create a story that demonstrates a specific state
 */
export function createStateStory(
  stateName: string,
  props: Record<string, any>,
  playFunction?: (canvas: ReturnType<typeof within>) => Promise<void>
): StoryObj<any> {
  return {
    args: props,
    play: playFunction
      ? async ({ canvasElement }) => {
          const canvas = within(canvasElement);
          await playFunction(canvas);
        }
      : undefined,
  };
}

/**
 * Create interaction test story with steps
 */
export function createInteractionTestStory(
  component: React.ComponentType<any>,
  props: Record<string, any>,
  steps: Array<{
    name: string;
    action: (canvas: ReturnType<typeof within>) => Promise<void>;
  }>
): StoryObj<any> {
  return {
    render: () => React.createElement(component, props),
    play: async ({ canvasElement, step }) => {
      const canvas = within(canvasElement);

      for (const stepConfig of steps) {
        await step(stepConfig.name, async () => {
          await stepConfig.action(canvas);
        });
      }
    },
  };
}

// Re-export React for convenience
import React from 'react';
export { React };

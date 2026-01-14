import type { Meta, StoryObj } from "@storybook/react";
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import TableActions from "./TableActions";

interface SampleRow {
  id: string;
  name: string;
  status: string;
}

const sampleRow: SampleRow = {
  id: '1',
  name: 'Sample Item',
  status: 'ACTIVE',
};

const meta: Meta<typeof TableActions> = {
  title: "Organisms/Table/TableActions",
  component: TableActions,
  parameters: {
    docs: {
      description: {
        component: `
## TableActions

Dropdown menu for row actions in tables.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onClick\` (action) | Ação clicada | \`(row: T) => void\` | Quando uma ação do menu é clicada |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Menu dropdown com ações |
| \`left-aligned\` | Alinhado à esquerda | \`align="left"\` | Menu alinhado à esquerda |
| \`right-aligned\` | Alinhado à direita | \`align="right"\` ou padrão | Menu alinhado à direita |
| \`with-disabled\` | Com ação desabilitada | Ação com \`disabled={true}\` | Ação desabilitada no menu |
| \`with-danger\` | Com ação de perigo | Ação com \`variant="danger"\` | Ação de perigo destacada |
        `,
      },
    },
  },
};

export const Default: StoryObj<typeof TableActions> = {
  args: {
    row: sampleRow,
    actions: [
      {
        label: 'View',
        onClick: () => {},
      },
      {
        label: 'Edit',
        onClick: () => {},
      },
      {
        label: 'Delete',
        onClick: () => {},
        variant: 'danger',
      },
    ],
  },
};

export const WithDisabledAction: StoryObj<typeof TableActions> = {
  args: {
    row: sampleRow,
    actions: [
      {
        label: 'View',
        onClick: () => {},
      },
      {
        label: 'Edit',
        onClick: () => {},
        disabled: true,
      },
      {
        label: 'Delete',
        onClick: () => {},
        variant: 'danger',
      },
    ],
  },
};

export const LeftAligned: StoryObj<typeof TableActions> = {
  args: {
    row: sampleRow,
    align: 'left',
    actions: [
      {
        label: 'View',
        onClick: () => {},
      },
      {
        label: 'Edit',
        onClick: () => {},
      },
    ],
  },
};

// Event Stories
export const WithEvents: StoryObj<typeof TableActions> = {
  render: () => {
    const handleView = fn(() => {
      console.log('View action clicked');
    });
    const handleEdit = fn(() => {
      console.log('Edit action clicked');
    });
    const handleDelete = fn(() => {
      console.log('Delete action clicked');
    });
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Click on the actions menu and select an action. Check the Actions panel to see events being fired.
        </p>
        <TableActions
          row={sampleRow}
          actions={[
            {
              label: 'View',
              onClick: handleView,
            },
            {
              label: 'Edit',
              onClick: handleEdit,
            },
            {
              label: 'Delete',
              onClick: handleDelete,
              variant: 'danger',
            },
          ]}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for component to be rendered
    await waitFor(() => {
      expect(canvas.getByText('View')).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates table actions events. Click on actions and check the Actions panel to see events being logged.',
      },
    },
  },
};

// State Stories
export const DefaultState: StoryObj<typeof TableActions> = {
  args: {
    row: sampleRow,
    actions: [
      {
        label: 'View',
        onClick: () => {},
      },
      {
        label: 'Edit',
        onClick: () => {},
      },
      {
        label: 'Delete',
        onClick: () => {},
        variant: 'danger',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state - dropdown menu with actions.',
      },
    },
  },
};

export const LeftAlignedState: StoryObj<typeof TableActions> = {
  args: {
    row: sampleRow,
    align: 'left',
    actions: [
      {
        label: 'View',
        onClick: () => {},
      },
      {
        label: 'Edit',
        onClick: () => {},
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Left aligned state - menu aligned to the left.',
      },
    },
  },
};

export const RightAlignedState: StoryObj<typeof TableActions> = {
  args: {
    row: sampleRow,
    align: 'right',
    actions: [
      {
        label: 'View',
        onClick: () => {},
      },
      {
        label: 'Edit',
        onClick: () => {},
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Right aligned state - menu aligned to the right (default).',
      },
    },
  },
};

export const WithDisabledActionState: StoryObj<typeof TableActions> = {
  args: {
    row: sampleRow,
    actions: [
      {
        label: 'View',
        onClick: () => {},
      },
      {
        label: 'Edit',
        onClick: () => {},
        disabled: true,
      },
      {
        label: 'Delete',
        onClick: () => {},
        variant: 'danger',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'With disabled action state - one action is disabled.',
      },
    },
  },
};

export const WithDangerActionState: StoryObj<typeof TableActions> = {
  args: {
    row: sampleRow,
    actions: [
      {
        label: 'View',
        onClick: () => {},
      },
      {
        label: 'Edit',
        onClick: () => {},
      },
      {
        label: 'Delete',
        onClick: () => {},
        variant: 'danger',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'With danger action state - one action has danger variant.',
      },
    },
  },
};

export default meta;

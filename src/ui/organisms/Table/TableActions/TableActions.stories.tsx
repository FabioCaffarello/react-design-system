import type { Meta, StoryObj } from "@storybook/react";
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
        component: "Dropdown menu for row actions in tables.",
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

export default meta;

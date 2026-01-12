import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import TableFilters from "./TableFilters";

const meta: Meta<typeof TableFilters> = {
  title: "Organisms/Table/TableFilters",
  component: TableFilters,
  parameters: {
    docs: {
      description: {
        component: "Filter controls for tables with support for text, select, and date filters.",
      },
    },
  },
};

export const Default: StoryObj<typeof TableFilters> = {
  render: () => {
    const [_filters, setFilters] = useState<Record<string, string>>({});

    return (
      <TableFilters
        filters={[
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'ACTIVE', label: 'Active' },
              { value: 'DRAFT', label: 'Draft' },
              { value: 'COMPLETED', label: 'Completed' },
            ],
          },
          {
            key: 'priority',
            label: 'Priority',
            type: 'select',
            options: [
              { value: 'HIGH', label: 'High' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'LOW', label: 'Low' },
            ],
          },
          {
            key: 'search',
            label: 'Search',
            type: 'text',
            placeholder: 'Search by name...',
          },
        ]}
        onFilter={(newFilters) => {
          setFilters(newFilters);
        }}
      />
    );
  },
};

export const WithInitialValues: StoryObj<typeof TableFilters> = {
  render: () => {
    const [_filters, setFilters] = useState<Record<string, unknown>>({});

    return (
      <TableFilters
        filters={[
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'ACTIVE', label: 'Active' },
              { value: 'DRAFT', label: 'Draft' },
            ],
          },
        ]}
        onFilter={(newFilters) => {
          setFilters(newFilters);
        }}
        initialValues={{ status: 'ACTIVE' }}
      />
    );
  },
};

export const WithDateFilter: StoryObj<typeof TableFilters> = {
  render: () => {
    const [_filters, setFilters] = useState<Record<string, string>>({});

    return (
      <TableFilters
        filters={[
          {
            key: 'startDate',
            label: 'Start Date',
            type: 'date',
          },
          {
            key: 'endDate',
            label: 'End Date',
            type: 'date',
          },
        ]}
        onFilter={(newFilters) => {
          setFilters(newFilters);
        }}
      />
    );
  },
};

export default meta;

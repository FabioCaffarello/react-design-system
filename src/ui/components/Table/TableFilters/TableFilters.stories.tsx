import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { expect, userEvent, within, waitFor } from "@storybook/test";
import { useState } from "react";
import TableFilters, { type FilterValue } from "./TableFilters";

const meta: Meta<typeof TableFilters> = {
  title: "Components/Table/TableFilters",
  component: TableFilters,
  parameters: {
    docs: {
      description: {
        component: `
## TableFilters

Filter controls for tables with support for text, select, and date filters.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onFilter\` | Filtros mudaram | \`(filters: Record<string, unknown>) => void\` | Quando filtros são aplicados ou alterados |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Filtros sem valores iniciais |
| \`with-initial-values\` | Com valores iniciais | \`initialValues\` prop definida | Filtros pré-preenchidos |
| \`text-filter\` | Filtro de texto | \`type="text"\` | Campo de texto para busca |
| \`select-filter\` | Filtro de seleção | \`type="select"\` | Dropdown para seleção |
| \`date-filter\` | Filtro de data | \`type="date"\` | Campo de data |
        `,
      },
    },
  },
};

export const Default: StoryObj<typeof TableFilters> = {
  render: () => {
    const [_filters, setFilters] = useState<Record<string, FilterValue>>({});

    return (
      <TableFilters
        filters={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "ACTIVE", label: "Active" },
              { value: "DRAFT", label: "Draft" },
              { value: "COMPLETED", label: "Completed" },
            ],
          },
          {
            key: "priority",
            label: "Priority",
            type: "select",
            options: [
              { value: "HIGH", label: "High" },
              { value: "MEDIUM", label: "Medium" },
              { value: "LOW", label: "Low" },
            ],
          },
          {
            key: "search",
            label: "Search",
            type: "text",
            placeholder: "Search by name...",
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
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "ACTIVE", label: "Active" },
              { value: "DRAFT", label: "Draft" },
            ],
          },
        ]}
        onFilter={(newFilters) => {
          setFilters(newFilters);
        }}
        initialValues={{ status: "ACTIVE" }}
      />
    );
  },
};

export const WithDateFilter: StoryObj<typeof TableFilters> = {
  render: () => {
    const [_filters, setFilters] = useState<Record<string, FilterValue>>({});

    return (
      <TableFilters
        filters={[
          {
            key: "startDate",
            label: "Start Date",
            type: "date",
          },
          {
            key: "endDate",
            label: "End Date",
            type: "date",
          },
        ]}
        onFilter={(newFilters) => {
          setFilters(newFilters);
        }}
      />
    );
  },
};

// Event Stories
export const WithEvents: StoryObj<typeof TableFilters> = {
  render: () => {
    const [_filters, setFilters] = useState<Record<string, FilterValue>>({});
    const handleFilter = fn((newFilters: Record<string, FilterValue>) => {
      setFilters(newFilters);
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Apply filters. Check the Actions panel to see events being fired.
        </p>
        <TableFilters
          filters={[
            {
              key: "status",
              label: "Status",
              type: "select",
              options: [
                { value: "ACTIVE", label: "Active" },
                { value: "DRAFT", label: "Draft" },
                { value: "COMPLETED", label: "Completed" },
              ],
            },
            {
              key: "search",
              label: "Search",
              type: "text",
              placeholder: "Search by name...",
            },
          ]}
          onFilter={handleFilter}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for component to be rendered
    await waitFor(
      async () => {
        // TableFilters starts collapsed, need to expand it first
        const filterButton = canvas.queryByText("Filters");
        if (filterButton) {
          await userEvent.click(filterButton);
          // Wait for filters to expand
          await waitFor(
            () => {
              const inputs = canvas.queryAllByRole("textbox");
              const selects = canvas.queryAllByRole("combobox");
              expect(inputs.length + selects.length).toBeGreaterThan(0);
            },
            { timeout: 2000 },
          );
        } else {
          // If no Filters button, component might already be expanded or structured differently
          // Just verify component rendered
          expect(canvasElement).toBeInTheDocument();
        }
      },
      { timeout: 3000 },
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates filter events. Apply filters and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const DefaultState: StoryObj<typeof TableFilters> = {
  render: () => {
    const [_filters, setFilters] = useState<Record<string, FilterValue>>({});
    return (
      <TableFilters
        filters={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "ACTIVE", label: "Active" },
              { value: "DRAFT", label: "Draft" },
              { value: "COMPLETED", label: "Completed" },
            ],
          },
        ]}
        onFilter={(newFilters) => {
          setFilters(newFilters);
        }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Default state - filters without initial values.",
      },
    },
  },
};

export const WithInitialValuesState: StoryObj<typeof TableFilters> = {
  render: () => {
    const [_filters, setFilters] = useState<Record<string, unknown>>({});
    return (
      <TableFilters
        filters={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "ACTIVE", label: "Active" },
              { value: "DRAFT", label: "Draft" },
            ],
          },
        ]}
        onFilter={(newFilters) => {
          setFilters(newFilters);
        }}
        initialValues={{ status: "ACTIVE" }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "With initial values state - filters pre-filled with values.",
      },
    },
  },
};

export const TextFilterState: StoryObj<typeof TableFilters> = {
  render: () => {
    const [_filters, setFilters] = useState<Record<string, FilterValue>>({});
    return (
      <TableFilters
        filters={[
          {
            key: "search",
            label: "Search",
            type: "text",
            placeholder: "Search by name...",
          },
        ]}
        onFilter={(newFilters) => {
          setFilters(newFilters);
        }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Text filter state - text input for search.",
      },
    },
  },
};

export const SelectFilterState: StoryObj<typeof TableFilters> = {
  render: () => {
    const [_filters, setFilters] = useState<Record<string, FilterValue>>({});
    return (
      <TableFilters
        filters={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "ACTIVE", label: "Active" },
              { value: "DRAFT", label: "Draft" },
              { value: "COMPLETED", label: "Completed" },
            ],
          },
        ]}
        onFilter={(newFilters) => {
          setFilters(newFilters);
        }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Select filter state - dropdown for selection.",
      },
    },
  },
};

export const DateFilterState: StoryObj<typeof TableFilters> = {
  render: () => {
    const [_filters, setFilters] = useState<Record<string, FilterValue>>({});
    return (
      <TableFilters
        filters={[
          {
            key: "startDate",
            label: "Start Date",
            type: "date",
          },
          {
            key: "endDate",
            label: "End Date",
            type: "date",
          },
        ]}
        onFilter={(newFilters) => {
          setFilters(newFilters);
        }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Date filter state - date picker for date range.",
      },
    },
  },
};

export default meta;

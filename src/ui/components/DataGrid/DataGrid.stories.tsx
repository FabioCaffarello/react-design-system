import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { expect, within, waitFor } from "storybook/test";
import { useState } from "react";
import DataGrid from "./DataGrid";
import Button from "../../primitives/Button/Button";

const meta: Meta<typeof DataGrid> = {
  title: "Components/DataGrid",
  component: DataGrid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## DataGrid

A data grid component for displaying tabular data with sorting, filtering, pagination, and selection capabilities.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onSort\` | Coluna ordenada | \`(column: string, direction: 'asc' | 'desc') => void\` | Quando uma coluna é clicada para ordenar |
| \`onSelectionChange\` | Seleção de linhas mudou | \`(selectedRows: string[]) => void\` | Quando linhas são selecionadas ou desselecionadas |
| \`onExport\` | Exportação acionada | \`(format: 'csv' | 'xlsx' | 'json') => void\` | Quando exportação é solicitada |
| \`onFilter\` | Filtros mudaram | \`(filters: Record<string, unknown>) => void\` | Quando filtros são aplicados |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Data grid normal |
| \`with-sorting\` | Com ordenação | \`onSort\` definido | Cabeçalhos de coluna clicáveis |
| \`with-selection\` | Com seleção | \`selectable={true}\` | Checkboxes para seleção |
| \`with-pagination\` | Com paginação | \`pagination\` prop definida | Controles de paginação visíveis |
| \`with-filters\` | Com filtros | \`filters\` prop definida | Controles de filtro visíveis |
| \`loading\` | Carregando | \`loading={true}\` | Indicador de loading visível |
| \`empty\` | Sem dados | \`data={[]}\` | Empty state visível |
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataGrid>;

const mockColumns = [
  { key: "id", label: "ID", sortable: true, exportable: true },
  { key: "name", label: "Name", sortable: true, exportable: true },
  { key: "email", label: "Email", sortable: true, exportable: true },
  { key: "role", label: "Role", sortable: true, exportable: true },
  { key: "status", label: "Status", sortable: true, exportable: true },
];

const mockData = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    role: "Moderator",
    status: "Active",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "User",
    status: "Active",
  },
];

export const Default: Story = {
  render: () => {
    const [sortColumn, setSortColumn] = useState<string | undefined>();
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleSort = (column: string, direction: "asc" | "desc") => {
      setSortColumn(column);
      setSortDirection(direction);
    };

    return (
      <DataGrid
        columns={mockColumns}
        data={mockData}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />
    );
  },
};

export const WithExport: Story = {
  render: () => {
    const handleExport = (format: "csv" | "xlsx" | "json") => {
      alert(`Exporting as ${format.toUpperCase()}`);
    };

    return (
      <DataGrid
        columns={mockColumns}
        data={mockData}
        exportable
        onExport={handleExport}
      />
    );
  },
};

export const WithPagination: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    return (
      <DataGrid
        columns={mockColumns}
        data={mockData}
        pagination={{
          page,
          pageSize,
          total: mockData.length,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    );
  },
};

export const WithSelection: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    return (
      <div className="space-y-4">
        <DataGrid
          columns={mockColumns}
          data={mockData}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          rowId={(row) => row.id as string}
        />
        {selectedRows.length > 0 && (
          <div className="p-4 bg-info-bg rounded-md">
            <p className="text-sm text-fg-info">
              {selectedRows.length} row(s) selected
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const WithFilters: Story = {
  render: () => {
    const [_filters, setFilters] = useState<Record<string, unknown>>({});

    return (
      <DataGrid
        columns={mockColumns}
        data={mockData}
        filters={{
          config: [
            {
              key: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Inactive"],
            },
            {
              key: "role",
              label: "Role",
              type: "select",
              options: ["Admin", "User", "Moderator"],
            },
          ],
          onFilter: setFilters,
        }}
      />
    );
  },
};

export const WithToolbar: Story = {
  render: () => {
    return (
      <DataGrid
        columns={mockColumns}
        data={mockData}
        exportable
        toolbarActions={
          <>
            <Button variant="primary" size="sm">
              Add New
            </Button>
            <Button variant="outline" size="sm">
              Refresh
            </Button>
          </>
        }
      />
    );
  },
};

export const WithGrouping: Story = {
  render: () => {
    return (
      <DataGrid
        columns={mockColumns}
        data={mockData}
        groupable
        groups={[{ column: "role", expanded: true }]}
      />
    );
  },
};

export const Loading: Story = {
  render: () => <DataGrid columns={mockColumns} data={[]} loading />,
};

export const Empty: Story = {
  render: () => (
    <DataGrid
      columns={mockColumns}
      data={[]}
      emptyStateTitle="No Data Available"
      emptyStateMessage="There is no data to display at this time."
    />
  ),
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    const [sortColumn, setSortColumn] = useState<string | undefined>();
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const handleSort = fn((column: string, direction: "asc" | "desc") => {
      setSortColumn(column);
      setSortDirection(direction);
    });

    const handleSelectionChange = fn((selected: string[]) => {
      setSelectedRows(selected);
    });

    const handleExport = fn((format: "csv" | "xlsx" | "json") => {
      console.log("Exporting as:", format);
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-fg-secondary">
          Sort columns, select rows, or export data. Check the Actions panel to
          see events being fired.
        </p>
        <DataGrid
          columns={mockColumns}
          data={mockData}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={handleSelectionChange}
          rowId={(row) => row.id as string}
          exportable
          onExport={handleExport}
        />
        {selectedRows.length > 0 && (
          <p className="text-sm text-fg-tertiary">
            {selectedRows.length} row(s) selected
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for data grid to be rendered
    await waitFor(() => {
      expect(canvas.getByText("ID")).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates data grid events. Sort, select, or export and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const DefaultState: Story = {
  args: {
    columns: mockColumns,
    data: mockData,
  },
  parameters: {
    docs: {
      description: {
        story: "Default state - data grid with basic functionality.",
      },
    },
  },
};

export const WithSortingState: Story = {
  render: () => {
    const [sortColumn, setSortColumn] = useState<string | undefined>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    return (
      <DataGrid
        columns={mockColumns}
        data={mockData}
        onSort={(col, dir) => {
          setSortColumn(col);
          setSortDirection(dir);
        }}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "With sorting state - columns are sortable.",
      },
    },
  },
};

export const WithSelectionState: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<string[]>(["1", "2"]);
    return (
      <DataGrid
        columns={mockColumns}
        data={mockData}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowId={(row) => row.id as string}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "With selection state - rows can be selected.",
      },
    },
  },
};

export const WithPaginationState: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    return (
      <DataGrid
        columns={mockColumns}
        data={mockData}
        pagination={{
          page,
          pageSize,
          total: mockData.length,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "With pagination state - pagination controls are visible.",
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    columns: mockColumns,
    data: [],
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Loading state - shows loading indicator while fetching data.",
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    columns: mockColumns,
    data: [],
    emptyStateTitle: "No Data Available",
    emptyStateMessage: "There is no data to display at this time.",
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state - no data is available to display.",
      },
    },
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { expect, within, waitFor } from "@storybook/test";
import { useState } from "react";
import Table from "./Table";
import { Badge, Button } from "../../primitives";
import { Card } from "../../molecules";

interface SampleData {
  id: string;
  name: string;
  status: string;
  priority: string;
  createdAt: string;
}

const sampleData: SampleData[] = [
  {
    id: "1",
    name: "Epic 1",
    status: "ACTIVE",
    priority: "HIGH",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Epic 2",
    status: "DRAFT",
    priority: "MEDIUM",
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    name: "Epic 3",
    status: "COMPLETED",
    priority: "LOW",
    createdAt: "2024-01-03",
  },
];

const meta: Meta<typeof Table> = {
  title: "Organisms/Table",
  component: Table,
  parameters: {
    docs: {
      description: {
        component: `
## Table

A table component with sorting, loading states, and responsive design. Supports custom cell rendering.

### State Machine

\`\`\`mermaid
stateDiagram-v2
    [*] --> Idle: Initialize
    Idle --> Sorting: onSort(column, direction)
    Sorting --> Sorted: Sort applied
    Sorted --> Sorting: onSort(column, direction)
    Idle --> Filtering: onFilter(filters)
    Filtering --> Filtered: Filters applied
    Filtered --> Filtering: onFilter(filters)
    Idle --> Paginating: setPage(page) / setPageSize(size)
    Paginating --> Paginated: Page changed
    Paginated --> Paginating: setPage(page) / setPageSize(size)
    Idle --> Selecting: toggleRowSelection(id)
    Selecting --> Selected: Selection changed
    Selected --> Selecting: toggleRowSelection(id)
    Sorted --> Filtering: onFilter(filters)
    Filtered --> Sorting: onSort(column, direction)
    Sorted --> Paginating: setPage(page)
    Filtered --> Paginating: setPage(page)
    Loading --> Idle: Data loaded
    Idle --> Loading: Data fetching
\`\`\`

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onSort\` | Coluna ordenada | \`(column: string, direction: 'asc' | 'desc') => void\` | Quando uma coluna é clicada para ordenar |
| \`onSelectionChange\` | Seleção de linhas mudou | \`(selectedRows: string[]) => void\` | Quando linhas são selecionadas ou desselecionadas |
| \`onFilter\` | Filtros mudaram | \`(filters: Record<string, unknown>) => void\` | Quando filtros são aplicados |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Tabela normal |
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
  argTypes: {
    loading: {
      control: "boolean",
      description: "Whether the table is in a loading state",
    },
  },
};

export const Default: StoryObj<typeof Table> = {
  args: {
    columns: [
      { key: "name", label: "Name" },
      { key: "status", label: "Status" },
      { key: "priority", label: "Priority" },
      { key: "createdAt", label: "Created At" },
    ],
    data: sampleData,
  },
};

export const WithSorting: StoryObj<typeof Table> = {
  render: () => {
    const [sortColumn, setSortColumn] = useState<string>("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [data, setData] = useState(sampleData);

    const handleSort = (columnKey: string, direction: "asc" | "desc") => {
      setSortColumn(columnKey);
      setSortDirection(direction);

      const sorted = [...data].sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[columnKey] as string;
        const bVal = (b as Record<string, unknown>)[columnKey] as string;
        const comparison = aVal.localeCompare(bVal);
        return direction === "asc" ? comparison : -comparison;
      });

      setData(sorted);
    };

    return (
      <Table
        columns={[
          { key: "name", label: "Name", sortable: true },
          { key: "status", label: "Status", sortable: true },
          { key: "priority", label: "Priority", sortable: true },
          { key: "createdAt", label: "Created At", sortable: true },
        ]}
        data={data}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />
    );
  },
};

export const WithCustomRendering: StoryObj<typeof Table> = {
  args: {
    columns: [
      { key: "name", label: "Name" },
      {
        key: "status",
        label: "Status",
        render: (value) => (
          <Badge
            variant={
              value === "ACTIVE"
                ? "success"
                : value === "COMPLETED"
                  ? "info"
                  : "neutral"
            }
          >
            {value}
          </Badge>
        ),
      },
      {
        key: "priority",
        label: "Priority",
        render: (value) => (
          <Badge
            variant={
              value === "HIGH"
                ? "error"
                : value === "MEDIUM"
                  ? "warning"
                  : "info"
            }
          >
            {value}
          </Badge>
        ),
      },
      { key: "createdAt", label: "Created At" },
    ],
    data: sampleData,
  },
};

export const Loading: StoryObj<typeof Table> = {
  args: {
    columns: [
      { key: "name", label: "Name" },
      { key: "status", label: "Status" },
    ],
    data: [],
    loading: true,
  },
};

export const Empty: StoryObj<typeof Table> = {
  args: {
    columns: [
      { key: "name", label: "Name" },
      { key: "status", label: "Status" },
    ],
    data: [],
    emptyMessage: "No epics found. Create your first epic to get started.",
  },
};

export const WithPagination: StoryObj<typeof Table> = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const allData = Array.from({ length: 100 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Item ${i + 1}`,
      status: i % 3 === 0 ? "ACTIVE" : i % 3 === 1 ? "DRAFT" : "COMPLETED",
      priority: i % 4 === 0 ? "HIGH" : i % 4 === 1 ? "MEDIUM" : "LOW",
      createdAt: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
    }));

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = allData.slice(startIndex, endIndex);

    return (
      <Table
        columns={[
          { key: "name", label: "Name", sortable: true },
          { key: "status", label: "Status", sortable: true },
          { key: "priority", label: "Priority" },
          { key: "createdAt", label: "Created At" },
        ]}
        data={paginatedData}
        pagination={{
          page,
          pageSize,
          total: allData.length,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    );
  },
};

export const WithFilters: StoryObj<typeof Table> = {
  render: () => {
    const [_filters, setFilters] = useState<Record<string, unknown>>({});
    const [data] = useState(sampleData);

    const handleFilter = (newFilters: Record<string, string>) => {
      setFilters(newFilters);
      // In a real app, this would trigger a server-side filter
    };

    return (
      <Table
        columns={[
          { key: "name", label: "Name" },
          { key: "status", label: "Status" },
          { key: "priority", label: "Priority" },
          { key: "createdAt", label: "Created At" },
        ]}
        data={data}
        filters={{
          config: [
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
          ],
          onFilter: handleFilter,
        }}
      />
    );
  },
};

export const WithSelection: StoryObj<typeof Table> = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    return (
      <Table
        columns={[
          { key: "name", label: "Name" },
          { key: "status", label: "Status" },
          { key: "priority", label: "Priority" },
        ]}
        data={sampleData}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowId={(row) => row.id}
      />
    );
  },
};

export const WithActions: StoryObj<typeof Table> = {
  render: () => {
    const handleView = (row: SampleData) => {
      console.log("View:", row);
    };

    const handleEdit = (row: SampleData) => {
      console.log("Edit:", row);
    };

    const handleDelete = (row: SampleData) => {
      console.log("Delete:", row);
    };

    return (
      <Table
        columns={[
          { key: "name", label: "Name" },
          { key: "status", label: "Status" },
          { key: "priority", label: "Priority" },
        ]}
        data={sampleData}
        actions={(row) => [
          { label: "View", onClick: () => handleView(row) },
          { label: "Edit", onClick: () => handleEdit(row) },
          {
            label: "Delete",
            onClick: () => handleDelete(row),
            variant: "danger",
          },
        ]}
        rowId={(row) => row.id}
      />
    );
  },
};

export const FullFeatured: StoryObj<typeof Table> = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortColumn, setSortColumn] = useState<string>("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [_filters, setFilters] = useState<Record<string, unknown>>({});
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const allData = Array.from({ length: 50 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Epic ${i + 1}`,
      status: i % 3 === 0 ? "ACTIVE" : i % 3 === 1 ? "DRAFT" : "COMPLETED",
      priority: i % 4 === 0 ? "HIGH" : i % 4 === 1 ? "MEDIUM" : "LOW",
      createdAt: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
    }));

    const handleSort = (columnKey: string, direction: "asc" | "desc") => {
      setSortColumn(columnKey);
      setSortDirection(direction);
    };

    const handleFilter = (newFilters: Record<string, string>) => {
      setFilters(newFilters);
    };

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = allData.slice(startIndex, endIndex);

    return (
      <Table
        columns={[
          { key: "name", label: "Name", sortable: true },
          {
            key: "status",
            label: "Status",
            sortable: true,
            render: (value) => (
              <Badge
                variant={
                  value === "ACTIVE"
                    ? "success"
                    : value === "COMPLETED"
                      ? "info"
                      : "neutral"
                }
              >
                {value}
              </Badge>
            ),
          },
          {
            key: "priority",
            label: "Priority",
            render: (value) => (
              <Badge
                variant={
                  value === "HIGH"
                    ? "error"
                    : value === "MEDIUM"
                      ? "warning"
                      : "info"
                }
              >
                {value}
              </Badge>
            ),
          },
          { key: "createdAt", label: "Created At", sortable: true },
        ]}
        data={paginatedData}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        pagination={{
          page,
          pageSize,
          total: allData.length,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
        filters={{
          config: [
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
          ],
          onFilter: handleFilter,
        }}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowId={(row) => row.id}
        actions={(_row) => [
          { label: "View", onClick: () => {} },
          { label: "Edit", onClick: () => {} },
          { label: "Delete", onClick: () => {}, variant: "danger" },
        ]}
      />
    );
  },
};

export const ClientSidePagination: StoryObj<typeof Table> = {
  render: () => {
    const allData = Array.from({ length: 100 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Item ${i + 1}`,
      status: i % 3 === 0 ? "ACTIVE" : i % 3 === 1 ? "DRAFT" : "COMPLETED",
      priority: i % 4 === 0 ? "HIGH" : i % 4 === 1 ? "MEDIUM" : "LOW",
      createdAt: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
    }));

    return (
      <Table
        columns={[
          { key: "name", label: "Name", sortable: true },
          { key: "status", label: "Status", sortable: true },
          { key: "priority", label: "Priority" },
          { key: "createdAt", label: "Created At" },
        ]}
        data={allData}
        paginationMode="client"
        defaultPageSize={10}
      />
    );
  },
};

export const ServerSidePagination: StoryObj<typeof Table> = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const allData = Array.from({ length: 100 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Item ${i + 1}`,
      status: i % 3 === 0 ? "ACTIVE" : i % 3 === 1 ? "DRAFT" : "COMPLETED",
      priority: i % 4 === 0 ? "HIGH" : i % 4 === 1 ? "MEDIUM" : "LOW",
      createdAt: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
    }));

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = allData.slice(startIndex, endIndex);

    return (
      <Table
        columns={[
          { key: "name", label: "Name", sortable: true },
          { key: "status", label: "Status", sortable: true },
          { key: "priority", label: "Priority" },
          { key: "createdAt", label: "Created At" },
        ]}
        data={paginatedData}
        paginationMode="server"
        page={page}
        pageSize={pageSize}
        total={allData.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
};

export const AutoDetectPagination: StoryObj<typeof Table> = {
  render: () => {
    // Example 1: Auto-detects as server-side (has total and onPageChange)
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const allData = Array.from({ length: 100 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Item ${i + 1}`,
      status: i % 3 === 0 ? "ACTIVE" : i % 3 === 1 ? "DRAFT" : "COMPLETED",
      priority: i % 4 === 0 ? "HIGH" : i % 4 === 1 ? "MEDIUM" : "LOW",
      createdAt: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
    }));

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = allData.slice(startIndex, endIndex);

    return (
      <Table
        columns={[
          { key: "name", label: "Name", sortable: true },
          { key: "status", label: "Status", sortable: true },
          { key: "priority", label: "Priority" },
          { key: "createdAt", label: "Created At" },
        ]}
        data={paginatedData}
        total={allData.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        // paginationMode="auto" is default, so we don't need to specify it
      />
    );
  },
};

export const DeclarativeAPI: StoryObj<typeof Table> = {
  render: () => {
    const allData = Array.from({ length: 50 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Epic ${i + 1}`,
      status: i % 3 === 0 ? "ACTIVE" : i % 3 === 1 ? "DRAFT" : "COMPLETED",
      priority: i % 4 === 0 ? "HIGH" : i % 4 === 1 ? "MEDIUM" : "LOW",
      createdAt: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
    }));

    return (
      <Table
        columns={[
          { key: "name", label: "Name", sortable: true },
          {
            key: "status",
            label: "Status",
            sortable: true,
            render: (value) => (
              <Badge
                variant={
                  value === "ACTIVE"
                    ? "success"
                    : value === "COMPLETED"
                      ? "info"
                      : "neutral"
                }
              >
                {value}
              </Badge>
            ),
          },
          {
            key: "priority",
            label: "Priority",
            render: (value) => (
              <Badge
                variant={
                  value === "HIGH"
                    ? "error"
                    : value === "MEDIUM"
                      ? "warning"
                      : "info"
                }
              >
                {value}
              </Badge>
            ),
          },
          { key: "createdAt", label: "Created At", sortable: true },
        ]}
        data={allData}
        paginationMode="client"
        defaultPageSize={10}
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
        ]}
        selectable
        actions={(_row) => [
          { label: "View", onClick: () => {} },
          { label: "Edit", onClick: () => {} },
          { label: "Delete", onClick: () => {}, variant: "danger" },
        ]}
      >
        <Table.Filters />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <Table.Header />
            <Table.Body />
          </table>
        </div>
        <Table.Pagination />
      </Table>
    );
  },
};

export const Accessibility: StoryObj<typeof Table> = {
  args: {
    columns: [
      { key: "name", label: "Name", sortable: true },
      { key: "status", label: "Status", sortable: true },
      { key: "priority", label: "Priority" },
    ],
    data: sampleData,
    "aria-label": "User management table",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table with accessibility features: aria-label, aria-sort on sortable columns, keyboard navigation support.",
      },
    },
  },
};

export const KeyboardNavigation: StoryObj<typeof Table> = {
  args: {
    columns: [
      { key: "name", label: "Name", sortable: true },
      { key: "status", label: "Status", sortable: true },
      { key: "priority", label: "Priority" },
    ],
    data: sampleData,
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800 font-medium mb-2">
          Keyboard Navigation:
        </p>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Tab to navigate to sortable column headers</li>
          <li>Enter or Space to sort columns</li>
          <li>Arrow keys to navigate cells (when implemented)</li>
          <li>Home/End to navigate to first/last column</li>
        </ul>
      </div>
      <Table {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates keyboard navigation in tables. Use Tab to focus sortable headers and Enter/Space to sort.",
      },
    },
  },
};

export const DashboardComposition: StoryObj<typeof Table> = {
  render: () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="primary">New Item</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-2xl font-bold">42</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">28</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-blue-600">14</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Items</h3>
          <Table
            columns={[
              { key: "name", label: "Name", sortable: true },
              { key: "status", label: "Status", sortable: true },
              { key: "priority", label: "Priority" },
              { key: "createdAt", label: "Created", sortable: true },
            ]}
            data={sampleData}
            aria-label="Recent items table"
          />
        </div>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Example dashboard showing Table component working together with Cards, Buttons, and other components.",
      },
    },
  },
};

export const EmptyState: StoryObj<typeof Table> = {
  args: {
    columns: [
      { key: "name", label: "Name" },
      { key: "status", label: "Status" },
      { key: "priority", label: "Priority" },
    ],
    data: [],
    emptyMessage: "No items found",
  },
  parameters: {
    docs: {
      description: {
        story: "Table with empty state when no data is available.",
      },
    },
  },
};

export const LoadingState: StoryObj<typeof Table> = {
  args: {
    columns: [
      { key: "name", label: "Name" },
      { key: "status", label: "Status" },
      { key: "priority", label: "Priority" },
    ],
    data: [],
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Table in loading state showing skeleton loaders.",
      },
    },
  },
};

export const LargeDataset: StoryObj<typeof Table> = {
  render: () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      id: String(i + 1),
      name: `Item ${i + 1}`,
      status: ["ACTIVE", "DRAFT", "COMPLETED"][i % 3],
      priority: ["HIGH", "MEDIUM", "LOW"][i % 3],
      createdAt: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
    }));

    return (
      <Table
        columns={[
          { key: "name", label: "Name", sortable: true },
          { key: "status", label: "Status", sortable: true },
          { key: "priority", label: "Priority" },
          { key: "createdAt", label: "Created", sortable: true },
        ]}
        data={largeData}
        paginationMode="client"
        defaultPageSize={10}
        aria-label="Large dataset table"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table handling large datasets with pagination. Demonstrates performance with 100+ rows.",
      },
    },
  },
};

// Event Stories
export const WithEvents: StoryObj<typeof Table> = {
  render: () => {
    const [sortColumn, setSortColumn] = useState<string>("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [_filters, setFilters] = useState<Record<string, unknown>>({});

    const handleSort = fn((columnKey: string, direction: "asc" | "desc") => {
      setSortColumn(columnKey);
      setSortDirection(direction);
    });

    const handleSelectionChange = fn((selected: string[]) => {
      setSelectedRows(selected);
    });

    const handleFilter = fn((newFilters: Record<string, unknown>) => {
      setFilters(newFilters);
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Sort columns, select rows, or apply filters. Check the Actions panel
          to see events being fired.
        </p>
        <Table
          columns={[
            { key: "name", label: "Name", sortable: true },
            { key: "status", label: "Status", sortable: true },
            { key: "priority", label: "Priority" },
          ]}
          data={sampleData}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={handleSelectionChange}
          rowId={(row) => row.id}
          filters={{
            config: [
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
            ],
            onFilter: handleFilter,
          }}
        />
        {selectedRows.length > 0 && (
          <p className="text-sm text-gray-500">
            {selectedRows.length} row(s) selected
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for table to be rendered
    await waitFor(() => {
      expect(canvas.getByText("Name")).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates table events. Sort, select, or filter and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const DefaultState: StoryObj<typeof Table> = {
  args: {
    columns: [
      { key: "name", label: "Name" },
      { key: "status", label: "Status" },
      { key: "priority", label: "Priority" },
    ],
    data: sampleData,
  },
  parameters: {
    docs: {
      description: {
        story: "Default state - table with basic functionality.",
      },
    },
  },
};

export const WithSortingState: StoryObj<typeof Table> = {
  render: () => {
    const [sortColumn, setSortColumn] = useState<string>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    return (
      <Table
        columns={[
          { key: "name", label: "Name", sortable: true },
          { key: "status", label: "Status", sortable: true },
          { key: "priority", label: "Priority" },
        ]}
        data={sampleData}
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

export const WithSelectionState: StoryObj<typeof Table> = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<string[]>(["1", "2"]);
    return (
      <Table
        columns={[
          { key: "name", label: "Name" },
          { key: "status", label: "Status" },
          { key: "priority", label: "Priority" },
        ]}
        data={sampleData}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowId={(row) => row.id}
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

export const LoadingStateSimple: StoryObj<typeof Table> = {
  args: {
    columns: [
      { key: "name", label: "Name" },
      { key: "status", label: "Status" },
    ],
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

export const NoData: StoryObj<typeof Table> = {
  args: {
    columns: [
      { key: "name", label: "Name" },
      { key: "status", label: "Status" },
    ],
    data: [],
    emptyMessage: "No data available",
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state - no data is available to display.",
      },
    },
  },
};

export default meta;

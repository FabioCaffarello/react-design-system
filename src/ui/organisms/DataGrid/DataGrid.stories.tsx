import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DataGrid from './DataGrid';
import Button from '../../atoms/Button/Button';

const meta: Meta<typeof DataGrid> = {
  title: 'Organisms/DataGrid',
  component: DataGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof DataGrid>;

const mockColumns = [
  { key: 'id', label: 'ID', sortable: true, exportable: true },
  { key: 'name', label: 'Name', sortable: true, exportable: true },
  { key: 'email', label: 'Email', sortable: true, exportable: true },
  { key: 'role', label: 'Role', sortable: true, exportable: true },
  { key: 'status', label: 'Status', sortable: true, exportable: true },
];

const mockData = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'Moderator', status: 'Active' },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Active' },
];

export const Default: Story = {
  render: () => {
    const [sortColumn, setSortColumn] = useState<string | undefined>();
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    
    const handleSort = (column: string, direction: 'asc' | 'desc') => {
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
    const handleExport = (format: 'csv' | 'xlsx' | 'json') => {
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
          <div className="p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
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
            { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
            { key: 'role', label: 'Role', type: 'select', options: ['Admin', 'User', 'Moderator'] },
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
        groups={[
          { column: 'role', expanded: true },
        ]}
      />
    );
  },
};

export const Loading: Story = {
  render: () => (
    <DataGrid
      columns={mockColumns}
      data={[]}
      loading
    />
  ),
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

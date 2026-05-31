import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within, waitFor } from "storybook/test";
import { DataTablePattern, type DataTableColumn } from "./DataTablePattern";
import { Button } from "../../primitives";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

const meta: Meta<typeof DataTablePattern> = {
  title: "Components/DataTablePattern",
  component: DataTablePattern,
  parameters: {
    docs: {
      description: {
        component: `
## DataTablePattern

A complete data table pattern that combines Table, Pagination, Search, and Actions.
This pattern solves the common UX problem of displaying searchable, paginated data tables.

### Components Used
- Table (organism)
- Pagination (molecule)
- SearchInput (molecule)
- Button (atom)
- Container (layout)
- Stack (layout)

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onSearch\` | Busca realizada | \`(query: string) => void\` | Quando o usuário busca na tabela |
| \`onPageChange\` | Página mudou | \`(page: number) => void\` | Quando a página é alterada |
| \`onAction\` | Ação executada | \`(action: string, row: T) => void\` | Quando uma ação é executada |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Default state | Initial render | Table with search and pagination |
| \`loading\` | Loading state | \`loading={true}\` | Shows loading spinner |
| \`empty\` | Empty state | No data | Shows empty message |
| \`searching\` | Searching | Type in search | Filters table data |
| \`with-actions\` | Com ações | \`actions\` prop definida | Botões de ação visíveis |
| \`without-search\` | Sem busca | \`enableSearch={false}\` | Campo de busca oculto |
| \`without-pagination\` | Sem paginação | \`enablePagination={false}\` | Controles de paginação ocultos |
        `,
      },
    },
  },
  argTypes: {
    enableSearch: {
      control: "boolean",
      description: "Enable search functionality",
    },
    enablePagination: {
      control: "boolean",
      description: "Enable pagination",
    },
    itemsPerPage: {
      control: "number",
      description: "Items per page",
    },
    loading: {
      control: "boolean",
      description: "Loading state",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTablePattern>;

const mockUsers: User[] = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Editor" : "Viewer",
  status: i % 4 === 0 ? "inactive" : "active",
}));

const columns: DataTableColumn<User>[] = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "role",
    label: "Role",
  },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span
        className={`px-2 py-1 rounded text-xs ${
          value === "active"
            ? "bg-surface-muted text-fg-success"
            : "bg-surface-muted text-fg-primary"
        }`}
      >
        {value}
      </span>
    ),
  },
];

export const Default: Story = {
  args: {
    columns,
    data: mockUsers,
    enableSearch: true,
    enablePagination: true,
    itemsPerPage: 10,
  },
};

export const WithActions: Story = {
  args: {
    columns,
    data: mockUsers,
    enableSearch: true,
    enablePagination: true,
    actions: (
      <>
        <Button variant="primary">Add User</Button>
        <Button variant="outline">Export</Button>
      </>
    ),
  },
};

export const WithoutSearch: Story = {
  args: {
    columns,
    data: mockUsers,
    enableSearch: false,
    enablePagination: true,
    itemsPerPage: 10,
  },
};

export const WithoutPagination: Story = {
  args: {
    columns,
    data: mockUsers.slice(0, 5),
    enableSearch: true,
    enablePagination: false,
  },
};

export const Loading: Story = {
  args: {
    columns,
    data: [],
    loading: true,
    enableSearch: true,
    enablePagination: true,
  },
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
    enableSearch: true,
    enablePagination: true,
    emptyMessage: "No users found",
  },
};

// Event Stories
export const WithEvents: Story = {
  args: {
    columns,
    data: mockUsers,
    enableSearch: true,
    enablePagination: true,
    itemsPerPage: 10,
  },
  decorators: [
    (Story) => (
      <div className="space-y-4">
        <p className="text-sm text-fg-secondary">
          Search or change pages. Check the Actions panel to see events being
          fired.
        </p>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(
      async () => {
        // There might be multiple "User 1" elements (e.g., User 1 and User 10)
        // Get all matching elements and verify at least one exists
        const user1Elements = canvas.getAllByText((content, element) => {
          return element?.textContent?.trim() === "User 1" || false;
        });
        expect(user1Elements.length).toBeGreaterThan(0);
      },
      { timeout: 3000 },
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates pattern events. Search or navigate pages and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const DefaultState: Story = {
  args: {
    columns,
    data: mockUsers,
    enableSearch: true,
    enablePagination: true,
    itemsPerPage: 10,
  },
  parameters: {
    docs: {
      description: {
        story: "Default state - table with search and pagination.",
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    columns,
    data: [],
    loading: true,
    enableSearch: true,
    enablePagination: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Loading state - shows loading spinner.",
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    columns,
    data: [],
    enableSearch: true,
    enablePagination: true,
    emptyMessage: "No users found",
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state - no data available.",
      },
    },
  },
};

export const WithActionsState: Story = {
  args: {
    columns,
    data: mockUsers,
    enableSearch: true,
    enablePagination: true,
    actions: (
      <>
        <Button variant="primary">Add User</Button>
        <Button variant="outline">Export</Button>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "With actions state - action buttons visible.",
      },
    },
  },
};

export const WithoutSearchState: Story = {
  args: {
    columns,
    data: mockUsers,
    enableSearch: false,
    enablePagination: true,
    itemsPerPage: 10,
  },
  parameters: {
    docs: {
      description: {
        story: "Without search state - search field hidden.",
      },
    },
  },
};

export const WithoutPaginationState: Story = {
  args: {
    columns,
    data: mockUsers.slice(0, 5),
    enableSearch: true,
    enablePagination: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Without pagination state - pagination controls hidden.",
      },
    },
  },
};

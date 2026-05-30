import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { userEvent, within, waitFor } from "storybook/test";
import { useState } from "react";
import Pagination from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component: `
## Pagination

A pagination component for navigating through pages of data. Supports page info and ellipsis for large page counts.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onPageChange\` | Página mudou | \`(page: number) => void\` | Quando uma nova página é selecionada |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`first-page\` | Primeira página | \`currentPage={1}\` | Botões de navegação anteriores desabilitados |
| \`middle-page\` | Página do meio | \`currentPage\` entre primeira e última | Todos os botões de navegação habilitados |
| \`last-page\` | Última página | \`currentPage={totalPages}\` | Botões de navegação seguintes desabilitados |
| \`with-page-info\` | Com informações | \`showPageInfo={true}\` ou padrão | Informações de página visíveis |
| \`without-page-info\` | Sem informações | \`showPageInfo={false}\` | Informações de página ocultas |
        `,
      },
    },
  },
  argTypes: {
    currentPage: {
      control: "number",
      description: "Current page number (1-based)",
    },
    totalPages: {
      control: "number",
      description: "Total number of pages",
    },
    totalItems: {
      control: "number",
      description: "Total number of items (for page info calculation)",
    },
    itemsPerPage: {
      control: "number",
      description: "Number of items per page",
    },
    showPageInfo: {
      control: "boolean",
      description: "Whether to show page information",
    },
    onPageChange: {
      action: "pageChanged",
      description: "Callback when page changes",
      category: "Events",
    },
  },
};

export const Default: StoryObj<typeof Pagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const totalItems = 100;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Simulate data for current page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = Array.from(
      { length: endIndex - startIndex },
      (_, i) => ({
        id: startIndex + i + 1,
        name: `Item ${startIndex + i + 1}`,
      }),
    );

    return (
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Name
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className="border-t border-gray-200">
                  <td className="px-4 py-2 text-sm">{item.id}</td>
                  <td className="px-4 py-2 text-sm">{item.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
        <div className="text-sm text-gray-600">
          Showing items {startIndex + 1} to {endIndex} of {totalItems}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pagination with real data simulation. Navigate through pages to see different data displayed.",
      },
    },
  },
};

export const FirstPage: StoryObj<typeof Pagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
    );
  },
};

export const MiddlePage: StoryObj<typeof Pagination> = {
  render: () => {
    const [page, setPage] = useState(5);
    return (
      <Pagination
        currentPage={page}
        totalPages={10}
        onPageChange={setPage}
        totalItems={100}
        itemsPerPage={10}
      />
    );
  },
};

export const LastPage: StoryObj<typeof Pagination> = {
  render: () => {
    const [page, setPage] = useState(10);
    return (
      <Pagination
        currentPage={page}
        totalPages={10}
        onPageChange={setPage}
        totalItems={100}
        itemsPerPage={10}
      />
    );
  },
};

export const FewPages: StoryObj<typeof Pagination> = {
  render: () => {
    const [page, setPage] = useState(2);
    return (
      <Pagination currentPage={page} totalPages={3} onPageChange={setPage} />
    );
  },
};

export const WithoutPageInfo: StoryObj<typeof Pagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        currentPage={page}
        totalPages={10}
        onPageChange={setPage}
        showPageInfo={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pagination without page info display. Useful for compact layouts.",
      },
    },
  },
};

export const WithManyPages: StoryObj<typeof Pagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    const totalPages = 50;
    const itemsPerPage = 10;
    const totalItems = totalPages * itemsPerPage;

    return (
      <div className="space-y-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
        <div className="text-sm text-gray-600">
          <p>
            Current page: <strong>{page}</strong> of {totalPages}
          </p>
          <p>Try navigating to see ellipsis (...) when there are many pages</p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pagination with many pages (50). Demonstrates ellipsis and navigation with large page counts.",
      },
    },
  },
};

export const InTable: StoryObj<typeof Pagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const totalItems = 47;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const allItems = Array.from({ length: totalItems }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: ["Admin", "User", "Guest"][i % 3],
    }));

    const startIndex = (page - 1) * itemsPerPage;
    const currentItems = allItems.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-sm">{item.id}</td>
                  <td className="px-4 py-2 text-sm">{item.name}</td>
                  <td className="px-4 py-2 text-sm">{item.email}</td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.role === "Admin"
                          ? "bg-blue-100 text-blue-800"
                          : item.role === "User"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pagination integrated in a data table. Navigate through pages to see different rows displayed.",
      },
    },
  },
};

// Event Stories
export const WithEvents: StoryObj<typeof Pagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    const handlePageChange = fn((newPage: number) => {
      setPage(newPage);
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Navigate through pages. Check the Actions panel to see events being
          fired.
        </p>
        <Pagination
          currentPage={page}
          totalPages={10}
          onPageChange={handlePageChange}
        />
        <p className="text-sm text-gray-500">Current page: {page}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Find next button by aria-label or by text content
    await waitFor(
      async () => {
        // Try to find by aria-label first
        let nextButton = canvas.queryByLabelText(/next/i);

        // If not found, try to find by role and name
        if (!nextButton) {
          const buttons = canvas.getAllByRole("button");
          nextButton =
            buttons.find((btn) => {
              const text = btn.textContent?.toLowerCase() || "";
              return (
                text.includes("next") ||
                btn.getAttribute("aria-label")?.toLowerCase().includes("next")
              );
            }) || null;
        }

        if (nextButton) {
          await userEvent.click(nextButton);
        }
      },
      { timeout: 3000 },
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates pagination events. Navigate through pages and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const FirstPageState: StoryObj<typeof Pagination> = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "First page state - previous navigation buttons are disabled.",
      },
    },
  },
};

export const MiddlePageState: StoryObj<typeof Pagination> = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Middle page state - all navigation buttons are enabled.",
      },
    },
  },
};

export const LastPageState: StoryObj<typeof Pagination> = {
  args: {
    currentPage: 10,
    totalPages: 10,
    onPageChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Last page state - next navigation buttons are disabled.",
      },
    },
  },
};

export const WithPageInfoState: StoryObj<typeof Pagination> = {
  args: {
    currentPage: 5,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    showPageInfo: true,
    onPageChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "With page info state - page information is displayed.",
      },
    },
  },
};

export const WithoutPageInfoState: StoryObj<typeof Pagination> = {
  args: {
    currentPage: 5,
    totalPages: 10,
    showPageInfo: false,
    onPageChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Without page info state - page information is hidden.",
      },
    },
  },
};

export default meta;

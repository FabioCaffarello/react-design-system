import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { expect, within, waitFor } from "storybook/test";
import { useState } from "react";
import TablePagination from "./TablePagination";

const meta: Meta<typeof TablePagination> = {
  title: "Components/Table/TablePagination",
  component: TablePagination,
  parameters: {
    docs: {
      description: {
        component: `
## TablePagination

Pagination controls for tables with page navigation and page size selection.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onPageChange\` | Página mudou | \`(page: number) => void\` | Quando uma nova página é selecionada |
| \`onPageSizeChange\` | Tamanho da página mudou | \`(pageSize: number) => void\` | Quando o tamanho da página é alterado |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Estado padrão | Estado inicial | Paginação completa com todas as opções |
| \`without-page-size\` | Sem seletor de tamanho | \`showPageSizeSelector={false}\` | Sem dropdown de tamanho de página |
| \`without-page-info\` | Sem informação de página | \`showPageInfo={false}\` | Sem texto de informação (ex: "1-10 of 100") |
| \`first-page\` | Primeira página | \`page={1}\` | Botão anterior desabilitado |
| \`last-page\` | Última página | \`page={totalPages}\` | Botão próximo desabilitado |
| \`middle-page\` | Página do meio | \`page\` entre 1 e totalPages | Ambos os botões habilitados |
        `,
      },
    },
  },
};

export const Default: StoryObj<typeof TablePagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    return (
      <TablePagination
        page={page}
        pageSize={pageSize}
        total={100}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
};

export const WithoutPageSizeSelector: StoryObj<typeof TablePagination> = {
  render: () => {
    const [page, setPage] = useState(1);

    return (
      <TablePagination
        page={page}
        pageSize={10}
        total={100}
        onPageChange={setPage}
        onPageSizeChange={() => {}}
        showPageSizeSelector={false}
      />
    );
  },
};

export const WithoutPageInfo: StoryObj<typeof TablePagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    return (
      <TablePagination
        page={page}
        pageSize={pageSize}
        total={100}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        showPageInfo={false}
      />
    );
  },
};

export const LargeDataset: StoryObj<typeof TablePagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    return (
      <TablePagination
        page={page}
        pageSize={pageSize}
        total={1250}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[10, 25, 50, 100, 250]}
      />
    );
  },
};

// Event Stories
export const WithEvents: StoryObj<typeof TablePagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const handlePageChange = fn((newPage: number) => {
      setPage(newPage);
    });
    const handlePageSizeChange = fn((newPageSize: number) => {
      setPageSize(newPageSize);
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-fg-secondary">
          Navigate pages or change page size. Check the Actions panel to see
          events being fired.
        </p>
        <TablePagination
          page={page}
          pageSize={pageSize}
          total={100}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
        <p className="text-sm text-fg-tertiary">
          Current page: {page}, Page size: {pageSize}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const _canvas = within(canvasElement);
    // Wait for component to be rendered
    // The text is rendered as "Showing 1 to 10 of 100 results" but split across multiple elements
    // So we check for a parent element that contains the full text
    await waitFor(
      () => {
        const container = canvasElement.querySelector("div");
        const text = container?.textContent || "";
        expect(text).toMatch(/showing.*1.*to.*10.*of.*100.*results/i);
      },
      { timeout: 3000 },
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates pagination events. Navigate pages or change page size and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const DefaultState: StoryObj<typeof TablePagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    return (
      <TablePagination
        page={page}
        pageSize={pageSize}
        total={100}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Default state - pagination with all options enabled.",
      },
    },
  },
};

export const FirstPageState: StoryObj<typeof TablePagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    return (
      <TablePagination
        page={page}
        pageSize={pageSize}
        total={100}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "First page state - previous button disabled.",
      },
    },
  },
};

export const MiddlePageState: StoryObj<typeof TablePagination> = {
  render: () => {
    const [page, setPage] = useState(5);
    const [pageSize, setPageSize] = useState(10);
    return (
      <TablePagination
        page={page}
        pageSize={pageSize}
        total={100}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Middle page state - both navigation buttons enabled.",
      },
    },
  },
};

export const LastPageState: StoryObj<typeof TablePagination> = {
  render: () => {
    const [page, setPage] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    return (
      <TablePagination
        page={page}
        pageSize={pageSize}
        total={100}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Last page state - next button disabled.",
      },
    },
  },
};

export const WithoutPageSizeSelectorState: StoryObj<typeof TablePagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <TablePagination
        page={page}
        pageSize={10}
        total={100}
        onPageChange={setPage}
        onPageSizeChange={() => {}}
        showPageSizeSelector={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Without page size selector state - page size selector hidden.",
      },
    },
  },
};

export const WithoutPageInfoState: StoryObj<typeof TablePagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    return (
      <TablePagination
        page={page}
        pageSize={pageSize}
        total={100}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        showPageInfo={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Without page info state - page information text hidden.",
      },
    },
  },
};

export default meta;

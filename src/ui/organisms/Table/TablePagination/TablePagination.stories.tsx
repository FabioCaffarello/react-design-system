import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import TablePagination from "./TablePagination";

const meta: Meta<typeof TablePagination> = {
  title: "Organisms/Table/TablePagination",
  component: TablePagination,
  parameters: {
    docs: {
      description: {
        component: "Pagination controls for tables with page navigation and page size selection.",
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

export default meta;

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Pagination from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Molecules/Pagination",
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component: "A pagination component for navigating through pages of data. Supports page info and ellipsis for large page counts.",
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
    showPageInfo: {
      control: "boolean",
      description: "Whether to show page information",
    },
  },
};

export const Default: StoryObj<typeof Pagination> = {
  render: () => {
    const [page, setPage] = useState(1);
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

export const FirstPage: StoryObj<typeof Pagination> = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        currentPage={page}
        totalPages={10}
        onPageChange={setPage}
      />
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
      <Pagination
        currentPage={page}
        totalPages={3}
        onPageChange={setPage}
      />
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
};

export default meta;

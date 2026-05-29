import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { expect, within, waitFor } from "@storybook/test";
import { SearchAndFilterPattern } from "./SearchAndFilterPattern";
import { Card } from "../../components";
import { Text } from "../../primitives";
import { Stack } from "../../layouts/Stack/Stack";
import type { FilterConfig } from "./SearchAndFilterPattern";

const meta: Meta<typeof SearchAndFilterPattern> = {
  title: "Components/SearchAndFilterPattern",
  component: SearchAndFilterPattern,
  parameters: {
    docs: {
      description: {
        component: `
## SearchAndFilterPattern

A complete search and filter pattern that combines SearchInput with filter controls.
This pattern solves the common UX problem of searching and filtering lists of items.

### Components Used
- SearchInput (molecule)
- Card (molecule)
- Button (atom)
- Container, Stack (layouts)
- Text (atom)

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onSearch\` | Busca realizada | \`(query: string) => void\` | Quando o usuário busca |
| \`onFilter\` | Filtro aplicado | \`(filters: Record<string, unknown>) => void\` | Quando filtros são aplicados |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Default state | Initial render | Shows all items |
| \`searching\` | Searching | Type in search | Filters items by search |
| \`filtering\` | Filtering | Select filter | Filters items by filter |
| \`empty\` | No results | No matches | Shows empty message |
| \`search-only\` | Apenas busca | \`filters={[]}\` | Apenas campo de busca visível |
| \`filters-only\` | Apenas filtros | Sem \`searchFn\` | Apenas filtros visíveis |
        `,
      },
    },
  },
  argTypes: {
    showResultsCount: {
      control: "boolean",
      description: "Show results count",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchAndFilterPattern>;

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

const mockProducts: Product[] = [
  { id: 1, name: "Laptop", category: "Electronics", price: 999, inStock: true },
  { id: 2, name: "Phone", category: "Electronics", price: 699, inStock: true },
  {
    id: 3,
    name: "Tablet",
    category: "Electronics",
    price: 399,
    inStock: false,
  },
  { id: 4, name: "Desk", category: "Furniture", price: 299, inStock: true },
  { id: 5, name: "Chair", category: "Furniture", price: 199, inStock: true },
  {
    id: 6,
    name: "Monitor",
    category: "Electronics",
    price: 249,
    inStock: true,
  },
  {
    id: 7,
    name: "Keyboard",
    category: "Electronics",
    price: 79,
    inStock: true,
  },
  { id: 8, name: "Mouse", category: "Electronics", price: 49, inStock: false },
];

const filters: FilterConfig[] = [
  {
    id: "category",
    label: "Category",
    type: "select",
    options: [
      { id: "electronics", label: "Electronics", value: "Electronics" },
      { id: "furniture", label: "Furniture", value: "Furniture" },
    ],
  },
  {
    id: "inStock",
    label: "Availability",
    type: "select",
    options: [
      { id: "in-stock", label: "In Stock", value: true },
      { id: "out-of-stock", label: "Out of Stock", value: false },
    ],
  },
];

export const Default: Story = {
  args: {
    items: mockProducts,
    searchFn: (query, item) =>
      (item as { name: string }).name.toLowerCase().includes(query),
    filterFn: (filters, item) => {
      const product = item as Product;
      if (filters.category && product.category !== filters.category)
        return false;
      if (filters.inStock !== undefined && product.inStock !== filters.inStock)
        return false;
      return true;
    },
    renderItem: (item) => {
      const product = item as Product;
      return (
        <Card padding="medium">
          <Stack spacing="sm">
            <Text variant="heading" className="text-base">
              {product.name}
            </Text>
            <Text className="text-gray-600 text-sm">{product.category}</Text>
            <Text variant="heading" className="text-lg">
              ${product.price}
            </Text>
            <Text
              className={
                product.inStock
                  ? "text-green-600 text-sm"
                  : "text-red-600 text-sm"
              }
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Text>
          </Stack>
        </Card>
      );
    },
    filters,
    searchPlaceholder: "Search products...",
    emptyMessage: "No products found",
    showResultsCount: true,
  },
};

export const SearchOnly: Story = {
  args: {
    items: mockProducts,
    searchFn: (query, item) =>
      (item as { name: string }).name.toLowerCase().includes(query),
    renderItem: (item) => {
      const typedItem = item as {
        name: string;
        category: string;
        price: number;
      };
      return (
        <Card padding="medium">
          <Text variant="heading">{typedItem.name}</Text>
          <Text className="text-gray-600 text-sm">
            {typedItem.category} - ${typedItem.price}
          </Text>
        </Card>
      );
    },
    filters: [],
    searchPlaceholder: "Search...",
  },
};

export const FiltersOnly: Story = {
  args: {
    items: mockProducts,
    filterFn: (filters, item) => {
      const typedItem = item as { category: string };
      if (filters.category && typedItem.category !== filters.category)
        return false;
      return true;
    },
    renderItem: (item) => {
      const typedItem = item as { name: string; category: string };
      return (
        <Card padding="medium">
          <Text variant="heading">{typedItem.name}</Text>
          <Text className="text-gray-600 text-sm">{typedItem.category}</Text>
        </Card>
      );
    },
    filters: [filters[0]], // Only category filter
    searchPlaceholder: "Search...",
  },
};

// Event Stories
export const WithEvents: Story = {
  render: () => {
    // @ts-expect-error - Used for Storybook actions panel
    const _handleSearch = fn((query: string) => {
      console.log("Search:", query);
    });
    // @ts-expect-error - Used for Storybook actions panel
    const _handleFilter = fn((filters: Record<string, unknown>) => {
      console.log("Filter:", filters);
    });

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Search or apply filters. Check the Actions panel to see events being
          fired.
        </p>
        <SearchAndFilterPattern
          items={mockProducts}
          searchFn={(query, item) => item.name.toLowerCase().includes(query)}
          filterFn={(filters, item) => {
            if (filters.category && item.category !== filters.category)
              return false;
            if (
              filters.inStock !== undefined &&
              item.inStock !== filters.inStock
            )
              return false;
            return true;
          }}
          renderItem={(item) => (
            <Card padding="medium">
              <Stack spacing="sm">
                <Text variant="heading" className="text-base">
                  {item.name}
                </Text>
                <Text className="text-gray-600 text-sm">{item.category}</Text>
              </Stack>
            </Card>
          )}
          filters={filters}
          searchPlaceholder="Search products..."
          emptyMessage="No products found"
          showResultsCount={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(
        canvas.getByPlaceholderText(/search products/i),
      ).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates pattern events. Search or apply filters and check the Actions panel to see events being logged.",
      },
    },
  },
};

// State Stories
export const DefaultState: Story = {
  args: {
    items: mockProducts,
    searchFn: (query, item) =>
      (item as { name: string }).name.toLowerCase().includes(query),
    filterFn: (filters, item) => {
      const typedItem = item as { category: string; inStock: boolean };
      if (filters.category && typedItem.category !== filters.category)
        return false;
      if (
        filters.inStock !== undefined &&
        typedItem.inStock !== filters.inStock
      )
        return false;
      return true;
    },
    renderItem: (item) => {
      const typedItem = item as { name: string; category: string };
      return (
        <Card padding="medium">
          <Stack spacing="sm">
            <Text variant="heading" className="text-base">
              {typedItem.name}
            </Text>
            <Text className="text-gray-600 text-sm">{typedItem.category}</Text>
          </Stack>
        </Card>
      );
    },
    filters,
    searchPlaceholder: "Search products...",
    emptyMessage: "No products found",
    showResultsCount: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Default state - shows all items with search and filters.",
      },
    },
  },
};

export const SearchOnlyState: Story = {
  args: {
    items: mockProducts,
    searchFn: (query, item) =>
      (item as { name: string }).name.toLowerCase().includes(query),
    renderItem: (item) => {
      const typedItem = item as {
        name: string;
        category: string;
        price: number;
      };
      return (
        <Card padding="medium">
          <Text variant="heading">{typedItem.name}</Text>
          <Text className="text-gray-600 text-sm">
            {typedItem.category} - ${typedItem.price}
          </Text>
        </Card>
      );
    },
    filters: [],
    searchPlaceholder: "Search...",
  },
  parameters: {
    docs: {
      description: {
        story: "Search only state - only search field visible.",
      },
    },
  },
};

export const FiltersOnlyState: Story = {
  args: {
    items: mockProducts,
    filterFn: (filters, item) => {
      const typedItem = item as { category: string };
      if (filters.category && typedItem.category !== filters.category)
        return false;
      return true;
    },
    renderItem: (item) => {
      const typedItem = item as { name: string; category: string };
      return (
        <Card padding="medium">
          <Text variant="heading">{typedItem.name}</Text>
          <Text className="text-gray-600 text-sm">{typedItem.category}</Text>
        </Card>
      );
    },
    filters: [filters[0]], // Only category filter
    searchPlaceholder: "Search...",
  },
  parameters: {
    docs: {
      description: {
        story: "Filters only state - only filters visible.",
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    items: [],
    searchFn: (query, item) =>
      (item as { name: string }).name.toLowerCase().includes(query),
    renderItem: (item) => {
      const typedItem = item as { name: string };
      return (
        <Card padding="medium">
          <Text variant="heading">{typedItem.name}</Text>
        </Card>
      );
    },
    filters: [],
    searchPlaceholder: "Search...",
    emptyMessage: "No items found",
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state - no items to display.",
      },
    },
  },
};

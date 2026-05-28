import React, { useState, useMemo } from "react";
import { SearchInput, Card } from "../../molecules";
import { Button, Text } from "../../primitives";
import { Container } from "../../layouts/Container/Container";
import { Stack } from "../../layouts/Stack/Stack";

export interface FilterOption {
  id: string;
  label: string;
  value: unknown;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: "select" | "multiselect" | "date" | "range";
  options?: FilterOption[];
  placeholder?: string;
}

export interface SearchAndFilterPatternProps<T = unknown> {
  /**
   * Items to search and filter
   */
  items: T[];
  /**
   * Search function - receives search query and item, returns boolean
   */
  searchFn?: (query: string, item: T) => boolean;
  /**
   * Filter function - receives filter config and item, returns boolean
   */
  filterFn?: (filters: Record<string, unknown>, item: T) => boolean;
  /**
   * Render function for each item
   */
  renderItem: (item: T, index: number) => React.ReactNode;
  /**
   * Filter configurations
   */
  filters?: FilterConfig[];
  /**
   * Search placeholder
   * @default "Search..."
   */
  searchPlaceholder?: string;
  /**
   * Empty state message
   */
  emptyMessage?: string;
  /**
   * Show results count
   * @default true
   */
  showResultsCount?: boolean;
}

/**
 * SearchAndFilterPattern - A complete search and filter pattern
 *
 * This pattern solves the common UX problem of searching and filtering lists of items.
 * It combines SearchInput with filter controls and results display.
 *
 * @example
 * ```tsx
 * <SearchAndFilterPattern
 *   items={products}
 *   searchFn={(query, item) => item.name.includes(query)}
 *   renderItem={(item) => <ProductCard product={item} />}
 * />
 * ```
 */
export function SearchAndFilterPattern<T = unknown>({
  items,
  searchFn,
  filterFn,
  renderItem,
  filters = [],
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  showResultsCount = true,
}: SearchAndFilterPatternProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>(
    {},
  );

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    let result = items;

    // Apply search
    if (searchQuery.trim() && searchFn) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) => searchFn(query, item));
    }

    // Apply filters
    if (filterFn && Object.keys(activeFilters).length > 0) {
      result = result.filter((item) => filterFn(activeFilters, item));
    }

    return result;
  }, [items, searchQuery, activeFilters, searchFn, filterFn]);

  const handleFilterChange = (filterId: string, value: unknown) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 || Object.keys(activeFilters).length > 0;

  return (
    <Container maxWidth="full" paddingX="base" paddingY="base">
      <Stack spacing="md">
        {/* Search and Filters */}
        <Card padding="medium">
          <Stack spacing="md">
            {/* Search */}
            <div>
              <SearchInput
                placeholder={searchPlaceholder}
                value={searchQuery}
                onSearch={setSearchQuery}
              />
            </div>

            {/* Filters */}
            {filters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <div key={filter.id} className="flex items-center gap-2">
                    <Text className="text-gray-600 text-sm">
                      {filter.label}:
                    </Text>
                    <select
                      className="px-3 py-1 border rounded text-sm"
                      value={String(activeFilters[filter.id] || "")}
                      onChange={(e) =>
                        handleFilterChange(
                          filter.id,
                          e.target.value || undefined,
                        )
                      }
                    >
                      <option value="">All</option>
                      {filter.options?.map((option) => (
                        <option
                          key={option.id}
                          value={String(option.value || "")}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </Stack>
        </Card>

        {/* Results Count */}
        {showResultsCount && (
          <div className="text-sm text-gray-600">
            Showing {filteredItems.length} of {items.length} results
            {hasActiveFilters && " (filtered)"}
          </div>
        )}

        {/* Results */}
        {filteredItems.length === 0 ? (
          <Card padding="large">
            <div className="text-center text-gray-500">
              <Text>{emptyMessage}</Text>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item, index) => (
              <div key={index}>{renderItem(item, index)}</div>
            ))}
          </div>
        )}
      </Stack>
    </Container>
  );
}

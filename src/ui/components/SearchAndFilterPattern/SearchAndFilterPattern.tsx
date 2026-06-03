import React, { useState, useMemo } from "react";
import { SearchInput, Card } from "../../components";
import { Button, Text } from "../../primitives";
import { Container } from "../../layouts/Container/Container";
import { Stack } from "../../layouts/Stack/Stack";
import { getSpacingClass } from "../../tokens/spacing";

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
              <div className={`flex flex-wrap ${getSpacingClass("sm", "gap")}`}>
                {filters.map((filter) => (
                  <div
                    key={filter.id}
                    className={`flex items-center ${getSpacingClass("sm", "gap")}`}
                  >
                    <Text className="text-fg-secondary text-sm">
                      {filter.label}:
                    </Text>
                    <select
                      className={`${getSpacingClass("md", "px")} ${getSpacingClass("xs", "py")} border rounded text-sm`}
                      // Accessible name comes from the `filter.label` prop
                      // (the same string the adjacent `<Text>` displays as
                      // a visible legend). Without aria-label the raw
                      // `<select>` has no programmatic name and axe
                      // `select-name` (critical) flags every filter
                      // instance — 8 nodes across 5 stories at the
                      // a11y-baseline-of-record measurement.
                      //
                      // The adjacent `<Text>` is prose, not a `<label>`
                      // with `htmlFor`; pairing them properly would
                      // require an id round-trip and a refactor. The
                      // aria-label here closes the rule without changing
                      // the markup shape — Phase 7 doctrine: name by
                      // function ("Status, combobox"), not by tag type.
                      //
                      // Architecturally the raw `<select>` here is a
                      // code-smell — the DS owns a `Select` primitive
                      // that exposes a typed label API used by
                      // `TablePagination`. Migrating this pattern to
                      // the primitive is a separate uniformization PR
                      // (registered in BACKLOG); the a11y fix doesn't
                      // wait on that refactor.
                      aria-label={filter.label}
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
          <div className="text-sm text-fg-secondary">
            Showing {filteredItems.length} of {items.length} results
            {hasActiveFilters && " (filtered)"}
          </div>
        )}

        {/* Results */}
        {filteredItems.length === 0 ? (
          <Card padding="large">
            <div className="text-center text-fg-secondary">
              <Text>{emptyMessage}</Text>
            </div>
          </Card>
        ) : (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${getSpacingClass("base", "gap")}`}
          >
            {filteredItems.map((item, index) => (
              <div key={index}>{renderItem(item, index)}</div>
            ))}
          </div>
        )}
      </Stack>
    </Container>
  );
}

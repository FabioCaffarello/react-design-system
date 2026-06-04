"use client";

import type { HTMLAttributes } from "react";
import { useState } from "react";
import { Input, Select, Label, Button } from "../../../primitives";
import { getSpacingClass } from "../../../tokens/spacing";
import { X, Filter } from "lucide-react";

export type FilterType = "text" | "select" | "date";

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export type FilterValue = string | number | boolean | null | undefined;

export interface TableFiltersProps extends HTMLAttributes<HTMLDivElement> {
  filters: FilterConfig[];
  onFilter: (filters: Record<string, FilterValue>) => void;
  initialValues?: Record<string, FilterValue>;
  showClearAll?: boolean;
}

/**
 * TableFilters Component
 *
 * Filter controls for tables with support for text, select, and date filters.
 * Follows Atomic Design principles as a Molecule component.
 *
 * @example
 * ```tsx
 * <TableFilters
 *   filters={[
 *     { key: 'status', label: 'Status', type: 'select', options: [...] },
 *     { key: 'search', label: 'Search', type: 'text', placeholder: 'Search...' }
 *   ]}
 *   onFilter={(filters) => handleFilter(filters)}
 * />
 * ```
 */
export default function TableFilters({
  filters,
  onFilter,
  initialValues = {},
  showClearAll = true,
  className = "",
  ...props
}: TableFiltersProps) {
  const [filterValues, setFilterValues] =
    useState<Record<string, FilterValue>>(initialValues);
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = Object.values(filterValues).some(
    (value) => value !== "" && value !== null && value !== undefined,
  );

  const handleFilterChange = (key: string, value: FilterValue) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    onFilter(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters: Record<string, FilterValue> = {};
    filters.forEach((filter) => {
      clearedFilters[filter.key] = "";
    });
    setFilterValues(clearedFilters);
    onFilter(clearedFilters);
  };

  const handleClearFilter = (key: string) => {
    const newFilters = { ...filterValues, [key]: "" };
    setFilterValues(newFilters);
    onFilter(newFilters);
  };

  const activeFilterCount = Object.values(filterValues).filter(
    (value) => value !== "" && value !== null && value !== undefined,
  ).length;

  return (
    <div
      className={`bg-surface-base border-b border-line-default ${className}`}
      {...props}
    >
      <div
        className={`${getSpacingClass("base", "px")} ${getSpacingClass("md", "py")} sm:${getSpacingClass("lg", "px")}`}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center ${getSpacingClass("sm", "gap")} text-sm font-medium text-fg-secondary hover:text-fg-primary`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span
                className={`inline-flex items-center ${getSpacingClass("sm", "px")} ${getSpacingClass("0.5", "py")} rounded text-xs font-medium bg-surface-brand-muted text-fg-brand-emphasis`}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {hasActiveFilters && showClearAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-sm"
            >
              Clear all
            </Button>
          )}
        </div>

        {isExpanded && (
          <div
            className={`${getSpacingClass("base", "mt")} grid grid-cols-1 ${getSpacingClass("base", "gap")} sm:grid-cols-2 lg:grid-cols-3`}
          >
            {filters.map((filter) => {
              const rawValue = filterValues[filter.key];
              const value = rawValue == null ? "" : String(rawValue);

              return (
                <div
                  key={filter.key}
                  className={getSpacingClass("xs", "space-y")}
                >
                  <Label htmlFor={`filter-${filter.key}`} variant="optional">
                    {filter.label}
                  </Label>
                  <div className="relative">
                    {filter.type === "text" && (
                      <Input
                        id={`filter-${filter.key}`}
                        type="text"
                        value={value}
                        onChange={(e) =>
                          handleFilterChange(filter.key, e.target.value)
                        }
                        placeholder={
                          filter.placeholder ||
                          `Filter by ${filter.label.toLowerCase()}`
                        }
                        size="sm"
                        variant="outlined"
                      />
                    )}

                    {filter.type === "select" && (
                      <div className="relative">
                        <Select
                          id={`filter-${filter.key}`}
                          options={[
                            { value: "", label: `All ${filter.label}` },
                            ...(filter.options || []),
                          ]}
                          value={value}
                          onChange={(e) =>
                            handleFilterChange(filter.key, e.target.value)
                          }
                        />
                        {value && (
                          <button
                            type="button"
                            onClick={() => handleClearFilter(filter.key)}
                            className="absolute right-8 top-1/2 -translate-y-1/2 text-fg-tertiary hover:text-fg-secondary"
                            aria-label={`Clear ${filter.label} filter`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}

                    {filter.type === "date" && (
                      <Input
                        id={`filter-${filter.key}`}
                        type="date"
                        value={value}
                        onChange={(e) =>
                          handleFilterChange(filter.key, e.target.value)
                        }
                        size="sm"
                        variant="outlined"
                      />
                    )}

                    {value && filter.type !== "select" && (
                      <button
                        type="button"
                        onClick={() => handleClearFilter(filter.key)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-fg-tertiary hover:text-fg-secondary"
                        aria-label={`Clear ${filter.label} filter`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

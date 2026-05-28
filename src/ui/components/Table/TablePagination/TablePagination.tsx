"use client";

import type { HTMLAttributes } from "react";
import { Button, Select, Text } from "../../../primitives";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface TablePaginationProps extends HTMLAttributes<HTMLDivElement> {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showPageInfo?: boolean;
}

/**
 * TablePagination Component
 *
 * Pagination controls for tables with page navigation and page size selection.
 * Follows Atomic Design principles as a Molecule component.
 *
 * @example
 * ```tsx
 * <TablePagination
 *   page={1}
 *   pageSize={10}
 *   total={100}
 *   onPageChange={(page) => setPage(page)}
 *   onPageSizeChange={(size) => setPageSize(size)}
 * />
 * ```
 */
export default function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  showPageInfo = true,
  className = "",
  ...props
}: TablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  const handleFirst = () => {
    if (page > 1) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (page < totalPages) {
      onPageChange(totalPages);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 ${className}`}
      {...props}
    >
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {showPageInfo && (
          <div>
            <Text as="p" className="text-sm text-gray-700">
              Showing <span className="font-medium">{startItem}</span> to{" "}
              <span className="font-medium">{endItem}</span> of{" "}
              <span className="font-medium">{total}</span> results
            </Text>
          </div>
        )}

        <div className="flex items-center gap-4">
          {showPageSizeSelector && (
            <div className="flex items-center gap-2">
              <Text as="span" className="text-sm text-gray-700">
                Show:
              </Text>
              <Select
                options={pageSizeOptions.map((size) => ({
                  value: size.toString(),
                  label: size.toString(),
                }))}
                value={pageSize.toString()}
                onChange={(e) => {
                  const newSize = parseInt(e.target.value);
                  onPageSizeChange(newSize);
                  // Reset to first page when changing page size
                  onPageChange(1);
                }}
                className="w-20"
              />
            </div>
          )}

          <nav className="flex items-center gap-1" aria-label="Pagination">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFirst}
              disabled={page === 1}
              aria-label="First page"
            >
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-2" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="min-w-10"
                    aria-label={`Page ${pageNum}`}
                    aria-current={page === pageNum ? "page" : undefined}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLast}
              disabled={page >= totalPages}
              aria-label="Last page"
            >
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-2" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}

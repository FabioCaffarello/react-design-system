"use client";

import type { HTMLAttributes } from "react";
import { Button } from "../../primitives";
import { cn } from "../../utils";
import {
  getColorClass,
  getSpacingClass,
  getTypographySizeFromFontSize,
} from "../../tokens";

interface Props extends HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  showPageInfo?: boolean;
}

/**
 * Pagination Component
 *
 * A pagination component for navigating through pages of data.
 * Follows Atomic Design principles as a Molecule component.
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => setPage(page)}
 *   totalItems={100}
 *   itemsPerPage={10}
 * />
 * ```
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showPageInfo = true,
  className = "",
  ...props
}: Props) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem =
    totalItems && itemsPerPage
      ? (currentPage - 1) * itemsPerPage + 1
      : undefined;
  const endItem =
    totalItems && itemsPerPage
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : undefined;

  const classes = cn(
    "flex",
    "items-center",
    "justify-between",
    getSpacingClass("base", "px"),
    getSpacingClass("md", "py"),
    className,
  );

  return (
    <nav className={classes} aria-label="Pagination" {...props}>
      <div className={cn("flex", "items-center", getSpacingClass("sm", "gap"))}>
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          size="sm"
        >
          Previous
        </Button>
        <div
          className={cn("flex", "items-center", getSpacingClass("xs", "gap"))}
        >
          {getPageNumbers().map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className={cn(
                    getSpacingClass("sm", "px"),
                    getColorClass("neutral", "DEFAULT", "text"),
                  )}
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <Button
                key={pageNum}
                variant={isActive ? "primary" : "ghost"}
                onClick={() => handlePageClick(pageNum)}
                size="sm"
                aria-current={isActive ? "page" : undefined}
                aria-label={`Go to page ${pageNum}`}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        <Button
          variant="secondary"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          size="sm"
        >
          Next
        </Button>
      </div>
      {showPageInfo && totalItems && itemsPerPage && (
        <div
          className={cn(
            getTypographySizeFromFontSize("sm"),
            getColorClass("neutral", "dark", "text"),
          )}
        >
          Showing {startItem} to {endItem} of {totalItems} results
        </div>
      )}
    </nav>
  );
}

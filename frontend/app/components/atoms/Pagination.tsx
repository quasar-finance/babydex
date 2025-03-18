import { useMemo, useState } from "react";
import type React from "react";
import { motion } from "motion/react";
import { twMerge } from "~/utils/twMerge";
import { Button } from "./Button";
import { IconChevronLeft, IconChevronRight, IconDots } from "@tabler/icons-react";

interface PaginationProps {
  total: number;
  initialPage?: number;
  maxVisible?: number;
  loop?: boolean;
  onPageChange?: (page: number) => void;
  className?: {
    base?: string;
    button?: string;
    arrows?: string;
  };
}

export const Pagination: React.FC<PaginationProps> = ({
  total,
  initialPage = 1,
  maxVisible = 7,
  loop = false,
  onPageChange,
  className,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = (page: number) => {
    const newPage = loop
      ? page < 1
        ? total
        : page > total
          ? 1
          : page
      : Math.max(1, Math.min(total, page));

    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

  const pages = useMemo(() => {
    if (total <= 1) return [1];

    const numbersToShow = maxVisible - 2;

    const leftBound = Math.max(
      2,
      Math.min(currentPage - Math.floor(numbersToShow / 2), total - numbersToShow),
    );
    const rightBound = Math.min(total - 1, leftBound + numbersToShow - 1);

    return [
      1,
      ...(leftBound > 2 ? ["..."] : []),
      ...Array.from({ length: rightBound - leftBound + 1 }, (_, i) => leftBound + i),
      ...(rightBound < total - 1 ? ["..."] : []),
      total,
    ];
  }, [currentPage, total, maxVisible]);

  return (
    <div
      className={twMerge(
        "relative z-10 flex items-center space-x-2 text-gray-400",
        className?.base,
      )}
    >
      <Button
        className={twMerge(
          "min-w-8 h-8 rounded-full flex items-center justify-center p-0",
          className?.arrows,
        )}
        variant="flat"
        onClick={() => goToPage(currentPage - 1)}
        isDisabled={currentPage === 1 && !loop}
      >
        <IconChevronLeft className="h-5 w-5" />
      </Button>

      <div className="relative flex space-x-2">
        {pages.map((page, index, arr) => {
          if (page === "...") {
            const isLeftEllipsis = index === 1;

            const nextPage = isLeftEllipsis
              ? (arr[index + 1] as number) - 1
              : (arr[index - 1] as number) + 1;

            return (
              <motion.button
                className={twMerge(
                  "relative w-8 h-8 flex items-center justify-center text-sm hover:text-tw-orange-400 transition-all text-white/20",
                  className?.button,
                )}
                key={`dots-${index}`}
                onClick={() => goToPage(nextPage)}
              >
                <IconDots className="h-5 w-5" />
              </motion.button>
            );
          }

          return (
            <motion.button
              layoutId={`pagination-${page}`}
              key={page}
              onClick={() => goToPage(+page)}
              className={twMerge(
                "relative w-8 h-8 flex items-center justify-center text-sm hover:text-tw-orange-400 transition-all select-none",
                page === currentPage ? "text-white" : "text-white/20",
                className?.button,
              )}
            >
              {page}
              {page === currentPage && (
                <motion.span
                  layoutId="pagination-underline"
                  className="absolute left-0 -bottom-1 w-full h-[1px] bg-tw-orange-400"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <Button
        className={twMerge(
          "min-w-8 h-8 rounded-full flex items-center justify-center p-0",
          className?.arrows,
        )}
        variant="flat"
        onClick={() => goToPage(currentPage + 1)}
        isDisabled={currentPage === total && !loop}
      >
        <IconChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

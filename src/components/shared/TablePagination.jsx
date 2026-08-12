"use client";

import { PAGE_SIZE_OPTIONS } from "@/hooks/usePagination";
import Button from "@/components/shared/Button";

export default function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-neutral-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-neutral-600">
        {totalItems} resultado{totalItems === 1 ? "" : "s"} en total
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-neutral-600">
            Pagina {currentPage} de {totalPages}
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}

export function TablePageSizeSelector({ pageSize, onPageSizeChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
      <span>Por pagina</span>
      <select
        value={pageSize}
        onChange={(event) => onPageSizeChange(Number(event.target.value))}
        className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none"
      >
        {PAGE_SIZE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

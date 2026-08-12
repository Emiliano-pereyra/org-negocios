"use client";

import TablePagination, { TablePageSizeSelector } from "@/components/shared/TablePagination";
import { usePagination } from "@/hooks/usePagination";

function getSortedRows(rows, sortKey, sortOrder) {
  if (!sortKey || sortOrder === "none") {
    return rows;
  }

  const sorted = [...rows].sort((a, b) => {
    const valueA = a[sortKey];
    const valueB = b[sortKey];

    if (typeof valueA === "number" && typeof valueB === "number") {
      return valueA - valueB;
    }

    return String(valueA).localeCompare(String(valueB), "es");
  });

  return sortOrder === "desc" ? sorted.reverse() : sorted;
}

function formatCellValue(value, key) {
  if (key === "precio" || key === "monto") {
    return `$${Number(value).toLocaleString("es-AR")}`;
  }

  return value;
}

// sortOrder: "none" mantiene el orden original, "asc" o "desc" ordena por sortKey
export default function DataTable({ columns, rows, sortKey, sortOrder = "none" }) {
  const sortedRows = getSortedRows(rows, sortKey, sortOrder);

  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedRows,
    totalItems,
  } = usePagination(sortedRows);

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className="flex justify-end border-b border-neutral-200 px-4 py-2">
        <TablePageSizeSelector pageSize={pageSize} onPageSizeChange={setPageSize} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-neutral-100">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium text-neutral-900">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-neutral-500"
                >
                  No hay resultados para mostrar.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-neutral-200 even:bg-white odd:bg-neutral-50"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-neutral-800">
                      {formatCellValue(row[column.key], column.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
      />
    </div>
  );
}

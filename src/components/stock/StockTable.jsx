"use client";

import { useMemo, useState } from "react";
import ActionIcon from "@/components/shared/ActionIcon";
import TablePagination, { TablePageSizeSelector } from "@/components/shared/TablePagination";
import { usePagination } from "@/hooks/usePagination";

const EDITABLE_COLUMNS = [
  { key: "nombre", label: "Producto", editable: true, type: "text" },
  { key: "cantidad", label: "Cantidad", editable: true, type: "number" },
  { key: "precio", label: "Precio", editable: true, type: "number" },
];

function formatDisplayValue(value, key) {
  if (key === "precio") {
    return `$${Number(value).toLocaleString("es-AR")}`;
  }

  return value;
}

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

export default function StockTable({
  rows,
  sortKey = "precio",
  sortOrder = "desc",
  onUpdate,
  onDelete,
  isProcessing = false,
}) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [rowError, setRowError] = useState("");

  const sortedRows = useMemo(
    () => getSortedRows(rows, sortKey, sortOrder),
    [rows, sortKey, sortOrder]
  );

  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedRows,
    totalItems,
  } = usePagination(sortedRows);

  function startEdit(row) {
    setEditingId(row.id);
    setDraft({
      id: row.id,
      nombre: row.nombre,
      cantidad: row.cantidad,
      precio: row.precio,
    });
    setRowError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
    setRowError("");
  }

  function updateDraft(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  async function saveEdit() {
    if (!draft?.nombre?.trim()) {
      setRowError("El nombre es obligatorio.");
      return;
    }

    try {
      await onUpdate({
        id: draft.id,
        nombre: draft.nombre.trim(),
        cantidad: Number(draft.cantidad ?? 0) || 0,
        precio: Number(draft.precio ?? 0) || 0,
      });
      cancelEdit();
    } catch (error) {
      setRowError(error.message);
    }
  }

  async function handleDelete(row) {
    const confirmed = window.confirm(
      `Confirmas eliminar el producto "${row.nombre}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await onDelete(row.id);
      if (editingId === row.id) {
        cancelEdit();
      }
    } catch (error) {
      setRowError(error.message);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className="flex justify-end border-b border-neutral-200 px-4 py-2">
        <TablePageSizeSelector pageSize={pageSize} onPageSizeChange={setPageSize} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-neutral-100">
            <tr>
              {EDITABLE_COLUMNS.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium text-neutral-900">
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-3 font-medium text-neutral-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={EDITABLE_COLUMNS.length + 1}
                  className="px-4 py-6 text-center text-neutral-500"
                >
                  No hay resultados para mostrar.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => {
                const isEditing = editingId === row.id;

                return (
                  <tr key={row.id} className="border-t border-neutral-200 even:bg-white odd:bg-neutral-50">
                    {EDITABLE_COLUMNS.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-neutral-800">
                        {isEditing && column.editable ? (
                          <input
                            type={column.type}
                            min={column.type === "number" ? "0" : undefined}
                            step={column.key === "precio" ? "0.01" : undefined}
                            value={draft[column.key]}
                            onChange={(event) => updateDraft(column.key, event.target.value)}
                            className="w-full min-w-30 rounded-md border border-neutral-300 px-2 py-1 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none"
                          />
                        ) : (
                          formatDisplayValue(row[column.key], column.key)
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <ActionIcon
                              icon="save"
                              label="Guardar"
                              onClick={saveEdit}
                              disabled={isProcessing}
                            />
                            <ActionIcon
                              icon="remove"
                              label="Cancelar"
                              onClick={cancelEdit}
                              disabled={isProcessing}
                            />
                          </>
                        ) : (
                          <>
                            <ActionIcon
                              icon="edit"
                              label="Editar"
                              onClick={() => startEdit(row)}
                              disabled={isProcessing}
                            />
                            <ActionIcon
                              icon="delete"
                              label="Eliminar"
                              onClick={() => handleDelete(row)}
                              disabled={isProcessing}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {rowError && (
        <p className="border-t border-neutral-200 px-4 py-3 text-sm text-neutral-800" role="alert">
          {rowError}
        </p>
      )}

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
      />
    </div>
  );
}

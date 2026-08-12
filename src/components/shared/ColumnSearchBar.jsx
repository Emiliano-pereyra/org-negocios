"use client";

import { ConfirmButton } from "@/components/shared/Button";

export default function ColumnSearchBar({ columns, filters, onChange, onSearch }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  function handleInputChange(key, value) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-xl font-bold">
        Filtrar búsqueda
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => (
          <div key={column.key}>
            <label htmlFor={`search-${column.key}`} className="mb-1 block text-xs font-medium text-neutral-700">
              {column.label}
            </label>
            <input
              id={`search-${column.key}`}
              type="text"
              value={filters[column.key] ?? ""}
              onChange={(event) => handleInputChange(column.key, event.target.value)}
              placeholder={`Buscar ${column.label.toLowerCase()}`}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none"
            />
          </div>
        ))}
      </div>
      <ConfirmButton type="submit" className="mt-4">
        Buscar
      </ConfirmButton>
    </form>
  );
}

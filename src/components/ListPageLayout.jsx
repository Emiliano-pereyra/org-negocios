"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import DataTable from "@/components/DataTable";
import ColumnSearchBar from "@/components/shared/ColumnSearchBar";
import { useUser } from "@/context/UserContext";
import { useProtectedList } from "@/hooks/useProtectedList";
import { createEmptyFilters, filterByColumns } from "@/lib/search/filterByColumns";

function ListContent({ title, columns, apiEndpoint, sortKey, sortOrder = "none" }) {
  const { user } = useUser();
  const searchKeys = columns.map((column) => column.key);
  const [searchInputs, setSearchInputs] = useState(createEmptyFilters(searchKeys));
  const [activeFilters, setActiveFilters] = useState(createEmptyFilters(searchKeys));
  const { data, loading, error } = useProtectedList(user?.idusuario, apiEndpoint);

  const filteredRows = useMemo(
    () => filterByColumns(data, activeFilters, searchKeys),
    [data, activeFilters, searchKeys]
  );

  const showLoading = loading && data.length === 0;
  const showError = Boolean(error) && data.length === 0;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
        <Link
          href="/home"
          className="text-sm text-neutral-600 transition hover:text-neutral-900"
        >
          Volver al inicio
        </Link>
      </div>

      <div className="mb-6">
        <ColumnSearchBar
          columns={columns}
          filters={searchInputs}
          onChange={setSearchInputs}
          onSearch={() => setActiveFilters({ ...searchInputs })}
        />
      </div>

      {showLoading && (
        <p className="mb-4 text-sm text-neutral-600">Cargando datos...</p>
      )}

      {showError && (
        <p className="mb-4 text-sm text-neutral-800" role="alert">
          {error}
        </p>
      )}

      {!showLoading && (
        <DataTable
          columns={columns}
          rows={filteredRows}
          sortKey={sortKey}
          sortOrder={sortOrder}
        />
      )}
    </div>
  );
}

export default function ListPageLayout({
  title,
  columns,
  apiEndpoint,
  sortKey,
  sortOrder = "none",
}) {
  return (
    <AuthGuard>
      <ListContent
        title={title}
        columns={columns}
        apiEndpoint={apiEndpoint}
        sortKey={sortKey}
        sortOrder={sortOrder}
      />
    </AuthGuard>
  );
}

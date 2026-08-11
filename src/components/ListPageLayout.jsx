"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import DataTable from "@/components/DataTable";
import SearchBar from "@/components/SearchBar";
import { apiGet } from "@/lib/api/client";

export default function ListPageLayout({
  title,
  columns,
  apiEndpoint,
  sortKey,
  sortOrder = "none",
  searchPlaceholder,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        const response = await apiGet(apiEndpoint);
        if (isMounted) {
          setData(response.data ?? []);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message);
          setData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [apiEndpoint]);

  const filteredRows = useMemo(() => {
    if (!activeSearch.trim()) {
      return data;
    }

    const term = activeSearch.toLowerCase();

    return data.filter((row) =>
      columns.some((column) =>
        String(row[column.key]).toLowerCase().includes(term)
      )
    );
  }, [activeSearch, columns, data]);

  return (
    <AuthGuard>
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
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSearch={() => setActiveSearch(searchInput)}
            placeholder={searchPlaceholder}
          />
        </div>

        {loading && (
          <p className="mb-4 text-sm text-neutral-600">Cargando datos...</p>
        )}

        {error && (
          <p className="mb-4 text-sm text-neutral-800" role="alert">
            {error}
          </p>
        )}

        <DataTable
          columns={columns}
          rows={filteredRows}
          sortKey={sortKey}
          sortOrder={sortOrder}
        />
      </div>
    </AuthGuard>
  );
}

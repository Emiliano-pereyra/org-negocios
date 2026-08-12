"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { ConfirmButton } from "@/components/shared/Button";
import AddItemsModal from "@/components/shared/AddItemsModal";
import ColumnSearchBar from "@/components/shared/ColumnSearchBar";
import StockTable from "@/components/stock/StockTable";
import { useUser } from "@/context/UserContext";
import { STOCK_CACHE_NAMESPACE, useStockData } from "@/hooks/useStockData";
import { getClientCache } from "@/lib/cache/clientCache";
import {
  createEmptyFilters,
  filterByColumns,
} from "@/lib/search/filterByColumns";

const SEARCH_COLUMNS = [
  { key: "nombre", label: "Producto" },
  { key: "cantidad", label: "Cantidad" },
  { key: "precio", label: "Precio" },
];

const SEARCH_KEYS = SEARCH_COLUMNS.map((column) => column.key);

const STOCK_ADD_FIELDS = [
  {
    key: "nombre",
    label: "Nombre del producto",
    type: "text",
    required: true,
  },
  {
    key: "cantidad",
    label: "Cantidad",
    type: "number",
    required: false,
  },
  {
    key: "precio",
    label: "Precio",
    type: "number",
    required: false,
    step: "0.01",
  },
];

function StockContent() {
  const { user } = useUser();
  const userId = user?.idusuario;
  const {
    loadStock,
    createProducts,
    updateProduct,
    deleteProduct,
    syncLocalCache,
  } = useStockData(userId);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInputs, setSearchInputs] = useState(
    createEmptyFilters(SEARCH_KEYS),
  );
  const [activeFilters, setActiveFilters] = useState(
    createEmptyFilters(SEARCH_KEYS),
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    let isActive = true;

    async function fetchInitialData() {
      setError("");

      const cached = getClientCache(STOCK_CACHE_NAMESPACE, userId);
      if (cached) {
        setData(cached.data);
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        const result = await loadStock({ force: false });
        if (isActive) {
          setData(result.data);
        }
      } catch (fetchError) {
        if (isActive && !cached) {
          setError(fetchError.message);
          setData([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchInitialData();

    return () => {
      isActive = false;
    };
  }, [userId, loadStock]);

  const filteredRows = useMemo(
    () => filterByColumns(data, activeFilters, SEARCH_KEYS),
    [data, activeFilters],
  );

  const showLoading = loading && data.length === 0;
  const showError = Boolean(error) && data.length === 0;

  async function handleCreateProducts(products) {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await createProducts(products);
      const nextData = response.cache ?? [...data, ...(response.data ?? [])];
      setData(nextData);
      syncLocalCache(nextData);
    } catch (submitError) {
      setError(submitError.message);
      throw submitError;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateProduct(product) {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await updateProduct(product);
      const nextData =
        response.cache ??
        data.map((item) =>
          item.id === response.data.id ? response.data : item,
        );
      setData(nextData);
      syncLocalCache(nextData);
    } catch (updateError) {
      setError(updateError.message);
      throw updateError;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteProduct(id) {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await deleteProduct(id);
      const nextData = response.cache ?? data.filter((item) => item.id !== id);
      setData(nextData);
      syncLocalCache(nextData);
    } catch (deleteError) {
      setError(deleteError.message);
      throw deleteError;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Listado stock
        </h1>
        <div className="flex items-center gap-4">
          <ConfirmButton type="button" onClick={() => setIsModalOpen(true)}>
            Agregar productos
          </ConfirmButton>
          <Link
            href="/home"
            className="text-sm text-neutral-600 transition hover:text-neutral-900"
          >
            Volver al inicio
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <ColumnSearchBar
          columns={SEARCH_COLUMNS}
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
        <StockTable
          rows={filteredRows}
          sortKey="precio"
          sortOrder="desc"
          onUpdate={handleUpdateProduct}
          onDelete={handleDeleteProduct}
          isProcessing={isSubmitting}
        />
      )}

      <AddItemsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar productos"
        fields={STOCK_ADD_FIELDS}
        maxRows={10}
        submitLabel="Añadir productos"
        onSubmit={handleCreateProducts}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default function StockPage() {
  return (
    <AuthGuard>
      <StockContent />
    </AuthGuard>
  );
}

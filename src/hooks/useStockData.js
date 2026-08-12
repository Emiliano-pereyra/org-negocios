"use client";

import { useCallback, useRef } from "react";
import {
  getClientCache,
  invalidateClientCache,
  setClientCache,
} from "@/lib/cache/clientCache";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api/client";

const CACHE_NAMESPACE = "stock";

export function useStockData(userId) {
  const inflightRef = useRef(null);

  const loadStock = useCallback(
    async ({ force = false } = {}) => {
      if (!userId) {
        throw new Error("Sesion no valida. Debes iniciar sesion nuevamente.");
      }

      if (!force) {
        const cached = getClientCache(CACHE_NAMESPACE, userId);
        if (cached) {
          return { data: cached.data, fromCache: true };
        }
      }

      if (inflightRef.current) {
        return inflightRef.current;
      }

      inflightRef.current = (async () => {
        try {
          const response = await apiGet("stock");
          const data = response.data ?? [];
          setClientCache(CACHE_NAMESPACE, userId, data);
          return { data, fromCache: false };
        } finally {
          inflightRef.current = null;
        }
      })();

      return inflightRef.current;
    },
    [userId]
  );

  const createProducts = useCallback(
    async (products) => {
      const response = await apiPost("stock", { products });

      if (userId) {
        if (response.cache) {
          setClientCache(CACHE_NAMESPACE, userId, response.cache);
        } else {
          invalidateClientCache(CACHE_NAMESPACE, userId);
        }
      }

      return response;
    },
    [userId]
  );

  const updateProduct = useCallback(
    async (product) => {
      const response = await apiPut("stock", { product });

      if (userId) {
        if (response.cache) {
          setClientCache(CACHE_NAMESPACE, userId, response.cache);
        } else {
          invalidateClientCache(CACHE_NAMESPACE, userId);
        }
      }

      return response;
    },
    [userId]
  );

  const deleteProduct = useCallback(
    async (id) => {
      const response = await apiDelete("stock", { id });

      if (userId) {
        if (response.cache) {
          setClientCache(CACHE_NAMESPACE, userId, response.cache);
        } else {
          invalidateClientCache(CACHE_NAMESPACE, userId);
        }
      }

      return response;
    },
    [userId]
  );

  const syncLocalCache = useCallback(
    (data) => {
      if (userId) {
        setClientCache(CACHE_NAMESPACE, userId, data);
      }
    },
    [userId]
  );

  return {
    loadStock,
    createProducts,
    updateProduct,
    deleteProduct,
    syncLocalCache,
  };
}

export { CACHE_NAMESPACE as STOCK_CACHE_NAMESPACE };

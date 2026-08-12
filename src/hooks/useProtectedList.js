"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getClientCache, setClientCache } from "@/lib/cache/clientCache";
import { apiGet } from "@/lib/api/client";

export function useProtectedList(userId, apiEndpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const inflightRef = useRef(null);

  const loadData = useCallback(
    async ({ force = false } = {}) => {
      if (!userId) {
        throw new Error("Sesion no valida. Debes iniciar sesion nuevamente.");
      }

      if (!force) {
        const cached = getClientCache(apiEndpoint, userId);
        if (cached) {
          return { data: cached.data, fromCache: true };
        }
      }

      if (inflightRef.current) {
        return inflightRef.current;
      }

      inflightRef.current = (async () => {
        try {
          const response = await apiGet(apiEndpoint);
          const nextData = response.data ?? [];
          setClientCache(apiEndpoint, userId, nextData);
          return { data: nextData, fromCache: false };
        } finally {
          inflightRef.current = null;
        }
      })();

      return inflightRef.current;
    },
    [userId, apiEndpoint]
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    let isActive = true;

    async function fetchInitialData() {
      setError("");

      const cached = getClientCache(apiEndpoint, userId);
      if (cached) {
        setData(cached.data);
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        const result = await loadData({ force: false });
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
  }, [userId, apiEndpoint, loadData]);

  return { data, loading, error };
}

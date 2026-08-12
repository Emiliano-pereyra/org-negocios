const store = new Map();

// Cache en memoria del cliente por recurso y usuario
export function getClientCache(namespace, userId) {
  const key = `${namespace}:${userId}`;
  return store.get(key) ?? null;
}

export function setClientCache(namespace, userId, data) {
  const key = `${namespace}:${userId}`;
  store.set(key, {
    data,
    updatedAt: Date.now(),
  });
}

export function invalidateClientCache(namespace, userId) {
  const key = `${namespace}:${userId}`;
  store.delete(key);
}

export function updateClientCache(namespace, userId, updater) {
  const current = getClientCache(namespace, userId);

  if (!current) {
    return null;
  }

  const nextData = updater(current.data);
  setClientCache(namespace, userId, nextData);
  return nextData;
}

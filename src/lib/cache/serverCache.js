const store = new Map();

// Cache en memoria del servidor por recurso y usuario
export function getServerCache(namespace, userId) {
  const key = `${namespace}:${userId}`;
  return store.get(key) ?? null;
}

export function setServerCache(namespace, userId, data) {
  const key = `${namespace}:${userId}`;
  store.set(key, {
    data,
    updatedAt: Date.now(),
  });
}

export function invalidateServerCache(namespace, userId) {
  const key = `${namespace}:${userId}`;
  store.delete(key);
}

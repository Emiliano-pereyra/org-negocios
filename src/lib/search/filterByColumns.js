// Filtro reutilizable: inputs vacios no aplican filtro (cuentan como "todos")
export function filterByColumns(rows, filters, columnKeys) {
  return rows.filter((row) =>
    columnKeys.every((key) => {
      const term = filters[key]?.trim();

      if (!term) {
        return true;
      }

      return String(row[key] ?? "")
        .toLowerCase()
        .includes(term.toLowerCase());
    })
  );
}

export function createEmptyFilters(columnKeys) {
  return columnKeys.reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {});
}

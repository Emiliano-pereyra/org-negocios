import ListPageLayout from "@/components/ListPageLayout";

const columns = [
  { key: "id", label: "ID" },
  { key: "nombre", label: "Producto" },
  { key: "cantidad", label: "Cantidad" },
  { key: "precio", label: "Precio" },
];

export default function StockPage() {
  return (
    <ListPageLayout
      title="Listado stock"
      columns={columns}
      apiEndpoint="stock"
      sortKey="precio"
      sortOrder="desc"
      searchPlaceholder="Buscar por producto, cantidad o precio..."
    />
  );
}

import ListPageLayout from "@/components/ListPageLayout";
import stockData from "@/data/stock.json";

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
      data={stockData}
      sortKey="precio"
      sortOrder="desc"
      searchPlaceholder="Buscar por producto, cantidad o precio..."
    />
  );
}

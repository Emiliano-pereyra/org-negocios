import ListPageLayout from "@/components/ListPageLayout";
import pagosData from "@/data/pagos.json";

const columns = [
  { key: "id", label: "ID" },
  { key: "cliente", label: "Cliente" },
  { key: "monto", label: "Monto" },
  { key: "fecha", label: "Fecha" },
];

export default function PagosPage() {
  return (
    <ListPageLayout
      title="Registro de pagos"
      columns={columns}
      data={pagosData}
      sortKey="fecha"
      sortOrder="desc"
      searchPlaceholder="Buscar por cliente, monto o fecha..."
    />
  );
}

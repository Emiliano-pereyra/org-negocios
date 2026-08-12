import ListPageLayout from "@/components/ListPageLayout";

const columns = [
  { key: "cliente", label: "Cliente" },
  { key: "monto", label: "Monto" },
  { key: "fecha", label: "Fecha" },
];

export default function PagosPage() {
  return (
    <ListPageLayout
      title="Registro de pagos"
      columns={columns}
      apiEndpoint="pagos"
      sortKey="fecha"
      sortOrder="desc"
    />
  );
}

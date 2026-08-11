import ListPageLayout from "@/components/ListPageLayout";

const columns = [
  { key: "id", label: "ID" },
  { key: "nombre", label: "Nombre" },
  { key: "telefono", label: "Telefono" },
  { key: "email", label: "Email" },
];

export default function ClientesPage() {
  return (
    <ListPageLayout
      title="Listado de clientes"
      columns={columns}
      apiEndpoint="clientes"
      sortKey="nombre"
      sortOrder="asc"
      searchPlaceholder="Buscar por nombre, telefono o email..."
    />
  );
}

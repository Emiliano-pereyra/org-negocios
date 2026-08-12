import Link from "next/link";

// Configuracion de cada variante de card del menu principal
const CARD_VARIANTS = {
  stock: {
    title: "Stock",
    description: "Consulta productos, cantidades y precios del inventario.",
    href: "/stock",
  },
  pagos: {
    title: "Registro de pagos",
    description: "Revisa pagos registrados por cliente, monto y fecha.",
    href: "/pagos",
  },
  clientes: {
    title: "Listado de clientes",
    description: "Administra y busca clientes por nombre, telefono o email.",
    href: "/clientes",
  },
};

export default function CardMenu({ variant }) {
  const card = CARD_VARIANTS[variant];

  if (!card) {
    return null;
  }

  return (
    <Link
      href={card.href}
      className="group flex flex-col rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-neutral-300 hover:shadow-md"
    >
      <h2 className="mb-2 text-xl font-semibold text-neutral-900 group-hover:text-neutral-700">
        {card.title}
      </h2>
      <p className="text-sm leading-relaxed text-neutral-600">{card.description}</p>
    </Link>
  );
}

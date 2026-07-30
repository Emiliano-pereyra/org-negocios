import Link from "next/link";

export default function SiteLogo({ href = "/home", className = "" }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-300 bg-neutral-100 text-xs font-bold text-neutral-900">
        ON
      </span>
      <span className="text-lg font-semibold text-neutral-900">Org Negocios</span>
    </Link>
  );
}

"use client";

const VARIANTS = {
  confirm:
    "cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/25 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "cursor-pointer rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-60",
  ghost:
    "cursor-pointer rounded-md px-2 py-1 text-sm text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-60",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "",
  full: "w-full py-2.5",
};

export default function Button({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const sizeClass = size === "md" ? "" : SIZES[size];

  return (
    <button
      type="button"
      className={`${VARIANTS[variant]} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export function ConfirmButton({ className = "", children, ...props }) {
  return (
    <Button variant="confirm" className={className} {...props}>
      {children}
    </Button>
  );
}

"use client";

import { ConfirmButton } from "@/components/shared/Button";

export default function SearchBar({ value, onChange, onSearch, placeholder }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
      />
      <ConfirmButton type="submit">Buscar</ConfirmButton>
    </form>
  );
}

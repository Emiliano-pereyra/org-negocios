"use client";

import { useState } from "react";
import Modal from "@/components/shared/Modal";
import ActionIcon from "@/components/shared/ActionIcon";
import Button, { ConfirmButton } from "@/components/shared/Button";

function createEmptyRow(fields) {
  return fields.reduce((acc, field) => {
    acc[field.key] = "";
    return acc;
  }, {});
}

export default function AddItemsModal({
  isOpen,
  onClose,
  title,
  fields,
  maxRows = 10,
  submitLabel = "Guardar",
  description,
  onSubmit,
  isSubmitting = false,
}) {
  const [rows, setRows] = useState([createEmptyRow(fields)]);
  const [error, setError] = useState("");

  function resetForm() {
    setRows([createEmptyRow(fields)]);
    setError("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function updateRow(index, field, value) {
    setRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
  }

  function addRow() {
    if (rows.length >= maxRows) {
      return;
    }

    setRows((prev) => [...prev, createEmptyRow(fields)]);
  }

  function removeRow(index) {
    if (rows.length === 1) {
      setRows([createEmptyRow(fields)]);
      return;
    }

    setRows((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const items = rows.map((row) => {
      const item = {};

      fields.forEach((field) => {
        const rawValue = row[field.key];

        if (field.type === "number") {
          item[field.key] = rawValue === "" ? 0 : Number(rawValue);
        } else {
          item[field.key] =
            typeof rawValue === "string" ? rawValue.trim() : rawValue;
        }
      });

      return item;
    });

    for (const item of items) {
      for (const field of fields) {
        if (field.required && !item[field.key]) {
          setError(
            `El campo ${field.label.toLowerCase()} es obligatorio en todos los registros.`,
          );
          return;
        }
      }
    }

    try {
      await onSubmit(items);
      resetForm();
      onClose();
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  const gridClass =
    fields.length >= 3
      ? "sm:grid-cols-[1fr_repeat(2,minmax(100px,120px))_auto]"
      : "sm:grid-cols-[1fr_auto_auto]";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <form onSubmit={handleSubmit}>
        {description && (
          <p className="mb-4 text-sm text-neutral-600">{description}</p>
        )}

        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-600">
            Se permiten hasta {maxRows} ingresos a la vez
          </p>

          <ActionIcon
            icon="add"
            label="Agregar"
            onClick={addRow}
            disabled={rows.length >= maxRows}
          />
        </div>

        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={`new-row-${index}`} className={`grid gap-3 ${gridClass}`}>
              {fields.map((field) => (
                <div key={field.key} className="flex flex-col">
                  <label
                    htmlFor={`${field.key}-${index}`}
                    className="mb-1 text-sm font-medium text-neutral-700"
                  >
                    {field.label}

                    {field.required && (
                      <span className="ml-1 text-red-600" aria-hidden="true">
                        *
                      </span>
                    )}
                  </label>

                  <input
                    id={`${field.key}-${index}`}
                    type={field.type ?? "text"}
                    min={field.type === "number" ? "0" : undefined}
                    step={field.step}
                    value={row[field.key]}
                    onChange={(event) =>
                      updateRow(index, field.key, event.target.value)
                    }
                    placeholder={field.label}
                    className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-200"
                  />
                </div>
              ))}

              <div className="flex items-end">
                <ActionIcon
                  icon="remove"
                  label="Quitar"
                  onClick={() => removeRow(index)}
                />
              </div>
            </div>
          ))}
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-center gap-3 border-t border-neutral-200 pt-5">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <ConfirmButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : submitLabel}
          </ConfirmButton>
        </div>
      </form>
    </Modal>
  );
}

"use client";

import { useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { FiCheck, FiChevronDown, FiX } from "react-icons/fi";
import type { AdminCategoryListItem } from "@/lib/admin/fetch-categories";
import type { CategoryReference } from "@/lib/firebase/firestore/prompt-types";
import { useDisclosure } from "@/lib/hooks/use-disclosure";
import { useCategorySearch } from "./use-category-search";

type CategorySelectFieldProps = {
  label: string;
  user: User;
  value: CategoryReference[];
  onChange: (value: CategoryReference[]) => void;
};

function toCategoryReference(item: AdminCategoryListItem): CategoryReference {
  return {
    id: item.id,
    name: item.name,
  };
}

export function CategorySelectField({
  label,
  user,
  value,
  onChange,
}: CategorySelectFieldProps) {
  const [search, setSearch] = useState("");
  const { open, toggle, close, triggerRef, panelRef } = useDisclosure();
  const { results, loading, error } = useCategorySearch(user, search, open);

  const displayItems = useMemo(() => {
    const missingSelected = value.filter(
      (category) => !results.some((item) => item.id === category.id),
    );

    if (missingSelected.length === 0) {
      return results;
    }

    return [
      ...missingSelected.map((category) => ({
        id: category.id,
        name: category.name,
        createdAt: null,
      })),
      ...results,
    ];
  }, [results, value]);

  const toggleCategory = (item: AdminCategoryListItem) => {
    const reference = toCategoryReference(item);
    const exists = value.some((category) => category.id === reference.id);

    if (exists) {
      onChange(value.filter((category) => category.id !== reference.id));
      return;
    }

    onChange([...value, reference]);
  };

  const removeCategory = (id: string) => {
    onChange(value.filter((category) => category.id !== id));
  };

  return (
    <div className="relative">
      <span className="mb-2 block text-sm font-medium text-white">{label}</span>

      <div
        ref={triggerRef}
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        }}
        aria-expanded={open}
        className="flex min-h-[52px] w-full cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-left transition-colors hover:border-white/20"
      >
        {value.length > 0 ? (
          <div className="flex flex-1 flex-wrap gap-2">
            {value.map((category) => (
              <span
                key={category.id}
                className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white"
              >
                {category.name}
                <button
                  type="button"
                  aria-label={`Remove ${category.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    removeCategory(category.id);
                  }}
                  className="rounded-full p-0.5 text-muted transition-colors hover:bg-white/10 hover:text-white"
                >
                  <FiX className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-sm text-muted">Select categories</span>
        )}

        <FiChevronDown
          className={`ml-auto h-4 w-4 shrink-0 text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </div>

      {open ? (
        <div
          ref={panelRef}
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-xl"
        >
          <div className="border-b border-white/10 p-3">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by category name or ID"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-muted focus:border-white/20"
            />
          </div>

          <div className="max-h-72 overflow-y-auto p-2">
            {loading ? (
              <p className="px-3 py-2 text-sm text-muted">Searching categories...</p>
            ) : error ? (
              <p className="px-3 py-2 text-sm text-red-400">{error}</p>
            ) : displayItems.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted">No categories found.</p>
            ) : (
              displayItems.map((item) => {
                const selected = value.some((category) => category.id === item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleCategory(item)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      selected ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        selected
                          ? "border-white bg-white text-black"
                          : "border-white/20 bg-transparent"
                      }`}
                    >
                      {selected ? <FiCheck className="h-3 w-3" aria-hidden="true" /> : null}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{item.name}</p>
                      <p className="truncate text-xs text-muted">{item.id}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="border-t border-white/10 p-3">
            <button
              type="button"
              onClick={close}
              className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

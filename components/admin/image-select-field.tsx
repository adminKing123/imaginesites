"use client";

import { useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { FiChevronDown } from "react-icons/fi";
import type { AdminUploadListItem } from "@/lib/admin/fetch-uploads";
import type { PromptImageReference } from "@/lib/firebase/firestore/prompt-types";
import { useDisclosure } from "@/lib/hooks/use-disclosure";
import { useImageSearch } from "./use-image-search";

type ImageSelectFieldProps = {
  label: string;
  user: User;
  value: PromptImageReference | null;
  onChange: (value: PromptImageReference | null) => void;
};

function toImageReference(item: AdminUploadListItem): PromptImageReference {
  return {
    id: item.id,
    image_name: item.image_name,
    image_cdn_url: item.image_cdn_url,
  };
}

export function ImageSelectField({ label, user, value, onChange }: ImageSelectFieldProps) {
  const [search, setSearch] = useState("");
  const { open, toggle, close, setTriggerRef, panelRef } = useDisclosure();
  const { results, loading, error } = useImageSearch(user, search, open);

  const displayItems = useMemo(() => {
    if (value && !results.some((item) => item.id === value.id)) {
      return [
        {
          id: value.id,
          image_name: value.image_name,
          image_cdn_url: value.image_cdn_url,
          createdAt: null,
        },
        ...results,
      ];
    }

    return results;
  }, [results, value]);

  return (
    <div className="relative">
      <span className="mb-2 block text-sm font-medium text-white">{label}</span>

      <button
        ref={setTriggerRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-left transition-colors hover:border-white/20"
      >
        {value ? (
          <>
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value.image_cdn_url}
                alt={value.image_name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{value.image_name}</p>
              <p className="truncate text-xs text-muted">{value.id}</p>
            </div>
          </>
        ) : (
          <span className="text-sm text-muted">Select an uploaded image</span>
        )}

        <FiChevronDown
          className={`ml-auto h-4 w-4 shrink-0 text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

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
              placeholder="Search by image name or ID"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-muted focus:border-white/20"
            />
          </div>

          <div className="max-h-72 overflow-y-auto p-2">
            {loading ? (
              <p className="px-3 py-2 text-sm text-muted">Searching images...</p>
            ) : error ? (
              <p className="px-3 py-2 text-sm text-red-400">{error}</p>
            ) : displayItems.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted">No images found.</p>
            ) : (
              displayItems.map((item) => {
                const selected = value?.id === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(toImageReference(item));
                      close();
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                      selected ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image_cdn_url}
                        alt={item.image_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {item.image_name}
                      </p>
                      <p className="truncate text-xs text-muted">{item.id}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

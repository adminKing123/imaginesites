"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiSliders } from "react-icons/fi";
import type { FilterOption } from "./config";
import { getOptionLabel } from "./utils";

type MobileFilterMenuProps = {
  typeValue: string;
  pricingValue: string;
  onTypeChange: (value: string) => void;
  onPricingChange: (value: string) => void;
  typeOptions: FilterOption[];
  pricingOptions: FilterOption[];
};

type FilterPanel = "main" | "type" | "pricing";

export function MobileFilterMenu({
  typeValue,
  pricingValue,
  onTypeChange,
  onPricingChange,
  typeOptions,
  pricingOptions,
}: MobileFilterMenuProps) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<FilterPanel>("main");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setPanel("main");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    setPanel("main");
  };

  return (
    <div ref={containerRef} className="relative shrink-0 lg:hidden">
      <button
        type="button"
        aria-label="Open filters"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] text-white transition-colors hover:bg-white/10"
      >
        <FiSliders className="h-5 w-5" aria-hidden="true" />
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-xl">
          {panel === "main" ? (
            <div className="py-1">
              <button
                type="button"
                onClick={() => setPanel("type")}
                className="flex w-full items-center justify-between px-4 py-3.5 text-sm text-white transition-colors hover:bg-white/5"
              >
                <span>Type</span>
                <span className="inline-flex items-center gap-1 text-muted">
                  {getOptionLabel(typeOptions, typeValue)}
                  <FiChevronRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>

              <div className="mx-4 border-t border-white/10" />

              <button
                type="button"
                onClick={() => setPanel("pricing")}
                className="flex w-full items-center justify-between px-4 py-3.5 text-sm text-white transition-colors hover:bg-white/5"
              >
                <span>Pricing</span>
                <span className="inline-flex items-center gap-1 text-muted">
                  {getOptionLabel(pricingOptions, pricingValue)}
                  <FiChevronRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => setPanel("main")}
                className="flex w-full items-center gap-2 border-b border-white/10 px-4 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
              >
                <FiChevronLeft className="h-4 w-4" aria-hidden="true" />
                {panel === "type" ? "Type" : "Pricing"}
              </button>

              {(panel === "type" ? typeOptions : pricingOptions).map((option) => {
                const selectedValue = panel === "type" ? typeValue : pricingValue;
                const onSelect = panel === "type" ? onTypeChange : onPricingChange;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onSelect(option.value);
                      closeMenu();
                    }}
                    className={`flex w-full px-4 py-3 text-left text-sm transition-colors hover:bg-white/5 ${
                      option.value === selectedValue ? "text-white" : "text-muted"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

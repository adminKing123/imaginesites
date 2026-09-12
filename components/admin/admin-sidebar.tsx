"use client";

import { ADMIN_NAV_ITEMS, type AdminSectionId } from "./config";

type AdminSidebarProps = {
  activeSection: AdminSectionId;
  onSectionChange: (section: AdminSectionId) => void;
};

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  return (
    <aside className="w-full shrink-0 border-b border-white/10 bg-black/20 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="px-4 py-5 lg:px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Admin panel
        </p>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:flex-col lg:px-3 lg:pb-6">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = item.id === activeSection;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={`shrink-0 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-muted hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

"use client";

import { useId } from "react";
import type { User } from "firebase/auth";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { useDisclosure } from "@/lib/hooks/use-disclosure";
import { signOutUser } from "@/lib/firebase/auth";
import { UserAvatar } from "./user-avatar";

type UserMenuProps = {
  user: User;
};

export function UserMenu({ user }: UserMenuProps) {
  const panelId = useId();
  const { open, toggle, close, triggerRef, panelRef } = useDisclosure();

  const displayName = user.displayName?.trim() || "Account";
  const email = user.email ?? "";

  const handleLogout = async () => {
    await signOutUser();
    close();
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        id={`${panelId}-trigger`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        aria-label={`${displayName} account menu`}
        onClick={toggle}
        className={`inline-flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-2 transition-colors ${
          open
            ? "border-white/20 bg-white/[0.06]"
            : "border-transparent hover:bg-white/[0.06]"
        }`}
      >
        <UserAvatar user={user} />
        <FiChevronDown
          className={`h-4 w-4 text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          aria-labelledby={`${panelId}-trigger`}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-60 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] shadow-xl"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <p className="truncate text-sm font-medium text-white">{displayName}</p>
            {email ? (
              <p className="mt-0.5 truncate text-xs text-muted">{email}</p>
            ) : null}
          </div>

          <div className="p-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/5"
            >
              <FiLogOut className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              Log out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

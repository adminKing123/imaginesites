"use client";

import { useEffect } from "react";
import Link from "next/link";
import { YOUTUBE_HREF } from "./config";
import { CloseIcon, YouTubeIcon } from "./icons";
import { NavbarLinks } from "./navbar-links";
import { signOutUser } from "@/lib/firebase/auth";
import { useAuthUser } from "@/lib/auth/use-auth-user";
import { SignUpButton } from "./sign-up-button";
import { UserAvatar } from "./user-avatar";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { user, loading } = useAuthUser();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close menu overlay"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-surface-elevated px-8 pb-8 pt-6 shadow-2xl">
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent text-white transition-opacity hover:opacity-90"
          >
            <CloseIcon />
          </button>
        </div>

        <NavbarLinks variant="mobile" onNavigate={onClose} className="mt-10 flex-1" />

        <div className="mt-auto flex flex-col gap-8 pt-10">
          <Link
            href={YOUTUBE_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="inline-flex w-fit text-white transition-opacity hover:opacity-70"
          >
            <YouTubeIcon />
          </Link>

          {!loading && user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <UserAvatar user={user} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {user.displayName || "Account"}
                  </p>
                  <p className="truncate text-xs text-muted">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await signOutUser();
                  onClose();
                }}
                className="inline-flex w-full items-center justify-center rounded-full border border-white/10 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/5"
              >
                Log out
              </button>
            </div>
          ) : (
            !loading && (
              <SignUpButton onNavigate={onClose} className="w-full py-3.5 text-base" />
            )
          )}
        </div>
      </aside>
    </div>
  );
}

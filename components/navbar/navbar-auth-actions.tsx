"use client";

import { useAuthUser } from "@/lib/auth/use-auth-user";
import { SearchButton } from "./search-button";
import { SignUpButton } from "./sign-up-button";
import { UserMenu } from "./user-menu";

type NavbarAuthActionsProps = {
  className?: string;
  variant?: "desktop" | "mobile";
};

export function NavbarAuthActions({
  className = "",
  variant = "desktop",
}: NavbarAuthActionsProps) {
  const { user, loading, isAdmin } = useAuthUser();
  const showProfile = variant === "desktop";

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <SearchButton />

      {showProfile && !loading
        ? user
          ? <UserMenu user={user} isAdmin={isAdmin} />
          : <SignUpButton />
        : null}
    </div>
  );
}

"use client";

import { useAuthUser } from "@/lib/auth/use-auth-user";
import { SearchButton } from "./search-button";
import { SignUpButton } from "./sign-up-button";
import { UserMenu } from "./user-menu";

type NavbarAuthActionsProps = {
  className?: string;
};

export function NavbarAuthActions({ className = "" }: NavbarAuthActionsProps) {
  const { user, loading } = useAuthUser();

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <SearchButton />

      {!loading && (user ? <UserMenu user={user} /> : <SignUpButton />)}
    </div>
  );
}

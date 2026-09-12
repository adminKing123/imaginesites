import type { User } from "firebase/auth";

export function getUserInitial(user: User) {
  const label = user.displayName?.trim() || user.email?.trim() || "?";
  return label.charAt(0).toUpperCase();
}

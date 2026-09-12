import Image from "next/image";
import type { User } from "firebase/auth";
import { getUserInitial } from "@/lib/auth/get-user-initial";

type UserAvatarProps = {
  user: User;
  size?: "sm" | "md";
};

const sizeClasses = {
  sm: "h-8 w-8 text-sm",
  md: "h-9 w-9 text-sm",
} as const;

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  const initial = getUserInitial(user);

  if (user.photoURL) {
    return (
      <Image
        src={user.photoURL}
        alt=""
        width={36}
        height={36}
        aria-hidden="true"
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`${sizeClasses[size]} inline-flex items-center justify-center rounded-full bg-white/10 font-semibold text-white`}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

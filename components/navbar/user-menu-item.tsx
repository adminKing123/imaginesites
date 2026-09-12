import Link from "next/link";
import type { ReactNode } from "react";

type UserMenuItemProps = {
  href?: string;
  onClick?: () => void;
  icon: ReactNode;
  label: string;
};

export function UserMenuItem({ href, onClick, icon, label }: UserMenuItemProps) {
  const className =
    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/5";

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        <span className="shrink-0 text-muted">{icon}</span>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <span className="shrink-0 text-muted">{icon}</span>
      {label}
    </button>
  );
}

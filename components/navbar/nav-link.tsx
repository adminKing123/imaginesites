import Link from "next/link";
import type { NavLinkItem } from "./config";

type NavLinkProps = {
  item: NavLinkItem;
  onNavigate?: () => void;
  className?: string;
};

export function NavLink({ item, onNavigate, className = "" }: NavLinkProps) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`inline-flex items-center gap-2 text-[15px] font-medium text-muted transition-colors hover:text-white ${className}`}
    >
      {item.label}
      {item.badge ? (
        <span className="rounded border border-orange-400/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-300 shadow-[0_0_8px_rgba(251,146,60,0.35)]">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

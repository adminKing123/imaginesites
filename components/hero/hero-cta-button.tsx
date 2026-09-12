import Link from "next/link";

type HeroCtaButtonProps = {
  label: string;
  href: string;
};

export function HeroCtaButton({ label, href }: HeroCtaButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-200 via-slate-100 to-white px-8 py-3.5 text-base font-semibold text-black transition-opacity hover:opacity-90"
    >
      {label} <span aria-hidden="true">&nbsp;→</span>
    </Link>
  );
}

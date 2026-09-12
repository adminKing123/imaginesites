type HeroBadgeProps = {
  label: string;
};

export function HeroBadge({ label }: HeroBadgeProps) {
  return (
    <span className="inline-flex rounded-full border border-orange-400/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-200/90">
      {label}
    </span>
  );
}

type CategoryPillProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
};

export function CategoryPill({ label, active = false, onClick }: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-white/10 text-white"
          : "text-muted hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

import { SearchIcon } from "./icons";

type SearchButtonProps = {
  className?: string;
};

export function SearchButton({ className = "" }: SearchButtonProps) {
  return (
    <button
      type="button"
      aria-label="Search"
      className={`inline-flex items-center justify-center text-white transition-opacity hover:opacity-70 ${className}`}
    >
      <SearchIcon />
    </button>
  );
}

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export function PromptViewBackLink() {
  return (
    <Link
      href="/"
      className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] items-center gap-2.5 sm:left-4 sm:top-4"
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/75">
        <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}

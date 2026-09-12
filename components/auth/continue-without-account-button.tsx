import Link from "next/link";

type ContinueWithoutAccountButtonProps = {
  href: string;
};

export function ContinueWithoutAccountButton({
  href,
}: ContinueWithoutAccountButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex w-full items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
    >
      Continue without an account
    </Link>
  );
}

import Link from "next/link";
import { SIGN_UP_HREF } from "./config";

type SignUpButtonProps = {
  onNavigate?: () => void;
  className?: string;
};

export function SignUpButton({ onNavigate, className = "" }: SignUpButtonProps) {
  return (
    <Link
      href={SIGN_UP_HREF}
      onClick={onNavigate}
      className={`inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 ${className}`}
    >
      Sign up
    </Link>
  );
}

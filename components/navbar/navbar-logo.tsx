import Image from "next/image";
import Link from "next/link";
import { SITE_ICONS } from "@/lib/site-config";

export function NavbarLogo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" onClick={onNavigate} className="inline-flex shrink-0 items-center">
      <Image
        src={SITE_ICONS.logo}
        alt="imaginesites"
        width={120}
        height={24}
        priority
        className="h-5 w-auto lg:h-6"
      />
    </Link>
  );
}

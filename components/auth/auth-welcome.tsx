import Image from "next/image";
import { SITE_ICONS } from "@/lib/site-config";

export function AuthWelcome() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-2xl font-semibold text-white">Welcome to</span>
      <Image
        src={SITE_ICONS.logo}
        alt="imaginesites"
        width={160}
        height={32}
        priority
        className="h-7 w-auto"
      />
    </div>
  );
}

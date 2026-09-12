import type { MetadataRoute } from "next";
import { SITE_CONFIG, SITE_ICONS } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: SITE_CONFIG.shortName,
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: SITE_CONFIG.backgroundColor,
    theme_color: SITE_CONFIG.themeColor,
    icons: [
      {
        src: SITE_ICONS.android192,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: SITE_ICONS.android512,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

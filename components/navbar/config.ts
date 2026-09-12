export type NavLinkItem = {
  label: string;
  href: string;
  badge?: string;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
};

export const NAV_LINKS: NavLinkItem[] = [
  { label: "Contact", href: "/contact" },
  { label: "Pricing", href: "/pricing", mobileOnly: true },
];

export const SIGN_UP_HREF = "/signup";

export const YOUTUBE_HREF = "https://youtube.com";

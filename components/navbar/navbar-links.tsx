import { NAV_LINKS } from "./config";
import { NavLink } from "./nav-link";

type NavbarLinksProps = {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
  className?: string;
};

function getLinksForVariant(variant: "desktop" | "mobile") {
  return NAV_LINKS.filter((item) =>
    variant === "desktop" ? !item.mobileOnly : !item.desktopOnly,
  );
}

export function NavbarLinks({ variant, onNavigate, className = "" }: NavbarLinksProps) {
  const links = getLinksForVariant(variant);

  if (variant === "desktop") {
    return (
      <nav aria-label="Main navigation" className={className}>
        <ul className="flex items-center gap-8">
          {links.map((item) => (
            <li key={item.href}>
              <NavLink item={item} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Mobile navigation" className={className}>
      <ul className="flex flex-col gap-8">
        {links.map((item) => (
          <li key={item.href}>
            <NavLink
              item={item}
              onNavigate={onNavigate}
              className="text-lg text-white/90"
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

"use client";

import { useState } from "react";
import { MenuIcon } from "./icons";
import { MobileMenu } from "./mobile-menu";
import { NavbarLinks } from "./navbar-links";
import { NavbarLogo } from "./navbar-logo";
import { NavbarAuthActions } from "./navbar-auth-actions";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-surface">
        <div className="flex h-16 w-full items-center justify-between px-6 lg:h-[72px] lg:px-8">
          <div className="flex items-center gap-10">
            <NavbarLogo />
            <NavbarLinks variant="desktop" className="hidden lg:block" />
          </div>

          <NavbarAuthActions className="hidden lg:flex" />

          <div className="flex items-center gap-5 lg:hidden">
            <NavbarAuthActions className="gap-5" />
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center text-white transition-opacity hover:opacity-70"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
}

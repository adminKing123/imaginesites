import { HERO_CONTENT } from "./config";
import { HeroBadge } from "./hero-badge";
import { HeroCtaButton } from "./hero-cta-button";
import { HeroHeading } from "./hero-heading";

export function HeroSection() {
  return (
    <section className="flex w-full flex-col items-center overflow-x-clip px-6 pb-20 pt-16 text-center sm:pt-20 md:pt-24 lg:pt-28">
      <HeroBadge label={HERO_CONTENT.badge} />

      <div className="mt-8 flex flex-col items-center gap-6 sm:mt-10">
        <HeroHeading />

        <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {HERO_CONTENT.description}
        </p>

        <HeroCtaButton label={HERO_CONTENT.cta.label} href={HERO_CONTENT.cta.href} />
      </div>
    </section>
  );
}

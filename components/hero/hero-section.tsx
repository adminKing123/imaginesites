import { HERO_CONTENT } from "./config";
import { HeroHeading } from "./hero-heading";

export function HeroSection() {
  return (
    <section className="flex w-full flex-col items-center overflow-x-clip px-6 pb-20 pt-16 text-center sm:pt-20 md:pt-24 lg:pt-28">
      <div className="flex flex-col items-center gap-6">
        <HeroHeading />

        <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {HERO_CONTENT.description}
        </p>
      </div>
    </section>
  );
}

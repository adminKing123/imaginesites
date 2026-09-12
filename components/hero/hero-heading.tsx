import { HERO_CONTENT } from "./config";

export function HeroHeading() {
  const { before, highlight, middle, glow } = HERO_CONTENT.heading;

  return (
    <h1 className="max-w-4xl text-center text-[30px] font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-[42px] md:text-[54px] lg:text-[66px]">
      {before}{" "}
      <span className="italic">{highlight}</span> {middle}{" "}
      <span className="relative inline-block">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-[0.85em] -translate-y-1/2 bg-gradient-to-r from-orange-400/70 via-pink-400/60 to-violet-400/70 blur-2xl"
        />
        <span className="relative">{glow}</span>
      </span>
    </h1>
  );
}

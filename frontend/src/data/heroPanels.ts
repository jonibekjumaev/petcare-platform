
export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: [string, string];
  cta: string;
  ctaHref: string;
  inset: string;
  insetAlt: string;
  insetPosition: string;
  insetSide: "left" | "right";
  flipBackground: boolean;
}

export const HERO_BACKGROUND = "/media/hero-bg-soft.jpg";
export const HERO_BACKGROUND_ALT =
  "A cat and a dog lying together in the grass";

export const HERO_INTERVAL_MS = 6000;

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "cats",
    eyebrow: "Premium Pet Care platform",
    title: ["Enjoy your pet", "We take care of your Pet"],
    cta: "Shop Cat Picks",
    ctaHref: "/products?category=FOOD",
    inset: "/media/hero-cat.jpg",
    insetAlt:
      "A golden British Shorthair kitten reaching up with one paw raised",
    insetPosition: "center 32%",
    insetSide: "right",
    flipBackground: false,
  },
  {
    id: "dogs",
    eyebrow: "Premium Pet Care platform",
    title: ["Enjoy your pet", "We take care of your Pet"],
    cta: "Shop Dog Picks",
    ctaHref: "/products?category=TOY",
    inset: "/media/hero-dog.jpg",
    insetAlt: "A cream-coloured doodle holding a tennis ball in its mouth",
    insetPosition: "center 30%",
    insetSide: "left",
    flipBackground: true,
  },
];

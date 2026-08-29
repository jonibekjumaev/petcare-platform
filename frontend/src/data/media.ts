
export interface Media {
  src?: string;
  alt: string;
  credit?: string;
}

export const HERO_MEDIA: Media = {
  src: undefined,
  alt: "A relaxed dog at home",
  credit: undefined,
};

export const CATEGORY_MEDIA: Partial<Record<string, Media>> = {
  FOOD: { src: "/media/cat-food.jpg", alt: "Bags of complete dry dog food" },
  TOY: { src: "/media/cat-toy.jpg", alt: "A red rubber bone chew toy" },
  ACCESSORY: { src: "/media/cat-accessory.jpg", alt: "Two small dogs in knitted outfits" },
  SUPPLEMENT: { src: "/media/cat-supplement.jpg", alt: "A dog catching treats mid-air" },
  HYGIENE: { src: "/media/cat-hygiene.jpg", alt: "Two moulded plastic feeding bowls" },
};

export interface Story {
  quote: string;
  petName: string;
  petDetail: string;
  owner: string;
}

export const STORIES: Story[] = [
  {
    quote:
      "I asked whether the senior formula was right for a 9-year-old with a sensitive stomach, and got an answer about my dog rather than about dogs.",
    petName: "Bella",
    petDetail: "Labrador · 7 years",
    owner: "Sample content",
  },
  {
    quote:
      "It reminded me the joint chews were due before I noticed the tub was empty. That is the part I keep coming back for.",
    petName: "Milo",
    petDetail: "Beagle · 4 years",
    owner: "Sample content",
  },
  {
    quote:
      "Two cats with completely different diets. Keeping a profile for each one means I stop second-guessing which bag is which.",
    petName: "Sesame",
    petDetail: "Domestic shorthair · 3 years",
    owner: "Sample content",
  },
];

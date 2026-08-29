import { ProductCategory, ProductPetType } from "@petcare/shared";

export type PetKind = "DOG" | "CAT";
export type AgeBand = "YOUNG" | "ADULT" | "SENIOR";
export type SizeBand = "S" | "M" | "L";

interface Band<T extends string> {
  value: T;
  label: string;
  detail: string;
}

export const KINDS: { value: PetKind; label: string; petType: ProductPetType }[] = [
  { value: "DOG", label: "Dog", petType: ProductPetType.DOG },
  { value: "CAT", label: "Cat", petType: ProductPetType.CAT },
];

export const AGE_BANDS: Record<PetKind, (Band<AgeBand> & { months: number })[]> = {
  DOG: [
    { value: "YOUNG", label: "Puppy", detail: "Under 1 year", months: 7 },
    { value: "ADULT", label: "Adult", detail: "1 to 7 years", months: 48 },
    { value: "SENIOR", label: "Senior", detail: "7 years and up", months: 108 },
  ],
  CAT: [
    { value: "YOUNG", label: "Kitten", detail: "Under 1 year", months: 7 },
    { value: "ADULT", label: "Adult", detail: "1 to 10 years", months: 60 },
    { value: "SENIOR", label: "Senior", detail: "10 years and up", months: 144 },
  ],
};

export const SIZE_BANDS: Record<PetKind, (Band<SizeBand> & { kg: number; phrase: string })[]> = {
  DOG: [
    { value: "S", label: "Small", detail: "Under 10 kg", kg: 6, phrase: "A small" },
    { value: "M", label: "Medium", detail: "10 to 25 kg", kg: 17, phrase: "A medium" },
    { value: "L", label: "Large", detail: "25 kg and up", kg: 34, phrase: "A large" },
  ],
  CAT: [
    { value: "S", label: "Petite", detail: "Under 4 kg", kg: 3.5, phrase: "A petite" },
    { value: "M", label: "Average", detail: "4 to 6 kg", kg: 5, phrase: "An average-build" },
    { value: "L", label: "Large", detail: "6 kg and up", kg: 7, phrase: "A large" },
  ],
};

const DAILY_FRACTION: Record<PetKind, Record<AgeBand, number>> = {
  DOG: { YOUNG: 0.03, ADULT: 0.02, SENIOR: 0.017 },
  CAT: { YOUNG: 0.025, ADULT: 0.013, SENIOR: 0.012 },
};

const MEALS: Record<AgeBand, number> = { YOUNG: 3, ADULT: 2, SENIOR: 2 };

const GROWTH_RATIO: Record<PetKind, number> = { DOG: 0.5, CAT: 0.45 };

const FOCUS: Record<PetKind, Record<AgeBand, string>> = {
  DOG: {
    YOUNG:
      "Growth is the priority. Look for a puppy formula with higher protein and controlled calcium, and keep meals frequent while the stomach is still small.",
    ADULT:
      "Maintenance is mostly consistency. One reliable food beats rotating brands — switching is the most common cause of an upset stomach in otherwise healthy dogs.",
    SENIOR:
      "Joints and weight are what to watch. Slightly fewer calories, and joint support is worth starting before stiffness shows rather than after.",
  },
  CAT: {
    YOUNG:
      "Kittens eat little and often. A kitten formula and constant access to water matter more than portion precision at this stage.",
    ADULT:
      "Hydration is what most owners miss. Cats on dry-only diets drink less than they need, and wet food or a fountain does more than any supplement.",
    SENIOR:
      "Kidneys and teeth are the two to watch. Softer textures help, and a check-up twice a year rather than once is the single best habit.",
  },
};

const CATEGORIES: Record<AgeBand, { primary: ProductCategory; secondary: ProductCategory }> = {
  YOUNG: { primary: ProductCategory.FOOD, secondary: ProductCategory.TOY },
  ADULT: { primary: ProductCategory.FOOD, secondary: ProductCategory.TOY },
  SENIOR: { primary: ProductCategory.SUPPLEMENT, secondary: ProductCategory.FOOD },
};

export interface Advice {
  summary: string;
  gramsPerDay: number;
  meals: number;
  portionLine: string;
  focus: string;
  primary: ProductCategory;
  secondary: ProductCategory;
  petType: ProductPetType;
  months: number;
  kg: number;
}

export function buildAdvice(kind: PetKind, age: AgeBand, size: SizeBand): Advice {
  const ageBand = AGE_BANDS[kind].find((b) => b.value === age)!;
  const sizeBand = SIZE_BANDS[kind].find((b) => b.value === size)!;
  const kindLabel = kind === "DOG" ? "dog" : "cat";

  const currentKg = age === "YOUNG" ? sizeBand.kg * GROWTH_RATIO[kind] : sizeBand.kg;
  const grams = Math.round((currentKg * DAILY_FRACTION[kind][age] * 1000) / 5) * 5;
  const meals = MEALS[age];

  return {
    summary:
      age === "YOUNG"
        ? `${sizeBand.phrase} ${ageBand.label.toLowerCase()}`
        : `${sizeBand.phrase} ${ageBand.label.toLowerCase()} ${kindLabel}`,
    gramsPerDay: grams,
    meals,
    portionLine: `Roughly ${grams} g of dry food a day, across ${meals} meals.`,
    focus: FOCUS[kind][age],
    primary: CATEGORIES[age].primary,
    secondary: CATEGORIES[age].secondary,
    petType: kind === "DOG" ? ProductPetType.DOG : ProductPetType.CAT,
    months: ageBand.months,
    kg: Math.round(currentKg * 10) / 10,
  };
}

export const PET_DRAFT_KEY = "petcare:pet-draft";

export function draftParams(advice: Advice, kind: PetKind): string {
  return new URLSearchParams({
    petType: kind,
    petAgeMonths: String(advice.months),
    petWeight: String(advice.kg),
  }).toString();
}

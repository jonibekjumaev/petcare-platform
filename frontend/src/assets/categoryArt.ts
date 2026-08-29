
import type { ProductCategory } from "@petcare/shared";
import {
  type Art,
  FoodGlyph,
  ToyGlyph,
  AccessoryGlyph,
  SupplementGlyph,
  HygieneGlyph,
} from "./art";

export const CATEGORY_ART: Record<ProductCategory, Art> = {
  FOOD: FoodGlyph,
  TOY: ToyGlyph,
  ACCESSORY: AccessoryGlyph,
  SUPPLEMENT: SupplementGlyph,
  HYGIENE: HygieneGlyph,
} as Record<ProductCategory, Art>;

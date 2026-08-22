import { PetDTO } from "@petcare/shared";
import { Pet } from "../types/pet";

export const toPetDTO = (pet: Pet): PetDTO => ({
  _id: String(pet._id),
  memberId: String(pet.memberId),
  petType: pet.petType,
  petGender: pet.petGender,
  petStatus: pet.petStatus,
  petName: pet.petName,
  petBreed: pet.petBreed,
  petAgeMonths: pet.petAgeMonths,
  petWeight: pet.petWeight,
  petImage: pet.petImage,
  petNotes: pet.petNotes,
  createdAt: pet.createdAt.toISOString(),
  updatedAt: pet.updatedAt.toISOString(),
});

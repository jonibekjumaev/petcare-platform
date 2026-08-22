import { PetGender, PetStatus, PetType } from "../enums/pet.enum.js";

/** API javobida qaytadigan uy hayvoni shakli. */
export interface PetDTO {
  _id: string;
  memberId: string;
  petType: PetType;
  petGender: PetGender;
  petStatus: PetStatus;
  petName: string;
  petBreed?: string;
  petAgeMonths?: number;
  petWeight?: number;
  petImage?: string;
  petNotes?: string;
  createdAt: string;
  updatedAt: string;
}

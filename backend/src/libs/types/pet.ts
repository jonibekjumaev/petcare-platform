import { ObjectId } from "mongoose";
import { PetGender, PetStatus, PetType } from "../enums/pet.enum";

export interface Pet {
  _id: ObjectId;
  memberId: ObjectId;
  petType: PetType;
  petGender: PetGender;
  petStatus: PetStatus;
  petName: string;
  petBreed?: string;
  petAgeMonths?: number;
  petWeight?: number;
  petImage?: string;
  petNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PetInput {
  petType: PetType;
  petGender: PetGender;
  petStatus?: PetStatus;
  petName: string;
  petBreed?: string;
  petAgeMonths?: number;
  petWeight?: number;
  petImage?: string;
  petNotes?: string;
}

export interface PetUpdateInput {
  _id: ObjectId;
  petType?: PetType;
  petGender?: PetGender;
  petStatus?: PetStatus;
  petName?: string;
  petBreed?: string;
  petAgeMonths?: number;
  petWeight?: number;
  petImage?: string;
  petNotes?: string;
}

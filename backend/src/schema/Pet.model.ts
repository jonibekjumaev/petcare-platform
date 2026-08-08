import mongoose, { Schema } from "mongoose";
import { PetGender, PetStatus, PetType } from "../libs/enums/pet.enum";
import { Pet } from "../libs/types/pet";

const PetSchema = new Schema<Pet>(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    petType: {
      type: String,
      enum: PetType,
      required: true,
    },

    petGender: {
      type: String,
      enum: PetGender,
      required: true,
    },

    petStatus: {
      type: String,
      enum: PetStatus,
      default: PetStatus.ACTIVE,
    },

    petName: {
      type: String,
      required: true,
    },

    petBreed: {
      type: String,
    },

    petAgeMonths: {
      type: Number,
    },

    petWeight: {
      type: Number,
    },

    petImage: {
      type: String,
    },

    petNotes: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Pet", PetSchema);

import { Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ExtendedRequest } from "../libs/types/member";
import { Pet, PetInput, PetUpdateInput } from "../libs/types/pet";
import PetService from "../models/Pet.service";
import { toPetDTO } from "../libs/mappers/pet.mapper";

const petService = new PetService();

export const createPet = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    const memberId = req.member?._id;
    if (!memberId)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    const input: PetInput = {
      petType: req.body.petType,
      petGender: req.body.petGender,
      petName: req.body.petName,
      petBreed: req.body.petBreed,
      petAgeMonths: req.body.petAgeMonths
        ? Number(req.body.petAgeMonths)
        : undefined,
      petWeight: req.body.petWeight ? Number(req.body.petWeight) : undefined,
      petNotes: req.body.petNotes,
    };

    if (req.file) input.petImage = `/uploads/pets/${req.file.filename}`;

    const result = await petService.createPet(memberId, input);

    res.status(HttpCode.CREATED).json(toPetDTO(result));
  } catch (err) {
    console.log("Error: createPet", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const getPet = async (
  req: ExtendedRequest<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const memberId = req.member?._id;
    if (!memberId)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    const { id } = req.params;
    const result = await petService.getPet(memberId, id);

    res.status(HttpCode.OK).json(toPetDTO(result));
  } catch (err) {
    console.log("Error: getPet", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const getAllPets = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    const memberId = req.member?._id;
    if (!memberId)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    const result = await petService.getAllPets(memberId);

    res.status(HttpCode.OK).json(result.map((pet) => toPetDTO(pet)));
  } catch (err) {
    console.log("Error: getAllPets", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const updatePet = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    const memberId = req.member?._id;
    if (!memberId)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    const input: PetUpdateInput = {
      _id: req.body._id,
      petType: req.body.petType,
      petGender: req.body.petGender,
      petStatus: req.body.petStatus,
      petName: req.body.petName,
      petBreed: req.body.petBreed,
      petAgeMonths: req.body.petAgeMonths
        ? Number(req.body.petAgeMonths)
        : undefined,
      petWeight: req.body.petWeight ? Number(req.body.petWeight) : undefined,
      petNotes: req.body.petNotes,
    };
    if (req.file) input.petImage = `/uploads/pets/${req.file.filename}`;

    const result = await petService.updatePet(memberId, input);

    res.status(HttpCode.OK).json(toPetDTO(result));
  } catch (err) {
    console.log("Error: updatePet", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const deletePet = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    const memberId = req.member?._id;
    if (!memberId)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    const petId = req.body._id;

    const result = await petService.deletePet(memberId, petId);

    res.status(HttpCode.OK).json(toPetDTO(result));
  } catch (err) {
    console.log("Error: deletePet", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

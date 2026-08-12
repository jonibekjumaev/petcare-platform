import { Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ExtendedRequest } from "../libs/types/member";
import { Pet, PetInput, PetUpdateInput } from "../libs/types/pet";
import PetService from "../models/Pet.service";

const petService = new PetService();

export const createPet = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    console.log("createPet");
    const memberId = req.member?._id;
    if (!memberId)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    const input: PetInput = req.body;
    const result = await petService.createPet(memberId, input);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.log("Error: createPet", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const getPet = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    console.log("getPet");
    const memberId = req.member?._id;
    if (!memberId)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    const { id } = req.params;
    const result = await petService.getPet(memberId, id as string);

    res.status(HttpCode.OK).json(result);
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
    console.log("getAllPets");
    const memberId = req.member?._id;
    if (!memberId)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    const result = await petService.getAllPets(memberId);

    res.status(HttpCode.OK).json(result);
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
    console.log("updatePet");
    const memberId = req.member?._id;
    if (!memberId)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    const input: PetUpdateInput = req.body;

    const result = await petService.updatePet(memberId, input);

    res.status(HttpCode.OK).json(result);
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
    console.log("deletePet");
    const memberId = req.member?._id;
    if (!memberId)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    const petId = req.body._id;

    const result = await petService.deletePet(memberId, petId);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error: deletePet", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

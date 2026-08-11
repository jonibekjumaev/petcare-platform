import { shapeIntoMongooseObjectId } from "../libs/config";
import { PetStatus } from "../libs/enums/pet.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Pet, PetInput, PetUpdateInput } from "../libs/types/pet";
import PetModel from "../schema/Pet.model";

class PetService {
  private readonly petModel;

  constructor() {
    this.petModel = PetModel;
  }

  public async createPet(memberId: string, input: PetInput): Promise<Pet> {
    try {
      const id = shapeIntoMongooseObjectId(memberId);
      return await this.petModel.create({ ...input, memberId: id });
    } catch (err) {
      console.error("Error, model: createPet:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async getPet(memberId: string, petId: string): Promise<Pet> {
    const id = shapeIntoMongooseObjectId(memberId);
    const idPet = shapeIntoMongooseObjectId(petId);

    const result = await this.petModel
      .findOne({
        memberId: id,
        _id: idPet,
        petStatus: PetStatus.ACTIVE,
      })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async getAllPets(memberId: string): Promise<Pet[]> {
    const id = shapeIntoMongooseObjectId(memberId);
    const result = await this.petModel
      .find({ memberId: id, petStatus: { $ne: PetStatus.DELETE } })
      .sort({ createdAt: -1 })
      .exec();

    return result;
  }

  public async updatePet(
    memberId: string,
    input: PetUpdateInput,
  ): Promise<Pet> {
    const id = shapeIntoMongooseObjectId(memberId);
    const idPet = shapeIntoMongooseObjectId(input._id);

    const result = await this.petModel
      .findOneAndUpdate({ memberId: id, _id: idPet }, input, { new: true })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async deletePet(memberId: string, petId: string): Promise<Pet> {
    const id = shapeIntoMongooseObjectId(memberId);
    const idPet = shapeIntoMongooseObjectId(petId);

    const result = await this.petModel
      .findOneAndUpdate(
        { memberId: id, _id: idPet, petStatus: { $ne: PetStatus.DELETE } },
        { petStatus: PetStatus.DELETE },
        { new: true },
      )
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }
}

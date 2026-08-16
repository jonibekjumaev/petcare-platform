import { shapeIntoMongooseObjectId } from "../libs/config";
import { ProductStatus } from "../libs/enums/product.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { AnyRecord } from "../libs/types/common";
import {
  Product,
  ProductInput,
  ProductInquiry,
  ProductUpdateInput,
} from "../libs/types/product";
import ProductModel from "../schema/Product.model";

class ProductService {
  private readonly productModel;

  constructor() {
    this.productModel = ProductModel;
  }

  public async createProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input);
    } catch (err) {
      console.error("Error, model: createProduct:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async getProduct(productId: string): Promise<Product> {
    const id = shapeIntoMongooseObjectId(productId);

    const result = await this.productModel
      .findOneAndUpdate(
        { _id: id, productStatus: { $ne: ProductStatus.DELETE } },
        { $inc: { productViews: 1 } },
        { new: true },
      )
      .exec();

    /** add Views */

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async getAllProducts(inquiry: ProductInquiry): Promise<Product[]> {
    const match: AnyRecord = { productStatus: { $ne: ProductStatus.DELETE } };

    if (inquiry.productCategory)
      match.productCategory = inquiry.productCategory;
    if (inquiry.productPetType) match.productPetType = inquiry.productPetType;
    if (inquiry.search)
      match.productName = { $regex: inquiry.search, $options: "i" };

    const sortField = inquiry.order ?? "createdAt";
    const skip = (inquiry.page - 1) * inquiry.limit;

    const result = await this.productModel
      .find(match)
      .sort({ [sortField]: -1 })
      .skip(skip)
      .limit(inquiry.limit)
      .exec();

    return result;
  }

  public async updateProduct(input: ProductUpdateInput): Promise<Product> {
    const id = shapeIntoMongooseObjectId(input._id);

    const result = await this.productModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async countProducts(): Promise<number> {
    return this.productModel
      .countDocuments({ productStatus: { $ne: ProductStatus.DELETE } })
      .exec();
  }

  public async getProductForEdit(productId: string): Promise<Product> {
    const id = shapeIntoMongooseObjectId(productId);

    const result = await this.productModel
      .findOne({ _id: id, productStatus: { $ne: ProductStatus.DELETE } })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }
}

export default ProductService;

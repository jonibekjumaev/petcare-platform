import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ExtendedRequest } from "../libs/types/member";
import { Response, Request } from "express";
import ProductService from "../models/Product.service";
import {
  ProductInput,
  ProductInquiry,
  ProductUpdateInput,
} from "../libs/types/product";
import { ProductCategory, ProductPetType } from "../libs/enums/product.enum";

const productService = new ProductService();

export const createProduct = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (req.member?.memberType !== MemberType.ADMIN) {
      throw new Errors(HttpCode.FORBIDDEN, Message.NOT_AUTHENTICATED);
    }

    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }

    const productImages = files.map(
      (file) => `/uploads/products/${file.filename}`,
    );

    const input: ProductInput = {
      productName: req.body.productName,
      productDesc: req.body.productDesc,
      productCategory: req.body.productCategory,
      productPetType: req.body.productPetType,
      productSize: req.body.productSize,
      productPrice: Number(req.body.productPrice),
      productLeftCount: Number(req.body.productLeftCount),
      productImages,
    };

    const result = await productService.createProduct(input);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.error("Error: createProduct", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const getProduct = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const productId = req.params.id;
    const result = await productService.getProduct(productId);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.error("Error: getProduct", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const inquiry: ProductInquiry = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 12,
      order: req.query.order as ProductInquiry["order"],
      productPetType: req.query.productPetType as ProductPetType,
      productCategory: req.query.productCategory as ProductCategory,
      search: req.query.search as string,
    };

    const result = await productService.getAllProducts(inquiry);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.error("Error: getAllProducts", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const updateProduct = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (req.member?.memberType !== MemberType.ADMIN) {
      throw new Errors(HttpCode.FORBIDDEN, Message.NOT_AUTHENTICATED);
    }

    const input: ProductUpdateInput = { ...req.body };

    if (input.productPrice) input.productPrice = Number(input.productPrice);
    if (input.productLeftCount)
      input.productLeftCount = Number(input.productLeftCount);

    const files = req.files as Express.Multer.File[] | undefined;
    if (files && files.length > 0) {
      input.productImages = files.map(
        (file) => `/uploads/products/${file.filename}`,
      );
    }

    const result = await productService.updateProduct(input);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.error("Error: updateProduct", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

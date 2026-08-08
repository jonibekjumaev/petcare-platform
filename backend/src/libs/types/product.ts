import { ObjectId } from "mongoose";
import {
  ProductCategory,
  ProductPetType,
  ProductSize,
  ProductStatus,
} from "../enums/product.enum";

export interface Product {
  _id: ObjectId;
  productStatus: ProductStatus;
  productCategory: ProductCategory;
  productPetType: ProductPetType;
  productSize: ProductSize;
  productName: string;
  productDesc?: string;
  productPrice: number;
  productLeftCount: number;
  productImages: string[];
  productViews: number;
  productLikes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInput {
  productStatus?: ProductStatus;
  productCategory: ProductCategory;
  productPetType: ProductPetType;
  productSize: ProductSize;
  productName: string;
  productDesc?: string;
  productPrice: number;
  productLeftCount: number;
  productImages: string[];
}

export interface ProductUpdateInput {
  _id: ObjectId;
  productStatus?: ProductStatus;
  productCategory?: ProductCategory;
  productPetType?: ProductPetType;
  productSize?: ProductSize;
  productName?: string;
  productDesc?: string;
  productPrice?: number;
  productLeftCount?: number;
  productImages?: string[];
}

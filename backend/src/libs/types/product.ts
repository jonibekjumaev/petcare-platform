import { ObjectId } from "mongoose";
import {
  ProductCategory,
  ProductPetType,
  ProductSize,
  ProductStatus,
  ProductSortOption,
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
  productSold: number;
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
  _id: string;
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

export interface ProductInquiry {
  page: number;
  limit: number;
  order?: ProductSortOption;
  productPetType?: ProductPetType;
  productCategory?: ProductCategory;
  search?: string;
}

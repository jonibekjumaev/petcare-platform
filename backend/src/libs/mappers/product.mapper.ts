import { ProductDTO } from "@petcare/shared";
import { Product } from "../types/product";

export const toProductDTO = (product: Product): ProductDTO => ({
  _id: String(product._id),
  productStatus: product.productStatus,
  productCategory: product.productCategory,
  productPetType: product.productPetType,
  productSize: product.productSize,
  productName: product.productName,
  productDesc: product.productDesc,
  productPrice: product.productPrice,
  productLeftCount: product.productLeftCount,
  productImages: product.productImages,
  productViews: product.productViews,
  productLikes: product.productLikes,
  productSold: product.productSold,
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
});

import {
  ProductCategory,
  ProductPetType,
  ProductSize,
  ProductSortOption,
  ProductStatus,
} from "../enums/product.enum.js";

/** API javobida qaytadigan mahsulot shakli. */
export interface ProductDTO {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ProductInquiryDTO {
  page: number;
  limit: number;
  order?: ProductSortOption;
  productPetType?: ProductPetType;
  productCategory?: ProductCategory;
  search?: string;
}

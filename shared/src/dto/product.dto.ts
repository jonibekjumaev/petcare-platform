import {
  ProductCategory,
  ProductPetType,
  ProductSize,
  ProductStatus,
} from "../enums/product.enum";

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
  createdAt: string;
  updatedAt: string;
}

/** GET /product/all uchun so'rov parametrlari. */
export interface ProductInquiryDTO {
  page: number;
  limit: number;
  order?: "createdAt" | "productPrice" | "productViews";
  productPetType?: ProductPetType;
  productCategory?: ProductCategory;
  search?: string;
}

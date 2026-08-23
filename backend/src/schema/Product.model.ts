import mongoose, { Schema } from "mongoose";
import { Product } from "../libs/types/product";
import {
  ProductCategory,
  ProductPetType,
  ProductSize,
  ProductStatus,
} from "../libs/enums/product.enum";

const ProductSchema = new Schema<Product>(
  {
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PROCESS,
    },

    productCategory: {
      type: String,
      enum: ProductCategory,
      required: true,
    },

    productPetType: {
      type: String,
      enum: ProductPetType,
      required: true,
    },

    productSize: {
      type: String,
      enum: ProductSize,
      default: ProductSize.MEDIUM,
    },

    productName: {
      type: String,
      required: true,
    },

    productDesc: {
      type: String,
    },

    productPrice: {
      type: Number,
      required: true,
    },

    productLeftCount: {
      type: Number,
      required: true,
    },

    productImages: {
      type: [String],
      default: [],
    },

    productViews: {
      type: Number,
      default: 0,
    },

    productLikes: {
      type: Number,
      default: 0,
    },
    productSold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

ProductSchema.index({
  productPetType: 1,
  productCategory: 1,
  productStatus: 1,
});

export default mongoose.model("Product", ProductSchema);

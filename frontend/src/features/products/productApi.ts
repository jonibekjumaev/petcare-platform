import { api } from "../../app/api";
import type {
  ProductDTO,
  ProductSortOption,
  ProductCategory,
} from "@petcare/shared";

interface GetAllProductsArgs {
  order?: ProductSortOption;
  productCategory?: ProductCategory;
  search?: string;
  
  limit?: number;
}

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<ProductDTO[], GetAllProductsArgs | void>({
      query: (args) => ({
        url: "/product/all",
        params: {
          ...(args?.order ? { order: args.order } : {}),
          ...(args?.productCategory
            ? { productCategory: args.productCategory }
            : {}),
          ...(args?.search ? { search: args.search } : {}),
          ...(args?.limit ? { limit: args.limit } : {}),
        },
      }),
      providesTags: ["Product"],
    }),
    getProduct: builder.query<ProductDTO, string>({
      query: (id) => `/product/${id}`,
      providesTags: ["Product"],
    }),
  }),
});

export const { useGetAllProductsQuery, useGetProductQuery } = productApi;

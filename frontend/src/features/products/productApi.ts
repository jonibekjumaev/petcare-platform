import { api } from "../../app/api";
import type { ProductDTO } from "@petcare/shared";

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<ProductDTO[], void>({
      query: () => "/product/all",
      providesTags: ["Product"],
    }),
    getProduct: builder.query<ProductDTO, string>({
      query: (id) => `/product/${id}`,
      providesTags: ["Product"],
    }),
  }),
});

export const { useGetAllProductsQuery, useGetProductQuery } = productApi;

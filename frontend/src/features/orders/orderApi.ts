import { api } from "../../app/api";
import type {
  CreateOrderRequestDTO,
  OrderDTO,
  OrderWithItemsDTO,
} from "@petcare/shared";

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderDTO, CreateOrderRequestDTO>({
      query: (input) => ({
        url: "/order/create",
        method: "POST",
        body: input,
      }),
      invalidatesTags: ["Product", "Order"],
    }),
    getAllOrders: builder.query<OrderWithItemsDTO[], void>({
      query: () => "/order/all?page=1&limit=50",
      providesTags: ["Order"],
    }),
  }),
});

export const { useCreateOrderMutation, useGetAllOrdersQuery } = orderApi;

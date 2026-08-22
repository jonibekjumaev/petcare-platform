import { api } from "../../app/api";
import type { CreateOrderRequestDTO, OrderDTO } from "@petcare/shared";

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderDTO, CreateOrderRequestDTO>({
      query: (input) => ({
        url: "/order/create",
        method: "POST",
        body: input,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const { useCreateOrderMutation } = orderApi;

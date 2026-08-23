import { api } from "../../app/api";
import type {
  CreateOrderRequestDTO,
  OrderDTO,
  OrderStatus,
  OrderWithItemsDTO,
} from "@petcare/shared";

interface GetAllOrdersArgs {
  orderStatus?: OrderStatus;
}

interface UpdateOrderStatusRequest {
  _id: string;
  orderStatus: OrderStatus;
}

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
    getAllOrders: builder.query<OrderWithItemsDTO[], GetAllOrdersArgs | void>({
      query: (args) => ({
        url: "/order/all",
        params: {
          page: 1,
          limit: 50,
          ...(args?.orderStatus ? { orderStatus: args.orderStatus } : {}),
        },
      }),
      providesTags: ["Order"],
    }),
    updateOrderStatus: builder.mutation<OrderDTO, UpdateOrderStatusRequest>({
      query: (input) => ({
        url: "/order/update",
        method: "POST",
        body: input,
      }),
      // Cancel qilinganda mahsulot stocki qayta tiklanadi,
      // shuning uchun Product cache ham invalidate qilinishi kerak.
      invalidatesTags: ["Product", "Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;

import { OrderDTO, OrderItemDTO, OrderWithItemsDTO } from "@petcare/shared";
import { toProductDTO } from "./product.mapper";
import { Order, OrderItem } from "../types/order";
import { OrderWithItems } from "../types/member";

export const toOrderDTO = (order: Order): OrderDTO => ({
  _id: String(order._id),
  memberId: String(order.memberId),
  petId: String(order.petId),
  orderStatus: order.orderStatus,
  orderTotal: order.orderTotal,
  orderDelivery: order.orderDelivery,
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
});

export const toOrderItemDTO = (item: OrderItem): OrderItemDTO => ({
  _id: String(item._id),
  orderId: String(item.orderId),
  productId: String(item.productId),
  itemQuantity: item.itemQuantity,
  itemPrice: item.itemPrice,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
});

export const toOrderWithItemsDTO = (
  order: OrderWithItems,
): OrderWithItemsDTO => ({
  ...toOrderDTO(order),
  orderItems: order.orderItems.map(toOrderItemDTO),
  productData: order.productData.map(toProductDTO),
});

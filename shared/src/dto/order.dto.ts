import { OrderStatus } from "../enums/order.enum.js";
import { ProductDTO } from "./product.dto.js";

export interface OrderDTO {
  _id: string;
  memberId: string;
  petId: string;
  orderStatus: OrderStatus;
  orderTotal: number;
  orderDelivery: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemDTO {
  _id: string;
  orderId: string;
  productId: string;
  itemQuantity: number;
  itemPrice: number;
  createdAt: string;
  updatedAt: string;
}

/** Buyurtma — mahsulot ma'lumotlari bilan birga. */
export interface OrderWithItemsDTO extends OrderDTO {
  orderItems: OrderItemDTO[];
  productData: ProductDTO[];
}

export interface OrderItemRequestDTO {
  productId: string;
  itemQuantity: number;
}

export interface CreateOrderRequestDTO {
  petId?: string;
  orderDelivery: number;
  items: OrderItemRequestDTO[];
}

export interface OrderInquiryDTO {
  page: number;
  limit: number;
  orderStatus?: OrderStatus;
}

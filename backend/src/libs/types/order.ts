import { ObjectId } from "mongoose";
import { OrderStatus } from "../enums/order.enum";

export interface Order {
  _id: ObjectId;
  memberId: ObjectId;
  petId?: ObjectId;
  orderStatus: OrderStatus;
  orderTotal: number;
  orderDelivery: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  _id: ObjectId;
  itemQuantity: number;
  itemPrice: number;
  orderId: ObjectId;
  productId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemInput {
  productId: string;
  itemQuantity: number;
}

export interface OrderInput {
  petId?: string;
  orderDelivery: number;
  items: OrderItemInput[];
}

export interface OrderUpdateInput {
  _id: string;
  orderStatus?: OrderStatus;
}

export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus?: OrderStatus;
}

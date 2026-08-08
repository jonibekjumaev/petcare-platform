import { ObjectId } from "mongoose";
import { OrderStatus } from "../enums/order.enum";

export interface Order {
  _id: ObjectId;
  memberId: ObjectId;
  petId: ObjectId;
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

export interface OrderInput {
  petId: ObjectId;
  orderDelivery: number;
  items: OrderItemInput[];
}

export interface OrderItemInput {
  itemQuantity: number;
  productId: ObjectId;
  orderId?: ObjectId;
}

import mongoose, { Schema } from "mongoose";
import { Order } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";

const OrderSchema = new Schema<Order>(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    petId: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: false,
    },

    orderStatus: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.PAUSE,
    },

    orderTotal: {
      type: Number,
      required: true,
    },

    orderDelivery: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

OrderSchema.index({ memberId: 1, createdAt: -1 });
OrderSchema.index({ petId: 1, createdAt: -1 });

export default mongoose.model("Order", OrderSchema);

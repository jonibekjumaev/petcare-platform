import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  Order,
  OrderInput,
  OrderInquiry,
  OrderUpdateInput,
} from "../libs/types/order";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import ProductModel from "../schema/Product.model";
import { ProductStatus } from "../libs/enums/product.enum";
import { OrderWithItems } from "../libs/types/member";
import { AnyRecord } from "../libs/types/common";
import { OrderStatus } from "../libs/enums/order.enum";

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;
  private readonly productModel;

  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
    this.productModel = ProductModel;
  }

  public async createOrder(
    memberId: string,
    input: OrderInput,
  ): Promise<Order> {
    const memberObjectId = shapeIntoMongooseObjectId(memberId);
    let petObjectId: ReturnType<typeof shapeIntoMongooseObjectId> | undefined;
    if (input.petId) petObjectId = shapeIntoMongooseObjectId(input.petId);

    let amount = 0;
    const orderItemsData: {
      productId: string;
      itemQuantity: number;
      itemPrice: number;
    }[] = [];

    for (const item of input.items) {
      const productObjectId = shapeIntoMongooseObjectId(item.productId);

      const updatedProduct = await this.productModel
        .findOneAndUpdate(
          {
            _id: productObjectId,
            productStatus: { $ne: ProductStatus.DELETE },
            productLeftCount: { $gte: item.itemQuantity },
          },
          {
            $inc: {
              productLeftCount: -item.itemQuantity,
              productSold: item.itemQuantity,
            },
          },
          { new: true },
        )
        .exec();

      if (!updatedProduct) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.NO_DATA_FOUND);
      }

      const itemPrice = updatedProduct.productPrice;
      amount += itemPrice * item.itemQuantity;

      orderItemsData.push({
        productId: item.productId,
        itemQuantity: item.itemQuantity,
        itemPrice,
      });
    }

    try {
      const newOrder = await this.orderModel.create({
        memberId: memberObjectId,
        petId: petObjectId,
        orderTotal: amount + input.orderDelivery,
        orderDelivery: input.orderDelivery,
      });

      await Promise.all(
        orderItemsData.map((item) =>
          this.orderItemModel.create({
            orderId: newOrder._id,
            productId: shapeIntoMongooseObjectId(item.productId),
            itemQuantity: item.itemQuantity,
            itemPrice: item.itemPrice,
          }),
        ),
      );

      return newOrder;
    } catch (err) {
      console.error("Error, model: createOrder:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async getAllOrders(
    member: string,
    input: OrderInquiry,
  ): Promise<OrderWithItems[]> {
    const memberId = shapeIntoMongooseObjectId(member);

    const match: Record<string, any> = { memberId };
    if (input.orderStatus) match.orderStatus = input.orderStatus;

    const result = await this.orderModel
      .aggregate([
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: (input.page - 1) * input.limit },
        { $limit: input.limit },
        {
          $lookup: {
            from: "orderitems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "productData",
          },
        },
      ])
      .exec();

    return result;
  }

  public async getOrder(
    memberId: string,
    orderId: string,
  ): Promise<OrderWithItems> {
    const memberObjectId = shapeIntoMongooseObjectId(memberId);
    const orderObjectId = shapeIntoMongooseObjectId(orderId);

    const result = await this.orderModel
      .aggregate([
        { $match: { _id: orderObjectId, memberId: memberObjectId } },
        {
          $lookup: {
            from: "orderitems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "productData",
          },
        },
      ])
      .exec();

    if (!result || result.length === 0) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    return result[0];
  }

  public async updateOrder(
    memberId: string,
    input: OrderUpdateInput,
  ): Promise<Order> {
    const memberObjectId = shapeIntoMongooseObjectId(memberId);
    const orderObjectId = shapeIntoMongooseObjectId(input._id);

    // Member faqat o'z pending orderini Cancel yoki Pay qila oladi —
    // boshqa hech qanday statusga to'g'ridan-to'g'ri o'ta olmaydi.
    const allowedTargets = [OrderStatus.PROCESS, OrderStatus.DELETE];
    if (!input.orderStatus || !allowedTargets.includes(input.orderStatus)) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.NO_DATA_FOUND); // <- loyihangizdagi mos Message konstantasini qo'ying
    }

    const existingOrder = await this.orderModel
      .findOne({ _id: orderObjectId, memberId: memberObjectId })
      .exec();
    if (!existingOrder) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
    if (existingOrder.orderStatus !== OrderStatus.PAUSE) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.NO_DATA_FOUND); // <- shu yerda ham mos Message
    }

    // Cancel qilinganda stock admin cancel yo'lidagidek qaytariladi.
    if (input.orderStatus === OrderStatus.DELETE) {
      const items = await this.orderItemModel
        .find({ orderId: orderObjectId })
        .exec();

      await Promise.all(
        items.map((item) =>
          this.productModel
            .findByIdAndUpdate(item.productId, {
              $inc: {
                productLeftCount: item.itemQuantity,
                productSold: -item.itemQuantity,
              },
            })
            .exec(),
        ),
      );
    }

    const result = await this.orderModel
      .findOneAndUpdate(
        { _id: orderObjectId, memberId: memberObjectId },
        { $set: { orderStatus: input.orderStatus } },
        { new: true },
      )
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async countOrders(): Promise<number> {
    return this.orderModel.countDocuments({}).exec();
  }

  public async getAllOrdersForAdmin(
    input: OrderInquiry,
  ): Promise<OrderWithItems[]> {
    const match: AnyRecord = {};
    if (input.orderStatus) match.orderStatus = input.orderStatus;

    const result = await this.orderModel
      .aggregate([
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: (input.page - 1) * input.limit },
        { $limit: input.limit },
        {
          $lookup: {
            from: "orderitems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "productData",
          },
        },
        {
          $lookup: {
            from: "members",
            localField: "memberId",
            foreignField: "_id",
            as: "memberData",
          },
        },
      ])
      .exec();

    return result;
  }

  public async updateOrderStatusForAdmin(
    orderId: string,
    newStatus: OrderStatus,
  ): Promise<Order> {
    const orderObjectId = shapeIntoMongooseObjectId(orderId);

    const existingOrder = await this.orderModel.findById(orderObjectId).exec();
    if (!existingOrder) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    const isBeingCanceledForFirstTime =
      existingOrder.orderStatus !== OrderStatus.DELETE &&
      newStatus === OrderStatus.DELETE;

    if (isBeingCanceledForFirstTime) {
      const items = await this.orderItemModel
        .find({ orderId: orderObjectId })
        .exec();

      await Promise.all(
        items.map((item) =>
          this.productModel
            .findByIdAndUpdate(item.productId, {
              $inc: {
                productLeftCount: item.itemQuantity,
                productSold: -item.itemQuantity,
              },
            })
            .exec(),
        ),
      );
    }

    const result = await this.orderModel
      .findOneAndUpdate(
        { _id: orderObjectId },
        { $set: { orderStatus: newStatus } },
        { new: true },
      )
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }
}

export default OrderService;

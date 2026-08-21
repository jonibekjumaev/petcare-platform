import { Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ExtendedRequest } from "../libs/types/member";
import {
  OrderInput,
  OrderInquiry,
  OrderUpdateInput,
} from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";
import OrderService from "../models/Order.service";
import { toOrderDTO, toOrderWithItemsDTO } from "../libs/mappers/order.mapper";

const orderService = new OrderService();

export const createOrder = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    const memberId = req.member?._id;
    if (!memberId) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }

    const input: OrderInput = req.body;
    const result = await orderService.createOrder(memberId, input);

    res.status(HttpCode.CREATED).json(toOrderDTO(result));
  } catch (err) {
    console.error("Error: createOrder", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const getAllOrders = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    const memberId = req.member?._id;
    if (!memberId) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }

    const inquiry: OrderInquiry = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 12,
      orderStatus: req.query.orderStatus as OrderStatus,
    };

    const result = await orderService.getAllOrders(memberId, inquiry);

    res
      .status(HttpCode.OK)
      .json(result.map((order) => toOrderWithItemsDTO(order)));
  } catch (err) {
    console.error("Error: getAllOrders", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const getOrder = async (
  req: ExtendedRequest<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const memberId = req.member?._id;
    if (!memberId) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }

    const orderId = req.params.id;
    const result = await orderService.getOrder(memberId, orderId);

    res.status(HttpCode.OK).json(toOrderWithItemsDTO(result));
  } catch (err) {
    console.error("Error: getOrder", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export const updateOrder = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    const memberId = req.member?._id;
    if (!memberId) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    }

    const input: OrderUpdateInput = req.body;
    const result = await orderService.updateOrder(memberId, input);

    res.status(HttpCode.OK).json(toOrderDTO(result));
  } catch (err) {
    console.error("Error: updateOrder", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import {
  ExtendedRequest,
  LoginInput,
  MemberInquiry,
  MemberUpdateInput,
} from "../libs/types/member";
import MemberService from "../models/Member.service";
import ProductService from "../models/Product.service";
import OrderService from "../models/Order.service";
import { error } from "node:console";
import {
  ProductInput,
  ProductInquiry,
  ProductUpdateInput,
} from "../libs/types/product";
import { ProductCategory, ProductPetType } from "../libs/enums/product.enum";
import { OrderInquiry } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";

const memberService = new MemberService();
const productService = new ProductService();
const orderService = new OrderService();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const input: LoginInput = req.body;
    const member = await memberService.login(input);

    if (member.memberType !== MemberType.ADMIN) {
      throw new Errors(HttpCode.FORBIDDEN, Message.NOT_AUTHENTICATED);
    }

    req.session.admin = {
      _id: member._id.toString(),
      memberNick: member.memberNick,
      memberType: member.memberType,
    };

    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, login:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;

    res.render("login", { error: message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error, logout:", err);
    }
    res.clearCookie("connect.sid");
    res.redirect("/admin");
  });
};

export const getLoginPage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (req.session.admin) {
      res.redirect("/admin/dashboard");
    } else {
      res.render("login", { error: null });
    }
  } catch (err) {
    console.error("Error: getLoginPage", err);
    const { code, message } = err instanceof Errors ? err : Errors.standard;
    res.status(code).render("login", { error: message });
  }
};

export const getDashboardPage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const [memberCount, productCount, orderCount] = await Promise.all([
      memberService.countMembers(),
      productService.countProducts(),
      orderService.countOrders(),
    ]);

    res.render("dashboard", { memberCount, productCount, orderCount });
  } catch (err) {
    console.error("Error: getDashboardPage", err);
    const { code, message } = err instanceof Errors ? err : Errors.standard;
    res.status(code).render("dashboard", {
      memberCount: 0,
      productCount: 0,
      orderCount: 0,
      error: message,
    });
  }
};

export const getProductsPage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const inquiry: ProductInquiry = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 12,
    order: req.query.order as ProductInquiry["order"],
    productPetType: req.query.productPetType as ProductPetType,
    productCategory: req.query.productCategory as ProductCategory,
    search: req.query.search as string,
  };

  try {
    const result = await productService.getAllProducts(inquiry);
    res.render("products", { products: result, inquiry });
  } catch (err) {
    console.error("Error: getProductsPage", err);
    res.status(HttpCode.INTERNAL_SERVER_ERROR).render("products", {
      products: [],
      inquiry,
      error: "Failed to load products",
    });
  }
};

export const getCreateProductPage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.render("product-form", { product: null, error: null });
};

export const createProduct = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }

    const productImages = files.map(
      (file) => `/uploads/products/${file.filename}`,
    );

    const input: ProductInput = {
      productName: req.body.productName,
      productDesc: req.body.productDesc,
      productCategory: req.body.productCategory,
      productPetType: req.body.productPetType,
      productSize: req.body.productSize,
      productPrice: Number(req.body.productPrice),
      productLeftCount: Number(req.body.productLeftCount),
      productImages,
    };

    await productService.createProduct(input);

    res.redirect("/admin/product/all");
  } catch (err) {
    console.error("Error: createProduct", err);
    const { code, message } = err instanceof Errors ? err : Errors.standard;
    res.status(code).render("product-form", {
      product: req.body,
      error: message,
    });
  }
};

export const getEditProductPage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = req.params.id;

    const result = await productService.getProductForEdit(productId as string);

    res.render("product-form", { product: result, error: null });
  } catch (err) {
    console.error("Error: getEditProductPage", err);
    const { code, message } = err instanceof Errors ? err : Errors.standard;
    res.status(code).render("product-form", {
      product: null,
      error: message,
    });
  }
};

export const updateProduct = async (
  req: ExtendedRequest,
  res: Response,
): Promise<void> => {
  const input: ProductUpdateInput = { ...req.body };
  input._id = req.params.id as string;
  try {
    if (input.productPrice) input.productPrice = Number(input.productPrice);
    if (input.productLeftCount)
      input.productLeftCount = Number(input.productLeftCount);

    const files = req.files as Express.Multer.File[] | undefined;
    if (files && files.length > 0) {
      input.productImages = files.map(
        (file) => `/uploads/products/${file.filename}`,
      );
    }

    await productService.updateProduct(input);

    res.redirect("/admin/product/all");
  } catch (err) {
    console.error("Error: updateProduct", err);
    const { code, message } = err instanceof Errors ? err : Errors.standard;
    res.status(code).render("product-form", {
      product: input,
      error: message,
    });
  }
};

export const getOrdersPage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const inquiry: OrderInquiry = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 12,
    orderStatus: req.query.orderStatus as OrderStatus,
  };

  try {
    const orders = await orderService.getAllOrdersForAdmin(inquiry);
    res.render("orders", { orders, inquiry, error: null });
  } catch (err) {
    console.error("Error: getOrdersPage", err);
    const { code, message } = err instanceof Errors ? err : Errors.standard;
    res.status(code).render("orders", {
      orders: [],
      inquiry,
      error: message,
    });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orderId = req.params.id as string;
    const newStatus = req.body.orderStatus as OrderStatus;

    await orderService.updateOrderStatusForAdmin(orderId, newStatus);

    res.redirect("/admin/order/all");
  } catch (err) {
    console.error("Error: updateOrderStatus", err);
    res.redirect("/admin/order/all");
  }
};

export const getMembersPage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const inquiry: MemberInquiry = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 12,
    memberStatus: req.query.memberStatus as MemberStatus,
  };

  try {
    const members = await memberService.getAllMembersForAdmin(inquiry);
    res.render("members", { members, inquiry, error: null });
  } catch (err) {
    console.error("Error: getMembersPage", err);
    const { code, message } = err instanceof Errors ? err : Errors.standard;
    res.status(code).render("members", {
      members: [],
      inquiry,
      error: message,
    });
  }
};

export const updateMemberStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const input: MemberUpdateInput = {
      _id: req.params.id as string,
      memberStatus: req.body.memberStatus,
    };
    await memberService.updateMember(input);
    res.redirect("/admin/member/all");
  } catch (err) {
    console.error("Error: updateMemberStatus", err);
    res.redirect("/admin/member/all");
  }
};

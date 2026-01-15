// models/Cart.ts (NEW FILE)
import mongoose, { Schema, models, Model } from "mongoose";
import { Cart } from "@/types";

interface CartDocument extends Omit<Cart, "_id">, mongoose.Document {}

const cartItemSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

const cartSchema = new Schema<CartDocument>(
  {
    userId: {
      type: String,
      required: false,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const CartModel: Model<CartDocument> =
  models.Cart || mongoose.model<CartDocument>("Cart", cartSchema);

export default CartModel;

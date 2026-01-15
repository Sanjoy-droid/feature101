// models/Product.ts (NEW FILE)
import mongoose, { Schema, models, Model } from "mongoose";
import { Product } from "@/types";

interface ProductDocument extends Omit<Product, "_id">, mongoose.Document {}

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const ProductModel: Model<ProductDocument> =
  models.Product || mongoose.model<ProductDocument>("Product", productSchema);

export default ProductModel;

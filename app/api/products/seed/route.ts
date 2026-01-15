import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ProductModel from "@/models/Product";

const SEED_PRODUCTS = [
  {
    name: "Wireless Headphones",
    price: 79.99,
    image: "🎧",
    category: "Electronics",
    stock: 50,
  },
  {
    name: "Smart Watch",
    price: 199.99,
    image: "⌚",
    category: "Electronics",
    stock: 30,
  },
  {
    name: "Laptop Stand",
    price: 49.99,
    image: "💻",
    category: "Accessories",
    stock: 100,
  },
  {
    name: "USB-C Cable",
    price: 12.99,
    image: "🔌",
    category: "Accessories",
    stock: 200,
  },
  {
    name: "Mechanical Keyboard",
    price: 129.99,
    image: "⌨️",
    category: "Electronics",
    stock: 45,
  },
  {
    name: "Mouse Pad",
    price: 19.99,
    image: "🖱️",
    category: "Accessories",
    stock: 150,
  },
  {
    name: "Webcam HD",
    price: 89.99,
    image: "📷",
    category: "Electronics",
    stock: 25,
  },
  {
    name: "Phone Stand",
    price: 24.99,
    image: "📱",
    category: "Accessories",
    stock: 80,
  },
];

export async function POST() {
  try {
    await connectDB();

    // Clear existing products (optional - remove in production)
    await ProductModel.deleteMany({});

    // Insert seed products
    const products = await ProductModel.insertMany(SEED_PRODUCTS);

    return NextResponse.json({
      message: "Products seeded successfully",
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error seeding products:", error);
    return NextResponse.json(
      { error: "Failed to seed products" },
      { status: 500 },
    );
  }
}

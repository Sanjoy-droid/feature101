import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ProductModel from "@/models/Product";

// GET all products
export async function GET() {
  try {
    await connectDB();
    const products = await ProductModel.find({}).sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// POST new product (for seeding/admin)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const product = await ProductModel.create(body);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

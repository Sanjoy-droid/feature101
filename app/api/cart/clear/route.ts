import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CartModel from "@/models/Cart";

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const sessionId = request.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    const cart = await CartModel.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    cart.items = [];
    cart.subtotal = 0;
    cart.tax = 0;
    cart.total = 0;

    await cart.save();

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 },
    );
  }
}

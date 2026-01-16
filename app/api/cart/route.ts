import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CartModel from "@/models/Cart";
import ProductModel from "@/models/Product";

// GET cart by sessionId
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const sessionId = request.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    let cart = await CartModel.findOne({ sessionId });

    if (!cart) {
      cart = await CartModel.create({
        sessionId,
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
      });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}

// POST add item to cart
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { sessionId, productId, name, price, image, category } =
      await request.json();

    if (!sessionId || !productId) {
      return NextResponse.json(
        { error: "Session ID and Product ID are required" },
        { status: 400 },
      );
    }

    // Check product stock
    const product = await ProductModel.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let cart = await CartModel.findOne({ sessionId });

    if (!cart) {
      cart = new CartModel({
        sessionId,
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );
    if (existingItemIndex > -1) {
      // Check stock before incrementing
      if (cart.items[existingItemIndex].quantity >= product.stock) {
        return NextResponse.json(
          { error: "Not enough stock available" },
          { status: 400 },
        );
      }
      cart.items[existingItemIndex].quantity += 1;
    } else {
      if (product.stock < 1) {
        return NextResponse.json(
          { error: "Product out of stock" },
          { status: 400 },
        );
      }
      cart.items.push({
        productId,
        name,
        price,
        image,
        category,
        quantity: 1,
      });
    }

    // Calculate totals
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    cart.tax = cart.subtotal * 0.08;
    cart.total = cart.subtotal + cart.tax;

    await cart.save();

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 },
    );
  }
}

// PUT update item quantity
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { sessionId, productId, quantity } = await request.json();

    if (!sessionId || !productId || quantity === undefined) {
      return NextResponse.json(
        { error: "Session ID, Product ID, and quantity are required" },
        { status: 400 },
      );
    }

    const cart = await CartModel.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Check stock
    const product = await ProductModel.findById(productId);
    if (product && quantity > product.stock) {
      return NextResponse.json(
        { error: `Only ${product.stock} items available in stock` },
        { status: 400 },
      );
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 },
      );
    }

    cart.items[itemIndex].quantity = quantity;

    // Calculate totals
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    cart.tax = cart.subtotal * 0.08;
    cart.total = cart.subtotal + cart.tax;

    await cart.save();

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 },
    );
  }
}

// DELETE remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { sessionId, productId } = await request.json();

    if (!sessionId || !productId) {
      return NextResponse.json(
        { error: "Session ID and Product ID are required" },
        { status: 400 },
      );
    }

    const cart = await CartModel.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);

    // Calculate totals
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    cart.tax = cart.subtotal * 0.08;
    cart.total = cart.subtotal + cart.tax;

    await cart.save();

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 },
    );
  }
}

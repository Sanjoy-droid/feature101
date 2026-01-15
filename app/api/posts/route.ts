import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const post = await Post.create(body);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}

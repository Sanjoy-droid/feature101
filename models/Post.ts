import mongoose, { Schema, models, Model } from "mongoose";
import { Post } from "@/types";

interface PostDocument extends Omit<Post, "_id">, mongoose.Document {}

const postSchema = new Schema<PostDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const PostModel: Model<PostDocument> =
  models.Post || mongoose.model<PostDocument>("Post", postSchema);

export default PostModel;

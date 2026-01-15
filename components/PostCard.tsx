"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {post.content}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              className="cursor-pointer"
              onClick={onEdit}
              variant="ghost"
              size="icon"
            >
              <Edit2 className="w-5 h-5" />
            </Button>
            <Button
              onClick={onDelete}
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive cursor-pointer"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
      {post.createdAt && (
        <CardFooter className="pt-0">
          <p className="text-sm text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PostCard from "@/components/PostCard";
import PostModal from "@/components/PostModal";
import DeleteDialog from "@/components/DeleteDialog";
import { Post } from "@/types";
import axios from "axios";
import toast from "react-hot-toast";

const api = {
  getPosts: async (): Promise<Post[]> => {
    const { data } = await axios.get("/api/posts");
    return data;
  },
  createPost: async (
    postData: Omit<Post, "_id" | "createdAt" | "updatedAt">,
  ): Promise<Post> => {
    const { data } = await axios.post("/api/posts", postData);
    return data;
  },
  updatePost: async (
    id: string,
    postData: Omit<Post, "_id" | "createdAt" | "updatedAt">,
  ): Promise<Post> => {
    const { data } = await axios.put(`/api/posts/${id}`, postData);
    return data;
  },
  deletePost: async (id: string): Promise<void> => {
    await axios.delete(`/api/posts/${id}`);
  },
};

export default function PostManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    post: Post | null;
  }>({
    open: false,
    post: null,
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await api.getPosts();
      setPosts(data);
    } catch (err) {
      console.error("Load posts error:", err);
      toast.error("Failed to load posts");
    }
  };

  const handleCreate = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (post: Post) => {
    setDeleteDialog({ open: true, post });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.post) return;

    const deletePromise = api.deletePost(deleteDialog.post._id);

    toast.promise(deletePromise, {
      loading: "Deleting...",
      success: "Post deleted successfully!",
      error: "Failed to delete post",
    });

    try {
      await deletePromise;
      setPosts(posts.filter((p) => p._id !== deleteDialog.post!._id));
      setDeleteDialog({ open: false, post: null });
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSubmit = async (data: { title: string; content: string }) => {
    try {
      if (editingPost) {
        const updatePromise = api.updatePost(editingPost._id, data);

        toast.promise(updatePromise, {
          loading: "Updating...",
          success: "Post updated successfully!",
          error: "Failed to update post",
        });

        const updated = await updatePromise;
        setPosts(posts.map((p) => (p._id === editingPost._id ? updated : p)));
      } else {
        const createPromise = api.createPost(data);

        toast.promise(createPromise, {
          loading: "Creating...",
          success: "Post created successfully!",
          error: "Failed to create post",
        });

        const created = await createPromise;
        setPosts([created, ...posts]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Post Manager
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and organize your posts
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="cursor-pointer" onClick={handleCreate}>
            <Plus className="w-5 h-5 mr-2" />
            New Post
          </Button>
        </div>

        <div className="grid gap-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border">
              <p className="text-muted-foreground text-lg">
                No posts found. Create your first post!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onEdit={() => handleEdit(post)}
                onDelete={() => handleDeleteClick(post)}
              />
            ))
          )}
        </div>

        {isModalOpen && (
          <PostModal
            post={editingPost}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
          />
        )}

        <DeleteDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, post: null })}
          onConfirm={handleDeleteConfirm}
          title={deleteDialog.post?.title || ""}
        />
      </div>
    </div>
  );
}

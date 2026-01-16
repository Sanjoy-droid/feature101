"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useCartStore, useCartTotals } from "@/lib/store/useCartStore";
import { Product } from "@/types";
import ProductCard from "@/components/shopping/ProductCard";
import CartSidebar from "@/components/shopping/CartSidebar";
import CartBadge from "@/components/shopping/CartBadge";
import toast from "react-hot-toast";
import { Sparkles, Loader2 } from "lucide-react";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    cart,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCartStore();

  const { totalItems, subtotal, tax, total } = useCartTotals();

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    fetchCart();
  }, [fetchCart]);

  const handleSeedProducts = async () => {
    try {
      setIsLoading(true);
      await axios.post("/api/products/seed");
      const response = await axios.get("/api/products");
      setProducts(response.data);
      toast.success("Products loaded successfully!");
    } catch (error) {
      toast.error("Failed to seed products");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Zustand Store
                </h1>
                <p className="text-sm text-muted-foreground">
                  Full-Stack State Management Demo
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Badge */}
      <CartBadge count={totalItems} onClick={() => setIsCartOpen(true)} />

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Featured Products
          </h2>
          <p className="text-muted-foreground">
            Discover our collection of {products.length} premium products
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-muted rounded-full mb-4">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No products available
            </h3>
            <p className="text-muted-foreground mb-6">
              Get started by seeding some sample products
            </p>
            <button
              onClick={handleSeedProducts}
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Seed Products
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onClear={clearCart}
        subtotal={subtotal}
        tax={tax}
        total={total}
      />
    </div>
  );
}

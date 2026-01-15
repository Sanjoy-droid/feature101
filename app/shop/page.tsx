"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useCartStore } from "@/lib/store/useCartStore";
import { Product } from "@/types";
import ProductCard from "@/components/shopping/ProductCard";
import CartSidebar from "@/components/shopping/CartSidebar";
import CartBadge from "@/components/shopping/CartBadge";
import toast from "react-hot-toast";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    cart,
    totalItems,
    subtotal,
    tax,
    total,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCartStore();

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800">
            🛍️ Zustand E-Commerce
          </h1>
          <p className="text-gray-600 mt-1">
            Full-Stack Shopping Cart with MongoDB
          </p>
        </div>
      </header>

      {/* Cart Badge */}
      <CartBadge count={totalItems} onClick={() => setIsCartOpen(true)} />
      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Featured Products</h2>
          <p className="text-gray-600">{products.length} products available</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products available</p>
            <button
              onClick={async () => {
                try {
                  await axios.post("/api/products/seed");
                  toast.success("Products seeded! Refresh the page.");
                } catch (error) {
                  toast.error("Failed to seed products");
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Seed Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

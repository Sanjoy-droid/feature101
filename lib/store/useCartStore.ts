import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface CartStore {
  cart: CartItem[];
  sessionId: string;
  isLoading: boolean;

  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  // Computed values
  totalItems: number;
  subtotal: number;
  tax: number;
  total: number;
}

// Generate session ID for guest users
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      sessionId: generateSessionId(),
      isLoading: false,

      fetchCart: async () => {
        try {
          set({ isLoading: true });
          const { sessionId } = get();
          const response = await axios.get(`/api/cart?sessionId=${sessionId}`);
          set({ cart: response.data.items || [] });
        } catch (error) {
          console.error("Failed to fetch cart:", error);
          toast.error("Failed to load cart");
        } finally {
          set({ isLoading: false });
        }
      },

      addToCart: async (product: Product) => {
        try {
          const { sessionId } = get();

          const response = await axios.post("/api/cart", {
            sessionId,
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
          });

          set({ cart: response.data.items });
          toast.success(`${product.name} added to cart!`);
        } catch (error: any) {
          console.error("Failed to add to cart:", error);
          toast.error(error.response?.data?.error || "Failed to add to cart");
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        try {
          const { sessionId } = get();

          if (quantity <= 0) {
            await get().removeFromCart(productId);
            return;
          }

          const response = await axios.put("/api/cart", {
            sessionId,
            productId,
            quantity,
          });

          set({ cart: response.data.items });
        } catch (error: any) {
          console.error("Failed to update quantity:", error);
          toast.error(
            error.response?.data?.error || "Failed to update quantity",
          );
        }
      },

      removeFromCart: async (productId: string) => {
        try {
          const { sessionId } = get();

          const response = await axios.delete("/api/cart", {
            data: { sessionId, productId },
          });

          set({ cart: response.data.items });
          toast.success("Item removed from cart");
        } catch (error) {
          console.error("Failed to remove from cart:", error);
          toast.error("Failed to remove item");
        }
      },

      clearCart: async () => {
        try {
          const { sessionId } = get();

          await axios.delete(`/api/cart/clear?sessionId=${sessionId}`);
          set({ cart: [] });
          toast.success("Cart cleared");
        } catch (error) {
          console.error("Failed to clear cart:", error);
          toast.error("Failed to clear cart");
        }
      },

      get totalItems() {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },

      get subtotal() {
        return get().cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
      },

      get tax() {
        return get().subtotal * 0.08;
      },

      get total() {
        return get().subtotal + get().tax;
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ sessionId: state.sessionId }),
    },
  ),
);

import { Plus } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
      <div className="text-6xl mb-4 text-center">{product.image}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
        {product.category}
      </div>
      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
      <div className="text-sm text-gray-600 mb-4">
        Stock: {product.stock} available
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-2xl font-bold text-blue-600">
          ${product.price.toFixed(2)}
        </span>
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {product.stock === 0 ? "Out of Stock" : "Add"}
        </button>
      </div>
    </div>
  );
}

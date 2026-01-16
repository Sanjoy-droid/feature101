import { Plus, Package } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Product Image Section */}
      <div className="relative bg-muted/50 p-8 flex items-center justify-center h-48">
        <div className="text-7xl transform group-hover:scale-110 transition-transform duration-300">
          {product.image}
        </div>

        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 right-3 bg-destructive/10 text-destructive text-xs font-medium px-2.5 py-1 rounded-md">
            Out of Stock
          </div>
        )}

        {product.stock > 0 && product.stock <= 10 && (
          <div className="absolute top-3 right-3 bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 text-xs font-medium px-2.5 py-1 rounded-md">
            Only {product.stock} left
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className="p-5 space-y-3">
        {/* Category */}
        <div className="flex items-center gap-2">
          <Package className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-lg text-foreground leading-tight">
          {product.name}
        </h3>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-2xl font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-primary-foreground px-4 py-2.5 rounded-md font-medium transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

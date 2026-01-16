import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors">
      {/* Product Image */}
      <div className="flex-shrink-0 w-16 h-16 bg-background rounded-lg border border-border flex items-center justify-center">
        <span className="text-3xl">{item.image}</span>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground text-sm leading-tight mb-1">
          {item.name}
        </h4>
        <p className="text-xs text-muted-foreground mb-2">{item.category}</p>
        <p className="text-sm font-medium text-foreground">
          ${item.price.toFixed(2)}{" "}
          <span className="text-muted-foreground">each</span>
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          className="w-7 h-7 rounded-md border border-input hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="w-8 text-center font-semibold text-sm text-foreground">
          {item.quantity}
        </span>

        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          className="w-7 h-7 rounded-md border border-input hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p className="font-bold text-foreground">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.productId)}
        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
        aria-label="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

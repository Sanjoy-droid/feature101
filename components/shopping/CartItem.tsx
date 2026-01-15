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
    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
      <div className="text-4xl">{item.image}</div>
      <div className="flex-1">
        <h4 className="font-semibold">{item.name}</h4>
        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          className="p-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          className="p-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="font-bold text-lg w-20 text-right">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
      <button
        onClick={() => onRemove(item.productId)}
        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

import { ShoppingCart } from "lucide-react";

interface CartBadgeProps {
  count: number;
  onClick: () => void;
}

export default function CartBadge({ count, onClick }: CartBadgeProps) {
  console.log(count);
  return (
    <button
      onClick={onClick}
      className="fixed top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50"
    >
      <ShoppingCart className="w-6 h-6" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {count} kire
        </span>
      )}
    </button>
  );
}

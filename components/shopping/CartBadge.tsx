import { ShoppingCart } from "lucide-react";

interface CartBadgeProps {
  count: number;
  onClick: () => void;
}

export default function CartBadge({ count, onClick }: CartBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 right-6 bg-primary hover:bg-primary/90 text-primary-foreground p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 group"
      aria-label={`Shopping cart with ${count} items`}
    >
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1 shadow-md animate-in zoom-in-50 duration-200">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

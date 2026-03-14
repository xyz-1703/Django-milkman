import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { authFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const CartSidebar = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const handleCheckout = async () => {
    if (items.length === 0 || isCheckingOut) return;

    if (!isAuthenticated || !user) {
      setIsCartOpen(false);
      navigate("/login");
      return;
    }

    setCheckoutError("");
    setIsCheckingOut(true);

    const orderPayload = {
      id: `ORD-${Date.now()}`,
      total: totalPrice.toFixed(2),
      items: items.map((item) => ({
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
    };

    try {
      const response = await authFetch("/orders/", {
        method: "POST",
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        setCheckoutError("Unable to place order. Please try again.");
        return;
      }

      clearCart();
      setIsCartOpen(false);
      navigate("/orders");
    } catch {
      setCheckoutError("Unable to connect to server.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-2xl animate-slide-in-right">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-display text-lg font-semibold">Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="rounded-full p-1 hover:bg-secondary"><X className="h-5 w-5" /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button onClick={() => { setIsCartOpen(false); navigate("/products"); }}>Browse Products</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 rounded-lg border border-border bg-background p-3">
                    <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-md object-cover" />
                    <div className="flex flex-1 flex-col">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.product.unit}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="rounded bg-secondary p-1 hover:bg-muted"><Minus className="h-3 w-3" /></button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="rounded bg-secondary p-1 hover:bg-muted"><Plus className="h-3 w-3" /></button>
                        </div>
                        <p className="text-sm font-semibold">₹{item.product.price * item.quantity}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="self-start text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-border p-4">
              <div className="mb-3 flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">₹{totalPrice}</span>
              </div>
              <div className="mb-3 flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium text-primary">Free</span>
              </div>
              <div className="mb-4 flex justify-between border-t border-border pt-3">
                <span className="font-display font-semibold">Total</span>
                <span className="font-display text-lg font-bold">₹{totalPrice}</span>
              </div>
              {checkoutError && <p className="mb-3 text-sm text-destructive">{checkoutError}</p>}
              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                {isCheckingOut ? "Placing Order..." : `Checkout - ₹${totalPrice}`}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartSidebar;

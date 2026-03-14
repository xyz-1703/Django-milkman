import { useEffect, useMemo, useState } from "react";
import { Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authFetchAll, authFetch } from "@/lib/api";

type ApiOrderItem = {
  product_name: string;
  quantity: number;
};

type ApiOrder = {
  id: string;
  date: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  user_name?: string;
  user_email?: string;
  user_contact_number?: string;
  user_full_address?: string;
  items: ApiOrderItem[];
};

const DeliveryPanel = () => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      const fetchedOrders = await authFetchAll<ApiOrder>("/orders/");
      setOrders(fetchedOrders.filter((order) => order.status !== "cancelled"));
      setError("");
    } catch {
      setError("Unable to load deliveries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = window.setInterval(loadOrders, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const markDelivered = async (id: string) => {
    const response = await authFetch(`/orders/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ status: "delivered" }),
    });

    if (!response.ok) {
      setError("Unable to update delivery status.");
      return;
    }

    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status: "delivered" } : order)));
  };

  const pending = useMemo(() => orders.filter((order) => order.status === "pending" || order.status === "processing"), [orders]);
  const delivered = useMemo(() => orders.filter((order) => order.status === "delivered"), [orders]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Today's Deliveries</h1>
      <p className="mt-1 mb-6 text-muted-foreground">{pending.length} pending, {delivered.length} delivered</p>
      {loading && <div className="mb-4 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">Loading deliveries...</div>}
      {error && <div className="mb-4 rounded-xl border border-border bg-card p-4 text-sm text-destructive">{error}</div>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className={`rounded-xl border bg-card p-5 transition ${order.status === "delivered" ? "border-primary/30 bg-primary/5" : "border-border"}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold">{order.user_name || order.user_email || "Customer"}</h3>
                  <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${order.status === "delivered" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                    {order.status === "delivered" ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">📧 {order.user_email || "Not available"}</p>
                <p className="text-sm text-muted-foreground">📱 {order.user_contact_number || "Not available"}</p>
                <p className="text-sm text-muted-foreground">📍 {order.user_full_address || "Address not set"}</p>
                <p className="text-sm text-muted-foreground">📦 {order.items.map((item) => `${item.product_name} x${item.quantity}`).join(", ")}</p>
                <p className="text-xs text-muted-foreground">Order: {order.id}</p>
              </div>
              <div className="flex flex-col gap-2">
                {(order.status === "pending" || order.status === "processing") && (
                  <Button size="sm" onClick={() => markDelivered(order.id)} className="gap-1.5">
                    <Check className="h-3.5 w-3.5" /> Mark Delivered
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryPanel;

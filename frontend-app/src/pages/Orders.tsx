import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/api";

type ApiOrderItem = {
  product: string;
  product_name: string;
  quantity: number;
  price: string | number;
};

type ApiOrder = {
  id: string;
  date: string;
  total: string | number;
  status: "pending" | "processing" | "delivered" | "cancelled";
  items: ApiOrderItem[];
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const statusColors: Record<string, string> = {
  pending: "bg-accent/10 text-accent",
  processing: "bg-primary/10 text-primary",
  delivered: "bg-primary/20 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
};

const Orders = () => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await authFetch("/orders/");
        if (!response.ok) {
          setError("Unable to load orders.");
          return;
        }

        const data = (await response.json()) as ApiOrder[] | PaginatedResponse<ApiOrder>;
        const results = Array.isArray(data) ? data : data.results;
        setOrders(results || []);
      } catch {
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const normalizedOrders = useMemo(
    () =>
      orders.map((order) => ({
        ...order,
        total: Number(order.total),
        items: order.items.map((item) => ({
          ...item,
          price: Number(item.price),
        })),
      })),
    [orders],
  );

  const downloadInvoice = (orderId: string) => {
    const order = normalizedOrders.find((o) => o.id === orderId);
    if (!order) return;
    const text = `INVOICE - ${order.id}\nDate: ${order.date}\n\n${order.items.map((i) => `${i.product_name} x${i.quantity} - INR ${i.price * i.quantity}`).join("\n")}\n\nTotal: INR ${order.total}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${orderId}-invoice.txt`;
    a.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Order History</h1>
      <p className="mt-1 mb-6 text-muted-foreground">View your past orders and download invoices</p>

      {loading && <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading your orders...</div>}
      {error && !loading && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      {!loading && !error && normalizedOrders.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">No orders found for your account yet.</div>
      )}

      <div className="space-y-4">
        {normalizedOrders.map((order) => (
          <div key={order.id} className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold">{order.id}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{order.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-display text-xl font-bold">₹{order.total}</p>
                <Button variant="outline" size="sm" onClick={() => downloadInvoice(order.id)} className="gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Invoice
                </Button>
              </div>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1 text-sm">
                  <span className="text-muted-foreground">{item.product_name} x {item.quantity}</span>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

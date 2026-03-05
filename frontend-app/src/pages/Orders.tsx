import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sampleOrders } from "@/data/mockData";

const statusColors: Record<string, string> = {
  pending: "bg-accent/10 text-accent",
  processing: "bg-primary/10 text-primary",
  delivered: "bg-primary/20 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
};

const Orders = () => {
  const downloadInvoice = (orderId: string) => {
    const order = sampleOrders.find((o) => o.id === orderId);
    if (!order) return;
    const text = `INVOICE - ${order.id}\nDate: ${order.date}\n\n${order.items.map((i) => `${i.name} x${i.qty} — ₹${i.price * i.qty}`).join("\n")}\n\nTotal: ₹${order.total}`;
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

      <div className="space-y-4">
        {sampleOrders.map((order) => (
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
                  <span className="text-muted-foreground">{item.name} × {item.qty}</span>
                  <span className="font-medium">₹{item.price * item.qty}</span>
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

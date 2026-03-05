import { useState } from "react";
import { Check, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sampleDeliveries, Delivery } from "@/data/mockData";

const DeliveryPanel = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>(sampleDeliveries);
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});

  const markDelivered = (id: string) => {
    setDeliveries((prev) => prev.map((d) => d.id === id ? { ...d, status: "delivered" } : d));
  };

  const addNote = (id: string) => {
    const note = noteInput[id];
    if (!note) return;
    setDeliveries((prev) => prev.map((d) => d.id === id ? { ...d, notes: note } : d));
    setNoteInput((prev) => ({ ...prev, [id]: "" }));
  };

  const pending = deliveries.filter((d) => d.status === "pending");
  const delivered = deliveries.filter((d) => d.status === "delivered");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Today's Deliveries</h1>
      <p className="mt-1 mb-6 text-muted-foreground">{deliveries[0]?.date} — {pending.length} pending, {delivered.length} delivered</p>

      <div className="space-y-4">
        {deliveries.map((del) => (
          <div key={del.id} className={`rounded-xl border bg-card p-5 transition ${del.status === "delivered" ? "border-primary/30 bg-primary/5" : "border-border"}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold">{del.customerName}</h3>
                  <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${del.status === "delivered" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                    {del.status === "delivered" ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {del.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">📍 {del.address}</p>
                <p className="text-sm text-muted-foreground">📦 {del.items}</p>
                <p className="text-xs text-muted-foreground">Order: {del.orderId}</p>
                {del.notes && <p className="mt-2 rounded bg-secondary px-3 py-1.5 text-xs text-muted-foreground">📝 {del.notes}</p>}
              </div>
              <div className="flex flex-col gap-2">
                {del.status === "pending" && (
                  <Button size="sm" onClick={() => markDelivered(del.id)} className="gap-1.5">
                    <Check className="h-3.5 w-3.5" /> Mark Delivered
                  </Button>
                )}
                <div className="flex gap-2">
                  <input
                    placeholder="Add note..."
                    value={noteInput[del.id] || ""}
                    onChange={(e) => setNoteInput((prev) => ({ ...prev, [del.id]: e.target.value }))}
                    className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs"
                  />
                  <Button size="sm" variant="outline" onClick={() => addNote(del.id)}>
                    <MessageSquare className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryPanel;

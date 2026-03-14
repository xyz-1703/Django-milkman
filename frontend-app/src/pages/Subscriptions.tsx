import { useEffect, useState } from "react";
import { Play, Pause, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/api";
import { fetchProducts } from "@/lib/catalogApi";
import { Product } from "@/types/catalog";

interface Subscription {
  id: string;
  productName: string;
  quantity: number;
  deliveryDays: string[];
  status: "active" | "paused";
  monthlyTotal: number;
  startDate: string;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Subscriptions = () => {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [subscribableProducts, setSubscribableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newProduct, setNewProduct] = useState("");
  const [newQty, setNewQty] = useState(1);
  const [newDays, setNewDays] = useState<string[]>(["Mon", "Wed", "Fri"]);

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const [response, productsData] = await Promise.all([authFetch("/subscriptions/"), fetchProducts()]);
        const onlySubscribable = productsData.filter((product) => product.isSubscribable);
        setSubscribableProducts(onlySubscribable);
        if (!newProduct && onlySubscribable.length > 0) {
          setNewProduct(onlySubscribable[0].id);
        }

        if (!response.ok) {
          setError("Unable to load subscriptions.");
          return;
        }

        const data = await response.json();
        const rawSubs = Array.isArray(data) ? data : data.results;

        const mappedSubs: Subscription[] = (rawSubs || []).map((sub: {
          id: string;
          product_name: string;
          quantity: number;
          delivery_days: string;
          status: "active" | "paused";
          monthly_total: string | number;
          start_date: string;
        }) => ({
          id: sub.id,
          productName: sub.product_name,
          quantity: sub.quantity,
          deliveryDays: sub.delivery_days.split(",").map((d) => d.trim()).filter(Boolean),
          status: sub.status,
          monthlyTotal: Number(sub.monthly_total),
          startDate: sub.start_date,
        }));

        setSubs(mappedSubs);
      } catch {
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, []);

  const toggleStatus = async (id: string) => {
    const existing = subs.find((s) => s.id === id);
    if (!existing) return;

    const nextStatus = existing.status === "active" ? "paused" : "active";

    const response = await authFetch(`/subscriptions/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!response.ok) return;

    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, status: nextStatus } : s)));
  };

  const toggleDay = (day: string) => {
    setNewDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const addSub = async () => {
    const product = subscribableProducts.find((p) => p.id === newProduct);
    if (!product || newDays.length === 0) return;
    const monthly = product.price * newQty * newDays.length * 4;

    const newId = `SUB-${Date.now()}`;
    const startDate = new Date().toISOString().split("T")[0];

    const response = await authFetch("/subscriptions/", {
      method: "POST",
      body: JSON.stringify({
        id: newId,
        product: newProduct,
        quantity: newQty,
        delivery_days: newDays.join(","),
        monthly_total: monthly,
        start_date: startDate,
      }),
    });

    if (!response.ok) {
      setError("Unable to create subscription.");
      return;
    }

    setSubs((prev) => [
      ...prev,
      {
        id: newId,
        productName: product.name,
        quantity: newQty,
        deliveryDays: newDays,
        status: "active",
        monthlyTotal: monthly,
        startDate,
      },
    ]);
    setShowNew(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">My Subscriptions</h1>
          <p className="mt-1 text-muted-foreground">Manage your recurring dairy deliveries</p>
        </div>
        <Button onClick={() => setShowNew(!showNew)} className="gap-2"><Plus className="h-4 w-4" /> New Subscription</Button>
      </div>

      {loading && <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading your subscriptions...</div>}
      {error && !loading && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      {!loading && !error && subs.length === 0 && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">No subscriptions found for your account.</div>
      )}

      {showNew && (
        <div className="mb-8 rounded-xl border border-border bg-card p-6 animate-fade-in">
          <h3 className="mb-4 font-display text-lg font-semibold">Create Subscription</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Product</label>
              <select value={newProduct} onChange={(e) => setNewProduct(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm">
                {subscribableProducts.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — ₹{p.price}/{p.unit}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Quantity</label>
              <input type="number" min={1} value={newQty} onChange={(e) => setNewQty(Number(e.target.value))} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Delivery Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d) => (
                  <button key={d} onClick={() => toggleDay(d)} className={`rounded-full px-3 py-1 text-xs font-medium transition ${newDays.includes(d) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{d}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button onClick={addSub}>Create</Button>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {subs.map((sub) => (
          <div key={sub.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition hover:shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-semibold">{sub.productName}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sub.status === "active" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                  {sub.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Qty: {sub.quantity} • Days: {sub.deliveryDays.join(", ")}</p>
              <p className="text-xs text-muted-foreground">Since {sub.startDate}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-display text-xl font-bold">₹{sub.monthlyTotal}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <Button variant="outline" size="sm" onClick={() => toggleStatus(sub.id)} className="gap-1.5">
                {sub.status === "active" ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Play className="h-3.5 w-3.5" /> Resume</>}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;

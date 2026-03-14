import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Package, Users, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCategories, fetchProducts } from "@/lib/catalogApi";
import { Category, Product } from "@/types/catalog";
import { authFetchAll } from "@/lib/api";

type StaffOrder = {
  id: string;
  date: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  total: string | number;
  user_name?: string;
  user_email?: string;
  user_contact_number?: string;
  user_full_address?: string;
  items: Array<{ quantity: number }>;
};

const StaffDashboard = () => {
  const [tab, setTab] = useState<"products" | "categories" | "orders" | "customers">("products");
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<StaffOrder[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({ name: "", category: "", price: 0, unit: "", description: "", image: "", isSubscribable: false });

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([fetchCategories(), fetchProducts()]);
        setCategories(categoriesData);
        setProductsList(productsData);
        if (categoriesData.length > 0) {
          setFormData((prev) => ({ ...prev, category: prev.category || categoriesData[0].id }));
        }
      } catch {
        setCatalogError("Unable to load catalog data.");
      } finally {
        setLoadingCatalog(false);
      }
    };

    loadCatalog();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const fetchedOrders = await authFetchAll<StaffOrder>("/orders/");
        setOrders(fetchedOrders);
      } catch {
        setCatalogError("Unable to load order data.");
      }
    };

    loadOrders();
    const interval = window.setInterval(loadOrders, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const startAdd = () => {
    setFormData({ name: "", category: categories[0]?.id || "", price: 0, unit: "", description: "", image: "", isSubscribable: false });
    setEditingProduct(null);
    setShowForm(true);
  };

  const startEdit = (p: Product) => {
    setFormData({ name: p.name, category: p.category, price: p.price, unit: p.unit, description: p.description, image: p.image, isSubscribable: p.isSubscribable });
    setEditingProduct(p);
    setShowForm(true);
  };

  const saveProduct = () => {
    if (editingProduct) {
      setProductsList((prev) => prev.map((p) => p.id === editingProduct.id ? { ...p, ...formData } : p));
    } else {
      setProductsList((prev) => [...prev, { id: `p${Date.now()}`, ...formData, rating: 4.5, inStock: true }]);
    }
    setShowForm(false);
  };

  const deleteProduct = (id: string) => setProductsList((prev) => prev.filter((p) => p.id !== id));

  const tabs = [
    { key: "products", label: "Products", icon: Package },
    { key: "categories", label: "Categories", icon: ShoppingBag },
    { key: "orders", label: "Orders", icon: Truck },
    { key: "customers", label: "Customers", icon: Users },
  ] as const;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Staff Dashboard</h1>
      <p className="mt-1 mb-6 text-muted-foreground">Manage products, orders, and deliveries</p>
      {loadingCatalog && <p className="mb-4 text-sm text-muted-foreground">Loading catalog...</p>}
      {catalogError && !loadingCatalog && <p className="mb-4 text-sm text-destructive">{catalogError}</p>}

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Products", value: productsList.length, icon: Package },
          { label: "Categories", value: categories.length, icon: ShoppingBag },
          { label: "Orders", value: orders.length, icon: Truck },
          { label: "Deliveries Today", value: orders.filter((o) => o.status === "pending" || o.status === "processing").length, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <Icon className="mb-2 h-5 w-5 text-primary" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${tab === key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === "products" && (
        <div>
          <div className="mb-4 flex justify-end">
            <Button onClick={startAdd} className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
          </div>
          {showForm && (
            <div className="mb-6 rounded-xl border border-border bg-card p-6 animate-fade-in">
              <h3 className="mb-4 font-display font-semibold">{editingProduct ? "Edit Product" : "Add Product"}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input type="number" placeholder="Price" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                <input placeholder="Unit (e.g., 1L)" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                <input placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm md:col-span-2" />
                <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm md:col-span-2" />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.isSubscribable} onChange={(e) => setFormData({ ...formData, isSubscribable: e.target.checked })} /> Subscribable</label>
              </div>
              <div className="mt-4 flex gap-3">
                <Button onClick={saveProduct}>Save</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Unit</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {productsList.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/50">
                    <td className="flex items-center gap-3 px-4 py-3">
                      <img src={p.image} alt={p.name} className="h-10 w-10 rounded-md object-cover" />
                      <span className="font-medium">{p.name}</span>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3">₹{p.price}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.unit}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => startEdit(p)} className="mr-2 text-primary hover:text-primary/80"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => deleteProduct(p.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "categories" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <img src={cat.image} alt={cat.name} className="h-16 w-16 rounded-lg object-cover" />
              <div>
                <p className="font-semibold">{cat.name}</p>
                <p className="text-sm text-muted-foreground">{cat.description}</p>
                <p className="text-xs text-muted-foreground">{productsList.filter((p) => p.category === cat.id).length} products</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "orders" && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Address</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Items</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{o.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <p>{o.user_name || "-"}</p>
                    <p className="text-xs">{o.user_email || "-"}</p>
                    <p className="text-xs">{o.user_contact_number || "-"}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{o.user_full_address || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.items.length} items</td>
                  <td className="px-4 py-3 font-medium">₹{o.total}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "customers" && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-semibold">Customer Management</p>
          <p className="mt-1 text-sm text-muted-foreground">Connect a backend to view real customer data.</p>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;

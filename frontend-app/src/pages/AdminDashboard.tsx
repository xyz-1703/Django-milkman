import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, Users, DollarSign, TrendingUp, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/lib/catalogApi";
import { authFetchAll } from "@/lib/api";

type AdminOrder = {
  id: string;
  date: string;
  total: string | number;
  status: "pending" | "processing" | "delivered" | "cancelled";
  user_email?: string;
  user_name?: string;
  user_contact_number?: string;
  user_full_address?: string;
  items: Array<{
    quantity: number;
  }>;
};

const COLORS = ["hsl(152,45%,28%)", "hsl(36,80%,55%)", "hsl(25,30%,30%)", "hsl(152,35%,50%)", "hsl(36,60%,45%)", "hsl(200,50%,50%)", "hsl(0,50%,50%)"];

const AdminDashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [products, fetchedOrders] = await Promise.all([fetchProducts(), authFetchAll<AdminOrder>("/orders/")]);
        setProductCount(products.length);
        setOrders(fetchedOrders || []);
        setOrdersError("");
      } catch {
        setProductCount(0);
        setOrdersError("Unable to load dashboard data.");
      } finally {
        setOrdersLoading(false);
      }
    };

    loadDashboardData();
    const interval = window.setInterval(loadDashboardData, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const exportCSV = () => {
    const csv =
      "Order ID,Customer,Email,Date,Items,Total,Status\n" +
      orders
        .map((o) => `${o.id},${o.user_name || ""},${o.user_email || ""},${o.user_contact_number || ""},${o.user_full_address || ""},${o.date},${o.items?.length || 0},${o.total},${o.status}`)
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders-report.csv";
    a.click();
  };

  const normalizedOrders = orders.map((order) => ({ ...order, total: Number(order.total) }));
  const totalRevenue = normalizedOrders.reduce((sum, order) => sum + order.total, 0);
  const deliveriesPending = normalizedOrders.filter((order) => order.status === "pending" || order.status === "processing").length;

  const revenueByMonthMap = normalizedOrders.reduce<Record<string, number>>((acc, order) => {
    const key = new Date(order.date).toLocaleString("en-US", { month: "short" });
    acc[key] = (acc[key] || 0) + order.total;
    return acc;
  }, {});

  const revenueData = Object.entries(revenueByMonthMap).map(([month, revenue]) => ({ month, revenue }));

  const statusCounts = normalizedOrders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const categoryRevenueData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Overview and analytics</p>
        </div>
        <Button onClick={exportCSV} variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export CSV</Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Revenue", value: `₹${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: "text-primary" },
          { label: "Products", value: productCount, icon: ShoppingBag, color: "text-accent" },
          { label: "Orders", value: normalizedOrders.length, icon: TrendingUp, color: "text-primary" },
          { label: "Deliveries Pending", value: deliveriesPending, icon: Users, color: "text-accent" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <Icon className={`mb-2 h-5 w-5 ${color}`} />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-lg font-semibold">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-lg font-semibold">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryRevenueData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                {categoryRevenueData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Orders */}
      <div className="mt-8">
        <h3 className="mb-4 font-display text-lg font-semibold">Customer Orders</h3>
        {ordersLoading && <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">Loading orders...</div>}
        {ordersError && !ordersLoading && <div className="rounded-xl border border-border bg-card p-4 text-sm text-destructive">{ordersError}</div>}
        {!ordersLoading && !ordersError && normalizedOrders.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">No customer orders found yet.</div>
        )}
        {!ordersLoading && !ordersError && normalizedOrders.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Address</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Items</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {normalizedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{order.id}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <p>{order.user_name || "-"}</p>
                      <p className="text-xs">{order.user_email || "-"}</p>
                      <p className="text-xs">{order.user_contact_number || "-"}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{order.user_full_address || "-"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.date}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.items?.length || 0}</td>
                    <td className="px-4 py-3 font-medium">₹{order.total}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Staff Management */}
      <div className="mt-8">
        <h3 className="mb-4 font-display text-lg font-semibold">Staff Management</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">Priya Staff</td>
                <td className="px-4 py-3 text-muted-foreground">staff@dairy.com</td>
                <td className="px-4 py-3"><span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">Staff</span></td>
                <td className="px-4 py-3"><span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Active</span></td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">Admin Singh</td>
                <td className="px-4 py-3 text-muted-foreground">admin@dairy.com</td>
                <td className="px-4 py-3"><span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">Admin</span></td>
                <td className="px-4 py-3"><span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

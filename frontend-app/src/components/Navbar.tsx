import { ShoppingCart, User, LogOut, Menu, X, Milk } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "staff") return "/staff";
    return "/orders";
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Milk className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">DairyFresh</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {!isAdmin && <Link to="/" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Home</Link>}
          {!isAdmin && <Link to="/products" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Products</Link>}
          {isAuthenticated && user?.role === "customer" && (
            <>
              <Link to="/subscriptions" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Subscriptions</Link>
              <Link to="/orders" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Orders</Link>
              <Link to="/account" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Account</Link>
            </>
          )}
          {isAuthenticated && user?.role === "staff" && (
            <Link to="/account" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Account</Link>
          )}
          {isAuthenticated && (user?.role === "staff" || user?.role === "admin") && (
            <>
              <Link to="/staff" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Dashboard</Link>
              <Link to="/delivery" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Deliveries</Link>
            </>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <Link to="/admin" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">Admin</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setIsCartOpen(true)} className="relative rounded-full p-2 text-foreground transition hover:bg-secondary">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link to={getDashboardLink()} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
                <User className="h-4 w-4" />
                {user?.name}
              </Link>
              <button onClick={() => { logout(); navigate("/"); }} className="rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login">
                <Button size="sm" variant="outline">Customer Login</Button>
              </Link>
              <Link to="/admin-login">
                <Button size="sm">Admin Login</Button>
              </Link>
            </div>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-full p-2 text-foreground md:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card p-4 md:hidden">
          <div className="flex flex-col gap-3">
            {!isAdmin && <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Home</Link>}
            {!isAdmin && <Link to="/products" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Products</Link>}
            {isAuthenticated && user?.role === "customer" && (
              <>
                <Link to="/subscriptions" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Subscriptions</Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Orders</Link>
                <Link to="/account" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Account</Link>
              </>
            )}
            {isAuthenticated && user?.role === "staff" && (
              <>
                <Link to="/staff" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Dashboard</Link>
                <Link to="/delivery" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Deliveries</Link>
                <Link to="/account" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Account</Link>
              </>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <>
                <Link to="/staff" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Dashboard</Link>
                <Link to="/delivery" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Deliveries</Link>
              </>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Admin</Link>
            )}
            {isAuthenticated ? (
              <button onClick={() => { logout(); navigate("/"); setMobileOpen(false); }} className="text-left text-sm font-medium text-destructive">Logout ({user?.name})</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-primary">Customer Login</Link>
                <Link to="/admin-login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-primary">Admin Login</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

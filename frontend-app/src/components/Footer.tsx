import { Milk } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Milk className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold">DairyFresh</span>
          </div>
          <p className="text-sm text-muted-foreground">Farm-fresh dairy products delivered to your doorstep. Pure, natural, and always fresh.</p>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-semibold">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground">Products</Link>
            <Link to="/subscriptions" className="text-sm text-muted-foreground hover:text-foreground">Subscriptions</Link>
            <Link to="/orders" className="text-sm text-muted-foreground hover:text-foreground">Order History</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-semibold">Categories</h4>
          <div className="flex flex-col gap-2">
            {["Milk", "Curd", "Butter", "Paneer", "Ghee", "Cheese"].map((c) => (
              <Link key={c} to="/products" className="text-sm text-muted-foreground hover:text-foreground">{c}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-semibold">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>📍 Green Valley Farm, Countryside</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ hello@dairyfresh.com</p>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © 2026 DairyFresh. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

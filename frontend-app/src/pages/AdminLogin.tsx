import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password, "admin");
    if (success) {
      navigate("/admin");
      return;
    }

    setError("Admin credentials are invalid.");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h1 className="font-display text-3xl font-bold">Admin Login</h1>
          <p className="mt-2 text-muted-foreground">Secure portal for administrators only</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg">Sign In as Admin</Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Customer or staff user?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">Go to regular login</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

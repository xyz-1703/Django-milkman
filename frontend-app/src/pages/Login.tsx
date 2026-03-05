import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Milk } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(email, password);
    if (success) navigate("/");
    else setError("Invalid credentials. Try the demo accounts below.");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Milk className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h1 className="font-display text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your DairyFresh account</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" required />
          </div>
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" required />
          </div>
          <Button type="submit" className="w-full" size="lg">Sign In</Button>
        </form>

        <div className="mt-6 rounded-xl border border-border bg-dairy-green-light p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">Demo Accounts</p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>👤 <strong>Customer:</strong> customer@dairy.com / customer123</p>
            <p>👷 <strong>Staff:</strong> staff@dairy.com / staff123</p>
            <p>🔑 <strong>Admin:</strong> admin@dairy.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

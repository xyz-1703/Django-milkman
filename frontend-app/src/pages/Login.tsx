import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Milk } from "lucide-react";

const Login = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login, registerCustomer } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const result = await registerCustomer(name, email, password);
      if (result.success) {
        setSuccess("Account created successfully. You are now logged in.");
        navigate("/");
      } else {
        setError(result.message);
      }
      return;
    }

    const isLoggedIn = await login(email, password);
    if (isLoggedIn) navigate("/");
    else setError("Invalid credentials or server unavailable.");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Milk className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h1 className="font-display text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your DairyFresh account</p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
              setSuccess("");
            }}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
              setSuccess("");
            }}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${mode === "register" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          {success && <div className="mb-4 rounded-lg bg-primary/10 p-3 text-sm text-primary">{success}</div>}

          {mode === "register" && (
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" required />
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" required />
          </div>

          <div className={mode === "register" ? "mb-4" : "mb-6"}>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" required />
          </div>

          {mode === "register" && (
            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" required />
            </div>
          )}

          <Button type="submit" className="w-full" size="lg">{mode === "register" ? "Create Customer Account" : "Sign In"}</Button>
        </form>

        <div className="mt-6 rounded-xl border border-border bg-dairy-green-light p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">Quick Access</p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>👤 <strong>Customer:</strong> customer@dairy.com / customer123</p>
            <p>👷 <strong>Staff:</strong> staff@dairy.com / staff123</p>
            <p>
              🔑 <strong>Admin:</strong>{" "}
              <Link to="/admin-login" className="font-medium text-primary hover:underline">Use separate admin login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

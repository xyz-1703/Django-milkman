import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const Account = () => {
  const { refreshUser, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    contact_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await authFetch("/users/me/");
        if (!response.ok) {
          setError("Unable to load profile details.");
          return;
        }

        const data = await response.json();
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          contact_number: data.contact_number || "",
          address_line1: data.address_line1 || "",
          address_line2: data.address_line2 || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
        });
      } catch {
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await authFetch("/users/me/", {
        method: "PATCH",
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setError("Unable to save profile details.");
        return;
      }

      await refreshUser();
      setSuccess("Profile details saved successfully.");
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold">My Account</h1>
      <p className="mt-1 text-muted-foreground">Update your contact number and delivery address details.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 text-sm text-muted-foreground">
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading profile...</p>}
        {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        {success && <div className="mb-4 rounded-lg bg-primary/10 p-3 text-sm text-primary">{success}</div>}

        {!loading && (
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">First Name</label>
              <input value={form.first_name} onChange={(e) => handleChange("first_name", e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Last Name</label>
              <input value={form.last_name} onChange={(e) => handleChange("last_name", e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Contact Number</label>
              <input value={form.contact_number} onChange={(e) => handleChange("contact_number", e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Pincode</label>
              <input value={form.pincode} onChange={(e) => handleChange("pincode", e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Address Line 1</label>
              <input value={form.address_line1} onChange={(e) => handleChange("address_line1", e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Address Line 2</label>
              <input value={form.address_line2} onChange={(e) => handleChange("address_line2", e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">City</label>
              <input value={form.city} onChange={(e) => handleChange("city", e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">State</label>
              <input value={form.state} onChange={(e) => handleChange("state", e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Details"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Account;

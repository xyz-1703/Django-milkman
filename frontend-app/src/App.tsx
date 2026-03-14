import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Account from "./pages/Account";
import Subscriptions from "./pages/Subscriptions";
import Orders from "./pages/Orders";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DeliveryPanel from "./pages/DeliveryPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/account" element={<ProtectedRoute allowedRoles={["customer", "staff", "admin"]}><Account /></ProtectedRoute>} />
                  <Route path="/subscriptions" element={<ProtectedRoute allowedRoles={["customer"]}><Subscriptions /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute allowedRoles={["customer"]}><Orders /></ProtectedRoute>} />
                  <Route path="/staff" element={<ProtectedRoute allowedRoles={["staff", "admin"]}><StaffDashboard /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/delivery" element={<ProtectedRoute allowedRoles={["staff", "admin"]}><DeliveryPanel /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <CartSidebar />
            </div>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

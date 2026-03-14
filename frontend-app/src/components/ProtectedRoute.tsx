import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type Role = "customer" | "staff" | "admin";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    const redirectPath = location.pathname.startsWith("/admin") ? "/admin-login" : "/login";
    return <Navigate to={redirectPath} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

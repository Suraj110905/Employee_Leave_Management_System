import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

/**
 * Role-based permission routing guard.
 * Validates if the authenticated user's role falls within the allowed access scopes.
 */
export default function RoleProtectedRoute({ allowedRoles = [], children }) {
  const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userRole = user?.role || "";

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children ? children : <Outlet />;
}

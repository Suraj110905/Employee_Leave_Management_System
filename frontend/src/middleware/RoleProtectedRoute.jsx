import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";

/**
 * Role-based permission routing guard.
 * Validates if the authenticated user's role falls within the allowed access scopes.
 */
export default function RoleProtectedRoute({ allowedRoles = [], children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-primary select-none font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-xs font-semibold text-muted-foreground animate-pulse">Checking permissions...</p>
        </div>
      </div>
    );
  }

  const userRole = user?.role || "";

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children ? children : <Outlet />;
}

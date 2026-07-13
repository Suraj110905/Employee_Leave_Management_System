import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

/**
 * Route protection guard.
 * Validates session authenticity. Redirects unauthenticated sessions back to the Login screen.
 */
export default function ProtectedRoute({ children }) {
  // Read session validation token or flag
  const isAuthenticated =
    localStorage.getItem("isAuthenticated") === "true" ||
    sessionStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children ? children : <Outlet />;
}

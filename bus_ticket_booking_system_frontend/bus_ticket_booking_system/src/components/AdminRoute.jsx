import { Navigate } from "react-router-dom";

/**
 * AdminRoute — wraps a route so only ROLE_ADMIN users can access it.
 * - Not logged in  → redirect to /  (login page)
 * - Logged in but not admin → redirect to /dashboard
 * - Admin → render children
 */
function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== "ROLE_ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;

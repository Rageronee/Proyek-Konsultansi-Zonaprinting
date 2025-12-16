import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

type Props = {
  requireAdmin?: boolean;
};

const ProtectedRoute = ({ requireAdmin = false }: Props) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/cart" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;


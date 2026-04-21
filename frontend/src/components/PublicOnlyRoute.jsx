import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-status">Loading account state...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicOnlyRoute;

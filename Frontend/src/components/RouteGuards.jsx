import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function LoadingScreen() {
  return (
    <div className="state-card glass-panel">
      <h3>Loading your workspace...</h3>
      <p>Checking session and preparing the SkillUp experience.</p>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export { AdminRoute, ProtectedRoute };

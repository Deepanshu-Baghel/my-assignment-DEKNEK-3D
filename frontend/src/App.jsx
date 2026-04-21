import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/PublicOnlyRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-status">Preparing your workspace...</div>;
  }

  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

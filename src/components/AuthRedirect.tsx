import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";

/**
 * Wrapper for routes that should redirect logged-in users away.
 * - Free users (no plan)  → /pricing
 * - Paid users            → /dashboard
 * - Logged out            → render children (e.g. Home)
 */
const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { loading: accessLoading, hasActiveSubscription, isAdmin } = useFeatureAccess();

  useEffect(() => {
    if (authLoading || accessLoading) return;
    if (!user) return;
    if (isAdmin || hasActiveSubscription) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/pricing", { replace: true });
    }
  }, [user, authLoading, accessLoading, hasActiveSubscription, isAdmin, navigate]);

  if (user) return null;
  return <>{children}</>;
};

export default AuthRedirect;
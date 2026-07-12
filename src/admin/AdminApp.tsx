import { useAdminAuth } from "./AdminAuth";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";

export function AdminApp() {
  const { session, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <div className="h-12 w-12 rounded-full border-2 border-ink-700 border-t-gold-400 animate-spin" />
      </div>
    );
  }

  if (!session) return <AdminLogin />;
  return <AdminDashboard />;
}

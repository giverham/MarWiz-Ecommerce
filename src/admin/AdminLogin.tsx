import { useState } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { useAdminAuth } from "./AdminAuth";

export function AdminLogin() {
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/30">
            <Lock size={24} className="text-gold-400" />
          </div>
          <h1 className="font-display text-3xl text-ink-50">Admin Panel</h1>
          <p className="mt-2 text-sm text-ink-500">MarWiz Wears & Watches</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 border border-ink-800 bg-ink-900 p-8">
          <div>
            <label className="label-luxury">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-ink-500" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-luxury pl-7"
                placeholder="admin@marwiz.com"
              />
            </div>
          </div>
          <div>
            <label className="label-luxury">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-ink-500" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-luxury pl-7"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 px-4 py-2">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-600">
          Authorized personnel only. Create an admin account via Supabase Auth.
        </p>
      </div>
    </div>
  );
}

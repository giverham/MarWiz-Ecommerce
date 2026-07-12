import { useState, useRef } from "react";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAdminAuth } from "./AdminAuth";

export function AdminLogin() {
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setLoading(false);
  };

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 0);
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
            <label htmlFor="email" className="label-luxury">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-ink-500" />
              <input
                required
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-luxury pl-7"
                placeholder="admin@marwiz.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="label-luxury">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-ink-500" />
              <input
                required
                id="password"
                name="password"
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-luxury pl-7 pr-8"
                placeholder="••••••••"
              />
              <button
                type="button"
                onMouseDown={togglePasswordVisibility}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowPassword((prev) => !prev);
                  }
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-ink-500 hover:text-gold-400 focus:outline-none transition-colors duration-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
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

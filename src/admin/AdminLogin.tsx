import { useState, useRef, useEffect } from "react";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAdminAuth } from "./AdminAuth";
import { supabase } from "../lib/supabase";

export function AdminLogin() {
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasAdmins, setHasAdmins] = useState<boolean | null>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function checkAdmins() {
      try {
        const { data } = await supabase.rpc("has_admin_users");
        setHasAdmins(!!data);
      } catch {
        // Fallback to normal login page in case of any network/RPC error
        setHasAdmins(true);
      }
    }
    checkAdmins();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setLoading(false);
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Create the first admin user
    const { data, error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpErr) {
      setError(signUpErr.message);
      setLoading(false);
      return;
    }

    if (data?.user) {
      // Log in immediately
      const { error: signInErr } = await signIn(email, password);
      if (signInErr) {
        setError(signInErr);
      } else {
        setHasAdmins(true);
      }
    }
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
          <div className="mb-6">
            <span className="font-display text-3xl font-medium tracking-[0.15em] text-ink-50 uppercase">
              MAR<span className="text-gold-400">WIZ</span>
            </span>
          </div>
          <h1 className="font-display text-sm uppercase tracking-[0.25em] text-gold-400">
            {hasAdmins === false ? "Setup Administrator" : "Admin Login"}
          </h1>
        </div>

        <form onSubmit={hasAdmins === false ? handleSetupSubmit : handleSubmit} className="space-y-6 border border-ink-800 bg-ink-900 p-8">
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
                placeholder="Enter your email"
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
                autoComplete={hasAdmins === false ? "new-password" : "current-password"}
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
            {loading ? (hasAdmins === false ? "Setting up..." : "Signing in...") : (hasAdmins === false ? "Create Account" : "Sign In")}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}

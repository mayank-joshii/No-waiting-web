import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Shield, KeyRound, ArrowRight, Loader2 } from "lucide-react";
import { adminLogin } from "../lib/api/cms.functions";

export const Route = createFileRoute("/cms/login")({
  component: CmsLoginPage,
});

function CmsLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to /cms
    const session = sessionStorage.getItem("admin_token");
    if (session === "authenticated-admin-session") {
      navigate({ to: "/cms" });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await adminLogin({ data: { password } });
      if (result.success && result.token) {
        sessionStorage.setItem("admin_token", result.token);
        navigate({ to: "/cms" });
      } else {
        setError(result.message || "Invalid password");
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Background patterns */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute inset-0 radial-lime opacity-80" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/10 blur-3xl" />

      {/* Login Card */}
      <div className="relative w-full max-w-md animate-fade-up">
        {/* Glow behind */}
        <div className="absolute inset-0 rounded-3xl opacity-30 blur-2xl lime-gradient pointer-events-none -z-10" />

        <div className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-elev backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl lime-gradient text-ink shadow-[0_10px_40px_-10px_rgba(126,211,33,0.6)]">
              <Shield className="h-7 w-7" />
            </span>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">
              NoWaiting CMS Admin
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              Enter admin password to manage dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-ink-soft"
              >
                Password
              </label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 py-3 text-sm text-white placeholder:text-ink-soft outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/15 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive-foreground">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl lime-gradient px-5 py-3 text-sm font-semibold text-ink shadow-[0_10px_30px_-5px_rgba(126,211,33,0.4)] transition-all hover:opacity-95 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Enter Dashboard <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

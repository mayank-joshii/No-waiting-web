import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email) setDone(true);
      }}
      className={`relative w-full ${compact ? "max-w-md" : "max-w-lg"}`}
    >
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur shadow-soft focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/15 transition-all">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-ink-soft outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-xl lime-gradient px-4 sm:px-5 py-2.5 text-sm font-semibold text-ink hover:opacity-90 transition-opacity"
        >
          {done ? <><Check className="h-4 w-4" /> You're in</> : <>Notify Me <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
      <p className="mt-3 text-xs text-ink-soft">
        Be the first to know when NoWaiting launches. No spam, ever.
      </p>
    </form>
  );
}

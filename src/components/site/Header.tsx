import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Bell } from "lucide-react";
import { Logo } from "./Logo";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container-x">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-5 py-2.5 transition-all duration-300 ${
            scrolled
              ? "glass shadow-soft"
              : "bg-transparent border border-transparent"
          }`}
        >
          <Link to="/" className="group">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-3.5 py-2 text-sm text-ink-soft hover:text-white rounded-lg transition-colors"
                activeProps={{ className: "text-white" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/contact"
              className="text-sm px-4 py-2 rounded-xl text-white/85 hover:text-white border border-white/10 hover:border-white/25 transition-colors"
            >
              Partner With Us
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl lime-gradient text-ink font-semibold hover:opacity-90 transition-opacity shadow-soft"
            >
              <Bell className="h-3.5 w-3.5" />
              Notify Me
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-2 glass rounded-2xl p-3 shadow-elev animate-fade-up">
            <div className="flex flex-col">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-sm rounded-lg hover:bg-white/5 text-white/85"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 text-center text-sm px-4 py-3 rounded-xl lime-gradient text-ink font-semibold"
              >
                Notify Me
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

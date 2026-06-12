import { Link } from "@tanstack/react-router";
import { Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-white/5 bg-[#070707]">
      <div className="container-x py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Link to="/"><Logo /></Link>
            <p className="mt-5 text-sm text-ink-soft max-w-sm leading-relaxed">
              Skip the queue. Enjoy more. NoWaiting is the smarter way to discover restaurants, check live wait times, reserve tables and pre-order food.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              Launching Soon — Join the Waitlist
            </div>
            <div className="mt-6 flex items-center gap-3">
              {[Twitter, Instagram, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid place-items-center h-9 w-9 rounded-full bg-white/5 border border-white/5 hover:bg-primary/15 hover:border-primary/40 hover:text-primary transition-all"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Product" links={[["Home", "/"], ["Services", "/services"], ["Blog", "/blog"]]} />
          <FooterCol title="Company" links={[["About", "/about"], ["Contact", "/contact"], ["Partner With Us", "/contact"]]} />
          <FooterCol title="Legal" links={[["Privacy", "/about"], ["Terms", "/about"], ["Security", "/about"]]} />
        </div>

        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-soft">
          <p>© {new Date().getFullYear()} NoWaiting. All rights reserved.</p>
          <p>Skip the Queue. Enjoy More.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="text-sm text-ink-soft hover:text-primary transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

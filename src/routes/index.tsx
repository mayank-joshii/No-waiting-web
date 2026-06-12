import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  CalendarCheck,
  Clock3,
  Compass,
  Download,
  Search,
  ShoppingBag,
  Smile,
  Sparkles,
  Store,
  Timer,
  TrendingUp,
  Users,
  Utensils,
  Zap,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { Eyebrow, SectionHeading, Section } from "../components/site/Section";
import { WaitlistForm } from "../components/site/WaitlistForm";
import appScreens from "../assets/app-screens.asset.json";
import appBanner from "../assets/app-banner.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NoWaiting — Skip the Queue. Enjoy More." },
      {
        name: "description",
        content:
          "NoWaiting is launching soon — discover restaurants, see live wait times, join virtual queues, reserve tables and pre-order food. Join the waitlist.",
      },
      { property: "og:title", content: "NoWaiting — Skip the Queue. Enjoy More." },
      {
        property: "og:description",
        content: "The smarter way to dine out — launching soon. Join the waitlist.",
      },
      { property: "og:url", content: "/" },
      { property: "og:image", content: appBanner.url },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Services />
      <HowItWorks />
      <AppShowcase />
      <Partners />
      <Waitlist />
    </>
  );
}

/* ---------------- APP SHOWCASE BILLBOARD ---------------- */
function AppShowcase() {
  return (
    <Section className="relative overflow-hidden py-12 sm:py-16">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 radial-lime opacity-40" />
      
      <div className="container-x relative">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-1.5 sm:p-2.5 shadow-elev group hover:border-primary/30 transition-all duration-500">
          <div className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-700"
               style={{ background: "radial-gradient(800px circle at 50% 50%, rgba(126,211,33,0.08), transparent 70%)" }} />
          
          {/* Glowing image container */}
          <div className="rounded-[2.25rem] overflow-hidden bg-black/40 border border-white/5">
            <img
              src="/hero_banner.jpg"
              alt="NoWaiting App Features - Real-time wait times, table reservations, pre-order food, and scheduled takeaways"
              className="w-full h-auto select-none object-cover transform scale-100 group-hover:scale-[1.01] transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- HERO ---------------- */
function PhoneMockup({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`aspect-[9/19.2] rounded-[2.2rem] border-[7px] border-zinc-900 bg-zinc-950 shadow-2xl overflow-hidden group select-none transition-all duration-500 ease-out ${className}`}>
      {/* Speaker notch / Dynamic Island */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-zinc-900 rounded-full z-20 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 absolute right-2" />
      </div>
      {/* Screen Glass Reflection Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-60 group-hover:opacity-20 transition-opacity duration-500" />
      {/* Inner Screen */}
      <div className="w-full h-full relative z-0 bg-neutral-900">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-top opacity-95 group-hover:opacity-100 transition-all duration-500"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-24 sm:pt-16 sm:pb-32">
      {/* Backdrops */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none absolute inset-0 radial-lime" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/10 blur-3xl" />

      <div className="container-x relative">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
          {/* Copy */}
          <div className="animate-fade-up order-2 lg:order-1">
            <Eyebrow>🚀 Launching Soon</Eyebrow>
            <h1 className="mt-6 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.02]">
              <span className="text-gradient">Skip the Queue.</span>
              <br />
              <span className="text-lime-gradient">Enjoy More.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-soft leading-relaxed">
              The smarter way to discover restaurants, check live wait times,
              reserve tables and enjoy a seamless dining experience —
              all in one beautiful app.
            </p>

            <div className="mt-8">
              <WaitlistForm />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                disabled
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-ink-soft cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                Download App
                <span className="ml-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  Coming Soon
                </span>
              </button>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                <Store className="h-4 w-4 text-primary" />
                Partner With Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { k: "Live", v: "Wait Times" },
                { k: "1-Tap", v: "Reservations" },
                { k: "Real-Time", v: "Updates" },
              ].map((s) => (
                <div key={s.k} className="border-l border-white/10 pl-3">
                  <p className="text-lg font-semibold text-primary">{s.k}</p>
                  <p className="text-xs text-ink-soft mt-1">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Phone collage */}
          <div className="relative h-[560px] sm:h-[640px] animate-fade-up order-1 lg:order-2">
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative w-full max-w-[480px] h-full">
                {/* Glow */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full bg-primary/25 blur-[100px]" />
                
                {/* Overlapping Phones container */}
                <div className="absolute inset-0 flex items-center justify-center animate-float-slow">
                  {/* Left Phone */}
                  <PhoneMockup
                    src="/restaurant_list.jpg"
                    alt="NoWaiting Restaurant List Screen"
                    className="absolute left-0 top-[15%] w-[42%] -rotate-6 z-10 hover:z-30 hover:-translate-y-4 hover:rotate-0 hover:scale-105"
                  />
                  {/* Right Phone */}
                  <PhoneMockup
                    src="/order_tracking.jpg"
                    alt="NoWaiting Order Tracking Screen"
                    className="absolute right-0 top-[15%] w-[42%] rotate-6 z-10 hover:z-30 hover:-translate-y-4 hover:rotate-0 hover:scale-105"
                  />
                  {/* Center Phone (Front) */}
                  <PhoneMockup
                    src="/logo_splash.jpg"
                    alt="NoWaiting App Splash Screen"
                    className="absolute left-[27%] top-[8%] w-[46%] z-20 border-[8px] hover:z-30 hover:-translate-y-4 hover:scale-[1.03] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)]"
                  />
                </div>

                {/* Floating chips */}
                <FloatingChip className="left-[-20px] top-12 animate-float z-30" icon={<Timer className="h-3.5 w-3.5" />} label="15 mins wait" tone="lime" />
                <FloatingChip className="right-[-20px] top-24 animate-float-delayed z-30" icon={<CalendarCheck className="h-3.5 w-3.5" />} label="Booked · 8:00 PM" />
                <FloatingChip className="left-[-10px] bottom-32 animate-float-delayed z-30" icon={<Bell className="h-3.5 w-3.5" />} label="Table ready soon" />
                <FloatingChip className="right-[-10px] bottom-20 animate-float z-30" icon={<ShoppingBag className="h-3.5 w-3.5" />} label="Pre-order placed" tone="lime" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingChip({
  className = "",
  icon,
  label,
  tone = "dark",
}: {
  className?: string;
  icon: React.ReactNode;
  label: string;
  tone?: "dark" | "lime";
}) {
  return (
    <div
      className={`absolute z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shadow-elev ${
        tone === "lime"
          ? "lime-gradient text-ink"
          : "glass-card text-white"
      } ${className}`}
    >
      <span className={tone === "lime" ? "text-ink" : "text-primary"}>{icon}</span>
      {label}
    </div>
  );
}

/* ---------------- TRUST BAR ---------------- */
function SocialProof() {
  const items = [
    { icon: ShieldCheck, label: "Verified Restaurants" },
    { icon: Zap, label: "Secure Payments" },
    { icon: Sparkles, label: "Best Dining Experience" },
    { icon: Smile, label: "Made for Foodies" },
  ];
  return (
    <section className="border-y border-white/5 bg-white/[0.015]">
      <div className="container-x py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-3 text-sm text-ink-soft">
            <span className="grid place-items-center h-9 w-9 rounded-xl border border-primary/30 bg-primary/10">
              <i.icon className="h-4 w-4 text-primary" />
            </span>
            <span className="font-medium text-white/85">{i.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- SERVICES ---------------- */
const SERVICES = [
  { icon: Compass, title: "Restaurant Discovery", desc: "Find the best places near you with curated lists, ratings and cuisines." },
  { icon: Clock3, title: "Live Wait Times", desc: "See real-time wait times for every restaurant before you head out." },
  { icon: Users, title: "Virtual Queue", desc: "Join a queue from anywhere. Show up right when your table is ready." },
  { icon: CalendarCheck, title: "Table Reservations", desc: "Book your perfect table in seconds — date, time, party size, preferences." },
  { icon: Utensils, title: "Pre-Order Food", desc: "Order ahead so your meal arrives shortly after you sit down." },
  { icon: ShoppingBag, title: "Takeaway Scheduling", desc: "Schedule pickup at the exact time you need — never wait again." },
  { icon: Bell, title: "Real-Time Notifications", desc: "Stay in the loop with smart alerts on bookings, queue and orders." },
  { icon: BarChart3, title: "Smarter Dining", desc: "Personal recommendations that learn from your taste over time." },
];

function Services() {
  return (
    <Section>
      <div className="container-x">
        <SectionHeading
          eyebrow="What we're building"
          title={<>Everything you need <span className="text-lime-gradient">to dine smarter.</span></>}
          subtitle="A complete platform for restaurants and diners — launching soon, free for users on day one."
        />

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="group relative rounded-3xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent p-6 hover:border-primary/40 transition-colors animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                   style={{ background: "radial-gradient(400px circle at 50% 0%, rgba(126,211,33,0.10), transparent 60%)" }} />
              <span className="grid place-items-center h-11 w-11 rounded-2xl border border-primary/30 bg-primary/10 text-primary group-hover:lime-gradient group-hover:text-ink transition-all">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */
function HowItWorks() {
  const steps = [
    { icon: Search, title: "Discover", desc: "Browse curated restaurants near you with live wait times." },
    { icon: CalendarCheck, title: "Reserve", desc: "Book a table, join a queue or pre-order your meal in one tap." },
    { icon: Smile, title: "Enjoy", desc: "Arrive right on time, sit down and let the good times begin." },
  ];
  return (
    <Section className="relative">
      <div className="absolute inset-0 pointer-events-none radial-lime opacity-50" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="How it works"
          title={<>Three steps. <span className="text-lime-gradient">Zero wait.</span></>}
        />
        <div className="mt-16 grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute left-0 right-0 top-12 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-3xl border border-white/8 bg-white/[0.025] p-8 text-center">
              <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl lime-gradient text-ink shadow-[0_10px_40px_-10px_rgba(126,211,33,0.6)]">
                <s.icon className="h-6 w-6" />
              </span>
              <div className="mt-4 text-xs font-semibold tracking-widest uppercase text-primary">
                Step 0{i + 1}
              </div>
              <h3 className="mt-2 text-2xl font-semibold text-white">{s.title}</h3>
              <p className="mt-3 text-sm text-ink-soft">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------------- PARTNERS ---------------- */
function Partners() {
  const benefits = [
    { icon: TrendingUp, title: "Reduce queue congestion", desc: "Smarter flow management = happier guests, fewer walk-aways." },
    { icon: Smile, title: "Better customer experience", desc: "Real-time updates keep diners informed and on time." },
    { icon: Zap, title: "Operational efficiency", desc: "Less manual coordination. More turning tables." },
    { icon: BarChart3, title: "Analytics & insights", desc: "Understand peak times, customer flow and opportunities." },
  ];
  return (
    <Section className="relative overflow-hidden">
      <div className="container-x relative">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 items-center">
          <div>
            <Eyebrow>For Restaurants</Eyebrow>
            <h2 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-gradient">
              Fill more tables. <br />
              <span className="text-lime-gradient">Stress less.</span>
            </h2>
            <p className="mt-5 text-lg text-ink-soft max-w-lg">
              NoWaiting helps your restaurant manage queues, reservations and pre-orders in one elegant dashboard — built for the way modern teams actually work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-2xl lime-gradient px-5 py-3 text-sm font-semibold text-ink hover:opacity-90 transition-opacity"
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Explore Services
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className="rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.05] to-transparent p-6 hover:border-primary/40 transition-colors animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="grid place-items-center h-10 w-10 rounded-xl border border-primary/30 bg-primary/10 text-primary">
                  <b.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">{b.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- WAITLIST ---------------- */
function Waitlist() {
  return (
    <Section className="relative">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-[#0E0E0E] p-10 sm:p-16 text-center">
          <div className="absolute inset-0 pointer-events-none radial-lime opacity-90" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-primary/20 blur-[100px]" />
          <div className="relative">
            <Eyebrow>Early Access</Eyebrow>
            <h2 className="mt-5 text-4xl sm:text-6xl font-semibold tracking-tight text-gradient">
              Join the <span className="text-lime-gradient">Waitlist.</span>
            </h2>
            <p className="mt-5 text-lg text-ink-soft max-w-xl mx-auto">
              Be the first to know when NoWaiting launches in your city. Early members get priority access and exclusive perks.
            </p>
            <div className="mt-8 flex justify-center">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

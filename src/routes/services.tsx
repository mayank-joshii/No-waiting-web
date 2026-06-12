import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Compass,
  ShoppingBag,
  Users,
  Utensils,
} from "lucide-react";
import { Eyebrow, SectionHeading, Section } from "../components/site/Section";
import { WaitlistForm } from "../components/site/WaitlistForm";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — NoWaiting" },
      { name: "description", content: "Explore every capability — discovery, live wait times, virtual queues, reservations, pre-orders, takeaways and analytics." },
      { property: "og:title", content: "Services — NoWaiting" },
      { property: "og:description", content: "Everything NoWaiting will offer at launch." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

type Svc = {
  icon: typeof Compass;
  title: string;
  tagline: string;
  bullets: string[];
  useCase: string;
  image: string;
};

const SERVICES: Svc[] = [
  {
    icon: Compass,
    title: "Restaurant Discovery",
    tagline: "Find your next favorite — not just another place to eat.",
    bullets: ["Curated lists by cuisine, mood and neighborhood", "Personalized recommendations", "Verified ratings and reviews"],
    useCase: "Date night? Birthday dinner? Quick lunch? Discovery surfaces the right place instantly.",
    image: "/restaurant_list.jpg",
  },
  {
    icon: Clock3,
    title: "Live Wait Times",
    tagline: "Know before you go.",
    bullets: ["Real-time wait estimates", "Updated by restaurants and predictive models", "Filter by max wait"],
    useCase: "Skip the restaurants with a 45-minute line and find the great spot 5 minutes away.",
    image: "/restaurant_detail.jpg",
  },
  {
    icon: Users,
    title: "Virtual Queue Management",
    tagline: "Join the line — without standing in it.",
    bullets: ["Get a token from anywhere", "Track your position in real time", "Smart ‘ready soon' notifications"],
    useCase: "Add yourself to the queue, walk around, and arrive right as your table opens up.",
    image: "/order_tracking.jpg",
  },
  {
    icon: CalendarCheck,
    title: "Table Reservations",
    tagline: "Book the perfect table in seconds.",
    bullets: ["Choose date, time, guests, seating", "Special requests supported", "Modify or cancel anytime"],
    useCase: "Confirm your evening before lunch and forget about it until it's time to eat.",
    image: "/book_table.jpg",
  },
  {
    icon: Utensils,
    title: "Pre-Order Food",
    tagline: "Your meal, ready when you sit down.",
    bullets: ["Browse the menu in advance", "Customize and split items", "Sync with your reservation"],
    useCase: "Short on time? Pre-order so your food arrives moments after you do.",
    image: "/restaurant_detail.jpg",
  },
  {
    icon: ShoppingBag,
    title: "Takeaway Scheduling",
    tagline: "Pick up exactly when you need to.",
    bullets: ["Pick the right pickup window", "Live order tracking", "Skip the counter line"],
    useCase: "Schedule lunch for 12:35 sharp and walk in for a 30-second pickup.",
    image: "/takeaway_order.jpg",
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    tagline: "Always in the loop.",
    bullets: ["Queue updates", "Reservation reminders", "Order status alerts"],
    useCase: "Get pinged the moment your table is ready or your food is on the way out.",
    image: "/order_tracking.jpg",
  },
];

function PhoneFrame({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full max-w-[280px] mx-auto aspect-[9/19.2] rounded-[2.2rem] border-[8px] border-zinc-900 bg-zinc-950 shadow-2xl overflow-hidden group select-none transition-all duration-500 ease-out hover:border-primary/40 ${className}`}>
      {/* Speaker notch / Dynamic Island */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-zinc-900 rounded-full z-20 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 absolute right-2" />
      </div>
      {/* Screen Glass Reflection Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-40 group-hover:opacity-10 transition-opacity duration-500" />
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

function ServicesPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 radial-lime opacity-60" />
        <div className="container-x relative text-center">
          <Eyebrow>Services</Eyebrow>
          <h1 className="mt-6 text-5xl sm:text-7xl font-bold tracking-tight">
            <span className="text-gradient">One app.</span><br />
            <span className="text-lime-gradient">Seven superpowers.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-ink-soft">
            Everything NoWaiting will offer at launch — for diners and for restaurants.
            All in one beautifully crafted experience.
          </p>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="container-x space-y-16">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="relative rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.05] to-transparent p-8 overflow-hidden flex items-center justify-center">
                <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />
                <PhoneFrame src={s.image} alt={`${s.title} preview`} />
              </div>

              <div>
                <span className="grid place-items-center h-12 w-12 rounded-2xl lime-gradient text-ink">
                  <s.icon className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                  {s.title}
                </h2>
                <p className="mt-3 text-lg text-primary/90">{s.tagline}</p>
                <ul className="mt-5 space-y-2.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-white/85">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.025] p-4 text-sm text-ink-soft">
                  <span className="text-xs uppercase tracking-widest text-primary font-semibold">Use case</span>
                  <p className="mt-1.5">{s.useCase}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-[#0E0E0E] p-10 sm:p-14 text-center">
            <div className="absolute inset-0 radial-lime opacity-80" />
            <div className="relative">
              <Eyebrow>Launching Soon</Eyebrow>
              <h2 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-gradient">
                Get early access.
              </h2>
              <p className="mt-4 text-ink-soft max-w-lg mx-auto">
                Sign up to be notified the moment NoWaiting goes live in your city.
              </p>
              <div className="mt-7 flex justify-center"><WaitlistForm /></div>
              <Link to="/contact" className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                Restaurant owner? Partner with us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

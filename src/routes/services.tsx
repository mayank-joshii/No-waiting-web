import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { Eyebrow, SectionHeading, Section } from "../components/site/Section";
import { WaitlistForm } from "../components/site/WaitlistForm";
import { getPublicServicesList } from "../lib/api/cms.functions";

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
  loader: async () => {
    return {
      servicesList: await getPublicServicesList(),
    };
  },
  component: ServicesPage,
});

function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent className={className} />;
}

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
  const { servicesList } = Route.useLoaderData();

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
          {servicesList.map((s: any, i: number) => {
            const imgSrc = s.imageUrl || s.imagePath || "";
            return (
              <div
                key={s.title}
                className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                <div className="relative rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.05] to-transparent p-8 overflow-hidden flex items-center justify-center">
                  <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />
                  <PhoneFrame src={imgSrc} alt={`${s.title} preview`} />
                </div>

                <div>
                  <span className="grid place-items-center h-12 w-12 rounded-2xl lime-gradient text-ink">
                    <ServiceIcon name={s.icon} className="h-6 w-6" />
                  </span>
                  <h2 className="mt-5 text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                    {s.title}
                  </h2>
                  <p className="mt-3 text-lg text-primary/90">{s.tagline}</p>
                  <ul className="mt-5 space-y-2.5">
                    {(s.bullets || []).map((b: string) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-white/85">
                        <Icons.CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
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
            );
          })}
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
                Restaurant owner? Partner with us <Icons.ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

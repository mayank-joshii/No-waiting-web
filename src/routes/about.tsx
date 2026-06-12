import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Rocket, Target, Sparkles, CheckCircle2 } from "lucide-react";
import { Eyebrow, SectionHeading, Section } from "../components/site/Section";
import { WaitlistForm } from "../components/site/WaitlistForm";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — NoWaiting" },
      { name: "description", content: "Our mission, vision and the story behind NoWaiting — a smarter way to dine out, launching soon." },
      { property: "og:title", content: "About — NoWaiting" },
      { property: "og:description", content: "Why we're building NoWaiting and what's coming." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});


function AboutPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 radial-lime opacity-60" />
        <div className="container-x relative text-center">
          <Eyebrow>Our Story</Eyebrow>
          <h1 className="mt-6 text-5xl sm:text-7xl font-bold tracking-tight">
            <span className="text-gradient">Built for diners.</span><br />
            <span className="text-lime-gradient">Designed for restaurants.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-ink-soft">
            We started NoWaiting with one question — why are we still standing in lines for dinner? Today, we're building the modern dining infrastructure that makes waiting a thing of the past.
          </p>
        </div>
      </Section>

      {/* Mission / Vision */}
      <Section className="pt-0">
        <div className="container-x grid md:grid-cols-2 gap-6">
          {[
            { icon: Target, title: "Mission", body: "Eliminate friction between people and the food they love by making every dining decision instant, informed and effortless." },
            { icon: Rocket, title: "Vision", body: "A world where no one waits in a queue — where every meal feels intentional, every reservation is seamless, and every restaurant runs smarter." },
          ].map((c) => (
            <div key={c.title} className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.05] to-transparent p-10">
              <span className="grid place-items-center h-12 w-12 rounded-2xl lime-gradient text-ink">
                <c.icon className="h-6 w-6" />
              </span>
              <h2 className="mt-6 text-3xl font-semibold text-white">{c.title}</h2>
              <p className="mt-3 text-base text-ink-soft leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* The problem */}
      <Section>
        <div className="container-x grid lg:grid-cols-[1fr_1.2fr] gap-14 items-start">
          <div>
            <Eyebrow>The Problem</Eyebrow>
            <h2 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-gradient">
              Dining out shouldn't <br /><span className="text-lime-gradient">feel like a guessing game.</span>
            </h2>
          </div>
          <div className="space-y-4">
            {[
              "You drive across town only to find a 45-minute wait.",
              "You call ahead — no one picks up. You walk in — the host can't say when you'll sit.",
              "Restaurants lose 20%+ of their potential covers to walk-aways and miscommunication.",
              "Diners and operators both lose. That's the system we're rebuilding.",
            ].map((p, i) => (
              <div key={i} className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <span className="mt-0.5 grid place-items-center h-7 w-7 shrink-0 rounded-full bg-primary/15 text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <p className="text-base text-white/85 leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Why */}
      <Section className="relative overflow-hidden">
        <div className="container-x">
          <SectionHeading
            eyebrow="Why NoWaiting"
            title={<>Because your time <span className="text-lime-gradient">is precious.</span></>}
            subtitle="Every minute spent in a queue is a minute not spent enjoying your meal, your company, or your evening. We're here to give that time back."
          />
          <div className="mt-14 grid md:grid-cols-3 gap-5">
            {[
              { icon: Heart, title: "Built with care", desc: "Designed in collaboration with chefs, hosts and frequent diners." },
              { icon: Rocket, title: "Engineered to scale", desc: "Real-time infrastructure powering thousands of decisions per minute." },
              { icon: CheckCircle2, title: "Restaurant-first", desc: "Tools restaurants actually want to use — not bolt-on noise." },
            ].map((c) => (
              <div key={c.title} className="rounded-3xl border border-white/8 bg-white/[0.025] p-7">
                <span className="grid place-items-center h-11 w-11 rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{c.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>


      {/* CTA */}
      <Section className="pt-0">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-[#0E0E0E] p-10 sm:p-14 text-center">
            <div className="absolute inset-0 radial-lime opacity-80" />
            <div className="relative">
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-gradient">
                Join the journey.
              </h2>
              <p className="mt-4 text-ink-soft max-w-lg mx-auto">
                Sign up for early access and be the first to experience NoWaiting.
              </p>
              <div className="mt-7 flex justify-center"><WaitlistForm /></div>
              <Link to="/contact" className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                Or get in touch <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Rocket, Target, Sparkles, CheckCircle2 } from "lucide-react";
import { Eyebrow, SectionHeading, Section } from "../components/site/Section";
import { WaitlistForm } from "../components/site/WaitlistForm";
import { urlFor } from "../lib/sanity";
import { getPublicAboutSettings } from "../lib/api/cms.functions";

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
  loader: async () => {
    return {
      aboutSettings: await getPublicAboutSettings(),
    };
  },
  component: AboutPage,
});

function AboutPage() {
  const { aboutSettings } = Route.useLoaderData();

  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 radial-lime opacity-60" />
        <div className="container-x relative text-center">
          <Eyebrow>{aboutSettings.eyebrow}</Eyebrow>
          <h1 className="mt-6 text-5xl sm:text-7xl font-bold tracking-tight">
            <span className="text-gradient">{aboutSettings.titleLine1}</span><br />
            <span className="text-lime-gradient">{aboutSettings.titleLine2}</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-ink-soft leading-relaxed">
            {aboutSettings.description}
          </p>
        </div>
      </Section>

      {/* Illustrative image from Sanity */}
      {aboutSettings.aboutImage && urlFor(aboutSettings.aboutImage) && (
        <Section className="pt-0 pb-16">
          <div className="container-x">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 aspect-[16/9] w-full max-w-4xl mx-auto shadow-elev group hover:border-primary/20 transition-colors duration-500">
              <img
                src={urlFor(aboutSettings.aboutImage)!.url()}
                alt="Our Story"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
          </div>
        </Section>
      )}

      {/* Mission / Vision */}
      <Section className="pt-0">
        <div className="container-x grid md:grid-cols-2 gap-6">
          {[
            { icon: Target, title: aboutSettings.missionTitle, body: aboutSettings.missionBody },
            { icon: Rocket, title: aboutSettings.visionTitle, body: aboutSettings.visionBody },
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
            <Eyebrow>{aboutSettings.problemEyebrow}</Eyebrow>
            <h2 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-gradient leading-tight">
              {aboutSettings.problemTitleLine1} <br />
              <span className="text-lime-gradient">{aboutSettings.problemTitleLine2}</span>
            </h2>
          </div>
          <div className="space-y-4">
            {aboutSettings.problemItems.map((p: string, i: number) => (
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
            eyebrow={aboutSettings.whyEyebrow}
            title={<>{aboutSettings.whyTitleLine1} <span className="text-lime-gradient">{aboutSettings.whyTitleLine2}</span></>}
            subtitle={aboutSettings.whyDescription}
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

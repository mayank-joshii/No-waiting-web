import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Search, Mail } from "lucide-react";
import { Eyebrow, SectionHeading, Section } from "../components/site/Section";
import { WaitlistForm } from "../components/site/WaitlistForm";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — NoWaiting" },
      { name: "description", content: "Insights on restaurant technology, dining tips, queue management, hospitality and food trends." },
      { property: "og:title", content: "Blog — NoWaiting" },
      { property: "og:description", content: "Stories and insights from the NoWaiting team." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

const CATEGORIES = [
  "All",
  "Restaurant Technology",
  "Dining Tips",
  "Queue Management",
  "Hospitality Industry",
  "Food Trends",
] as const;

type Post = {
  title: string;
  excerpt: string;
  category: (typeof CATEGORIES)[number];
  date: string;
  read: string;
  featured?: boolean;
};

const POSTS: Post[] = [
  {
    title: "Why virtual queues are the future of dining out",
    excerpt: "How restaurants are using virtual queues to reduce walk-aways, boost reviews and turn more tables — without the chaos.",
    category: "Queue Management",
    date: "May 28, 2026",
    read: "6 min",
    featured: true,
  },
  {
    title: "5 ways to make your reservation feel personal again",
    excerpt: "From special requests to thoughtful follow-ups — small touches restaurants can use to turn diners into regulars.",
    category: "Hospitality Industry",
    date: "May 18, 2026",
    read: "4 min",
  },
  {
    title: "Pre-ordering: the underrated growth lever for restaurants",
    excerpt: "Why pre-orders quietly improve speed of service, kitchen flow and per-cover revenue at the same time.",
    category: "Restaurant Technology",
    date: "May 9, 2026",
    read: "5 min",
  },
  {
    title: "Dining smarter in a busy city — a frequent diner's playbook",
    excerpt: "Practical tips for getting into the restaurants you actually want, without burning your evening on logistics.",
    category: "Dining Tips",
    date: "Apr 30, 2026",
    read: "3 min",
  },
  {
    title: "Inside the modern restaurant tech stack",
    excerpt: "POS, reservations, kitchen displays, payments — and the connective tissue that ties them together.",
    category: "Restaurant Technology",
    date: "Apr 22, 2026",
    read: "7 min",
  },
  {
    title: "Where the food world is heading in 2026",
    excerpt: "Chef-led ghost kitchens, single-dish concepts, and the slow comeback of the neighborhood spot.",
    category: "Food Trends",
    date: "Apr 12, 2026",
    read: "5 min",
  },
];

function BlogPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");

  const featured = POSTS.find((p) => p.featured)!;
  const rest = POSTS.filter((p) => !p.featured);
  const filtered = useMemo(() => {
    return rest.filter((p) => {
      const matchCat = cat === "All" || p.category === cat;
      const s = q.trim().toLowerCase();
      const matchQ = !s || p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s);
      return matchCat && matchQ;
    });
  }, [q, cat, rest]);

  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 radial-lime opacity-60" />
        <div className="container-x relative text-center">
          <Eyebrow>The NoWaiting Blog</Eyebrow>
          <h1 className="mt-6 text-5xl sm:text-7xl font-bold tracking-tight">
            <span className="text-gradient">Ideas worth</span> <span className="text-lime-gradient">savoring.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-ink-soft">
            Insights on restaurant tech, dining tips, queue management, hospitality and food trends.
          </p>
          <div className="mt-10 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-ink-soft focus:border-primary/60 focus:ring-4 focus:ring-primary/15 outline-none transition-all"
            />
          </div>
        </div>
      </Section>

      {/* Featured */}
      <Section className="pt-0">
        <div className="container-x">
          <a className="group relative grid lg:grid-cols-[1.2fr_1fr] gap-8 rounded-[2rem] border border-white/8 bg-gradient-to-br from-white/[0.05] to-transparent p-6 sm:p-10 overflow-hidden hover:border-primary/40 transition-colors cursor-pointer">
            <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                Featured · {featured.category}
              </div>
              <h2 className="mt-5 text-3xl sm:text-5xl font-semibold tracking-tight text-gradient leading-tight">
                {featured.title}
              </h2>
              <p className="mt-5 text-lg text-ink-soft max-w-xl">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-sm text-ink-soft">
                <span>{featured.date}</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span>{featured.read} read</span>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
            <div className="relative aspect-[5/4] rounded-2xl overflow-hidden border border-white/10 bg-[#0E0E0E]">
              <div className="absolute inset-0 lime-gradient opacity-20" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="h-32 w-32 rounded-3xl lime-gradient flex items-center justify-center text-ink text-5xl font-black shadow-[0_20px_60px_-10px_rgba(126,211,33,0.6)]">
                  NW
                </div>
              </div>
            </div>
          </a>
        </div>
      </Section>

      {/* Categories */}
      <Section className="pt-0">
        <div className="container-x">
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm border transition-all ${
                  cat === c
                    ? "lime-gradient text-ink border-primary"
                    : "border-white/10 bg-white/[0.04] text-white/85 hover:border-white/25"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <a
                key={p.title}
                className="group rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent p-6 hover:border-primary/40 transition-colors cursor-pointer flex flex-col"
              >
                <div className="aspect-[16/10] rounded-2xl bg-[#0E0E0E] border border-white/8 mb-5 relative overflow-hidden">
                  <div className="absolute inset-0 radial-lime opacity-50" />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="h-16 w-16 rounded-2xl lime-gradient grid place-items-center text-ink font-bold text-xl">
                      NW
                    </div>
                  </div>
                </div>
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">{p.category}</div>
                <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-ink-soft flex-1">{p.excerpt}</p>
                <div className="mt-5 flex items-center justify-between text-xs text-ink-soft">
                  <span>{p.date}</span>
                  <span>{p.read} read</span>
                </div>
              </a>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-ink-soft py-10">
                No articles match your search yet.
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Newsletter */}
      <Section className="pt-0">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-[#0E0E0E] p-10 sm:p-14 grid md:grid-cols-2 gap-10 items-center">
            <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <span className="grid place-items-center h-12 w-12 rounded-2xl lime-gradient text-ink">
                <Mail className="h-6 w-6" />
              </span>
              <SectionHeading
                align="left"
                eyebrow="Newsletter"
                title={<>The dining brief. <span className="text-lime-gradient">Once a week.</span></>}
                subtitle="Subscribe for the best from our blog, plus early access to NoWaiting when we launch."
              />
            </div>
            <div className="relative"><WaitlistForm /></div>
          </div>
        </div>
      </Section>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Search, Mail, X } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { Eyebrow, SectionHeading, Section } from "../components/site/Section";
import { WaitlistForm } from "../components/site/WaitlistForm";
import { urlFor } from "../lib/sanity";
import { getPublicBlogPosts } from "../lib/api/cms.functions";

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
  loader: async () => {
    return {
      posts: await getPublicBlogPosts(),
    };
  },
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

function BlogPage() {
  const { posts } = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  // Safely find featured or default to first post
  const featured = posts.find((p: any) => p.featured) || posts[0];
  const rest = posts.filter((p: any) => p._id !== featured?._id);

  const filtered = useMemo(() => {
    return rest.filter((p: any) => {
      const matchCat = cat === "All" || p.category === cat;
      const s = q.trim().toLowerCase();
      const matchQ =
        !s ||
        p.title.toLowerCase().includes(s) ||
        p.excerpt.toLowerCase().includes(s);
      return matchCat && matchQ;
    });
  }, [q, cat, rest]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 radial-lime opacity-60" />
        <div className="container-x relative text-center">
          <Eyebrow>The NoWaiting Blog</Eyebrow>
          <h1 className="mt-6 text-5xl sm:text-7xl font-bold tracking-tight">
            <span className="text-gradient">Ideas worth</span>{" "}
            <span className="text-lime-gradient">savoring.</span>
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
      {featured && (
        <Section className="pt-0">
          <div className="container-x">
            <div
              onClick={() => setSelectedPost(featured)}
              className="group relative grid lg:grid-cols-[1.2fr_1fr] gap-8 rounded-[2rem] border border-white/8 bg-gradient-to-br from-white/[0.05] to-transparent p-6 sm:p-10 overflow-hidden hover:border-primary/40 transition-colors cursor-pointer"
            >
              <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                  Featured · {featured.category}
                </div>
                <h2 className="mt-5 text-3xl sm:text-5xl font-semibold tracking-tight text-gradient leading-tight">
                  {featured.title}
                </h2>
                <p className="mt-5 text-lg text-ink-soft max-w-xl">
                  {featured.excerpt}
                </p>
                <div className="mt-6 flex items-center gap-4 text-sm text-ink-soft">
                  <span>{formatDate(featured.date)}</span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span>{featured.read} read</span>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Read article{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
              <div className="relative aspect-[5/4] rounded-2xl overflow-hidden border border-white/10 bg-[#0E0E0E]">
                {featured.mainImage && urlFor(featured.mainImage) ? (
                  <img
                    src={urlFor(featured.mainImage)!.url()}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 lime-gradient opacity-20" />
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="h-32 w-32 rounded-3xl lime-gradient flex items-center justify-center text-ink text-5xl font-black shadow-[0_20px_60px_-10px_rgba(126,211,33,0.6)]">
                        NW
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Section>
      )}

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
            {filtered.map((p: any) => (
              <div
                key={p._id || p.title}
                onClick={() => setSelectedPost(p)}
                className="group rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent p-6 hover:border-primary/40 transition-colors cursor-pointer flex flex-col"
              >
                <div className="aspect-[16/10] rounded-2xl bg-[#0E0E0E] border border-white/8 mb-5 relative overflow-hidden">
                  {p.mainImage && urlFor(p.mainImage) ? (
                    <img
                      src={urlFor(p.mainImage)!.url()}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 radial-lime opacity-50" />
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="h-16 w-16 rounded-2xl lime-gradient grid place-items-center text-ink font-bold text-xl">
                          NW
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {p.category}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-ink-soft flex-1">{p.excerpt}</p>
                <div className="mt-5 flex items-center justify-between text-xs text-ink-soft">
                  <span>{formatDate(p.date)}</span>
                  <span>{p.read} read</span>
                </div>
              </div>
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
                title={
                  <>
                    The dining brief. <span className="text-lime-gradient">Once a week.</span>
                  </>
                }
                subtitle="Subscribe for the best from our blog, plus early access to NoWaiting when we launch."
              />
            </div>
            <div className="relative">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </Section>

      {/* Blog Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0E0E0E] p-6 sm:p-10 shadow-elev animate-fade-up">
            {/* Ambient Background Glow */}
            <div className="absolute -top-40 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 p-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-ink-soft hover:text-white transition-all hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                {selectedPost.category}
              </span>
              <h2 className="mt-5 text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                {selectedPost.title}
              </h2>
              <div className="mt-4 flex items-center gap-4 text-xs text-ink-soft">
                <span>{formatDate(selectedPost.date)}</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span>{selectedPost.read} read</span>
              </div>

              <hr className="border-white/5 my-6" />

              {/* PortableText Body */}
              <div className="prose prose-invert max-w-none text-sm leading-relaxed text-ink-soft space-y-4">
                {selectedPost.content ? (
                  <PortableText value={selectedPost.content} />
                ) : (
                  <p>{selectedPost.excerpt}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, MessageSquare, Phone, Store, Users, Instagram, Twitter, Linkedin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Eyebrow, SectionHeading, Section } from "../components/site/Section";
import { submitContact } from "../lib/api/cms.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — NoWaiting" },
      { name: "description", content: "Get in touch — general inquiries, restaurant partnerships and onboarding for NoWaiting." },
      { property: "og:title", content: "Contact — NoWaiting" },
      { property: "og:description", content: "Talk to the NoWaiting team — partners, press and support." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

type Tab = "general" | "partner" | "onboarding";

function ContactPage() {
  const [tab, setTab] = useState<Tab>("general");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      first: formData.get("first") as string,
      last: formData.get("last") as string,
      email: formData.get("email") as string,
      topic: tab === "general" ? (formData.get("topic") as string) || "General Inquiry" : tab,
      restaurant: (formData.get("restaurant") as string) || "",
      city: (formData.get("city") as string) || "",
      locations: (formData.get("locations") as string) || "",
      message: formData.get("message") as string,
    };

    try {
      const result = await submitContact({ data });
      if (result.success) {
        setSubmitted(true);
        toast.success("Thank you! Your message has been sent successfully.");
        e.currentTarget.reset();
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 radial-lime opacity-60" />
        <div className="container-x relative text-center">
          <Eyebrow>Get in Touch</Eyebrow>
          <h1 className="mt-6 text-5xl sm:text-7xl font-bold tracking-tight">
            <span className="text-gradient">Let's talk.</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-lg text-ink-soft">
            Whether you're a diner, a restaurant or the press — we'd love to hear from you.
            We respond within one business day.
          </p>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="container-x">
          {/* Centered form container */}
          <div className="max-w-2xl mx-auto rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent p-6 sm:p-10">
            <div className="flex flex-wrap gap-2 mb-8">
              {([
                { id: "general", label: "General", icon: MessageSquare },
                { id: "partner", label: "Partner Inquiry", icon: Store },
                { id: "onboarding", label: "Restaurant Onboarding", icon: Users },
              ] as { id: Tab; label: string; icon: typeof Mail }[]).map((t) => (
                <button
                  key={t.id}
                  disabled={loading}
                  onClick={() => { setTab(t.id); setSubmitted(false); }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border transition-all ${
                    tab === t.id
                      ? "lime-gradient text-ink border-primary"
                      : "border-white/10 bg-white/[0.04] text-white/85 hover:border-white/25"
                  } disabled:opacity-50`}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            <SectionHeading
              align="left"
              eyebrow={
                tab === "general" ? "General Inquiry" :
                tab === "partner" ? "Partner With NoWaiting" : "Restaurant Onboarding"
              }
              title={
                tab === "general" ? "How can we help?" :
                tab === "partner" ? "Let's grow together." : "Get your restaurant ready."
              }
            />

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="First name" name="first" required disabled={loading || submitted} />
                <Field label="Last name" name="last" required disabled={loading || submitted} />
                <Field label="Email" name="email" type="email" required disabled={loading || submitted} />
                {tab === "general" && <Field label="Topic" name="topic" placeholder="e.g. Press, Support" disabled={loading || submitted} />}
                {tab !== "general" && <Field label="Restaurant name" name="restaurant" required disabled={loading || submitted} />}
                {tab !== "general" && <Field label="City" name="city" required disabled={loading || submitted} />}
                {tab === "onboarding" && <Field label="Number of locations" name="locations" type="number" required disabled={loading || submitted} />}
              </div>
              <Field
                label="Message"
                name="message"
                textarea
                required
                disabled={loading || submitted}
                placeholder={
                  tab === "general" ? "Tell us what's on your mind..." :
                  tab === "partner" ? "Tell us about your restaurant and what you're looking for..." :
                  "Tell us about your venue size, current systems and goals..."
                }
              />
              <button
                type="submit"
                disabled={loading || submitted}
                className="inline-flex items-center gap-2 rounded-2xl lime-gradient text-ink px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : submitted ? (
                  "Sent — we'll be in touch!"
                ) : (
                  "Send message"
                )}
              </button>
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea = false,
  placeholder,
  required = false,
  disabled = false,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-ink-soft">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={5}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-ink-soft focus:border-primary/60 focus:ring-4 focus:ring-primary/15 outline-none transition-all disabled:opacity-50"
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-ink-soft focus:border-primary/60 focus:ring-4 focus:ring-primary/15 outline-none transition-all disabled:opacity-50"
        />
      )}
    </label>
  );
}




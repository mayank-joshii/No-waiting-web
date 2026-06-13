import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Default settings fallback
export const DEFAULT_SETTINGS = {
  heroTitleLine1: "Skip the Queue.",
  heroTitleLine2: "Enjoy More.",
  heroDescription: "The smarter way to discover restaurants, check live wait times, reserve tables and enjoy a seamless dining experience — all in one beautiful app.",
};

// Default blog posts fallback
export const DEFAULT_POSTS = [
  {
    _id: "default-1",
    title: "Why virtual queues are the future of dining out",
    excerpt: "How restaurants are using virtual queues to reduce walk-aways, boost reviews and turn more tables — without the chaos.",
    category: "Queue Management",
    date: "2026-05-28",
    read: "6 min",
    featured: true,
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Long queues outside restaurants are a familiar sight in any busy city. But while they might seem like a sign of success, the reality is different. Long physical lines lead to customer frustration, walk-aways, and lost revenue. Virtual queues solve this problem by letting diners join the wait from anywhere.",
          }
        ]
      }
    ]
  },
  {
    _id: "default-2",
    title: "5 ways to make your reservation feel personal again",
    excerpt: "From special requests to thoughtful follow-ups — small touches restaurants can use to turn diners into regulars.",
    category: "Hospitality Industry",
    date: "2026-05-18",
    read: "4 min",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "In the digital age, reservations can sometimes feel transactional. But hospitality is all about human connection. By personalizing the reservation experience—remembering a regular guest's favorite table, asking about allergies in advance, or sending a warm follow-up note—restaurants can build lasting relationships.",
          }
        ]
      }
    ]
  },
  {
    _id: "default-3",
    title: "Pre-ordering: the underrated growth lever for restaurants",
    excerpt: "Why pre-orders quietly improve speed of service, kitchen flow and per-cover revenue at the same time.",
    category: "Restaurant Technology",
    date: "2026-05-09",
    read: "5 min",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Pre-ordering is changing the way diners and restaurants interact. By letting customers choose their meals before sitting down, kitchens can prepare in advance, table turnover times improve, and average ticket sizes increase due to frictionless upsells.",
          }
        ]
      }
    ]
  }
];

export const DEFAULT_ABOUT_SETTINGS = {
  eyebrow: "Our Story",
  titleLine1: "Built for diners.",
  titleLine2: "Designed for restaurants.",
  description: "We started NoWaiting with one question — why are we still standing in lines for dinner? Today, we're building the modern dining infrastructure that makes waiting a thing of the past.",
  missionTitle: "Mission",
  missionBody: "Eliminate friction between people and the food they love by making every dining decision instant, informed and effortless.",
  visionTitle: "Vision",
  visionBody: "A world where no one waits in a queue — where every meal feels intentional, every reservation is seamless, and every restaurant runs smarter.",
  problemEyebrow: "The Problem",
  problemTitleLine1: "Dining out shouldn't",
  problemTitleLine2: "feel like a guessing game.",
  problemItems: [
    "You drive across town only to find a 45-minute wait.",
    "You call ahead — no one picks up. You walk in — the host can't say when you'll sit.",
    "Restaurants lose 20%+ of their potential covers to walk-aways and miscommunication.",
    "Diners and operators both lose. That's the system we're rebuilding."
  ],
  whyEyebrow: "Why NoWaiting",
  whyTitleLine1: "Because your time",
  whyTitleLine2: "is precious.",
  whyDescription: "Every minute spent in a queue is a minute not spent enjoying your meal, your company, or your evening. We're here to give that time back."
};

export const DEFAULT_SERVICES = [
  {
    id: "s-1",
    title: "Restaurant Discovery",
    tagline: "Find your next favorite — not just another place to eat.",
    icon: "Compass",
    bullets: ["Curated lists by cuisine, mood and neighborhood", "Personalized recommendations", "Verified ratings and reviews"],
    useCase: "Date night? Birthday dinner? Quick lunch? Discovery surfaces the right place instantly.",
    imagePath: "/restaurant_list.jpg",
    order: 0
  },
  {
    id: "s-2",
    title: "Live Wait Times",
    tagline: "Know before you go.",
    icon: "Clock3",
    bullets: ["Real-time wait estimates", "Updated by restaurants and predictive models", "Filter by max wait"],
    useCase: "Skip the restaurants with a 45-minute line and find the great spot 5 minutes away.",
    imagePath: "/restaurant_detail.jpg",
    order: 1
  },
  {
    id: "s-3",
    title: "Virtual Queue",
    tagline: "Join the line — without standing in it.",
    icon: "Users",
    bullets: ["Get a token from anywhere", "Track your position in real time", "Smart ‘ready soon' notifications"],
    useCase: "Add yourself to the queue, walk around, and arrive right as your table opens up.",
    imagePath: "/order_tracking.jpg",
    order: 2
  },
  {
    id: "s-4",
    title: "Table Reservations",
    tagline: "Book the perfect table in seconds.",
    icon: "CalendarCheck",
    bullets: ["Choose date, time, guests, seating", "Special requests supported", "Modify or cancel anytime"],
    useCase: "Confirm your evening before lunch and forget about it until it's time to eat.",
    imagePath: "/book_table.jpg",
    order: 3
  },
  {
    id: "s-5",
    title: "Pre-Order Food",
    tagline: "Your meal, ready when you sit down.",
    icon: "Utensils",
    bullets: ["Browse the menu in advance", "Customize and split items", "Sync with your reservation"],
    useCase: "Short on time? Pre-order so your food arrives moments after you do.",
    imagePath: "/restaurant_detail.jpg",
    order: 4
  },
  {
    id: "s-6",
    title: "Takeaway Scheduling",
    tagline: "Pick up exactly when you need to.",
    icon: "ShoppingBag",
    bullets: ["Pick the right pickup window", "Live order tracking", "Skip the counter line"],
    useCase: "Schedule lunch for 12:35 sharp and walk in for a 30-second pickup.",
    imagePath: "/takeaway_order.jpg",
    order: 5
  },
  {
    id: "s-7",
    title: "Real-Time Notifications",
    tagline: "Always in the loop.",
    icon: "Bell",
    bullets: ["Queue updates", "Reservation reminders", "Order status alerts"],
    useCase: "Get pinged the moment your table is ready or your food is on the way out.",
    imagePath: "/order_tracking.jpg",
    order: 6
  }
];

const cleanEnv = (val: string | undefined | null) => {
  if (!val) return "";
  return val.replace(/^["']|["']$/g, "").trim();
};

const projectId = cleanEnv(typeof process !== "undefined" ? process.env.VITE_SANITY_PROJECT_ID : (import.meta.env?.VITE_SANITY_PROJECT_ID || ""));
const dataset = cleanEnv(typeof process !== "undefined" ? process.env.VITE_SANITY_DATASET : (import.meta.env?.VITE_SANITY_DATASET || "")) || "production";
const apiVersion = "2024-03-11";
const writeToken = cleanEnv(typeof process !== "undefined" ? process.env.SANITY_WRITE_TOKEN : "");

const isSanityConfigured = !!projectId && projectId !== "your_project_id";

// Client for reading (safe for browser and server)
export const sanityReadClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
    })
  : null;

// Client for writing (server-side only, requires writeToken)
export const sanityWriteClient = isSanityConfigured && writeToken
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: writeToken,
    })
  : null;

const builder = sanityReadClient ? imageUrlBuilder(sanityReadClient) : null;

export function urlFor(source: any) {
  return builder ? builder.image(source) : null;
}



import { promises as fs } from "fs";
import path from "path";

const dbDir = path.resolve("./data");
const dbPath = path.join(dbDir, "submissions.json");

type WaitlistEntry = {
  id: string;
  email: string;
  createdAt: string;
};

type ContactEntry = {
  id: string;
  first: string;
  last: string;
  email: string;
  topic?: string;
  restaurant?: string;
  city?: string;
  locations?: string;
  message: string;
  createdAt: string;
  read: boolean;
};

type SubmissionsDb = {
  waitlist: WaitlistEntry[];
  contacts: ContactEntry[];
  posts: any[];
  settings: any;
  aboutSettings?: any;
  services?: any[];
};

// Initial default settings
const defaultSettings = {
  heroTitleLine1: "Skip the Queue.",
  heroTitleLine2: "Enjoy More.",
  heroDescription: "The smarter way to discover restaurants, check live wait times, reserve tables and enjoy a seamless dining experience — all in one beautiful app.",
};

const defaultAboutSettings = {
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

const defaultServices = [
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

// Initial default posts
const defaultPosts = [
  {
    id: "default-1",
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
    id: "default-2",
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
  }
];

const defaultDb: SubmissionsDb = {
  waitlist: [
    { id: "w-1", email: "onboarding@nowaiting.com", createdAt: "2026-06-13T10:00:00.000Z" }
  ],
  contacts: [
    {
      id: "c-1",
      first: "Sarah",
      last: "Miller",
      email: "sarah@bistro.com",
      topic: "partner",
      restaurant: "Le Bistro",
      city: "New York",
      message: "We would love to integrate NoWaiting with our POS system. Please send onboarding details.",
      createdAt: "2026-06-13T11:00:00.000Z",
      read: false
    }
  ],
  posts: defaultPosts,
  settings: defaultSettings,
  aboutSettings: defaultAboutSettings,
  services: defaultServices
};

async function ensureDbExists() {
  try {
    await fs.mkdir(dbDir, { recursive: true });
    try {
      await fs.access(dbPath);
      // Read current and check if it has posts, settings, aboutSettings, and services keys (migration)
      const content = await fs.readFile(dbPath, "utf-8");
      const data = JSON.parse(content);
      let changed = false;
      if (!data.posts) {
        data.posts = defaultPosts;
        changed = true;
      }
      if (!data.settings) {
        data.settings = defaultSettings;
        changed = true;
      }
      if (!data.aboutSettings) {
        data.aboutSettings = defaultAboutSettings;
        changed = true;
      }
      if (!data.services) {
        data.services = defaultServices;
        changed = true;
      }
      if (changed) {
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
      }
    } catch {
      await fs.writeFile(dbPath, JSON.stringify(defaultDb, null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Failed to initialize local submissions DB directory:", error);
  }
}

export async function readLocalSubmissions(): Promise<SubmissionsDb> {
  await ensureDbExists();
  try {
    const content = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(content) as SubmissionsDb;
  } catch (error) {
    console.error("Failed to read local submissions file:", error);
    return defaultDb;
  }
}

export async function writeLocalSubmissions(data: SubmissionsDb): Promise<boolean> {
  await ensureDbExists();
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Failed to write to local submissions file:", error);
    return false;
  }
}

export async function addLocalWaitlist(email: string): Promise<WaitlistEntry> {
  const db = await readLocalSubmissions();
  const entry: WaitlistEntry = {
    id: `w-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    email,
    createdAt: new Date().toISOString(),
  };
  db.waitlist.unshift(entry);
  await writeLocalSubmissions(db);
  return entry;
}

export async function addLocalContact(contact: Omit<ContactEntry, "id" | "createdAt" | "read">): Promise<ContactEntry> {
  const db = await readLocalSubmissions();
  const entry: ContactEntry = {
    ...contact,
    id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  db.contacts.unshift(entry);
  await writeLocalSubmissions(db);
  return entry;
}

export async function deleteLocalWaitlist(id: string): Promise<boolean> {
  const db = await readLocalSubmissions();
  const index = db.waitlist.findIndex((e) => e.id === id);
  if (index === -1) return false;
  db.waitlist.splice(index, 1);
  return await writeLocalSubmissions(db);
}

export async function deleteLocalContact(id: string): Promise<boolean> {
  const db = await readLocalSubmissions();
  const index = db.contacts.findIndex((e) => e.id === id);
  if (index === -1) return false;
  db.contacts.splice(index, 1);
  return await writeLocalSubmissions(db);
}

export async function markLocalContactRead(id: string): Promise<boolean> {
  const db = await readLocalSubmissions();
  const contact = db.contacts.find((e) => e.id === id);
  if (!contact) return false;
  contact.read = true;
  return await writeLocalSubmissions(db);
}

// Local Blog & Settings Helpers
export async function saveLocalBlogPost(post: any): Promise<any> {
  const db = await readLocalSubmissions();
  if (!db.posts) db.posts = [];

  const existingIndex = post.id ? db.posts.findIndex((p) => p.id === post.id) : -1;
  const entry = {
    ...post,
    id: post.id || `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    date: post.date || new Date().toISOString().split("T")[0],
  };

  if (existingIndex > -1) {
    db.posts[existingIndex] = entry;
  } else {
    db.posts.unshift(entry);
  }
  await writeLocalSubmissions(db);
  return entry;
}

export async function deleteLocalBlogPost(id: string): Promise<boolean> {
  const db = await readLocalSubmissions();
  if (!db.posts) return false;
  const index = db.posts.findIndex((p) => p.id === id);
  if (index === -1) return false;
  db.posts.splice(index, 1);
  return await writeLocalSubmissions(db);
}

export async function saveLocalSettings(settings: any): Promise<boolean> {
  const db = await readLocalSubmissions();
  db.settings = {
    ...db.settings,
    ...settings,
  };
  return await writeLocalSubmissions(db);
}

export async function saveLocalAboutSettings(aboutSettings: any): Promise<boolean> {
  const db = await readLocalSubmissions();
  db.aboutSettings = {
    ...db.aboutSettings,
    ...aboutSettings,
  };
  return await writeLocalSubmissions(db);
}

export async function saveLocalService(service: any): Promise<any> {
  const db = await readLocalSubmissions();
  if (!db.services) db.services = [...defaultServices];

  const existingIndex = service.id ? db.services.findIndex((s) => s.id === service.id) : -1;
  const entry = {
    ...service,
    id: service.id || `s-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
  };

  if (existingIndex > -1) {
    db.services[existingIndex] = entry;
  } else {
    db.services.push(entry);
  }
  await writeLocalSubmissions(db);
  return entry;
}

export async function deleteLocalService(id: string): Promise<boolean> {
  const db = await readLocalSubmissions();
  if (!db.services) return false;
  const index = db.services.findIndex((s) => s.id === id);
  if (index === -1) return false;
  db.services.splice(index, 1);
  return await writeLocalSubmissions(db);
}

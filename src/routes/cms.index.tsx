import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users,
  MessageSquare,
  Search,
  Download,
  Trash2,
  ExternalLink,
  BookOpen,
  Settings,
  LogOut,
  CheckCircle,
  Eye,
  Mail,
  Building,
  MapPin,
  Calendar,
  AlertCircle,
  TrendingUp,
  X,
  FileText,
  Plus,
  Edit3,
  Save,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import {
  getSubmissions,
  deleteWaitlistEntry,
  deleteContactSubmission,
  markContactMessageRead,
  saveBlogPost,
  deleteBlogPost,
  saveSiteSettings,
  saveAboutSettings,
  saveService,
  deleteService
} from "../lib/api/cms.functions";
import { urlFor } from "../lib/sanity";

export const Route = createFileRoute("/cms/")({
  component: CmsDashboardPage,
});

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

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  read: string;
  featured: boolean;
  content?: any;
};

type SiteSettings = {
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
};

type ActiveTab = "overview" | "waitlist" | "messages" | "blog" | "settings" | "integration";

const CATEGORIES = [
  "Restaurant Technology",
  "Dining Tips",
  "Queue Management",
  "Hospitality Industry",
  "Food Trends"
] as const;

function CmsDashboardPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [settingsSubTab, setSettingsSubTab] = useState<"homepage" | "homepage-photos" | "about" | "about-photo" | "services">("homepage");
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<any>({
    heroTitleLine1: "",
    heroTitleLine2: "",
    heroDescription: "",
    heroImageLeft: null,
    heroImageCenter: null,
    heroImageRight: null,
    showcaseBanner: null
  });
  const [aboutSettings, setAboutSettings] = useState<any>({
    eyebrow: "",
    titleLine1: "",
    titleLine2: "",
    description: "",
    missionTitle: "",
    missionBody: "",
    visionTitle: "",
    visionBody: "",
    problemEyebrow: "",
    problemTitleLine1: "",
    problemTitleLine2: "",
    problemItems: [],
    whyEyebrow: "",
    whyTitleLine1: "",
    whyTitleLine2: "",
    whyDescription: "",
    aboutImage: null
  });
  const [services, setServices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactEntry | null>(null);

  // Blog Editor Modal State
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postCategory, setPostCategory] = useState<string>(CATEGORIES[0]);
  const [postDate, setPostDate] = useState("");
  const [postRead, setPostRead] = useState("5 min");
  const [postFeatured, setPostFeatured] = useState(false);
  const [postContent, setPostContent] = useState("");

  // Settings Form State
  const [settingsLine1, setSettingsLine1] = useState("");
  const [settingsLine2, setSettingsLine2] = useState("");
  const [settingsDesc, setSettingsDesc] = useState("");

  // About Form State
  const [aboutEyebrow, setAboutEyebrow] = useState("");
  const [aboutTitleLine1, setAboutTitleLine1] = useState("");
  const [aboutTitleLine2, setAboutTitleLine2] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [aboutMissionTitle, setAboutMissionTitle] = useState("");
  const [aboutMissionBody, setAboutMissionBody] = useState("");
  const [aboutVisionTitle, setAboutVisionTitle] = useState("");
  const [aboutVisionBody, setAboutVisionBody] = useState("");
  const [aboutProblemEyebrow, setAboutProblemEyebrow] = useState("");
  const [aboutProblemTitleLine1, setAboutProblemTitleLine1] = useState("");
  const [aboutProblemTitleLine2, setAboutProblemTitleLine2] = useState("");
  const [aboutProblemItems, setAboutProblemItems] = useState<string[]>([]);
  const [aboutWhyEyebrow, setAboutWhyEyebrow] = useState("");
  const [aboutWhyTitleLine1, setAboutWhyTitleLine1] = useState("");
  const [aboutWhyTitleLine2, setAboutWhyTitleLine2] = useState("");
  const [aboutWhyDescription, setAboutWhyDescription] = useState("");

  // Services Editor Modal State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceTagline, setServiceTagline] = useState("");
  const [serviceIcon, setServiceIcon] = useState("");
  const [serviceBullets, setServiceBullets] = useState("");
  const [serviceUseCase, setServiceUseCase] = useState("");
  const [serviceOrder, setServiceOrder] = useState(0);

  const token = typeof window !== "undefined" ? sessionStorage.getItem("admin_token") || "" : "";

  // Load data
  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const result = await getSubmissions({ data: { token } });
      setWaitlist(result.waitlist || []);
      setContacts(result.contacts || []);
      setPosts(result.posts || []);
      setServices(result.services || []);
      
      const loadedSettings = result.settings || {
        heroTitleLine1: "Skip the Queue.",
        heroTitleLine2: "Enjoy More.",
        heroDescription: "The smarter way to discover restaurants..."
      };
      setSettings(loadedSettings);
      setSettingsLine1(loadedSettings.heroTitleLine1 || "");
      setSettingsLine2(loadedSettings.heroTitleLine2 || "");
      setSettingsDesc(loadedSettings.heroDescription || "");

      const loadedAbout = result.aboutSettings || {};
      setAboutSettings(loadedAbout);
      setAboutEyebrow(loadedAbout.eyebrow || "");
      setAboutTitleLine1(loadedAbout.titleLine1 || "");
      setAboutTitleLine2(loadedAbout.titleLine2 || "");
      setAboutDescription(loadedAbout.description || "");
      setAboutMissionTitle(loadedAbout.missionTitle || "");
      setAboutMissionBody(loadedAbout.missionBody || "");
      setAboutVisionTitle(loadedAbout.visionTitle || "");
      setAboutVisionBody(loadedAbout.visionBody || "");
      setAboutProblemEyebrow(loadedAbout.problemEyebrow || "");
      setAboutProblemTitleLine1(loadedAbout.problemTitleLine1 || "");
      setAboutProblemTitleLine2(loadedAbout.problemTitleLine2 || "");
      setAboutProblemItems(loadedAbout.problemItems || []);
      setAboutWhyEyebrow(loadedAbout.whyEyebrow || "");
      setAboutWhyTitleLine1(loadedAbout.whyTitleLine1 || "");
      setAboutWhyTitleLine2(loadedAbout.whyTitleLine2 || "");
      setAboutWhyDescription(loadedAbout.whyDescription || "");
    } catch (error) {
      console.error("Failed to load submissions:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    navigate({ to: "/cms/login" });
  };

  // Delete waitlist entry
  const handleDeleteWaitlist = async (id: string) => {
    if (!confirm("Are you sure you want to remove this email?")) return;
    setActionLoading(`delete-waitlist-${id}`);
    try {
      await deleteWaitlistEntry({ data: { token, id } });
      setWaitlist(waitlist.filter((w) => w.id !== id));
      router.invalidate();
      toast.success("Waitlist lead deleted.");
    } catch (err) {
      toast.error("Failed to delete entry.");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    setActionLoading(`delete-msg-${id}`);
    try {
      await deleteContactSubmission({ data: { token, id } });
      setContacts(contacts.filter((c) => c.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      router.invalidate();
      toast.success("Inquiry deleted.");
    } catch (err) {
      toast.error("Failed to delete message.");
    } finally {
      setActionLoading(null);
    }
  };

  // Mark read
  const handleMarkRead = async (id: string) => {
    setActionLoading(`read-msg-${id}`);
    try {
      await markContactMessageRead({ data: { token, id } });
      setContacts(
        contacts.map((c) => (c.id === id ? { ...c, read: true } : c))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, read: true });
      }
      router.invalidate();
    } catch (err) {
      console.error("Failed to mark message read", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("save-settings");
    try {
      const res = await saveSiteSettings({
        data: {
          token,
          heroTitleLine1: settingsLine1,
          heroTitleLine2: settingsLine2,
          heroDescription: settingsDesc
        }
      });
      if (res.success) {
        setSettings({
          ...settings,
          heroTitleLine1: settingsLine1,
          heroTitleLine2: settingsLine2,
          heroDescription: settingsDesc
        });
        router.invalidate();
        toast.success(res.message || "Site settings saved successfully.");
      }
    } catch (err) {
      toast.error("Failed to update site settings.");
    } finally {
      setActionLoading(null);
    }
  };

  // Save About settings
  const handleSaveAboutSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("save-about");
    try {
      const res = await saveAboutSettings({
        data: {
          token,
          eyebrow: aboutEyebrow,
          titleLine1: aboutTitleLine1,
          titleLine2: aboutTitleLine2,
          description: aboutDescription,
          missionTitle: aboutMissionTitle,
          missionBody: aboutMissionBody,
          visionTitle: aboutVisionTitle,
          visionBody: aboutVisionBody,
          problemEyebrow: aboutProblemEyebrow,
          problemTitleLine1: aboutProblemTitleLine1,
          problemTitleLine2: aboutProblemTitleLine2,
          problemItems: aboutProblemItems,
          whyEyebrow: aboutWhyEyebrow,
          whyTitleLine1: aboutWhyTitleLine1,
          whyTitleLine2: aboutWhyTitleLine2,
          whyDescription: aboutWhyDescription
        }
      });
      if (res.success) {
        setAboutSettings({
          ...aboutSettings,
          eyebrow: aboutEyebrow,
          titleLine1: aboutTitleLine1,
          titleLine2: aboutTitleLine2,
          description: aboutDescription,
          missionTitle: aboutMissionTitle,
          missionBody: aboutMissionBody,
          visionTitle: aboutVisionTitle,
          visionBody: aboutVisionBody,
          problemEyebrow: aboutProblemEyebrow,
          problemTitleLine1: aboutProblemTitleLine1,
          problemTitleLine2: aboutProblemTitleLine2,
          problemItems: aboutProblemItems,
          whyEyebrow: aboutWhyEyebrow,
          whyTitleLine1: aboutWhyTitleLine1,
          whyTitleLine2: aboutWhyTitleLine2,
          whyDescription: aboutWhyDescription
        });
        router.invalidate();
        toast.success(res.message || "About settings saved successfully.");
      }
    } catch (err) {
      toast.error("Failed to update about settings.");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete service superpower
  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service superpower?")) return;
    setActionLoading(`delete-service-${id}`);
    try {
      await deleteService({ data: { token, id } });
      setServices(services.filter((s) => s.id !== id));
      router.invalidate();
      toast.success("Service superpower deleted.");
    } catch (err) {
      toast.error("Failed to delete service superpower.");
    } finally {
      setActionLoading(null);
    }
  };

  // Open Service Modal for Create
  const handleOpenCreateService = () => {
    setEditingService(null);
    setServiceTitle("");
    setServiceTagline("");
    setServiceIcon("Compass");
    setServiceBullets("");
    setServiceUseCase("");
    setServiceOrder(services.length);
    setServiceModalOpen(true);
  };

  // Open Service Modal for Edit
  const handleOpenEditService = (service: any) => {
    setEditingService(service);
    setServiceTitle(service.title || "");
    setServiceTagline(service.tagline || "");
    setServiceIcon(service.icon || "Compass");
    setServiceBullets((service.bullets || []).join("; "));
    setServiceUseCase(service.useCase || "");
    setServiceOrder(service.order || 0);
    setServiceModalOpen(true);
  };

  // Save Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle || !serviceTagline || !serviceIcon || !serviceUseCase) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const bulletsList = serviceBullets
      .split(";")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    setActionLoading("save-service");
    try {
      const res = await saveService({
        data: {
          token,
          id: editingService?.id || undefined,
          title: serviceTitle,
          tagline: serviceTagline,
          icon: serviceIcon,
          bullets: bulletsList,
          useCase: serviceUseCase,
          order: serviceOrder
        }
      });

      if (res.success) {
        toast.success(res.message || "Service saved successfully.");
        setServiceModalOpen(false);
        router.invalidate();
        loadData(); // reload
      }
    } catch (err) {
      toast.error("Failed to save service superpower.");
    } finally {
      setActionLoading(null);
    }
  };

  // Open Blog Modal for Create
  const handleOpenCreateBlog = () => {
    setEditingPost(null);
    setPostTitle("");
    setPostExcerpt("");
    setPostCategory(CATEGORIES[0]);
    setPostDate(new Date().toISOString().split("T")[0]);
    setPostRead("5 min");
    setPostFeatured(false);
    setPostContent("");
    setBlogModalOpen(true);
  };

  // Open Blog Modal for Edit
  const handleOpenEditBlog = (post: BlogPost) => {
    setEditingPost(post);
    setPostTitle(post.title);
    setPostExcerpt(post.excerpt);
    setPostCategory(post.category);
    setPostDate(post.date ? post.date.split("T")[0] : new Date().toISOString().split("T")[0]);
    setPostRead(post.read);
    setPostFeatured(post.featured || false);
    
    // Extract simple text from Portable Text if available
    let contentText = "";
    if (post.content && Array.isArray(post.content)) {
      const spans = post.content.flatMap((block: any) => block.children || []);
      contentText = spans.map((s: any) => s.text || "").join("\n");
    } else {
      contentText = typeof post.content === "string" ? post.content : "";
    }
    
    setPostContent(contentText || post.excerpt);
    setBlogModalOpen(true);
  };

  // Save Blog Post
  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postExcerpt || !postContent) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setActionLoading("save-blog");
    try {
      const res = await saveBlogPost({
        data: {
          token,
          id: editingPost?.id || undefined,
          title: postTitle,
          excerpt: postExcerpt,
          category: postCategory,
          date: postDate,
          read: postRead,
          featured: postFeatured,
          content: postContent
        }
      });

      if (res.success) {
        toast.success(res.message || "Blog post saved successfully.");
        setBlogModalOpen(false);
        router.invalidate();
        loadData(); // reload list
      }
    } catch (err) {
      toast.error("Failed to save blog post.");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Blog Post
  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setActionLoading(`delete-blog-${id}`);
    try {
      await deleteBlogPost({ data: { token, id } });
      setPosts(posts.filter((p) => p.id !== id));
      router.invalidate();
      toast.success("Blog post deleted.");
    } catch (err) {
      toast.error("Failed to delete blog post.");
    } finally {
      setActionLoading(null);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ["Email", "Join Date"];
    const rows = waitlist.map((w) => [
      w.email,
      new Date(w.createdAt).toISOString()
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nowaiting_waitlist_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering
  const filteredWaitlist = waitlist.filter((w) =>
    w.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(
    (c) =>
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.first.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.last.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = contacts.filter((c) => !c.read).length;

  return (
    <div className="flex min-h-screen bg-[#070707]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0A0A0A] p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 px-2">
            <span className="h-8 w-8 lime-gradient rounded-lg flex items-center justify-center font-bold text-ink">
              NW
            </span>
            <span className="font-bold text-white text-lg tracking-tight">Admin CMS</span>
          </div>

          <nav className="mt-10 space-y-1.5">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "waitlist", label: "Waitlist", icon: Users, badge: waitlist.length },
              { id: "messages", label: "Inquiries", icon: MessageSquare, badge: unreadCount },
              { id: "blog", label: "Blog Posts", icon: BookOpen, badge: posts.length },
              { id: "settings", label: "Site Content", icon: FileText },
              { id: "integration", label: "Sanity Guide", icon: Settings },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id as ActiveTab);
                  setSearchQuery("");
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === t.id
                    ? "lime-gradient text-ink shadow-[0_10px_20px_-10px_rgba(126,211,33,0.3)]"
                    : "text-ink-soft hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <t.icon className="h-4.5 w-4.5" />
                  {t.label}
                </div>
                {t.badge !== undefined && t.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                      activeTab === t.id
                        ? "bg-black/80 text-primary"
                        : "bg-primary/20 text-primary"
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all mt-auto"
        >
          <LogOut className="h-4.5 w-4.5" />
          Log Out
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-10 overflow-y-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-fade-up">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
                  <p className="text-ink-soft text-sm mt-1">Real-time stats from diner activities and inquiries.</p>
                </div>

                <div className="grid sm:grid-cols-4 gap-6">
                  {/* Card 1 */}
                  <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.03] to-transparent p-6 relative overflow-hidden group">
                    <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 text-primary">
                      <Users className="h-5 w-5" />
                    </span>
                    <h3 className="text-ink-soft text-sm font-medium mt-4">Total Waitlist</h3>
                    <p className="text-3xl font-bold text-white mt-1">{waitlist.length}</p>
                    <p className="text-[10px] text-ink-soft mt-2">Diners requesting early access</p>
                  </div>

                  {/* Card 2 */}
                  <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.03] to-transparent p-6 relative overflow-hidden group">
                    <span className="grid place-items-center h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400">
                      <MessageSquare className="h-5 w-5" />
                    </span>
                    <h3 className="text-ink-soft text-sm font-medium mt-4">General Messages</h3>
                    <p className="text-3xl font-bold text-white mt-1">
                      {contacts.filter((c) => c.topic === "general").length}
                    </p>
                    <p className="text-[10px] text-ink-soft mt-2">Diner feedback & press questions</p>
                  </div>

                  {/* Card 3 */}
                  <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.03] to-transparent p-6 relative overflow-hidden group">
                    <span className="grid place-items-center h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                      <Building className="h-5 w-5" />
                    </span>
                    <h3 className="text-ink-soft text-sm font-medium mt-4">Restaurant Leads</h3>
                    <p className="text-3xl font-bold text-white mt-1">
                      {contacts.filter((c) => c.topic !== "general").length}
                    </p>
                    <p className="text-[10px] text-ink-soft mt-2">Partnerships & onboarding queries</p>
                  </div>

                  {/* Card 4 */}
                  <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.03] to-transparent p-6 relative overflow-hidden group">
                    <span className="grid place-items-center h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <h3 className="text-ink-soft text-sm font-medium mt-4">Blog Articles</h3>
                    <p className="text-3xl font-bold text-white mt-1">{posts.length}</p>
                    <p className="text-[10px] text-ink-soft mt-2">Published content articles</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Database Connection Alert */}
                  <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 flex flex-col justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/10 text-primary shrink-0 font-bold">
                        NW
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-white">Sanity CMS Connection Status</h4>
                        <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                          {process.env.VITE_SANITY_PROJECT_ID
                            ? `Connected to project: ${process.env.VITE_SANITY_PROJECT_ID}`
                            : "Running in local fallback mode. Connect your Sanity account in the Sanity Guide tab."}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("integration")}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-white/10 hover:bg-white/[0.03] text-white transition-colors cursor-pointer w-full text-center"
                    >
                      Configure Integration
                    </button>
                  </div>

                  {/* Sanity Studio Quick Access Card */}
                  <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent p-6 flex flex-col justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/15 text-primary shrink-0 font-bold">
                        S
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-white">Sanity Studio (Content & Photos)</h4>
                        <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                          Launch the Sanity Studio interface to upload hero mockups, billboard banners, and service frames, crop them, or write blog posts with cover images.
                        </p>
                      </div>
                    </div>
                    <a
                      href="http://localhost:3333"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl lime-gradient text-ink hover:opacity-95 transition-opacity w-full text-center"
                    >
                      Launch Sanity Studio <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Waitlist */}
            {activeTab === "waitlist" && (
              <div className="space-y-6 animate-fade-up">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Waitlist Leads</h1>
                    <p className="text-ink-soft text-sm mt-1">Manage early signups for app access.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportCsv}
                      disabled={waitlist.length === 0}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <Download className="h-4 w-4" /> Export CSV
                    </button>
                  </div>
                </div>

                {/* Filter and Table */}
                <div className="rounded-2xl border border-white/5 bg-[#090909] overflow-hidden">
                  <div className="p-4 border-b border-white/5 relative">
                    <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search waitlist emails..."
                      className="w-full rounded-xl border border-white/8 bg-white/[0.02] pl-11 pr-4 py-2.5 text-xs text-white placeholder:text-ink-soft focus:border-primary/50 outline-none transition-all"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01] text-ink-soft uppercase font-semibold tracking-wider">
                          <th className="p-4 pl-6">Email Address</th>
                          <th className="p-4">Date Joined</th>
                          <th className="p-4 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWaitlist.map((w) => (
                          <tr key={w.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                            <td className="p-4 pl-6 font-medium text-white">{w.email}</td>
                            <td className="p-4 text-ink-soft">
                              {new Date(w.createdAt).toLocaleString()}
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <button
                                onClick={() => handleDeleteWaitlist(w.id)}
                                disabled={actionLoading === `delete-waitlist-${w.id}`}
                                className="text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-all disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredWaitlist.length === 0 && (
                          <tr>
                            <td colSpan={3} className="text-center p-10 text-ink-soft">
                              No waitlist entries match your search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Messages */}
            {activeTab === "messages" && (
              <div className="space-y-6 animate-fade-up">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">Contact Inbox</h1>
                  <p className="text-ink-soft text-sm mt-1">Customer inquiries and partnership queries.</p>
                </div>

                <div className="grid md:grid-cols-[1fr_1.1fr] gap-6 items-start">
                  <div className="rounded-2xl border border-white/5 bg-[#090909] overflow-hidden">
                    <div className="p-4 border-b border-white/5 relative">
                      <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search name, message..."
                        className="w-full rounded-xl border border-white/8 bg-white/[0.02] pl-11 pr-4 py-2.5 text-xs text-white placeholder:text-ink-soft focus:border-primary/50 outline-none transition-all"
                      />
                    </div>

                    <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                      {filteredContacts.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setSelectedMessage(c);
                            if (!c.read) handleMarkRead(c.id);
                          }}
                          className={`p-5 text-left cursor-pointer transition-colors relative ${
                            selectedMessage?.id === c.id
                              ? "bg-white/[0.03]"
                              : "hover:bg-white/[0.01]"
                          } ${!c.read ? "border-l-2 border-primary" : ""}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-white text-xs">
                              {c.first} {c.last}
                            </span>
                            <span className="text-[10px] text-ink-soft">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span
                              className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                c.topic === "partner"
                                  ? "bg-indigo-500/20 text-indigo-400"
                                  : c.topic === "onboarding"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-slate-500/20 text-slate-400"
                              }`}
                            >
                              {c.topic}
                            </span>
                            {c.restaurant && (
                              <span className="text-[9px] text-ink-soft truncate max-w-[150px]">
                                · {c.restaurant}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-ink-soft mt-3 line-clamp-2">{c.message}</p>
                        </div>
                      ))}

                      {filteredContacts.length === 0 && (
                        <div className="p-10 text-center text-ink-soft text-xs">
                          No messages in inbox.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-[#090909] p-6 min-h-[300px] relative">
                    {selectedMessage ? (
                      <div className="space-y-6 text-left animate-fade-up">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-bold text-white leading-snug">
                              {selectedMessage.first} {selectedMessage.last}
                            </h2>
                            <a
                              href={`mailto:${selectedMessage.email}`}
                              className="text-primary hover:underline flex items-center gap-1 mt-1 text-xs"
                            >
                              <Mail className="h-3 w-3" /> {selectedMessage.email}
                            </a>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteMessage(selectedMessage.id)}
                              className="text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <hr className="border-white/5" />

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="flex items-center gap-2 text-ink-soft">
                            <Calendar className="h-4 w-4 text-primary shrink-0" />
                            <div>
                              <p className="text-[10px] text-ink-soft/60 uppercase tracking-wider font-semibold">Date</p>
                              <p className="text-white font-medium mt-0.5">
                                {new Date(selectedMessage.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-ink-soft">
                            <Settings className="h-4 w-4 text-primary shrink-0" />
                            <div>
                              <p className="text-[10px] text-ink-soft/60 uppercase tracking-wider font-semibold">Topic</p>
                              <p className="text-white font-medium capitalize mt-0.5">
                                {selectedMessage.topic || "General"}
                              </p>
                            </div>
                          </div>

                          {selectedMessage.restaurant && (
                            <div className="flex items-center gap-2 text-ink-soft col-span-2 md:col-span-1">
                              <Building className="h-4 w-4 text-primary shrink-0" />
                              <div>
                                <p className="text-[10px] text-ink-soft/60 uppercase tracking-wider font-semibold">Restaurant</p>
                                <p className="text-white font-medium mt-0.5">{selectedMessage.restaurant}</p>
                              </div>
                            </div>
                          )}

                          {selectedMessage.city && (
                            <div className="flex items-center gap-2 text-ink-soft col-span-2 md:col-span-1">
                              <MapPin className="h-4 w-4 text-primary shrink-0" />
                              <div>
                                <p className="text-[10px] text-ink-soft/60 uppercase tracking-wider font-semibold">City</p>
                                <p className="text-white font-medium mt-0.5">{selectedMessage.city}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <hr className="border-white/5" />

                        <div className="space-y-2 text-xs">
                          <p className="text-[10px] text-ink-soft/60 uppercase tracking-wider font-semibold">Message</p>
                          <p className="text-white leading-relaxed bg-white/[0.015] border border-white/5 p-4 rounded-xl whitespace-pre-wrap">
                            {selectedMessage.message}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <span className="grid place-items-center h-12 w-12 rounded-2xl bg-white/[0.02] text-ink-soft mb-4">
                          <Mail className="h-6 w-6" />
                        </span>
                        <p className="text-sm font-semibold text-white">No Message Selected</p>
                        <p className="text-xs text-ink-soft mt-1">Select an inquiry from the inbox to read details.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Blog Posts Manager */}
            {activeTab === "blog" && (
              <div className="space-y-6 animate-fade-up">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Blog Manager</h1>
                    <p className="text-ink-soft text-sm mt-1">Create and update articles on the NoWaiting blog.</p>
                  </div>
                  <button
                    onClick={handleOpenCreateBlog}
                    className="inline-flex items-center gap-2 rounded-xl lime-gradient text-ink px-4 py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Plus className="h-4 w-4" /> Add Blog Post
                  </button>
                </div>

                {/* Filter and Table */}
                <div className="rounded-2xl border border-white/5 bg-[#090909] overflow-hidden">
                  <div className="p-4 border-b border-white/5 relative">
                    <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search articles by title or category..."
                      className="w-full rounded-xl border border-white/8 bg-white/[0.02] pl-11 pr-4 py-2.5 text-xs text-white placeholder:text-ink-soft focus:border-primary/50 outline-none transition-all"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01] text-ink-soft uppercase font-semibold tracking-wider">
                          <th className="p-4 pl-6">Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Date</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPosts.map((p) => (
                          <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                            <td className="p-4 pl-6 font-medium text-white max-w-xs truncate">{p.title}</td>
                            <td className="p-4 text-ink-soft">{p.category}</td>
                            <td className="p-4 text-ink-soft">{p.date}</td>
                            <td className="p-4 text-center">
                              {p.featured ? (
                                <span className="inline-block px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold">
                                  Featured
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded bg-white/5 text-ink-soft text-[10px]">
                                  Standard
                                </span>
                              )}
                            </td>
                            <td className="p-4 pr-6 text-right space-x-1">
                              <button
                                onClick={() => handleOpenEditBlog(p)}
                                className="text-white hover:bg-white/5 p-2 rounded-xl transition-all"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlogPost(p.id)}
                                disabled={actionLoading === `delete-blog-${p.id}`}
                                className="text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-all disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredPosts.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center p-10 text-ink-soft">
                              No blog posts found. Click "Add Blog Post" to publish an article!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Site Settings Editor */}
            {activeTab === "settings" && (
              <div className="space-y-6 animate-fade-up text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Site Content Editor</h1>
                    <p className="text-ink-soft text-sm mt-1">Configure copy variables and view size constraints for website pages.</p>
                  </div>
                  <a
                    href="http://localhost:3333"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl lime-gradient text-ink hover:opacity-95 transition-opacity"
                  >
                    Open Sanity Studio <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                {/* Sub-tab navigation */}
                <div className="flex border-b border-white/5 gap-2 pb-px overflow-x-auto">
                  {[
                    { id: "homepage", label: "Homepage Copy" },
                    { id: "homepage-photos", label: "Homepage Photos" },
                    { id: "about", label: "About Page Copy" },
                    { id: "about-photo", label: "About Photo" },
                    { id: "services", label: "Services Page" }
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setSettingsSubTab(st.id as any)}
                      className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                        settingsSubTab === st.id
                          ? "border-primary text-primary"
                          : "border-transparent text-ink-soft hover:text-white"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* Sub-tab: Homepage Copy */}
                {settingsSubTab === "homepage" && (
                  <form onSubmit={handleSaveSettings} className="rounded-2xl border border-white/5 bg-[#090909] p-6 space-y-6 max-w-2xl">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Hero Headline Line 1 (White Text)
                      </label>
                      <input
                        required
                        value={settingsLine1}
                        onChange={(e) => setSettingsLine1(e.target.value)}
                        placeholder="e.g. Skip the Queue."
                        className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Hero Headline Line 2 (Lime Gradient Text)
                      </label>
                      <input
                        required
                        value={settingsLine2}
                        onChange={(e) => setSettingsLine2(e.target.value)}
                        placeholder="e.g. Enjoy More."
                        className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Hero Introduction Paragraph
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={settingsDesc}
                        onChange={(e) => setSettingsDesc(e.target.value)}
                        placeholder="Introductory text describing the application..."
                        className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={actionLoading === "save-settings"}
                      className="inline-flex items-center gap-2 rounded-xl lime-gradient text-ink px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {actionLoading === "save-settings" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" /> Save Content Settings
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Sub-tab: Homepage Photos */}
                {settingsSubTab === "homepage-photos" && (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white">Edit Homepage Photos in Sanity Studio</h4>
                        <p className="text-xs text-ink-soft leading-relaxed max-w-xl">
                          To replace the phone mockups or billboard banner, click the link to launch your Sanity Studio. There you can drag-and-drop new pictures and configure precise hotspot cropping.
                        </p>
                      </div>
                      <a
                        href="http://localhost:3333"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl lime-gradient text-ink hover:opacity-95 transition-opacity"
                      >
                        Launch Sanity Studio <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    <div className="grid sm:grid-cols-4 gap-6">
                      {[
                        {
                          title: "Hero Mockup Left",
                          size: "480 x 1024 px",
                          aspect: "Portrait (9:19.2)",
                          desc: "Restaurant listing screen.",
                          img: settings.heroImageLeft ? urlFor(settings.heroImageLeft)?.url() : "/restaurant_list.jpg"
                        },
                        {
                          title: "Hero Mockup Center",
                          size: "480 x 1024 px",
                          aspect: "Portrait (9:19.2)",
                          desc: "App splash or main welcome.",
                          img: settings.heroImageCenter ? urlFor(settings.heroImageCenter)?.url() : "/logo_splash.jpg"
                        },
                        {
                          title: "Hero Mockup Right",
                          size: "480 x 1024 px",
                          aspect: "Portrait (9:19.2)",
                          desc: "Order status & tracker page.",
                          img: settings.heroImageRight ? urlFor(settings.heroImageRight)?.url() : "/order_tracking.jpg"
                        },
                        {
                          title: "Showcase Billboard",
                          size: "1200 x 600 px",
                          aspect: "Landscape (2:1)",
                          desc: "Large full-width showcase banner.",
                          img: settings.showcaseBanner ? urlFor(settings.showcaseBanner)?.url() : "/hero_banner.jpg",
                          isWide: true
                        }
                      ].map((item) => (
                        <div
                          key={item.title}
                          className={`rounded-2xl border border-white/5 bg-[#090909] p-5 flex flex-col justify-between ${
                            item.isWide ? "sm:col-span-2" : ""
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.title}</h4>
                              <span className="text-[10px] font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5 whitespace-nowrap">
                                {item.size}
                              </span>
                            </div>
                            <p className="text-[10px] text-ink-soft mt-1 leading-relaxed">{item.desc}</p>
                            <p className="text-[9px] text-primary/60 mt-0.5">{item.aspect}</p>
                          </div>

                          <div className={`mt-4 rounded-xl border border-white/5 bg-black/40 overflow-hidden flex items-center justify-center relative group ${
                            item.isWide ? "aspect-[2/1]" : "aspect-[9/19.2] max-h-60"
                          }`}>
                            {item.img ? (
                              <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-ink-soft">
                                <ImageIcon className="h-6 w-6 opacity-40 mb-1" />
                                <span className="text-[9px]">No image uploaded</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-tab: About Page Copy */}
                {settingsSubTab === "about" && (
                  <form onSubmit={handleSaveAboutSettings} className="rounded-2xl border border-white/5 bg-[#090909] p-6 space-y-6 max-w-3xl">
                    <div className="grid sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                          Main Eyebrow
                        </label>
                        <input
                          required
                          value={aboutEyebrow}
                          onChange={(e) => setAboutEyebrow(e.target.value)}
                          placeholder="e.g. Our Story"
                          className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                          Headline Line 1
                        </label>
                        <input
                          required
                          value={aboutTitleLine1}
                          onChange={(e) => setAboutTitleLine1(e.target.value)}
                          placeholder="e.g. Built for diners."
                          className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                          Headline Line 2
                        </label>
                        <input
                          required
                          value={aboutTitleLine2}
                          onChange={(e) => setAboutTitleLine2(e.target.value)}
                          placeholder="e.g. Designed for restaurants."
                          className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Main Description Paragraph
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={aboutDescription}
                        onChange={(e) => setAboutDescription(e.target.value)}
                        placeholder="Our story overview..."
                        className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5 border-t border-white/5 pt-5">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Mission Card</h4>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-ink-soft">Title</label>
                          <input
                            required
                            value={aboutMissionTitle}
                            onChange={(e) => setAboutMissionTitle(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-ink-soft">Body Copy</label>
                          <textarea
                            required
                            rows={3}
                            value={aboutMissionBody}
                            onChange={(e) => setAboutMissionBody(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Vision Card</h4>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-ink-soft">Title</label>
                          <input
                            required
                            value={aboutVisionTitle}
                            onChange={(e) => setAboutVisionTitle(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-ink-soft">Body Copy</label>
                          <textarea
                            required
                            rows={3}
                            value={aboutVisionBody}
                            onChange={(e) => setAboutVisionBody(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-5 space-y-4">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">The Problem Section</h4>
                      <div className="grid sm:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-ink-soft">Section Eyebrow</label>
                          <input
                            required
                            value={aboutProblemEyebrow}
                            onChange={(e) => setAboutProblemEyebrow(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white focus:border-primary/60 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-ink-soft">Title Line 1</label>
                          <input
                            required
                            value={aboutProblemTitleLine1}
                            onChange={(e) => setAboutProblemTitleLine1(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white focus:border-primary/60 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-ink-soft">Title Line 2 (Lime)</label>
                          <input
                            required
                            value={aboutProblemTitleLine2}
                            onChange={(e) => setAboutProblemTitleLine2(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white focus:border-primary/60 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                          Problem List Statements (4 bullet sentences)
                        </label>
                        {aboutProblemItems.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <span className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-xs text-primary shrink-0">
                              {index + 1}
                            </span>
                            <input
                              required
                              value={item}
                              onChange={(e) => {
                                const newItems = [...aboutProblemItems];
                                newItems[index] = e.target.value;
                                setAboutProblemItems(newItems);
                              }}
                              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white focus:border-primary/60 outline-none transition-all"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-5 space-y-4">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Why NoWaiting Section</h4>
                      <div className="grid sm:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-ink-soft">Section Eyebrow</label>
                          <input
                            required
                            value={aboutWhyEyebrow}
                            onChange={(e) => setAboutWhyEyebrow(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white focus:border-primary/60 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-ink-soft">Title Line 1</label>
                          <input
                            required
                            value={aboutWhyTitleLine1}
                            onChange={(e) => setAboutWhyTitleLine1(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white focus:border-primary/60 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-ink-soft">Title Line 2 (Lime)</label>
                          <input
                            required
                            value={aboutWhyTitleLine2}
                            onChange={(e) => setAboutWhyTitleLine2(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white focus:border-primary/60 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Description Subtitle</label>
                        <textarea
                          required
                          rows={3}
                          value={aboutWhyDescription}
                          onChange={(e) => setAboutWhyDescription(e.target.value)}
                          className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white focus:border-primary/60 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={actionLoading === "save-about"}
                      className="inline-flex items-center gap-2 rounded-xl lime-gradient text-ink px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {actionLoading === "save-about" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" /> Save About Page Copy
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Sub-tab: About Photo */}
                {settingsSubTab === "about-photo" && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white">Edit About Page Photo in Sanity Studio</h4>
                        <p className="text-xs text-ink-soft leading-relaxed max-w-xl">
                          To change the team or background illustrative photo on the About page, use Sanity Studio.
                        </p>
                      </div>
                      <a
                        href="http://localhost:3333"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl lime-gradient text-ink hover:opacity-95 transition-opacity"
                      >
                        Launch Sanity Studio <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-[#090909] p-6 max-w-md">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Illustrative About Photo</h4>
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5 whitespace-nowrap">
                          800 x 600 px
                        </span>
                      </div>
                      <p className="text-[10px] text-ink-soft mt-1 leading-relaxed">Landscape (4:3 aspect ratio). Displays as a beautiful showcase block on the story page.</p>

                      <div className="mt-4 rounded-xl border border-white/5 bg-black/40 overflow-hidden aspect-[4/3] flex items-center justify-center relative group">
                        {aboutSettings.aboutImage ? (
                          <img
                            src={urlFor(aboutSettings.aboutImage)?.url() || "/hero_banner.jpg"}
                            alt="About Us"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-ink-soft">
                            <ImageIcon className="h-8 w-8 opacity-40 mb-1" />
                            <span className="text-[10px]">No image uploaded (using fallback banner)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-tab: Services Page */}
                {settingsSubTab === "services" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-white">Services List</h3>
                        <p className="text-ink-soft text-xs mt-1">Manage the superpowers/capabilities showcased on the site.</p>
                      </div>
                      <button
                        onClick={handleOpenCreateService}
                        className="inline-flex items-center gap-2 rounded-xl lime-gradient text-ink px-4 py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                      >
                        <Plus className="h-4 w-4" /> Add Service Superpower
                      </button>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-[#090909] overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01] text-ink-soft uppercase font-semibold tracking-wider">
                              <th className="p-4 pl-6">Order</th>
                              <th className="p-4">Icon</th>
                              <th className="p-4">Service Title</th>
                              <th className="p-4">Tagline</th>
                              <th className="p-4">Mockup Image</th>
                              <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {services.map((s) => (
                              <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                                <td className="p-4 pl-6 font-semibold text-primary">{s.order}</td>
                                <td className="p-4 font-mono text-white">{s.icon}</td>
                                <td className="p-4 font-medium text-white">{s.title}</td>
                                <td className="p-4 text-ink-soft max-w-xs truncate">{s.tagline}</td>
                                <td className="p-4">
                                  <span className="text-[10px] text-ink-soft bg-white/5 px-2 py-1 rounded">
                                    {s.image ? "Sanity Upload" : "Static Default"}
                                  </span>
                                </td>
                                <td className="p-4 pr-6 text-right space-x-1">
                                  <button
                                    onClick={() => handleOpenEditService(s)}
                                    className="text-white hover:bg-white/5 p-2 rounded-xl transition-all"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteService(s.id)}
                                    disabled={actionLoading === `delete-service-${s.id}`}
                                    className="text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-all disabled:opacity-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {services.length === 0 && (
                              <tr>
                                <td colSpan={6} className="text-center p-10 text-ink-soft">
                                  No services configured. Click "Add Service Superpower" to get started!
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Integration */}
            {activeTab === "integration" && (
              <div className="space-y-6 text-left animate-fade-up">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">Sanity CMS Setup Guide</h1>
                  <p className="text-ink-soft text-sm mt-1">Step-by-step instructions to configure your Sanity project.</p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.02] to-transparent p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="h-5 w-5 rounded-md lime-gradient text-ink inline-flex items-center justify-center text-[10px] font-bold">1</span>
                      Create Sanity Project
                    </h3>
                    <p className="text-xs text-ink-soft mt-2 leading-relaxed pl-7">
                      Run <code className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">npm create sanity@latest</code> or sign in to your dashboard at <a href="https://sanity.io" target="_blank" className="text-primary hover:underline inline-flex items-center gap-0.5">sanity.io <ExternalLink className="h-3 w-3" /></a> to create a new project.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="h-5 w-5 rounded-md lime-gradient text-ink inline-flex items-center justify-center text-[10px] font-bold">2</span>
                      Retrieve Project Details
                    </h3>
                    <p className="text-xs text-ink-soft mt-2 pl-7 leading-relaxed">
                      Go to the Sanity project dashboard, grab your <b>Project ID</b>, set the dataset to <code className="bg-white/10 px-1 py-0.5 rounded text-[10px]">production</code>, and create a <b>Write Token</b> (API settings &rarr; Add API Token &rarr; Select "Editor" or "Contributor" permissions).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="h-5 w-5 rounded-md lime-gradient text-ink inline-flex items-center justify-center text-[10px] font-bold">3</span>
                      Add Environment Variables
                    </h3>
                    <p className="text-xs text-ink-soft mt-2 pl-7 leading-relaxed">
                      Add these variables to your local <code className="bg-white/10 px-1 py-0.5 rounded text-[10px]">.env</code> file:
                    </p>
                    <pre className="mt-2.5 ml-7 p-4 bg-black border border-white/5 rounded-xl text-[10px] text-green-400 font-mono select-all whitespace-pre-wrap">
{`VITE_SANITY_PROJECT_ID="your_project_id"
VITE_SANITY_DATASET="production"
SANITY_WRITE_TOKEN="your_write_token_with_editor_rights"`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="h-5 w-5 rounded-md lime-gradient text-ink inline-flex items-center justify-center text-[10px] font-bold">4</span>
                      Sanity Schema Structures
                    </h3>
                    <p className="text-xs text-ink-soft mt-2 pl-7 leading-relaxed">
                      We have generated standard schemas for your blog posts, landing settings, waitlists, and contact queries. Look in the local <code className="bg-white/10 px-1 py-0.5 rounded text-[10px]">sanity-schemas/</code> folder or copy them below to drop into your Sanity Studio.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Blog Post Add/Edit Modal */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in text-left">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0E0E0E] p-8 shadow-elev animate-fade-up">
            <button
              onClick={() => setBlogModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/[0.04] border border-white/8 text-ink-soft hover:text-white transition-all hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">
              {editingPost ? "Edit Blog Article" : "Create New Blog Article"}
            </h2>

            <form onSubmit={handleSaveBlogPost} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Article Title
                </label>
                <input
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Why virtual queues are the future of dining out"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  List Summary / Excerpt
                </label>
                <textarea
                  required
                  rows={2}
                  value={postExcerpt}
                  onChange={(e) => setPostExcerpt(e.target.value)}
                  placeholder="A short description of the post shown in card listings..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Category
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0E0E0E] text-white px-4 py-3 text-sm focus:border-primary/60 outline-none transition-all"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#0E0E0E]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Publish Date
                  </label>
                  <input
                    required
                    type="date"
                    value={postDate}
                    onChange={(e) => setPostDate(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0E0E0E] text-white px-4 py-3 text-sm focus:border-primary/60 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Read Time
                  </label>
                  <input
                    required
                    value={postRead}
                    onChange={(e) => setPostRead(e.target.value)}
                    placeholder="e.g. 5 min"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={postFeatured}
                  onChange={(e) => setPostFeatured(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-white/10 bg-white/[0.04] text-primary focus:ring-primary/20 outline-none"
                />
                <label htmlFor="featured" className="text-sm font-medium text-white select-none cursor-pointer">
                  Feature this post at the top of the blog page
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Body Content
                </label>
                <textarea
                  required
                  rows={8}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Write full article text here..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBlogModalOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "save-blog"}
                  className="inline-flex items-center gap-2 rounded-xl lime-gradient text-ink px-5 py-2.5 text-xs font-semibold hover:opacity-95 disabled:opacity-50"
                >
                  {actionLoading === "save-blog" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" /> Save Post
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Add/Edit Modal */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in text-left">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0E0E0E] p-8 shadow-elev animate-fade-up">
            <button
              onClick={() => setServiceModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/[0.04] border border-white/8 text-ink-soft hover:text-white transition-all hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">
              {editingService ? "Edit Service Superpower" : "Add Service Superpower"}
            </h2>

            <form onSubmit={handleSaveService} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Service Title
                  </label>
                  <input
                    required
                    value={serviceTitle}
                    onChange={(e) => setServiceTitle(e.target.value)}
                    placeholder="e.g. Restaurant Discovery"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-ink-soft focus:border-primary/60 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Lucide Icon Name
                  </label>
                  <input
                    required
                    value={serviceIcon}
                    onChange={(e) => setServiceIcon(e.target.value)}
                    placeholder="e.g. Compass, Clock3, Users, CalendarCheck"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white focus:border-primary/60 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Tagline / Brief Headline
                </label>
                <input
                  required
                  value={serviceTagline}
                  onChange={(e) => setServiceTagline(e.target.value)}
                  placeholder="e.g. Find your next favorite — not just another place to eat."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white focus:border-primary/60 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Bullet Features (Semicolon-separated)
                </label>
                <input
                  required
                  value={serviceBullets}
                  onChange={(e) => setServiceBullets(e.target.value)}
                  placeholder="e.g. Curated lists; Personalized recommendations; Verified ratings"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white focus:border-primary/60 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Use Case Example
                </label>
                <textarea
                  required
                  rows={2}
                  value={serviceUseCase}
                  onChange={(e) => setServiceUseCase(e.target.value)}
                  placeholder="e.g. Date night? Discovery surfaces the right place instantly."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white focus:border-primary/60 outline-none transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Sort Order (Number)
                  </label>
                  <input
                    required
                    type="number"
                    value={serviceOrder}
                    onChange={(e) => setServiceOrder(parseInt(e.target.value) || 0)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0E0E0E] text-white px-4 py-3 text-sm focus:border-primary/60 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col justify-end pb-1.5">
                  <div className="text-[10px] text-ink-soft leading-relaxed">
                    <span className="font-bold text-white uppercase block">Image Requirement:</span>
                    Mockup portrait screen image of <b>480 x 1024 px</b> should be uploaded in Sanity Studio.
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "save-service"}
                  className="inline-flex items-center gap-2 rounded-xl lime-gradient text-ink px-5 py-2.5 text-xs font-semibold hover:opacity-95 disabled:opacity-50"
                >
                  {actionLoading === "save-service" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" /> Save Superpower
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

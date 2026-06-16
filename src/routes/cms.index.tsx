import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users,
  MessageSquare,
  Search,
  Download,
  Trash2,
  ExternalLink,
  LogOut,
  CheckCircle,
  Mail,
  Building,
  MapPin,
  Calendar,
  TrendingUp,
  X,
  Loader2,
  Menu,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import {
  getSubmissions,
  deleteWaitlistEntry,
  deleteContactSubmission,
  markContactMessageRead
} from "../lib/api/cms.functions";

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

type ActiveTab = "overview" | "waitlist" | "messages";

function CmsDashboardPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactEntry | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const token = typeof window !== "undefined" ? sessionStorage.getItem("admin_token") || "" : "";

  // Load data
  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const result = await getSubmissions({ data: { token } });
      setWaitlist(result.waitlist || []);
      setContacts(result.contacts || []);
    } catch (error) {
      console.error("Failed to load submissions:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate({ to: "/cms/login" });
    } else {
      loadData();
    }
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

  const unreadCount = contacts.filter((c) => !c.read).length;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#070707]">
      {/* Mobile Sticky Header */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0A0A0A] sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 lime-gradient rounded-lg flex items-center justify-center font-bold text-ink">
            NW
          </span>
          <span className="font-bold text-white text-lg tracking-tight">Admin CMS</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-white/[0.03] border border-white/8 text-white hover:bg-white/5 transition-all"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 border-r border-white/5 bg-[#0A0A0A] p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:flex lg:z-auto shrink-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
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
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id as ActiveTab);
                  setSearchQuery("");
                  setIsMobileMenuOpen(false);
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

            <div className="h-px bg-white/5 my-4" />

            <a
              href="http://localhost:3333"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-ink-soft hover:bg-white/[0.03] hover:text-white transition-all"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4.5 w-4.5 text-primary" />
                Launch Sanity Studio
              </div>
            </a>
          </nav>
        </div>

        <button
          onClick={() => {
            setIsMobileMenuOpen(false);
            handleLogout();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all mt-auto"
        >
          <LogOut className="h-4.5 w-4.5" />
          Log Out
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
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

                <div className="grid sm:grid-cols-3 gap-6">
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
                    <h3 className="text-ink-soft text-sm font-medium mt-4">Total Inquiries</h3>
                    <p className="text-3xl font-bold text-white mt-1">{contacts.length}</p>
                    <p className="text-[10px] text-ink-soft mt-2">Messages from contact form</p>
                  </div>

                  {/* Card 3 */}
                  <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.03] to-transparent p-6 relative overflow-hidden group">
                    <span className="grid place-items-center h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                      <CheckCircle className="h-5 w-5" />
                    </span>
                    <h3 className="text-ink-soft text-sm font-medium mt-4">Unread Messages</h3>
                    <p className="text-3xl font-bold text-white mt-1">{unreadCount}</p>
                    <p className="text-[10px] text-ink-soft mt-2">Pending customer inquiries</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Sanity CMS Connection Status */}
                  <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 flex flex-col justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/10 text-primary shrink-0 font-bold">
                        NW
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-white">Sanity CMS Connection Status</h4>
                        <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                          {process.env.VITE_SANITY_PROJECT_ID
                            ? `Connected to Sanity project: ${process.env.VITE_SANITY_PROJECT_ID}`
                            : "Running in local fallback mode."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sanity Studio Quick Access Card */}
                  <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent p-6 flex flex-col justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/15 text-primary shrink-0 font-bold">
                        S
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-white">Launch Sanity Studio</h4>
                        <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                          Access your Sanity Studio directly to upload hero images, change mockup photos, crop banners, or write blog posts.
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
                    <table className="w-full text-left text-xs border-collapse min-w-[500px]">
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
                  <div className={`rounded-2xl border border-white/5 bg-[#090909] overflow-hidden ${selectedMessage ? "hidden md:block" : "block"}`}>
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

                  <div className={`rounded-2xl border border-white/5 bg-[#090909] p-6 min-h-[300px] relative ${!selectedMessage ? "hidden md:block" : "block"}`}>
                    {selectedMessage && (
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="md:hidden flex items-center gap-2 text-primary hover:underline mb-4 text-xs font-semibold"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back to Inbox
                      </button>
                    )}
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
                            <CheckCircle className="h-4 w-4 text-primary shrink-0" />
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
          </div>
        )}
      </main>
    </div>
  );
}

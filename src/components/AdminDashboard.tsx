import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, 
  LogIn, 
  Layers, 
  Mail, 
  BarChart3, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  Archive, 
  ExternalLink,
  Loader2,
  Sparkles,
  ArrowLeft,
  X,
  FileCheck,
  CheckCircle,
  Copy
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Legend
} from "recharts";
import { Project, ContactMessage, AnalyticsSummary } from "../types";
import { API } from "../lib/api";
import { User } from "firebase/auth";

interface AdminDashboardProps {
  user: User | null;
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function AdminDashboard({ user, isAdmin, onLogin, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "projects" | "messages">("analytics");
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // CRUD Form State
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    image: "",
    category: "Web Development" as any,
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    featured: false
  });

  // Selected Message State for Detailed view
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageFilter, setMessageFilter] = useState<"all" | "unread" | "read" | "archived">("all");

  const loadDashboardData = async () => {
    if (!user || !isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      const [analyticsData, projectsData, messagesData] = await Promise.all([
        API.getAnalytics(),
        API.getProjects(),
        API.getContactMessages()
      ]);
      setAnalytics(analyticsData);
      setProjects(projectsData);
      setMessages(messagesData);
    } catch (err: any) {
      console.error("Error loading dashboard data:", err);
      setError(err.message || "Failed to sync secure dashboard logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user, isAdmin]);

  // Handle Project Form Submission (Create or Update)
  const handleProjectSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.description || !formState.category) {
      setError("Please fill in all required project fields.");
      return;
    }

    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);

    const techArray = formState.technologies
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      title: formState.title,
      description: formState.description,
      image: formState.image,
      category: formState.category,
      technologies: techArray,
      githubUrl: formState.githubUrl,
      liveUrl: formState.liveUrl,
      featured: formState.featured
    };

    try {
      if (editingProject) {
        await API.updateProject(editingProject.id, payload);
        setSuccessMsg(`Project "${payload.title}" updated successfully.`);
      } else {
        await API.createProject(payload);
        setSuccessMsg(`Project "${payload.title}" created successfully.`);
      }
      setProjectFormOpen(false);
      setEditingProject(null);
      // Reload Data
      const [projectsData, analyticsData] = await Promise.all([
        API.getProjects(),
        API.getAnalytics()
      ]);
      setProjects(projectsData);
      setAnalytics(analyticsData);
    } catch (err: any) {
      setError(err.message || "Failed to commit project write.");
    } finally {
      setActionLoading(false);
    }
  };

  // Pre-populate form for editing
  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setFormState({
      title: project.title,
      description: project.description,
      image: project.image,
      category: project.category,
      technologies: project.technologies.join(", "),
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      featured: project.featured
    });
    setProjectFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingProject(null);
    setFormState({
      title: "",
      description: "",
      image: "",
      category: "Web Development",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
      featured: false
    });
    setProjectFormOpen(true);
  };

  // Delete Project
  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete project "${title}"?`)) {
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      await API.deleteProject(id);
      setSuccessMsg(`Project "${title}" deleted successfully.`);
      const [projectsData, analyticsData] = await Promise.all([
        API.getProjects(),
        API.getAnalytics()
      ]);
      setProjects(projectsData);
      setAnalytics(analyticsData);
    } catch (err: any) {
      setError(err.message || "Failed to delete project.");
    } finally {
      setActionLoading(false);
    }
  };

  // Update Message Status (Read/Archived)
  const handleUpdateMessageStatus = async (id: string, status: "unread" | "read" | "archived") => {
    setActionLoading(true);
    setError(null);
    try {
      await API.updateMessageStatus(id, status);
      const [messagesData, analyticsData] = await Promise.all([
        API.getContactMessages(),
        API.getAnalytics()
      ]);
      setMessages(messagesData);
      setAnalytics(analyticsData);
      // Update selected message locally
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, status } : null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update message state.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Contact Message
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact message?")) {
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      await API.deleteMessage(id);
      setSelectedMessage(null);
      const [messagesData, analyticsData] = await Promise.all([
        API.getContactMessages(),
        API.getAnalytics()
      ]);
      setMessages(messagesData);
      setAnalytics(analyticsData);
    } catch (err: any) {
      setError(err.message || "Failed to delete message.");
    } finally {
      setActionLoading(false);
    }
  };

  // Copy AI draft to clipboard
  const [copied, setCopied] = useState(false);
  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtered Messages
  const filteredMessages = messages.filter(m => {
    if (messageFilter === "all") return true;
    return m.status === messageFilter;
  });

  // Recharts Colors
  const COLORS = ["#3b82f6", "#6366f1", "#10b981", "#f59e0b", "#ec4899"];

  // 1. Unauthenticated Login Screen
  if (!user) {
    return (
      <section id="admin-login-view" className="bg-slate-950 min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl z-0 pointer-events-none" />
        
        <div className="max-w-md w-full bg-slate-950 border border-slate-900 rounded-3xl p-8 shadow-2xl relative z-10 text-center space-y-6">
          <div className="mx-auto bg-blue-950/40 border border-blue-900/50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-500">
            <ShieldAlert className="w-6 h-6" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Administrative Portal</h2>
            <p className="text-xs text-slate-500 leading-normal">
              Access is restricted to authorized James Tech personnel only. Please sign in via Google to verify your credentials.
            </p>
          </div>

          <button
            id="admin-btn-google-login"
            onClick={onLogin}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with Google Admin</span>
          </button>
        </div>
      </section>
    );
  }

  // 2. Unauthorized Screen
  if (!isAdmin) {
    return (
      <section id="admin-unauthorized-view" className="bg-slate-950 min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden">
        <div className="max-w-md w-full bg-slate-950 border border-slate-900 rounded-3xl p-8 shadow-2xl relative z-10 text-center space-y-6">
          <div className="mx-auto bg-red-950/40 border border-red-900/50 w-12 h-12 rounded-2xl flex items-center justify-center text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Not Authorized</h2>
            <p className="text-xs text-red-400 leading-normal font-semibold">
              The credentials for ({user.email}) are not recognized as an administrator.
            </p>
            <p className="text-xs text-slate-500 leading-normal pt-1">
              If you believe this is an error, please contact James Tech Systems Operations.
            </p>
          </div>

          <button
            id="unauthorized-btn-logout"
            onClick={onLogout}
            className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Log Out Session
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="admin-dashboard-view" className="bg-slate-950 min-h-screen pt-28 pb-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top welcome info bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-6 mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <ShieldAlert className="w-6 h-6 text-blue-500" />
              <span>James Tech Ledger Admin</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Active Session: <span className="font-mono text-slate-300">{user.email}</span> (Bootstrapped Admin Node)
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-slate-900/60 p-1 border border-slate-900 rounded-2xl w-full sm:w-auto">
            <button
              id="dash-tab-btn-analytics"
              onClick={() => setActiveTab("analytics")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === "analytics" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Metrics</span>
            </button>
            <button
              id="dash-tab-btn-projects"
              onClick={() => setActiveTab("projects")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === "projects" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Case Studies</span>
            </button>
            <button
              id="dash-tab-btn-messages"
              onClick={() => {
                setActiveTab("messages");
                setSelectedMessage(null);
              }}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 relative ${
                activeTab === "messages" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Client Inbox</span>
              {analytics && analytics.unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {analytics.unreadMessagesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Global feedbacks */}
        {error && (
          <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl flex items-center space-x-2 text-red-400 text-xs font-semibold mb-6">
            <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl flex items-center space-x-2 text-emerald-400 text-xs font-semibold mb-6">
            <CheckCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Loading Indicator */}
        {loading ? (
          <div id="dash-loading" className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-xs text-slate-500 font-mono">Syncing system operations...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* 1. ANALYTICS TAB */}
            {activeTab === "analytics" && analytics && (
              <motion.div
                key="analytics-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Total Projects */}
                  <div className="bg-slate-950/40 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Active Case Studies</span>
                    <span className="text-4xl font-extrabold text-white mt-2 font-mono">{analytics.totalProjects}</span>
                    <span className="text-[10px] text-slate-500 mt-2 font-semibold">Total published showcase nodes</span>
                  </div>

                  {/* Total Messages */}
                  <div className="bg-slate-950/40 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Logged Contact Packets</span>
                    <span className="text-4xl font-extrabold text-white mt-2 font-mono">{analytics.totalMessages}</span>
                    <span className="text-[10px] text-slate-500 mt-2 font-semibold">Contact inquiries in directory</span>
                  </div>

                  {/* Pending Messages */}
                  <div className="bg-slate-950/40 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Pending Response</span>
                      {analytics.unreadMessagesCount > 0 && (
                        <span className="bg-amber-950/30 border border-amber-900/50 text-amber-500 text-[9px] font-bold px-2 py-0.5 rounded-md">
                          Warning State
                        </span>
                      )}
                    </div>
                    <span className="text-4xl font-extrabold text-white mt-2 font-mono">{analytics.unreadMessagesCount}</span>
                    <span className="text-[10px] text-slate-500 mt-2 font-semibold">Inquiries currently in unread queue</span>
                  </div>
                </div>

                {/* Charts section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Category Pie Chart */}
                  <div className="bg-slate-950/40 border border-slate-900 p-6 sm:p-8 rounded-2xl space-y-4">
                    <h3 className="text-sm font-bold text-white tracking-tight font-mono uppercase">Case Study Segmentations</h3>
                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.categoryDistribution.filter(c => c.value > 0)}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {analytics.categoryDistribution.filter(c => c.value > 0).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "12px", fontSize: "12px" }}
                            itemStyle={{ color: "#f8fafc" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Legend Labels */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-[10px] font-semibold text-slate-400">
                      {analytics.categoryDistribution.map((entry, index) => (
                        <div key={index} className="flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span>{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Distribution Bar Chart */}
                  <div className="bg-slate-950/40 border border-slate-900 p-6 sm:p-8 rounded-2xl space-y-4">
                    <h3 className="text-sm font-bold text-white tracking-tight font-mono uppercase">Workload Capacity</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.categoryDistribution}>
                          <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "12px", fontSize: "12px" }}
                            itemStyle={{ color: "#f8fafc" }}
                          />
                          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                            {analytics.categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Recent submissions list */}
                <div className="bg-slate-950/40 border border-slate-900 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white tracking-tight font-mono uppercase">Recent Submissions Ingress</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-900 text-slate-500">
                          <th className="py-3 font-semibold">Client Name</th>
                          <th className="py-3 font-semibold">Subject</th>
                          <th className="py-3 font-semibold">Status</th>
                          <th className="py-3 font-semibold">Timestamp</th>
                          <th className="py-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.recentSubmissions.map((msg) => (
                          <tr key={msg.id} className="border-b border-slate-900 hover:bg-slate-900/10">
                            <td className="py-3.5 font-semibold text-white">{msg.name}</td>
                            <td className="py-3.5 text-slate-300 max-w-xs truncate">{msg.subject}</td>
                            <td className="py-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                msg.status === "unread" 
                                  ? "bg-amber-950/40 border border-amber-900/50 text-amber-400"
                                  : msg.status === "read"
                                  ? "bg-blue-950/40 border border-blue-900/50 text-blue-400"
                                  : "bg-slate-900 border border-slate-800 text-slate-500"
                              }`}>
                                {msg.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-slate-500 font-mono">{new Date(msg.createdAt).toLocaleDateString()}</td>
                            <td className="py-3.5 text-right">
                              <button
                                onClick={() => {
                                  setActiveTab("messages");
                                  setSelectedMessage(msg);
                                }}
                                className="text-blue-500 hover:text-blue-400 font-semibold cursor-pointer"
                              >
                                Review Packet
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. PROJECTS TAB */}
            {activeTab === "projects" && (
              <motion.div
                key="projects-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white tracking-tight font-mono uppercase">Case Study Directory</h3>
                  <button
                    id="dash-btn-add-project"
                    onClick={handleCreateClick}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Node</span>
                  </button>
                </div>

                {/* Table list */}
                <div className="bg-slate-950/40 border border-slate-900 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-900 bg-slate-900/10 text-slate-500">
                          <th className="p-4 font-semibold">Title</th>
                          <th className="p-4 font-semibold">Division</th>
                          <th className="p-4 font-semibold">Tech Stack</th>
                          <th className="p-4 font-semibold text-center">Featured</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((proj) => (
                          <tr key={proj.id} className="border-b border-slate-900 hover:bg-slate-900/10">
                            <td className="p-4 font-bold text-white">{proj.title}</td>
                            <td className="p-4 text-slate-400">{proj.category}</td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1 max-w-[240px]">
                                {proj.technologies.map((t, idx) => (
                                  <span key={idx} className="bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-400">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`inline-block w-2.5 h-2.5 rounded-full ${proj.featured ? "bg-emerald-500" : "bg-slate-800"}`} />
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end space-x-2">
                                <button
                                  id={`dash-project-edit-${proj.id}`}
                                  onClick={() => handleEditClick(proj)}
                                  className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-blue-500 hover:text-blue-400 cursor-pointer"
                                  title="Edit Project"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  id={`dash-project-delete-${proj.id}`}
                                  onClick={() => handleDeleteProject(proj.id, proj.title)}
                                  className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-red-500 hover:text-red-400 cursor-pointer"
                                  title="Delete Project"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Create/Edit Drawer Modal */}
                <AnimatePresence>
                  {projectFormOpen && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-end">
                      <motion.div
                        initial={{ opacity: 0, x: 200 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 200 }}
                        className="bg-slate-950 border-l border-slate-900 w-full max-w-lg h-full flex flex-col justify-between shadow-2xl"
                      >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-900 flex justify-between items-center">
                          <h3 className="text-sm font-bold text-white tracking-tight font-mono uppercase">
                            {editingProject ? "MODIFY CASE STUDY" : "CREATE NEW CASE STUDY"}
                          </h3>
                          <button
                            id="dash-form-close-btn"
                            onClick={() => setProjectFormOpen(false)}
                            className="text-slate-500 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Form body */}
                        <form onSubmit={handleProjectSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
                          {/* Title */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                              Project Title *
                            </label>
                            <input
                              id="form-title"
                              type="text"
                              required
                              placeholder="e.g. Healthcare Automation API"
                              value={formState.title}
                              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-850 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* Category */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                              Tech Service Division *
                            </label>
                            <select
                              id="form-category"
                              value={formState.category}
                              onChange={(e) => setFormState({ ...formState, category: e.target.value as any })}
                              className="w-full bg-slate-900 border border-slate-850 text-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                            >
                              <option value="Web Development">Web Development</option>
                              <option value="Full-Stack Applications">Full-Stack Applications</option>
                              <option value="IT Support">IT Support</option>
                              <option value="Network Administration">Network Administration</option>
                              <option value="Digital Solutions">Digital Solutions</option>
                            </select>
                          </div>

                          {/* Technologies */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                              Technologies (comma separated) *
                            </label>
                            <input
                              id="form-tech"
                              type="text"
                              required
                              placeholder="e.g. React, Node.js, Firestore, Tailwind"
                              value={formState.technologies}
                              onChange={(e) => setFormState({ ...formState, technologies: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-850 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* Image */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                              Thumbnail Image URL
                            </label>
                            <input
                              id="form-image"
                              type="text"
                              placeholder="e.g. https://images.unsplash.com/photo-..."
                              value={formState.image}
                              onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-850 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* Live URL */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                              Live Production Link
                            </label>
                            <input
                              id="form-live"
                              type="text"
                              placeholder="e.g. https://portal.jamestech.com"
                              value={formState.liveUrl}
                              onChange={(e) => setFormState({ ...formState, liveUrl: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-850 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* GitHub URL */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                              GitHub Code Link
                            </label>
                            <input
                              id="form-github"
                              type="text"
                              placeholder="e.g. https://github.com/jamestech/..."
                              value={formState.githubUrl}
                              onChange={(e) => setFormState({ ...formState, githubUrl: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-850 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* Description */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                              Case Description / Outline *
                            </label>
                            <textarea
                              id="form-desc"
                              rows={4}
                              required
                              placeholder="Document scope, user impact, architecture specifications, or business outcomes achieved..."
                              value={formState.description}
                              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-850 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-blue-500 resize-none"
                            />
                          </div>

                          {/* Featured toggle */}
                          <div className="flex items-center space-x-3 bg-slate-900/40 p-3.5 rounded-xl border border-slate-900">
                            <input
                              id="form-featured"
                              type="checkbox"
                              checked={formState.featured}
                              onChange={(e) => setFormState({ ...formState, featured: e.target.checked })}
                              className="w-4.5 h-4.5 text-blue-600 focus:ring-blue-500 border-slate-800 rounded bg-slate-900"
                            />
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-bold text-white">Feature on Landing Page</span>
                              <span className="text-[10px] text-slate-500 font-semibold">Expose case card in the main hero highlights</span>
                            </div>
                          </div>
                        </form>

                        {/* Footer Buttons */}
                        <div className="p-6 border-t border-slate-900 bg-slate-950 flex space-x-3">
                          <button
                            id="form-cancel-btn"
                            type="button"
                            onClick={() => setProjectFormOpen(false)}
                            className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Discard
                          </button>
                          <button
                            id="form-submit-btn"
                            onClick={handleProjectSubmit}
                            disabled={actionLoading}
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1"
                          >
                            {actionLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <span>Save Case Study</span>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* 3. MESSAGES TAB */}
            {activeTab === "messages" && (
              <motion.div
                key="messages-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left side list */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Status Filters */}
                  <div className="flex bg-slate-900/60 p-1 border border-slate-900 rounded-2xl">
                    {["all", "unread", "read", "archived"].map((filt) => (
                      <button
                        key={filt}
                        id={`msg-filter-btn-${filt}`}
                        onClick={() => {
                          setMessageFilter(filt as any);
                          setSelectedMessage(null);
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          messageFilter === filt ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {filt}
                      </button>
                    ))}
                  </div>

                  {/* Message List */}
                  <div className="bg-slate-950/40 border border-slate-900 rounded-2xl max-h-[60vh] overflow-y-auto divide-y divide-slate-900">
                    {filteredMessages.length === 0 ? (
                      <div className="p-10 text-center text-slate-500 text-xs">
                        No contact packets found in index.
                      </div>
                    ) : (
                      filteredMessages.map((msg) => (
                        <div
                          key={msg.id}
                          id={`msg-card-list-item-${msg.id}`}
                          onClick={() => setSelectedMessage(msg)}
                          className={`p-4 text-left cursor-pointer transition-all ${
                            selectedMessage && selectedMessage.id === msg.id
                              ? "bg-blue-950/20 border-l-2 border-blue-500"
                              : "hover:bg-slate-900/40 border-l-2 border-transparent"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-white text-xs truncate max-w-[150px]">{msg.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{new Date(msg.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 font-semibold truncate mt-1">{msg.subject}</p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{msg.message}</p>
                          
                          <div className="flex space-x-2 mt-3">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide ${
                              msg.status === "unread" ? "bg-amber-950/40 text-amber-500 border border-amber-900/50" : "bg-slate-900 text-slate-500"
                            }`}>
                              {msg.status}
                            </span>
                            {msg.aiSuggestedReply && (
                              <span className="bg-blue-950/40 text-blue-400 border border-blue-900/50 text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>AI Drafted</span>
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right side detail pane */}
                <div className="lg:col-span-7">
                  <AnimatePresence mode="wait">
                    {selectedMessage ? (
                      <motion.div
                        key={`msg-detail-${selectedMessage.id}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-slate-950/40 border border-slate-900 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl"
                      >
                        {/* Header bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
                          <div>
                            <h4 className="text-sm font-bold text-white tracking-tight">{selectedMessage.name}</h4>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedMessage.email}</p>
                          </div>

                          {/* Quick statuses */}
                          <div className="flex items-center space-x-2">
                            {selectedMessage.status === "unread" && (
                              <button
                                id="btn-mark-read"
                                onClick={() => handleUpdateMessageStatus(selectedMessage.id, "read")}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-blue-400 rounded-lg border border-slate-800 cursor-pointer flex items-center space-x-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Mark Read</span>
                              </button>
                            )}
                            {selectedMessage.status !== "archived" && (
                              <button
                                id="btn-mark-archive"
                                onClick={() => handleUpdateMessageStatus(selectedMessage.id, "archived")}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-slate-400 rounded-lg border border-slate-800 cursor-pointer flex items-center space-x-1"
                              >
                                <Archive className="w-3.5 h-3.5" />
                                <span>Archive</span>
                              </button>
                            )}
                            <button
                              id="btn-delete-msg"
                              onClick={() => handleDeleteMessage(selectedMessage.id)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-red-500 rounded-lg border border-slate-800 cursor-pointer"
                              title="Delete Message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Message body */}
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">SUBJECT</span>
                            <p className="text-sm font-bold text-white leading-normal">{selectedMessage.subject}</p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">MESSAGE CONTENT</span>
                            <div className="bg-slate-900/40 p-4 border border-slate-900 rounded-2xl text-xs text-slate-300 font-medium font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                              {selectedMessage.message}
                            </div>
                          </div>
                        </div>

                        {/* AI Suggested Response Block */}
                        {selectedMessage.aiSuggestedReply && (
                          <div className="bg-slate-900/40 p-5 sm:p-6 border border-slate-850 rounded-2xl space-y-4 shadow-inner">
                            <div className="flex justify-between items-center border-b border-slate-850 pb-2.5">
                              <div className="flex items-center space-x-2 text-blue-400">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-xs font-mono font-bold tracking-wide">AI-SUGGESTED RESPONSE EMAIL</span>
                              </div>
                              <button
                                id="btn-copy-reply"
                                onClick={() => handleCopyDraft(selectedMessage.aiSuggestedReply || "")}
                                className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-[10px] font-bold uppercase rounded hover:text-white flex items-center space-x-1 text-slate-400"
                              >
                                {copied ? (
                                  <>
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy Draft</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <p className="text-xs text-slate-400 leading-normal font-medium">
                              This reply was automatically prepared on receipt by James Tech AI Broker using Google Gemini 3.5. Review, copy, or edit this template to email the client.
                            </p>

                            <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl text-xs text-slate-300 font-sans font-medium whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                              {selectedMessage.aiSuggestedReply}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <div className="h-full border border-dashed border-slate-900 rounded-3xl p-16 text-center text-slate-500 text-xs flex flex-col items-center justify-center space-y-4">
                        <Mail className="w-8 h-8 text-slate-600" />
                        <p>Select a contact packet from the ingress queue on the left to review client requirements.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}

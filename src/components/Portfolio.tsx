import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, ExternalLink, Github, Loader2, RefreshCw, X } from "lucide-react";
import { Project } from "../types";
import { API } from "../lib/api";

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    "All",
    "Web Development",
    "Full-Stack Applications",
    "IT Support",
    "Network Administration",
    "Digital Solutions"
  ];

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await API.getProjects();
      setProjects(data);
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError(err.message || "Could not retrieve portfolio projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="portfolio-section" className="bg-slate-950 py-24 min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-900/5 rounded-full blur-3xl z-0 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div id="portfolio-header" className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Case Studies & Solutions
          </h2>
          <p className="text-slate-400 mt-4 leading-relaxed">
            Explore our real-world system deployments, custom applications, and infrastructure overhauls executed by James Tech engineers.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div id="portfolio-controls" className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-slate-950/40 border border-slate-900 p-6 rounded-3xl">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`portfolio-cat-btn-${cat.replace(/\s+/g, "-")}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850"
                }`}
              >
                {cat === "All" ? "All Deployments" : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-500" />
            <input
              id="portfolio-search-input"
              type="text"
              placeholder="Search by keyword or tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Grid Display */}
        {loading ? (
          <div id="portfolio-loading-indicator" className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-sm text-slate-400 font-mono">Quering secure project ledger...</p>
          </div>
        ) : error ? (
          <div id="portfolio-error-fallback" className="bg-slate-900/40 border border-red-900/30 p-8 rounded-3xl text-center max-w-xl mx-auto space-y-4">
            <p className="text-sm text-red-400 font-medium">{error}</p>
            <button
              onClick={fetchProjects}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry database connection</span>
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div id="portfolio-empty-state" className="text-center py-20 text-slate-500 border border-dashed border-slate-900 rounded-3xl">
            <p className="text-sm font-medium">No system case studies found matching current query filters.</p>
          </div>
        ) : (
          <motion.div
            id="portfolio-grid"
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedProject(project)}
                  className="bg-slate-950/40 border border-slate-900 hover:border-slate-800 rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between transition-all duration-300 shadow-lg shadow-slate-950/20"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden border-b border-slate-900 bg-slate-900">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-blue-400 tracking-wide">
                        {project.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Tech stack & Action bottom */}
                  <div className="p-6 pt-0 border-t border-transparent space-y-4">
                    <div className="flex flex-wrap gap-1.5 pt-4">
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-900 border border-slate-800/60 px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Project Details Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div
              id="portfolio-detail-modal-overlay"
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                id="portfolio-detail-modal-card"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-950 border border-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-950/80 flex flex-col"
              >
                {/* Header image */}
                <div className="relative h-64 sm:h-80 bg-slate-900 shrink-0 border-b border-slate-900">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Close button */}
                  <button
                    id="portfolio-modal-close-btn"
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 p-2.5 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  {/* Overlay Title */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="bg-blue-600 px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-wide uppercase">
                      {selectedProject.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-3 tracking-tight">
                      {selectedProject.title}
                    </h3>
                  </div>
                </div>

                {/* Modal Content body */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest">
                      PROJECT CASE OVERVIEW
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Technology labels */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest">
                      SYSTEM COMPONENT STACK
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-900 border border-slate-850 px-3 py-1 rounded-lg text-xs font-mono text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interactive project links */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-900">
                    {selectedProject.liveUrl && (
                      <a
                        id="portfolio-modal-live-link"
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                      >
                        <span>Access Production Site</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a
                        id="portfolio-modal-github-link"
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 px-5 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                      >
                        <span>View Source Code</span>
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

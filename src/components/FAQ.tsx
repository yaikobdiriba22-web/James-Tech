import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronDown, 
  HelpCircle, 
  Code, 
  ShieldCheck, 
  Activity, 
  Server, 
  Bot, 
  Sparkles 
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "software" | "it-network" | "general";
  icon: React.ReactNode;
}

export default function FAQ() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "software" | "it-network" | "general">("all");

  const faqData: FAQItem[] = [
    {
      id: "faq-1",
      question: "What specific software development services do you offer?",
      answer: "We engineer high-performance custom web applications, robust full-stack platforms, API integrations, and mobile-optimized interfaces. Our typical tech stack features React, TypeScript, Next.js, Node.js, and cloud ecosystems like Google Cloud, Firebase, and PostgreSQL.",
      category: "software",
      icon: <Code className="w-4 h-4" />
    },
    {
      id: "faq-2",
      question: "How do you guarantee and maintain your 99.99% uptime SLA?",
      answer: "Our Managed IT Operations and Network Administration frameworks use multi-region containerized failovers (via Cloud Run/Kubernetes), automated live telemetry dashboards, zero-trust VPN policies, and redundant network backbones. We monitor services 24/7/365 to instantly neutralize issues before they impact production environments.",
      category: "it-network",
      icon: <Server className="w-4 h-4" />
    },
    {
      id: "faq-3",
      question: "What is your typical project timeline and development process?",
      answer: "We follow an agile milestone-based delivery structure. Small-to-medium deployments typically launch within 3 to 6 weeks, while enterprise software architecture overhauls can take 2 to 4 months. Each project starts with a detailed technical consultation, followed by high-fidelity design prototypes, secure staging, and controlled rollout.",
      category: "software",
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      id: "faq-4",
      question: "Do you provide on-site IT support and office infrastructure setups?",
      answer: "Yes, we specialize in complete office networking overhauls, on-premises server configuration, automatic local-to-cloud backup routines, and hardware firewall integrations. We also offer ongoing service desk SLA retainers with 24/7 proactive system monitoring.",
      category: "it-network",
      icon: <ShieldCheck className="w-4 h-4" />
    },
    {
      id: "faq-5",
      question: "How does your secure automated customer support agent (James Bot) work?",
      answer: "James Bot is our context-aware, Gemini-powered automated assistant. It operates fully server-side to prevent sensitive API key leaks and is trained to help users review our engineering services, obtain direct contact channels, or draft scope templates instantly in real-time.",
      category: "general",
      icon: <Bot className="w-4 h-4" />
    },
    {
      id: "faq-6",
      question: "How can I request a custom consultation and get started?",
      answer: "Simply navigate to our Contact page, or click 'Request a Tech Consultation' anywhere on our platform. You can fill out our secure project scope submitter, call us directly at 0922067302, or email us at yaikobdiriba22@gmail.com. We respond within 2 hours with an initial evaluation.",
      category: "general",
      icon: <Activity className="w-4 h-4" />
    }
  ];

  const filteredFaqs = selectedCategory === "all" 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const toggleAccordion = (id: string) => {
    setActiveId(prevId => (prevId === id ? null : id));
  };

  return (
    <section id="faq-section" className="py-24 border-t border-slate-200/50 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/40 relative overflow-hidden transition-colors duration-300">
      {/* Visual background details */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.03),transparent_40%)]" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 px-3 py-1.5 rounded-2xl text-blue-600 dark:text-blue-400">
            <HelpCircle className="w-4 h-4" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase">Support Knowledgebase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            Frequently Asked Inquiries
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            Get instant answers to common questions about our software engineering methodologies, zero-trust network setups, and technical SLA policies.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: "all", label: "All Questions" },
            { id: "software", label: "Software Dev" },
            { id: "it-network", label: "IT & Networks" },
            { id: "general", label: "General & Support" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as any);
                setActiveId(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                  : "bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {filteredFaqs.map((item) => {
              const isOpen = activeId === item.id;
              return (
                <motion.div
                  key={item.id}
                  layout
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? "bg-white dark:bg-slate-900/80 border-blue-500/50 shadow-md shadow-blue-500/5"
                      : "bg-white dark:bg-slate-900/20 border-slate-200 dark:border-slate-900 hover:border-slate-300 dark:hover:border-slate-850"
                  }`}
                >
                  {/* Accordion Header Trigger */}
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Icon Container */}
                      <div className={`p-2.5 rounded-xl border transition-colors ${
                        isOpen
                          ? "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-850 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                      }`}>
                        {item.icon}
                      </div>
                      <span className={`text-sm sm:text-base font-bold tracking-tight transition-colors ${
                        isOpen 
                          ? "text-slate-900 dark:text-white" 
                          : "text-slate-700 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white"
                      }`}>
                        {item.question}
                      </span>
                    </div>

                    {/* Chevron Indicator */}
                    <div className={`p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800/60 text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-blue-500 border-blue-200 dark:border-blue-900" : ""
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Body Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        <div className="px-6 pb-6 pt-1 border-t border-slate-100 dark:border-slate-850/60 ml-14">
                          <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 leading-relaxed font-sans">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-950 rounded-2xl bg-white dark:bg-slate-900/10">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500">No questions found matching this filter.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

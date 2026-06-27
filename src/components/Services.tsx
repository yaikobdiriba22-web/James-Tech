import { useState } from "react";
import { motion } from "motion/react";
import { 
  Globe, 
  Layers, 
  Settings, 
  Network, 
  BrainCircuit, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Server,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface ServicesProps {
  setTab: (tab: string) => void;
}

export default function Services({ setTab }: ServicesProps) {
  const [activeEstimator, setActiveEstimator] = useState({
    webDev: false,
    fullStack: false,
    itSupport: false,
    networking: false,
    digitalAi: false
  });

  const services = [
    {
      id: "webDev",
      title: "Web Development",
      icon: Globe,
      color: "from-blue-500 to-cyan-400",
      bgAccent: "bg-blue-500/5 hover:border-blue-500/30",
      description: "Modern, search-engine optimized, fully accessible, and blazingly fast corporate websites, landing pages, and headless content hubs built on advanced client rendering frameworks.",
      bullets: [
        "React & Vite Single Page Architectures",
        "Headless CMS Integration (Strapi, Sanity)",
        "Mobile-First Responsive UX Auditing",
        "W3C Web Standards & Core Web Vitals Optimization"
      ]
    },
    {
      id: "fullStack",
      title: "Full-Stack Applications",
      icon: Layers,
      color: "from-indigo-500 to-purple-400",
      bgAccent: "bg-indigo-500/5 hover:border-indigo-500/30",
      description: "Custom cloud-hosted administrative panels, client portals, SaaS architectures, and relational or non-relational database models designed for secure concurrent operations.",
      bullets: [
        "Node.js + Express REST & GraphQL APIs",
        "Firestore, PostgreSQL & MongoDB Schemes",
        "JWT, OAuth & Zero-Trust Session Management",
        "Real-Time Data Streams & Socket Interactivity"
      ]
    },
    {
      id: "itSupport",
      title: "IT Support & System Administration",
      icon: Settings,
      color: "from-emerald-500 to-teal-400",
      bgAccent: "bg-emerald-500/5 hover:border-emerald-500/30",
      description: "Comprehensive diagnostics, automated infrastructure deployments, patch management, security baselines, and off-site snapshot retention schedules to safeguard daily operations.",
      bullets: [
        "Linux & Windows Directory Provisioning",
        "Ansible & Terraform Infrastructure as Code",
        "Veeam & Duplicacy Automated Backup Strategies",
        "SLA-Backed Helpdesk & Helpdesk Escalation Systems"
      ]
    },
    {
      id: "networking",
      title: "Network Administration",
      icon: Network,
      color: "from-orange-500 to-amber-400",
      bgAccent: "bg-orange-500/5 hover:border-orange-500/30",
      description: "Secure routing and switching schemes, VPN configurations, wireless heatmapping, firewall filtering rules, and SNMP telemetry monitoring solutions designed for localized network perimeters.",
      bullets: [
        "Perimeter Defense & Next-Gen Firewall Configuration",
        "Site-to-Site IPsec VPN & Remote WireGuard Setups",
        "Enterprise VLAN Segmentation & Traffic Shaping",
        "Real-Time Telemetry Maps & Alert Daemon Monitors"
      ]
    },
    {
      id: "digitalAi",
      title: "Digital Solutions & AI Integration",
      icon: BrainCircuit,
      color: "from-pink-500 to-rose-400",
      bgAccent: "bg-pink-500/5 hover:border-pink-500/30",
      description: "Harness modern Large Language Models (LLMs) such as Google Gemini to automate complex document ingestion pipelines, customer response engines, and digital marketing optimizations.",
      bullets: [
        "Server-Side Gemini LLM Integration Modules",
        "Optical Character Recognition (OCR) Intake Pipelines",
        "Automated Intelligent E-Mail Draft Response Systems",
        "Business Intelligence Reports & Analytical Insights"
      ]
    }
  ];

  // Configurator logic calculations
  const calculateEstimate = () => {
    let baseSLAHours = 24;
    let baseWeeklyHours = 0;
    let recommendedSLA = "Standard Helpdesk Plan";

    if (activeEstimator.webDev) {
      baseWeeklyHours += 15;
    }
    if (activeEstimator.fullStack) {
      baseWeeklyHours += 25;
      baseSLAHours = Math.min(baseSLAHours, 8);
    }
    if (activeEstimator.itSupport) {
      baseWeeklyHours += 10;
      baseSLAHours = Math.min(baseSLAHours, 4);
    }
    if (activeEstimator.networking) {
      baseWeeklyHours += 12;
      baseSLAHours = Math.min(baseSLAHours, 2);
    }
    if (activeEstimator.digitalAi) {
      baseWeeklyHours += 20;
    }

    if (baseSLAHours <= 2) {
      recommendedSLA = "Mission-Critical Enterprise SLA (2-Hour Uptime Guarantee)";
    } else if (baseSLAHours <= 8) {
      recommendedSLA = "Priority Gold SLA (8-Hour Turnaround)";
    } else if (baseWeeklyHours > 0) {
      recommendedSLA = "Standard Silver SLA (24-Hour Next-Business-Day)";
    } else {
      recommendedSLA = "Select at least one module below";
    }

    return {
      hours: baseWeeklyHours,
      sla: recommendedSLA,
      slaHours: baseSLAHours === 24 && baseWeeklyHours === 0 ? "N/A" : `${baseSLAHours}h Response`
    };
  };

  const estimate = calculateEstimate();

  return (
    <section id="services-section" className="bg-slate-950 py-24 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/5 rounded-full blur-3xl z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div id="services-header" className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-950/40 border border-blue-900/50 px-4 py-1.5 rounded-full text-blue-400 mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-mono font-medium tracking-wide">WHAT WE EXCEL AT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Our Enterprise Tech Offerings
          </h2>
          <p className="text-slate-400 mt-4 leading-relaxed">
            James Tech provides premium software solutions, system engineering, and IT managed services, strictly customized to fulfill strict security standards and operational objectives.
          </p>
        </div>

        {/* Services Grid */}
        <div id="services-list-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc) => {
            const IconComponent = svc.icon;
            return (
              <motion.div
                key={svc.id}
                id={`service-card-${svc.id}`}
                whileHover={{ y: -8 }}
                className={`border border-slate-900 bg-slate-950/40 p-6 sm:p-8 rounded-3xl ${svc.bgAccent} transition-all duration-300 flex flex-col justify-between group`}
              >
                <div>
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${svc.color} p-0.5 mb-6 shadow-md shadow-slate-950/50 group-hover:scale-105 transition-transform`}>
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                      <IconComponent className="w-5 h-5 text-slate-100" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white tracking-tight mb-3">
                    {svc.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {svc.description}
                  </p>

                  {/* Bullets */}
                  <ul className="space-y-2.5 mb-6 text-xs text-slate-300 font-medium">
                    {svc.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA */}
                <button
                  onClick={() => setTab("contact")}
                  className="mt-4 flex items-center space-x-1.5 text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors cursor-pointer group/btn"
                >
                  <span>Request service setup</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Estimator Panel */}
        <div id="services-sla-configurator" className="mt-20 bg-slate-950/40 border border-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Control Col */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Dynamic Service SLA Configurator
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Select the service nodes you require for your system roadmap. Our calculator dynamically analyzes required engineering capacities and recommends a response-time Service Level Agreement (SLA).
              </p>

              {/* Selector checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {services.map((svc) => (
                  <button
                    key={svc.id}
                    id={`estimator-toggle-${svc.id}`}
                    onClick={() => setActiveEstimator(prev => ({
                      ...prev,
                      [svc.id as any]: !prev[svc.id as keyof typeof activeEstimator]
                    }))}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                      activeEstimator[svc.id as keyof typeof activeEstimator]
                        ? "bg-blue-950/40 border-blue-600 text-white shadow-md shadow-blue-500/5"
                        : "bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:bg-slate-900"
                    }`}
                  >
                    <span>{svc.title}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      activeEstimator[svc.id as keyof typeof activeEstimator] ? "bg-blue-500" : "bg-slate-800"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Output Summary Col */}
            <div className="lg:col-span-5 bg-slate-950/60 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between space-y-6">
              <h4 className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-3">
                PROJECT METRICS SUMMARY
              </h4>

              <div className="space-y-4">
                {/* Weekly estimated hours */}
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-slate-400 font-medium">Estimated Scale:</span>
                  <span className="text-2xl font-bold text-white font-mono">
                    {estimate.hours} <span className="text-xs text-slate-500">h/week</span>
                  </span>
                </div>

                {/* Recommended SLA */}
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-medium block">Recommended SLA:</span>
                  <div className="flex items-center space-x-1.5 bg-blue-950/20 border border-blue-900/30 p-2.5 rounded-xl text-blue-400">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-semibold tracking-wide leading-tight">
                      {estimate.sla}
                    </span>
                  </div>
                </div>

                {/* Priority / Support Guarantee */}
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Includes live monitoring dashboards</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                id="sla-configurator-cta"
                onClick={() => setTab("contact")}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Initialize Scope Setup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion } from "motion/react";
import { ShieldCheck, Target, Cpu, Users, Award, Code, Database, Globe } from "lucide-react";

export default function About() {
  const values = [
    {
      title: "Resilience First",
      description: "We engineer systems and network configurations with multi-tier failovers, securing near-zero disruptions.",
      icon: ShieldCheck
    },
    {
      title: "Clean Integrity",
      description: "Pragmatic, high-fidelity source code with strict type-safety, documented parameters, and zero shadow code.",
      icon: Code
    },
    {
      title: "Data Guardians",
      description: "Uncompromised security guidelines incorporating attribute-based session filters and granular cloud locks.",
      icon: Database
    },
    {
      title: "Global Scalability",
      description: "Delivering edge-optimized, responsive architectures built to easily sustain multi-tenant workloads.",
      icon: Globe
    }
  ];

  return (
    <section id="about-section" className="bg-slate-950 py-24 min-h-screen relative overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        
        {/* Upper Title Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-950/40 border border-blue-900/50 px-4 py-1.5 rounded-full text-blue-400">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-mono font-medium tracking-wide">ABOUT JAMES TECH</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Zero-Compromise Engineering <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                For Scaling Ventures
              </span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Founded on the philosophy that modern companies require more than basic templates, James Tech provides custom full-stack solutions. We fuse classical network administration, zero-trust perimeter security, and responsive React frontend systems to give businesses a singular, highly resilient partner.
            </p>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="border border-slate-900 bg-slate-950/40 p-6 rounded-3xl shadow-xl flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-850 text-center">
                  <span className="text-3xl font-bold text-white font-mono">100%</span>
                  <p className="text-xs text-slate-500 mt-2 font-semibold">Client Project Delivery</p>
                </div>
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-850 text-center">
                  <span className="text-3xl font-bold text-white font-mono">5+</span>
                  <p className="text-xs text-slate-500 mt-2 font-semibold">Core Tech Divisions</p>
                </div>
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-850 text-center">
                  <span className="text-3xl font-bold text-white font-mono">99.9%</span>
                  <p className="text-xs text-slate-500 mt-2 font-semibold">Critical Uptime SLA</p>
                </div>
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-850 text-center">
                  <span className="text-3xl font-bold text-white font-mono">24/7</span>
                  <p className="text-xs text-slate-500 mt-2 font-semibold">Managed MSP Response</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Founder Section */}
        <div id="about-founder-container" className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Image container */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative group w-48 h-48 sm:w-56 sm:h-56">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-45 transition-opacity" />
                <div className="relative w-full h-full rounded-2xl border-2 border-slate-800 overflow-hidden bg-slate-900 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
                    alt="James - CEO of James Tech"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Content Container */}
            <div className="md:col-span-8 space-y-4">
              <span className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest block">
                MEET THE FOUNDER
              </span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                James
              </h3>
              <p className="text-xs font-semibold text-slate-400">
                CEO & Principal Solutions Architect, James Tech
              </p>
              <div className="h-0.5 w-16 bg-blue-600 rounded" />
              <p className="text-slate-300 text-sm leading-relaxed pt-2">
                &ldquo;At James Tech, we believe software should not simply check boxes; it must be an engine for compounding organizational leverage. With over 15 years of systems planning, network administration, and full-stack software architecture experience, I founded James Tech to bridge the gap between complex DevOps deployment models and pristine, beautiful end-user experiences.&rdquo;
              </p>
              <div className="flex items-center space-x-2 pt-2 text-xs font-mono text-blue-400 font-semibold">
                <Award className="w-4 h-4" />
                <span>Enterprise Systems Engineering Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Our Structural Core Pillars
            </h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Every server, database scheme, subnet configuration, and code module we deliver adheres strictly to these fundamental tenets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => {
              const IconComp = v.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-950/40 border border-slate-900 p-6 rounded-2xl hover:border-slate-800 transition-all duration-300 space-y-4 shadow-lg shadow-slate-950/10"
                >
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl w-11 h-11 flex items-center justify-center text-blue-500 shadow-inner">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white tracking-tight">
                    {v.title}
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

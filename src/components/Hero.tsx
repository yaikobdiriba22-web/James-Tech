import { motion } from "motion/react";
import { ArrowRight, Terminal, CheckCircle, Award, Network } from "lucide-react";

interface HeroProps {
  setTab: (tab: string) => void;
}

export default function Hero({ setTab }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section id="hero-section" className="relative bg-slate-950 min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Dynamic Background Grids / Mesh */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.02),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.08),transparent_50%)]" />
      
      {/* Overlay matrix grid style lines */}
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Headline and Copy */}
          <motion.div
            id="hero-content-col"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-8"
          >
            {/* Tagline */}
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-blue-950/40 border border-blue-900/50 px-4 py-2 rounded-2xl text-blue-400">
              <Terminal className="w-4 h-4" />
              <span className="text-xs font-mono font-medium tracking-wide">SYSTEMS ARCHITECTURE & SOFTWARE</span>
            </motion.div>

            {/* Display Title */}
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
              High-Performance <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                Digital Solutions
              </span> <br />
              For Enterprise.
            </motion.h1>

            {/* Paragraph Description */}
            <motion.p variants={itemVariants} className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              James Tech designs, builds, and deploys scalable full-stack software applications, enterprise networking frameworks, and resilient managed IT operations tailored for growing businesses.
            </motion.p>

            {/* Call To Actions */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                id="hero-btn-get-quote"
                onClick={() => setTab("contact")}
                className="group flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer"
              >
                <span>Request a Tech Consultation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                id="hero-btn-portfolio"
                onClick={() => setTab("portfolio")}
                className="flex items-center justify-center px-6 py-3.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl transition-all cursor-pointer"
              >
                Explore Case Studies
              </button>
            </motion.div>

            {/* Minimal Indicators */}
            <motion.div variants={itemVariants} className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-900/60 max-w-lg">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white font-mono">99.99%</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider mt-1">Uptime SLA</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white font-mono">40+</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider mt-1">Deployments</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white font-mono">24/7</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider mt-1">MSP Monitor</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive Hero Asset Panel (Sleek Tech Illustration Layout) */}
          <motion.div
            id="hero-asset-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative border border-slate-800 bg-slate-950/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-900/10 backdrop-blur-sm overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
              
              {/* Card visual details */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />

              {/* Title representation */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-500 select-none">jamestech-deployment-matrix.conf</span>
              </div>

              <div className="space-y-6">
                {/* Visual block 1 */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-start space-x-4 hover:bg-slate-900 transition-colors">
                  <div className="bg-blue-950 text-blue-400 p-2.5 rounded-xl border border-blue-900/40">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Full-Stack Application Delivery</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">
                      We engineer robust systems from DB layer up to micro-frontends with perfect type consistency.
                    </p>
                  </div>
                </div>

                {/* Visual block 2 */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-start space-x-4 hover:bg-slate-900 transition-colors">
                  <div className="bg-indigo-950 text-indigo-400 p-2.5 rounded-xl border border-indigo-900/40">
                    <Network className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Network & VPN Auditing</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">
                      Deep perimeter scanning, zero-trust network topology design, and redundant IPSec tunnels.
                    </p>
                  </div>
                </div>

                {/* Visual block 3 */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-start space-x-4 hover:bg-slate-900 transition-colors">
                  <div className="bg-emerald-950 text-emerald-400 p-2.5 rounded-xl border border-emerald-900/40">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">System Modernization Solutions</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">
                      Leverage advanced Google Gemini AI models to automate client tasks and paper-based flows.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

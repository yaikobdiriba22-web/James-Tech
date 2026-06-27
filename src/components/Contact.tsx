import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Clock,
  Sparkles
} from "lucide-react";
import { API } from "../lib/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Automated reply draft captured from Gemini on submission
  const [autoReply, setAutoReply] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Please complete all fields of the contact form.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);
    setAutoReply(null);

    try {
      const response = await API.submitContactForm(
        formData.name,
        formData.email,
        formData.subject,
        formData.message
      );
      setSuccess(true);
      if (response.aiSuggestedReply) {
        setAutoReply(response.aiSuggestedReply);
      }
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to submit contact request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact-section" className="bg-slate-950 py-24 min-h-screen relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div id="contact-header" className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Initiate Project Scope
          </h2>
          <p className="text-slate-400 mt-4 leading-relaxed">
            Ready to deploy enterprise systems or optimize your code? Reach out below. Our system architects and AI engines will review your scope within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Direct Contacts & Map placeholder */}
          <div className="lg:col-span-5 space-y-8">
            {/* Direct Cards */}
            <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-white tracking-tight border-b border-slate-900 pb-3">
                Corporate Directory
              </h3>

              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start space-x-3.5 text-sm text-slate-400">
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-blue-500 shrink-0">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Silicon Valley HQ</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                      1200 Tech Parkway, Suite 400<br />
                      Silicon Valley, CA 94025
                    </p>
                  </div>
                </div>

                {/* Mail */}
                <div className="flex items-start space-x-3.5 text-sm text-slate-400">
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-blue-500 shrink-0">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Engineering Scope</h4>
                    <a href="mailto:yaikobdiriba22@gmail.com" className="text-xs text-slate-400 hover:text-blue-500 mt-0.5 block transition-colors">
                      yaikobdiriba22@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3.5 text-sm text-slate-400">
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-blue-500 shrink-0">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">24/7 Service Desk</h4>
                    <a href="tel:0922067302" className="text-xs text-slate-400 hover:text-blue-500 mt-0.5 block transition-colors">
                      0922067302
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Styled Map Container */}
            <div id="contact-map-container" className="border border-slate-900 bg-slate-950/60 rounded-3xl p-4 h-64 relative overflow-hidden flex flex-col justify-between shadow-lg">
              {/* Background Map Simulation */}
              <div className="absolute inset-0 z-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="20" y1="0" x2="20" y2="100" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="40" y1="0" x2="40" y2="100" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="60" y1="0" x2="60" y2="100" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="80" y1="0" x2="80" y2="100" stroke="currentColor" strokeWidth="0.5" />
                  {/* Dynamic pathways */}
                  <path d="M10 20 C 35 25, 45 45, 60 40 C 70 35, 80 50, 95 60" stroke="currentColor" strokeWidth="1" />
                  <path d="M20 90 C 40 80, 50 50, 60 40 C 70 30, 90 20, 95 5" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>

              {/* Ping Marker */}
              <div className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                </span>
                <span className="bg-slate-950 border border-slate-800 text-[9px] font-bold text-white px-2 py-0.5 rounded-md mt-1.5 shadow-md">
                  Silicon ValleyHQ
                </span>
              </div>

              <div className="relative z-10 flex justify-between items-center w-full mt-auto bg-slate-950/80 border border-slate-850/80 p-3 rounded-2xl backdrop-blur-sm">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-mono text-slate-500">HQ GEO COORDINATES</span>
                  <span className="text-[11px] text-white font-semibold font-mono">37.4419&deg; N, 122.1430&deg; W</span>
                </div>
                <span className="text-[9px] bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 px-2 py-1 rounded-full font-semibold">
                  Global Ingress Online
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-950/40 border border-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
              
              <h3 className="text-lg font-bold text-white tracking-tight border-b border-slate-900 pb-3">
                Scope Registration Form
              </h3>

              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="bg-emerald-950/20 border border-emerald-900/40 p-6 rounded-2xl flex items-start space-x-4">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-base font-bold text-emerald-400">Inquiry Received Successfully</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-normal">
                          Thank you for connecting with James Tech. Your scope parameter submission has been logged into our secure ledger. A solutions architect will contact you shortly.
                        </p>
                      </div>
                    </div>

                    {/* Gemini Suggested Reply display */}
                    {autoReply && (
                      <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 sm:p-6 space-y-4 shadow-inner">
                        <div className="flex items-center space-x-2 text-blue-400 border-b border-slate-850 pb-2.5">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-xs font-mono font-bold tracking-wide">AUTOMATED SERVICE RESPONSE</span>
                        </div>
                        <div className="text-xs text-slate-300 font-medium font-sans whitespace-pre-wrap leading-relaxed">
                          {autoReply}
                        </div>
                        <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Delivered immediately via James Tech AI Broker</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setSuccess(false)}
                      className="text-xs font-semibold px-4 py-2 bg-slate-900 border border-slate-800 text-slate-200 hover:text-white rounded-xl transition-all cursor-pointer"
                    >
                      Submit another request
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {error && (
                      <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl flex items-center space-x-2 text-red-400 text-xs font-semibold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                          Client / Contact Name
                        </label>
                        <input
                          id="contact-name-input"
                          type="text"
                          required
                          placeholder="e.g. Sarah Connor"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-850 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                          Corporate Email Address
                        </label>
                        <input
                          id="contact-email-input"
                          type="email"
                          required
                          placeholder="e.g. sarah@cyberdyne.io"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-850 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                        Scope Subject / Topic
                      </label>
                      <input
                        id="contact-subject-input"
                        type="text"
                        required
                        placeholder="e.g. Multi-Tenant CRM Platform & Ansible Deployments"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-850 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                        Detailed System Requirements
                      </label>
                      <textarea
                        id="contact-message-input"
                        rows={5}
                        required
                        placeholder="Outline user volumes, SLA requirements, system integrations, or specific infrastructure roadblocks..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-850 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      id="contact-submit-btn"
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Routing packet through Gemini Broker...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Scope Parameter</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

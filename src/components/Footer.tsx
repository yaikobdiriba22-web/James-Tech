import { Cpu, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

interface FooterProps {
  setTab: (tab: string) => void;
}

export default function Footer({ setTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleTabChange = (tabId: string) => {
    setTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="site-footer" className="bg-slate-950 border-t border-slate-900 text-slate-400">
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => handleTabChange("home")}>
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl text-white">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                James <span className="text-blue-500">Tech</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Delivering high-performance software engineering, enterprise cloud infrastructures, secure networking, and digital transformational services globally.
            </p>
            <div className="flex space-x-4 pt-2">
              <span className="text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                Enterprise Certified
              </span>
              <span className="text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                SLA Backed
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleTabChange("home")} className="hover:text-blue-500 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleTabChange("services")} className="hover:text-blue-500 transition-colors">
                  Service Offerings
                </button>
              </li>
              <li>
                <button onClick={() => handleTabChange("portfolio")} className="hover:text-blue-500 transition-colors">
                  Case Studies & Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => handleTabChange("about")} className="hover:text-blue-500 transition-colors">
                  About Our Team
                </button>
              </li>
              <li>
                <button onClick={() => handleTabChange("contact")} className="hover:text-blue-500 transition-colors">
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleTabChange("services")} className="hover:text-blue-500 transition-colors">
                  Custom Web Development
                </button>
              </li>
              <li>
                <button onClick={() => handleTabChange("services")} className="hover:text-blue-500 transition-colors">
                  Full-Stack Cloud Applications
                </button>
              </li>
              <li>
                <button onClick={() => handleTabChange("services")} className="hover:text-blue-500 transition-colors">
                  IT Support & Audits
                </button>
              </li>
              <li>
                <button onClick={() => handleTabChange("services")} className="hover:text-blue-500 transition-colors">
                  Network Architecture & VPNs
                </button>
              </li>
              <li>
                <button onClick={() => handleTabChange("services")} className="hover:text-blue-500 transition-colors">
                  AI Integration Solutions
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 text-sm">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Connect Directly</h3>
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <span>
                1200 Tech Parkway, Suite 400<br />
                Silicon Valley, CA 94025
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <a href="mailto:yaikobdiriba22@gmail.com" className="hover:text-blue-500 transition-colors">
                yaikobdiriba22@gmail.com
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <a href="tel:0922067302" className="hover:text-blue-500 transition-colors">
                0922067302
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer (Copyright) */}
      <div className="border-t border-slate-900 bg-slate-950/50 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <span>
            &copy; {currentYear} James Tech Inc. All rights reserved. Registered MSP & ISV.
          </span>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <button onClick={() => handleTabChange("admin")} className="hover:text-blue-500 transition-colors flex items-center space-x-0.5">
              <span>Admin Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

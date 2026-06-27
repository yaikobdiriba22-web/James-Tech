import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Menu, X, ShieldAlert, LogOut, Sun, Moon } from "lucide-react";
import { auth } from "../lib/firebase";
import { User } from "firebase/auth";
import { useTheme } from "../context/ThemeContext";

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  user: User | null;
  isAdmin: boolean;
  onLogout: () => void;
  onLogin: () => void;
}

export default function Navbar({ currentTab, setTab, user, isAdmin, onLogout, onLogin }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Portfolio" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  const handleTabChange = (tabId: string) => {
    setTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      id="site-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/85 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-900 shadow-lg shadow-slate-200/5 dark:shadow-slate-950/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            id="nav-logo-container"
            onClick={() => handleTabChange("home")}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              James <span className="text-blue-500 group-hover:text-blue-400 transition-colors">Tech</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleTabChange(item.id)}
                className={`text-sm font-medium transition-all duration-200 relative py-2 ${
                  currentTab === item.id
                    ? "text-blue-500"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {item.label}
                {currentTab === item.id && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Action Buttons / Admin Indicators */}
          <div id="desktop-actions" className="hidden md:flex items-center space-x-4">
            {/* Global Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-all cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Toggle visual theme"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <button
                    id="nav-btn-admin-panel"
                    onClick={() => handleTabChange("admin")}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      currentTab === "admin"
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-slate-900 border-slate-800 text-blue-400 hover:bg-slate-800"
                    } transition-all`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </button>
                )}
                <div className="flex items-center space-x-2 border-l border-slate-800 pl-4">
                  <img
                    src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"}
                    alt={user.displayName || "Admin"}
                    className="w-8 h-8 rounded-full border border-slate-700"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-200 max-w-[100px] truncate">
                      {user.displayName || "Admin User"}
                    </span>
                    <button
                      id="nav-btn-logout"
                      onClick={onLogout}
                      className="text-[10px] text-slate-400 hover:text-red-400 text-left flex items-center space-x-0.5"
                    >
                      <LogOut className="w-2.5 h-2.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                id="nav-btn-admin-login"
                onClick={() => handleTabChange("admin")}
                className="text-xs font-semibold px-4 py-2 bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-850 rounded-xl transition-all"
              >
                Admin Area
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleTabChange(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    currentTab === item.id
                      ? "bg-slate-100 dark:bg-slate-900 text-blue-500 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Theme toggle for mobile */}
              <div className="px-4 py-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-900 mt-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Theme Preference</span>
                <button
                  id="mobile-theme-toggle-btn"
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-semibold">Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-semibold">Dark Mode</span>
                    </>
                  )}
                </button>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-900 pt-4 mt-4 px-4">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"}
                        alt={user.displayName || "User"}
                        className="w-10 h-10 rounded-full border border-slate-700"
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-200">
                          {user.displayName || "Admin User"}
                        </div>
                        {isAdmin && (
                          <span className="text-[10px] text-blue-400 font-semibold">Administrator</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {isAdmin && (
                        <button
                          id="mobile-nav-btn-admin-panel"
                          onClick={() => handleTabChange("admin")}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white flex items-center space-x-1"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Panel</span>
                        </button>
                      )}
                      <button
                        id="mobile-nav-btn-logout"
                        onClick={onLogout}
                        className="text-xs text-red-400 flex items-center justify-end space-x-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    id="mobile-nav-btn-admin-login"
                    onClick={() => handleTabChange("admin")}
                    className="w-full py-2.5 text-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-xl font-semibold text-sm transition-all cursor-pointer"
                  >
                    Admin Dashboard Area
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

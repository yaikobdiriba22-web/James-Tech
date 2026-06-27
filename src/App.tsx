import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { auth, googleProvider } from "./lib/firebase";
import { API } from "./lib/api";
import { useTheme } from "./context/ThemeContext";

// Core Layout Views
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import FAQ from "./components/FAQ";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import About from "./components/About";
import Contact from "./components/Contact";
import AdminDashboard from "./components/AdminDashboard";
import SupportAgent from "./components/SupportAgent";

export default function App() {
  const { theme } = useTheme();
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Authenticate Google Account
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Authentication popup error:", err);
    }
  };

  // Sign out
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      setCurrentTab("home");
    } catch (err) {
      console.error("Signout error:", err);
    }
  };

  // Track Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fast client fallback check
        const isClientAdmin = currentUser.email === "yaikobdiriba22@gmail.com";
        setIsAdmin(isClientAdmin);

        // Standardized backend validation verification
        try {
          const res = await API.verifyAdminSession();
          setIsAdmin(res.success);
        } catch (err) {
          console.error("Admin verification failed, falling back to client-check:", err);
          setIsAdmin(isClientAdmin);
        }
      } else {
        setIsAdmin(false);
      }
      setAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const renderActiveView = () => {
    switch (currentTab) {
      case "services":
        return <Services setTab={setCurrentTab} />;
      case "portfolio":
        return <Portfolio />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      case "admin":
        return (
          <AdminDashboard
            user={user}
            isAdmin={isAdmin}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        );
      case "home":
      default:
        return (
          <>
            <Hero setTab={setCurrentTab} />
            <FAQ />
          </>
        );
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300">
      {/* Sleek top navigation */}
      <Navbar
        currentTab={currentTab}
        setTab={setCurrentTab}
        user={user}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />

      {/* Main Dynamic View Content Container */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern High-End Footer */}
      <Footer setTab={setCurrentTab} />

      {/* Floating Customer Support Chatbot Agent */}
      <SupportAgent />
    </div>
  );
}

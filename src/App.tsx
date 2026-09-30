import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { AnimatePresence, motion } from "motion/react";
import { auth, googleProvider } from "./lib/firebase";
import { API } from "./lib/api";
import { useTheme } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AcademyHome from "./components/AcademyHome";
import AdminDashboard from "./components/AdminDashboard";
import SupportAgent from "./components/SupportAgent";

export default function App() {
  const { theme } = useTheme();
  const [currentTab, setCurrentTab] = useState("home");
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Authentication popup error:", err);
    }
  };

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const result = await API.verifyAdminSession();
          setIsAdmin(result.success);
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setAuthChecking(false);
    });
    return unsubscribe;
  }, []);

  const showAdmin = currentTab === "admin" && isAdmin;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-950">
      <Navbar
        currentTab={currentTab}
        setTab={setCurrentTab}
        user={user}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />

      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={showAdmin ? "admin" : "academy"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {showAdmin ? (
              <AdminDashboard user={user} isAdmin={isAdmin} onLogin={handleLogin} onLogout={handleLogout} />
            ) : (
              <AcademyHome />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {!showAdmin && <Footer setTab={setCurrentTab} />}
      <SupportAgent />
      {authChecking && <span className="sr-only">Checking account session</span>}
    </div>
  );
}

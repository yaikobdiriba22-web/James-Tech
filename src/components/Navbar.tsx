import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
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

const items = [
  ["home", "Home"], ["about", "About"], ["programs", "Programs"], ["projects", "Projects"],
  ["parents", "Parents"], ["faq", "FAQ"], ["contact", "Contact"]
];

export default function Navbar({ currentTab, setTab, user, isAdmin, onLogout, onLogin }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setTab(id);
    setOpen(false);
    if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    else setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl" : "bg-white/70 backdrop-blur-md"}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => go("home")} className="flex items-center gap-3 text-left" aria-label="James Tech home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white shadow-lg"><span className="font-display text-lg font-bold">J</span></span>
          <span className="font-display text-lg font-bold tracking-tight">James <span className="text-blue-600">Tech</span><span className="block text-[9px] font-sans font-semibold uppercase tracking-[.18em] text-slate-500">Young Innovators</span></span>
        </button>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
          {items.map(([id,label]) => <button key={id} onClick={() => go(id)} className={`relative py-2 text-sm font-semibold transition ${currentTab === id ? "text-blue-600" : "text-slate-600 hover:text-slate-950"}`}>{label}{currentTab === id && <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-blue-600" />}</button>)}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button onClick={toggleTheme} className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50" aria-label="Toggle theme">{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
          {isAdmin && <button onClick={() => go("admin")} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">Admin</button>}
          <button onClick={() => go("enrollment")} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Enroll Now</button>
          {user && <button onClick={onLogout} className="rounded-xl px-2 py-2 text-xs font-semibold text-slate-500 hover:text-slate-950">Sign out</button>}
          {!user && isAdmin === false && <button onClick={onLogin} className="hidden">Sign in</button>}
        </div>

        <button className="rounded-xl border border-slate-200 p-2.5 lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </div>

      {open && <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden"><nav className="mx-auto flex max-w-7xl flex-col gap-1">{items.map(([id,label]) => <button key={id} onClick={() => go(id)} className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">{label}</button>)}<button onClick={() => go("enrollment")} className="mt-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">Enroll Now</button>{isAdmin && <button onClick={() => go("admin")} className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700">Admin</button>}</nav></div>}
    </header>
  );
}

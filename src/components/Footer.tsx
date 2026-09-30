import { Mail, Phone } from "lucide-react";

interface FooterProps { setTab: (tab: string) => void; }

export default function Footer({ setTab }: FooterProps) {
  const go = (id: string) => {
    setTab(id);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 0);
  };
  return <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
      <div className="md:col-span-2"><div className="font-display text-xl font-bold">James <span className="text-blue-600">Tech</span></div><p className="mt-3 max-w-md text-sm leading-6 text-slate-600">Building Future Generations Through Technology.</p><p className="mt-4 text-xs text-slate-500">Helping young learners move from technology consumers to technology creators.</p></div>
      <div><h3 className="text-sm font-bold">Explore</h3><div className="mt-4 grid gap-2 text-sm text-slate-600">{["about","programs","projects","parents","faq","enrollment"].map(id => <button key={id} onClick={() => go(id)} className="text-left capitalize hover:text-blue-600">{id}</button>)}</div></div>
      <div><h3 className="text-sm font-bold">Contact</h3><div className="mt-4 grid gap-3 text-sm text-slate-600"><a href="mailto:yaikobdiriba22@gmail.com" className="inline-flex items-center gap-2 hover:text-blue-600"><Mail className="h-4 w-4" />Email James Tech</a><a href="tel:0922067302" className="inline-flex items-center gap-2 hover:text-blue-600"><Phone className="h-4 w-4" />0922067302</a></div></div>
    </div>
    <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} James Tech. All rights reserved.</div>
  </footer>;
}

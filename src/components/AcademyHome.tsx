import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight, Bot, BrainCircuit, Check, ChevronDown, Code2, Cpu, ExternalLink,
  Gamepad2, Lightbulb, Mail, Menu, Palette, Phone, Rocket, Send, Sparkles,
  Target, Users, X, Zap
} from "lucide-react";
import { API } from "../lib/api";
import { Project } from "../types";

type Program = {
  id: string;
  title: string;
  age: string;
  level: string;
  icon: typeof Code2;
  description: string;
  skills: string[];
  projects: string[];
};

const programs: Program[] = [
  {
    id: "scratch",
    title: "Scratch & Game Development",
    age: "7–10",
    level: "Beginner",
    icon: Gamepad2,
    description: "Learn programming concepts through visual coding, storytelling, creativity, and game development.",
    skills: ["Sequences & logic", "Events & variables", "Storytelling", "Game design"],
    projects: ["Interactive stories", "Simple games", "Animations", "Creative challenges"]
  },
  {
    id: "web",
    title: "Web Development",
    age: "10–16",
    level: "Beginner → Intermediate",
    icon: Code2,
    description: "Understand how websites work and build responsive web experiences with modern fundamentals.",
    skills: ["HTML", "CSS", "JavaScript", "Responsive design"],
    projects: ["Personal websites", "Portfolio sites", "Landing pages", "School projects"]
  },
  {
    id: "python",
    title: "Python Programming",
    age: "11–16",
    level: "Beginner → Intermediate",
    icon: Zap,
    description: "Develop programming logic and problem-solving skills using Python through practical challenges.",
    skills: ["Variables", "Conditions & loops", "Functions", "Data structures"],
    projects: ["Small applications", "Games", "Automation ideas", "Coding challenges"]
  },
  {
    id: "ai",
    title: "AI & Emerging Technology",
    age: "12–16",
    level: "Exploration",
    icon: BrainCircuit,
    description: "Explore AI concepts, generative AI, prompting, digital creativity, and responsible technology use.",
    skills: ["AI concepts", "Prompting", "Generative AI", "Responsible AI"],
    projects: ["AI experiments", "Creative workflows", "Prompt projects", "Emerging-tech challenges"]
  },
  {
    id: "robotics",
    title: "Robotics & STEM",
    age: "8–16",
    level: "Explore → Build",
    icon: Cpu,
    description: "Combine technology, engineering, creativity, and problem solving through practical STEM activities.",
    skills: ["Robotics concepts", "Sensors", "Automation", "Engineering thinking"],
    projects: ["Sensor challenges", "Simple automation", "Robotics concepts", "STEM builds"]
  },
  {
    id: "design",
    title: "UI/UX & Digital Creativity",
    age: "8–16",
    level: "Creative",
    icon: Palette,
    description: "Learn design thinking and how to create useful, clear, and engaging digital experiences.",
    skills: ["Design thinking", "UI fundamentals", "UX fundamentals", "Prototyping"],
    projects: ["App concepts", "Website mockups", "Digital graphics", "Interactive prototypes"]
  }
];

const faqs = [
  ["What ages can join James Tech?", "Our learning tracks are designed for young learners ages 7–16, with age ranges shown on each program."],
  ["Does my child need previous coding experience?", "Not necessarily. Several tracks start at beginner level. The right starting point depends on the student's age, interests, and existing experience."],
  ["What programs are available?", "Programs include Scratch & Game Development, Web Development, Python, AI & Emerging Technology, Robotics & STEM, and UI/UX & Digital Creativity."],
  ["Are classes online or in person?", "Learning format should be confirmed with James Tech for the current intake. Contact us and we can share the available options."],
  ["What equipment is required?", "Requirements vary by program. Contact James Tech for the current equipment guidance for the program you choose."],
  ["How are students taught?", "The learning approach emphasizes discovering concepts, practicing them, building projects, and presenting what students create."],
  ["What projects will students build?", "Examples include games, websites, Python applications, AI experiments, robotics challenges, and UI/UX designs. Actual student work is only presented as student work when supplied by James Tech."],
  ["Do students receive certificates?", "Certificate availability is not assumed here. Contact James Tech for the current program policy."],
  ["How can parents track progress?", "Progress-support options depend on the current program. Contact James Tech for the current parent communication process."],
  ["How can I enroll?", "Use the enrollment form below or contact James Tech directly. Include the student's age and program of interest so the team can guide you."]
] as const;

const sampleProjects = [
  { title: "Game Lab Demo", technology: "Scratch", description: "A sample game-development concept demonstrating events, variables, logic, and creative storytelling." },
  { title: "Young Creator Portfolio", technology: "HTML • CSS • JavaScript", description: "A sample responsive portfolio showing how a learner can turn web fundamentals into a finished digital project." },
  { title: "Python Challenge Lab", technology: "Python", description: "A sample programming challenge collection focused on logic, functions, loops, and problem solving." },
  { title: "AI Creativity Lab", technology: "Generative AI", description: "A sample exploration of prompting and responsible AI-assisted creativity." }
];

function SectionTitle({ eyebrow, title, body, light = false }: { eyebrow: string; title: string; body?: string; light?: boolean }) {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${light ? "border-slate-200 bg-white text-slate-600" : "border-blue-400/20 bg-blue-400/10 text-blue-300"}`}>
        <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
      </span>
      <h2 className={`mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl ${light ? "text-slate-950" : "text-white"}`}>{title}</h2>
      {body && <p className={`mt-5 text-base leading-8 ${light ? "text-slate-600" : "text-slate-400"}`}>{body}</p>}
    </div>
  );
}

export default function AcademyHome() {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ guardian: "", student: "", age: "", phone: "", email: "", program: "", format: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    let active = true;
    API.getProjects().then(data => {
      if (active) setProjects(data);
    }).catch(() => {
      if (active) setProjectError(true);
    }).finally(() => {
      if (active) setProjectLoading(false);
    });
    return () => { active = false; };
  }, []);

  const filteredPrograms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return programs;
    return programs.filter(p =>
      [p.title, p.age, p.level, p.description, ...p.skills, ...p.projects].join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  const submitEnrollment = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormState("idle");
    try {
      await API.submitContactForm(
        form.guardian,
        form.email,
        `Enrollment inquiry — ${form.program || "Program information"}`,
        [
          `Parent/Guardian: ${form.guardian}`,
          `Student: ${form.student}`,
          `Student age: ${form.age}`,
          `Phone: ${form.phone}`,
          `Program: ${form.program || "Not specified"}`,
          `Preferred format: ${form.format || "Not specified"}`,
          `Message: ${form.message || "No additional message"}`
        ].join("\n")
      );
      setFormState("success");
      setForm({ guardian: "", student: "", age: "", phone: "", email: "", program: "", format: "", message: "" });
    } catch {
      setFormState("error");
    } finally {
      setSubmitting(false);
    }
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="bg-white text-slate-950">
      <section id="home" className="relative isolate overflow-hidden bg-slate-950 pt-28 text-white sm:pt-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,.22),transparent_35%),radial-gradient(circle_at_10%_80%,rgba(16,185,129,.12),transparent_30%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-12 lg:px-8 lg:pb-28">
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
              <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.18em] text-blue-300">Technology academy • Ages 7–16</span>
              <h1 className="mt-7 font-display text-5xl font-bold leading-[1.03] tracking-tight sm:text-6xl lg:text-7xl">Building Future Generations Through Technology</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">Empowering young learners ages 7–16 to learn technology, solve problems, build real projects, and create with confidence.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => scrollTo("programs")} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300">Explore Programs <ArrowRight className="h-4 w-4" /></button>
                <button onClick={() => scrollTo("enrollment")} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40">Enroll Now <Rocket className="h-4 w-4" /></button>
              </div>
              <div className="mt-10 flex flex-wrap gap-3 text-sm text-slate-300">
                {["Hands-on Learning", "Project-Based Education", "Mentor Support", "Future-Ready Skills"].map(x => <span key={x} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{x}</span>)}
              </div>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .6, delay: .1 }} className="relative lg:col-span-5">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.06] p-5 shadow-2xl backdrop-blur-md sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-4"><span className="text-xs font-semibold text-slate-400">JAMES TECH / LEARNING LAB</span><span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,.8)]" /></div>
              <div className="grid gap-4 py-5 sm:grid-cols-2">
                {[
                  [Code2, "Code", "Turn ideas into working programs."],
                  [Bot, "Create", "Explore AI and digital creativity."],
                  [Cpu, "Build", "Experiment with STEM and robotics."],
                  [Target, "Solve", "Strengthen logic and problem solving."]
                ].map(([Icon, title, body]) => {
                  const I = Icon as typeof Code2;
                  return <div key={String(title)} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"><I className="h-5 w-5 text-blue-300" /><h3 className="mt-4 font-semibold">{String(title)}</h3><p className="mt-1 text-sm leading-6 text-slate-400">{String(body)}</p></div>;
                })}
              </div>
              <div className="rounded-2xl border border-blue-400/15 bg-blue-500/10 p-4 text-sm text-blue-100">Explore → Learn → Build → Present → Grow</div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-3 px-4 sm:px-6 lg:px-8">
          {["Hands-on Learning", "Project-Based Education", "Mentor Support", "Future-Ready Skills"].map(x => <span key={x} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">{x}</span>)}
        </div>
      </section>

      <section id="about" className="scroll-mt-24 bg-white py-24 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div><SectionTitle light eyebrow="About James Tech" title="From technology consumers to technology creators." body="James Tech helps young people build practical technology skills through hands-on learning, creativity, problem-solving, and real project work." /><div className="mt-7 rounded-3xl border border-slate-200 bg-slate-950 p-7 text-white"><p className="text-lg leading-8 text-slate-200">“We don't want young people to only consume technology. We want them to understand it, create with it, and use it to solve problems.”</p></div></div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[["LEARN", Lightbulb, "Build strong technology foundations."], ["BUILD", Code2, "Turn knowledge into practical projects."], ["GROW", Users, "Develop creativity, confidence, and problem-solving skills."]].map(([title, Icon, body]) => {
              const I = Icon as typeof Code2;
              return <div key={String(title)} className="rounded-3xl border border-slate-200 bg-slate-50 p-6"><I className="h-6 w-6 text-blue-600" /><h3 className="mt-5 font-display text-xl font-bold">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{String(body)}</p></div>;
            })}
          </div>
        </div>
      </section>

      <section id="programs" className="scroll-mt-24 bg-slate-950 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Learning tracks" title="Programs Designed for Young Creators" body="Age-appropriate, practical technology learning designed to help students move from curiosity to creation." />
          <div className="mx-auto mt-10 max-w-2xl"><label htmlFor="program-search" className="sr-only">Search programs</label><div className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4"><Sparkles className="h-4 w-4 text-slate-400" /><input id="program-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search programs, skills, or projects..." className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-500" /></div></div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredPrograms.map(p => { const I = p.icon; return <motion.article key={p.id} whileHover={{ y: -5 }} className="group flex flex-col rounded-3xl border border-white/10 bg-white/[.04] p-6 transition hover:border-blue-400/30 hover:bg-white/[.06]">
              <div className="flex items-start justify-between"><div className="rounded-2xl bg-blue-500/10 p-3 text-blue-300"><I className="h-6 w-6" /></div><span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-300">{p.age}</span></div>
              <h3 className="mt-6 font-display text-xl font-bold text-white">{p.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{p.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">{p.skills.map(s => <span key={s} className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs text-slate-300">{s}</span>)}</div>
              <div className="mt-6 flex-1"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Example projects</p><ul className="mt-3 space-y-2 text-sm text-slate-300">{p.projects.map(x => <li key={x} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{x}</li>)}</ul></div>
              <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5"><span className="text-xs font-semibold text-slate-500">{p.level}</span><button onClick={() => setSelectedProgram(p)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-300 hover:text-blue-200">View Program <ArrowRight className="h-4 w-4" /></button></div>
            </motion.article> })}
          </div>
          {filteredPrograms.length === 0 && <p className="mt-10 text-center text-slate-400">No programs match that search.</p>}
        </div>
      </section>

      <section id="path" className="scroll-mt-24 bg-slate-50 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionTitle light eyebrow="Learning journey" title="A path that grows with the learner." body="Use age and interest as a guide. The exact starting point should be confirmed with James Tech." />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[["7–9", "Explore & Create", ["Scratch", "Digital Creativity", "Problem Solving"]], ["10–12", "Build & Experiment", ["Game Development", "Web Fundamentals", "Robotics", "Creative Technology"]], ["13–16", "Code & Innovate", ["Python", "Web Development", "AI", "Advanced Projects"]]].map(([age, title, items]) => <div key={String(age)} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"><span className="text-sm font-bold text-blue-600">AGE {String(age)}</span><h3 className="mt-3 font-display text-2xl font-bold">{String(title)}</h3><div className="mt-6 space-y-3">{(items as string[]).map(item => <div key={item} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700"><span className="h-2 w-2 rounded-full bg-blue-500" />{item}</div>)}</div></div>)}
          </div>
          <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-2 text-sm font-semibold text-slate-600">{["Explore", "Learn", "Build", "Present", "Grow"].map((x,i) => <span key={x} className="inline-flex items-center gap-2">{i > 0 && <ArrowRight className="h-4 w-4 text-slate-300" />}<span className="rounded-full border border-slate-200 bg-white px-4 py-2">{x}</span></span>)}</div>
        </div>
      </section>

      <section id="projects" className="scroll-mt-24 bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionTitle light eyebrow="Project showcase" title="Learn by Building" body="Real student work should be celebrated. Until James Tech supplies verified student projects, examples below are clearly presented as sample/demo work." />
          {projectLoading ? <div className="mt-12 text-center text-sm text-slate-500">Loading project showcase…</div> : projectError ? <div className="mt-12 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-800">Project data is temporarily unavailable. The academy content remains available.</div> : projects.length > 0 ? <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{projects.map(p => <article key={p.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Published project</span><h3 className="mt-3 font-display text-xl font-bold">{p.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{p.description}</p><div className="mt-5 flex flex-wrap gap-2">{p.technologies.map(t => <span key={t} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{t}</span>)}</div>{p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-500">Open project <ExternalLink className="h-4 w-4" /></a>}</article>)}</div> : <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{sampleProjects.map(p => <article key={p.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sample / demo</span><h3 className="mt-3 font-display text-lg font-bold">{p.title}</h3><p className="mt-2 text-xs font-semibold text-blue-600">{p.technology}</p><p className="mt-3 text-sm leading-6 text-slate-600">{p.description}</p></article>)}</div>}
        </div>
      </section>

      <section id="method" className="scroll-mt-24 bg-slate-950 py-24 sm:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionTitle eyebrow="Methodology" title="How Students Learn" body="A practical learning loop keeps technology education active, visible, and connected to real outcomes." /><div className="mt-12 grid gap-4 md:grid-cols-5">{["Discover", "Learn", "Practice", "Build", "Present"].map((x,i) => <div key={x} className="rounded-3xl border border-white/10 bg-white/[.04] p-6 text-center"><span className="font-mono text-sm text-blue-300">0{i+1}</span><h3 className="mt-5 font-display text-xl font-bold text-white">{x}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{["Ask questions and explore possibilities.", "Understand the core concept.", "Apply the concept through guided activity.", "Create something tangible.", "Explain, demonstrate, and reflect."][i]}</p></div>)}</div></div></section>

      <section id="why" className="scroll-mt-24 bg-white py-24 sm:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionTitle light eyebrow="Why James Tech" title="A practical foundation for young creators." /><div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{["Project-Based Learning", "Age-Appropriate Curriculum", "Practical Technology Skills", "Creative Problem Solving", "Mentor Guidance", "Future-Ready Learning"].map((x,i) => <div key={x} className="rounded-3xl border border-slate-200 bg-slate-50 p-6"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">{i+1}</div><h3 className="mt-5 font-display text-lg font-bold">{x}</h3><p className="mt-2 text-sm leading-6 text-slate-600">Designed to help learners understand concepts, practice them, and turn ideas into meaningful work.</p></div>)}</div></div></section>

      <section id="parents" className="scroll-mt-24 bg-slate-50 py-24 sm:py-28"><div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8"><div><SectionTitle light eyebrow="For parents" title="Technology Education Parents Can Trust" body="Parents should be able to understand what their child is learning, why it matters, and how practical work supports development." /><div className="mt-8 grid gap-3 sm:grid-cols-2">{["What children learn", "Project-based learning", "Learning environment", "Student development", "Communication", "Digital responsibility"].map(x => <div key={x} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700">{x}</div>)}</div></div><div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl"><Users className="h-8 w-8 text-blue-300" /><h3 className="mt-6 font-display text-2xl font-bold">Questions before enrolling?</h3><p className="mt-3 text-sm leading-7 text-slate-400">Talk with James Tech about the student's age, interests, current skills, and the programs available for the current intake.</p><button onClick={() => scrollTo("contact")} className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-100">Talk to James Tech <ArrowRight className="h-4 w-4" /></button></div></div></section>

      <section id="instructors" className="scroll-mt-24 bg-white py-24 sm:py-28"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"><SectionTitle light eyebrow="Mentors" title="Meet Our Mentors" body="Instructor profiles are intentionally kept ready for real information only. No identities, credentials, photos, or achievements are fabricated." /><div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10"><Users className="mx-auto h-10 w-10 text-slate-400" /><h3 className="mt-4 font-display text-xl font-bold">Instructor profiles coming from the James Tech team</h3><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">Add verified mentor names, roles, expertise, biographies, and approved photos when those details are available.</p></div></div></section>

      <section id="pricing" className="scroll-mt-24 bg-slate-950 py-24 sm:py-28"><div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"><SectionTitle eyebrow="Pricing" title="Flexible learning options available." body="Current fees, schedules, and learning formats should be confirmed directly with James Tech rather than guessed or hard-coded." /><button onClick={() => scrollTo("contact")} className="mt-9 inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-6 py-3.5 font-semibold text-white hover:bg-blue-400">Contact Us <Mail className="h-4 w-4" /></button></div></section>

      <section id="faq" className="scroll-mt-24 bg-white py-24 sm:py-28"><div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><SectionTitle light eyebrow="FAQ" title="Questions parents ask" body="Clear answers without making promises about services, schedules, or certificates that have not been confirmed." /><div className="mt-12 space-y-3">{faqs.map(([q,a],i) => <div key={q} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"><button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="flex w-full items-center justify-between gap-5 p-5 text-left font-semibold"><span>{q}</span><ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} /></button><AnimatePresence initial={false}>{openFaq === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}><p className="border-t border-slate-200 px-5 pb-5 pt-4 text-sm leading-7 text-slate-600">{a}</p></motion.div>}</AnimatePresence></div>)}</div></div></section>

      <section id="enrollment" className="scroll-mt-24 bg-slate-950 py-24 sm:py-28"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><SectionTitle eyebrow="Enrollment" title="Start a conversation about your learner." body="Share the essentials and James Tech can guide you toward the relevant program and current availability." /><div className="mt-12 grid gap-8 lg:grid-cols-5"><div className="rounded-3xl border border-white/10 bg-white/[.04] p-7 lg:col-span-2"><Rocket className="h-7 w-7 text-blue-300" /><h3 className="mt-5 font-display text-2xl font-bold text-white">What to include</h3><ul className="mt-6 space-y-4 text-sm leading-6 text-slate-400">{["Student age and interests", "Program you're considering", "Preferred learning format", "Any previous experience", "Questions for the James Tech team"].map(x => <li key={x} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />{x}</li>)}</ul></div><form onSubmit={submitEnrollment} className="rounded-3xl border border-white/10 bg-white p-6 sm:p-8 lg:col-span-3"><div className="grid gap-4 sm:grid-cols-2"><Field label="Parent/Guardian Name" value={form.guardian} onChange={v => setForm({...form, guardian:v})} required /><Field label="Student Name" value={form.student} onChange={v => setForm({...form, student:v})} required /><Field label="Student Age" value={form.age} onChange={v => setForm({...form, age:v})} type="number" min="7" max="16" required /><Field label="Phone" value={form.phone} onChange={v => setForm({...form, phone:v})} required /><Field label="Email" value={form.email} onChange={v => setForm({...form, email:v})} type="email" required /><div><label className="mb-2 block text-xs font-semibold text-slate-600">Program Interested In</label><select value={form.program} onChange={e => setForm({...form, program:e.target.value})} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"><option value="">Select a program</option>{programs.map(p => <option key={p.id}>{p.title}</option>)}</select></div></div><div className="mt-4"><label className="mb-2 block text-xs font-semibold text-slate-600">Preferred Learning Format</label><select value={form.format} onChange={e => setForm({...form, format:e.target.value})} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"><option value="">Please confirm current options</option><option>Online</option><option>In person</option><option>Either / discuss options</option></select></div><div className="mt-4"><label className="mb-2 block text-xs font-semibold text-slate-600">Message</label><textarea value={form.message} onChange={e => setForm({...form, message:e.target.value})} rows={4} placeholder="Tell us about the learner or ask a question…" className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>{formState === "success" && <div role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">Enrollment inquiry received. James Tech can follow up using the contact details you provided.</div>}{formState === "error" && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">We couldn't submit the inquiry. Please try again or contact James Tech directly.</div>}<button disabled={submitting} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Sending…" : "Submit Enrollment Inquiry"} <Send className="h-4 w-4" /></button></form></div></div></section>

      <section id="contact" className="scroll-mt-24 border-t border-slate-800 bg-slate-950 py-14"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"><div><p className="text-sm font-semibold text-blue-300">James Tech</p><h2 className="mt-2 font-display text-2xl font-bold text-white">Building Future Generations Through Technology</h2></div><div className="flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:gap-6"><a href="mailto:yaikobdiriba22@gmail.com" className="inline-flex items-center gap-2 hover:text-white"><Mail className="h-4 w-4" />yaikobdiriba22@gmail.com</a><a href="tel:0922067302" className="inline-flex items-center gap-2 hover:text-white"><Phone className="h-4 w-4" />0922067302</a></div></div></section>

      <AnimatePresence>{selectedProgram && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={selectedProgram.title} onClick={() => setSelectedProgram(null)}><motion.div initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .98 }} onClick={e => e.stopPropagation()} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl sm:p-9"><div className="flex items-start justify-between gap-6"><div><span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Program details</span><h2 className="mt-2 font-display text-3xl font-bold">{selectedProgram.title}</h2><p className="mt-2 text-sm text-slate-500">Age {selectedProgram.age} • {selectedProgram.level}</p></div><button onClick={() => setSelectedProgram(null)} aria-label="Close program details" className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"><X className="h-5 w-5" /></button></div><p className="mt-7 leading-7 text-slate-600">{selectedProgram.description}</p><div className="mt-8 grid gap-5 sm:grid-cols-2"><div><h3 className="font-semibold">Learning objectives</h3><ul className="mt-3 space-y-2 text-sm text-slate-600">{selectedProgram.skills.map(x => <li key={x} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-blue-600" />Develop {x.toLowerCase()}</li>)}</ul></div><div><h3 className="font-semibold">Example projects</h3><ul className="mt-3 space-y-2 text-sm text-slate-600">{selectedProgram.projects.map(x => <li key={x} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-blue-600" />{x}</li>)}</ul></div></div><div className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-600"><strong className="text-slate-900">Duration, weekly schedule, equipment, and current fees:</strong> contact James Tech for confirmed details.</div><button onClick={() => { setSelectedProgram(null); setTimeout(() => scrollTo("enrollment"), 0); }} className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800">Ask about this program <ArrowRight className="h-4 w-4" /></button></motion.div></div>}</AnimatePresence>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false, min, max }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; min?: string; max?: string }) {
  return <div><label className="mb-2 block text-xs font-semibold text-slate-600">{label}</label><input required={required} type={type} min={min} max={max} value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>;
}

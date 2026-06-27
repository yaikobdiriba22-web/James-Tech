import { Project, ContactMessage, AnalyticsSummary } from "../types";
import { db, auth } from "./firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  Timestamp,
  serverTimestamp
} from "firebase/firestore";

// Default portfolio projects as a robust fallback and seed
const DEFAULT_PROJECTS: Omit<Project, "id">[] = [
  {
    title: "James Tech Client Portal",
    description: "A secure, responsive full-stack customer dashboard designed for legal and medical clients to submit service tickets, monitor system/network uptime reports, and process digital retainer payments.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    category: "Full-Stack Applications",
    technologies: ["React", "Express", "Firebase Auth", "Firestore", "Tailwind CSS"],
    githubUrl: "https://github.com/jamestech/client-portal",
    liveUrl: "https://portal.jamestech.com",
    featured: true
  },
  {
    title: "Enterprise Network Monitor",
    description: "A high-frequency real-time network telemetry monitor utilizing SNMP and interactive network maps. Deployed on-premise at medical complexes to track 150+ dynamic ethernet terminals.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    category: "Network Administration",
    technologies: ["Node.js", "D3.js", "WebSockets", "SNMP Protocol", "Linux Daemon"],
    githubUrl: "https://github.com/jamestech/network-telemetry",
    liveUrl: "https://netmon.jamestech.com",
    featured: true
  },
  {
    title: "MediSync Clinic Infrastructure Setup",
    description: "A complete overhaul and modernization of a veterinary group's regional networks. Automated systems deployment with Ansible, active directory domains, and secure offsite backups.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    category: "IT Support",
    technologies: ["Linux", "Nginx", "Ansible", "Active Directory", "Veeam Backup"],
    githubUrl: "https://github.com/jamestech/ansible-active-directory",
    liveUrl: "https://jamestech.com/case-studies/medisync",
    featured: true
  },
  {
    title: "OmniRetail Headless E-Commerce",
    description: "A lightning-fast, SEO-optimized e-commerce portal utilizing headless APIs. Includes instant card processing, customizable inventory filters, and multi-tenant store panels.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    category: "Web Development",
    technologies: ["React", "Next.js", "GraphQL", "Stripe API", "Tailwind CSS"],
    githubUrl: "https://github.com/jamestech/headless-retail",
    liveUrl: "https://omnicart.jamestech.com",
    featured: false
  },
  {
    title: "CloudDoc Automated Intake Engine",
    description: "A paperless medical office intake engine utilizing Cloud Vision OCR models to extract and digitize handwritten intake forms into patient charts. Saves front-office staff over 12 hours a week.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    category: "Digital Solutions",
    technologies: ["Node.js", "Google Cloud Vision OCR", "Firebase Storage", "React"],
    githubUrl: "https://github.com/jamestech/ocr-intake",
    liveUrl: "https://clouddoc.jamestech.com",
    featured: false
  }
];

// Helper to seed projects
async function seedDefaultProjects() {
  try {
    console.log("Auto-seeding default projects client-side...");
    for (const project of DEFAULT_PROJECTS) {
      await addDoc(collection(db, "projects"), {
        ...project,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    console.log("Auto-seeding completed!");
  } catch (err) {
    console.error("Auto-seeding failed:", err);
  }
}

export const API = {
  // 1. Projects Endpoints (Direct Firestore + Local Fallback)
  async getProjects(): Promise<Project[]> {
    try {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      
      const projects = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        };
      }) as Project[];

      // If empty and logged in as admin, trigger auto-seed
      if (projects.length === 0 && auth.currentUser?.email === "yaikobdiriba22@gmail.com") {
        await seedDefaultProjects();
        return this.getProjects();
      }

      // If database is empty for standard visitors, show default list
      if (projects.length === 0) {
        return DEFAULT_PROJECTS.map((p, idx) => ({
          id: `default-${idx}`,
          ...p,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })) as Project[];
      }

      return projects;
    } catch (err) {
      console.error("Error fetching projects from Firestore, using fallbacks:", err);
      return DEFAULT_PROJECTS.map((p, idx) => ({
        id: `default-${idx}`,
        ...p,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })) as Project[];
    }
  },

  async createProject(project: Omit<Project, "id">): Promise<Project> {
    const docRef = await addDoc(collection(db, "projects"), {
      ...project,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return {
      id: docRef.id,
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Project;
  },

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const ref = doc(db, "projects", id);
    const updateData: any = {
      ...project,
      updatedAt: serverTimestamp()
    };
    // Don't update the ID field
    delete updateData.id;
    
    await updateDoc(ref, updateData);
    return {
      id,
      ...project
    } as Project;
  },

  async deleteProject(id: string): Promise<{ success: boolean }> {
    await deleteDoc(doc(db, "projects", id));
    return { success: true };
  },

  // 2. Contact Message Endpoints (Gemini draft proxy + Client Firestore save)
  async submitContactForm(name: string, email: string, subject: string, message: string): Promise<ContactMessage> {
    let aiSuggestedReply = "";
    
    try {
      // Call server proxy to securely run the Gemini prompt draft
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      });
      if (res.ok) {
        const data = await res.json();
        aiSuggestedReply = data.aiSuggestedReply || "";
      }
    } catch (err) {
      console.warn("Backend Gemini AI proxy failed, fallback draft generated:", err);
      aiSuggestedReply = `Hi ${name},\n\nThank you for reaching out to James Tech. We have received your inquiry regarding "${subject}" and our team will get back to you shortly.\n\nBest regards,\nJames Tech Team`;
    }

    const messageData = {
      name,
      email,
      subject,
      message,
      status: "unread" as const,
      aiSuggestedReply,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "contactMessages"), messageData);
    
    return {
      id: docRef.id,
      ...messageData,
      createdAt: new Date().toISOString()
    } as ContactMessage;
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    }) as ContactMessage[];
  },

  async updateMessageStatus(id: string, status: "unread" | "read" | "archived"): Promise<{ success: boolean }> {
    const ref = doc(db, "contactMessages", id);
    await updateDoc(ref, { status });
    return { success: true };
  },

  async deleteMessage(id: string): Promise<{ success: boolean }> {
    await deleteDoc(doc(db, "contactMessages", id));
    return { success: true };
  },

  // 3. Analytics Endpoint (Computed Client-side from collections)
  async getAnalytics(): Promise<AnalyticsSummary> {
    const [projectsSnap, messagesSnap] = await Promise.all([
      getDocs(collection(db, "projects")),
      getDocs(collection(db, "contactMessages"))
    ]);

    const totalProjects = projectsSnap.size === 0 ? DEFAULT_PROJECTS.length : projectsSnap.size;
    const totalMessages = messagesSnap.size;

    let unreadMessagesCount = 0;
    const messages: any[] = [];
    const categories: { [key: string]: number } = {
      "Web Development": 0,
      "Full-Stack Applications": 0,
      "IT Support": 0,
      "Network Administration": 0,
      "Digital Solutions": 0,
    };

    const projectsDocs = projectsSnap.size === 0 ? [] : projectsSnap.docs;
    projectsDocs.forEach(doc => {
      const cat = doc.data().category;
      if (cat && categories[cat] !== undefined) {
        categories[cat]++;
      }
    });

    // Populate fallback categories if empty
    if (projectsSnap.size === 0) {
      DEFAULT_PROJECTS.forEach(proj => {
        if (proj.category && categories[proj.category] !== undefined) {
          categories[proj.category]++;
        }
      });
    }

    messagesSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.status === "unread") {
        unreadMessagesCount++;
      }
      messages.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });

    const sortedMessages = messages
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const categoryDistribution = Object.keys(categories).map(name => ({
      name,
      value: categories[name],
    }));

    return {
      totalProjects,
      totalMessages,
      unreadMessagesCount,
      categoryDistribution,
      recentSubmissions: sortedMessages,
    };
  },

  // 4. Admin Verification Endpoint
  async verifyAdminSession(): Promise<{ success: boolean; user: { uid: string; email: string; name: string; picture: string } }> {
    const user = auth.currentUser;
    if (user && user.email === "yaikobdiriba22@gmail.com") {
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split("@")[0] || "Administrator",
          picture: user.photoURL || ""
        }
      };
    }
    return { success: false } as any;
  },

  // 5. Support Chat Endpoint
  async sendSupportChat(messages: { sender: "user" | "bot"; text: string }[]): Promise<string> {
    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages })
      });
      if (res.ok) {
        const data = await res.json();
        return data.reply || "I'm sorry, I couldn't process that request.";
      }
      throw new Error("Failed to connect to support agent API");
    } catch (err) {
      console.error("Support agent API error:", err);
      return "I apologize, but I am experiencing temporary connectivity issues. You can reach our team directly at phone: 0922067302 or email: yaikobdiriba22@gmail.com.";
    }
  }
};

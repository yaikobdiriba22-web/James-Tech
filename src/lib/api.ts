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
// Legacy project API retained for the admin dashboard. Public academy content never seeds fabricated projects.
const DEFAULT_PROJECTS: Omit<Project, "id">[] = [];

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
      if (projects.length === 0) return [];
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

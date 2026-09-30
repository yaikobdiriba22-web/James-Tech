import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { GoogleGenAI } from "@google/genai";
import firebaseConfig from "./firebase-applet-config.json" with { type: "json" };

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

// Initialize Firebase Admin SDK
try {
  if (getApps().length === 0) {
    initializeApp({
      projectId: firebaseConfig.projectId,
    });
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin SDK:", error);
}

const adminDb = getFirestore(getApps()[0], firebaseConfig.firestoreDatabaseId);

// Lazy-loaded Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } else {
      console.warn("GEMINI_API_KEY environment variable is missing or placeholder. AI auto-responses will be simulated.");
    }
  }
  return aiClient;
}

// Seed Initial Projects if the collection is empty
async function seedInitialProjects() {
  try {
    const projectsCol = adminDb.collection("projects");
    const snapshot = await projectsCol.limit(1).get();
    if (snapshot.empty) {
      console.log("Seeding default projects into Firestore...");
      const defaultProjects = [
        {
          title: "James Tech Client Portal",
          description: "A secure, responsive full-stack customer dashboard designed for legal and medical clients to submit service tickets, monitor system/network uptime reports, and process digital retainer payments.",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
          category: "Full-Stack Applications",
          technologies: ["React", "Express", "Firebase Auth", "Firestore", "Tailwind CSS"],
          githubUrl: "https://github.com/jamestech/client-portal",
          liveUrl: "https://portal.jamestech.com",
          featured: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        {
          title: "Enterprise Network Monitor",
          description: "A high-frequency real-time network telemetry monitor utilizing SNMP and interactive network maps. Deployed on-premise at medical complexes to track 150+ dynamic ethernet terminals.",
          image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
          category: "Network Administration",
          technologies: ["Node.js", "D3.js", "WebSockets", "SNMP Protocol", "Linux Daemon"],
          githubUrl: "https://github.com/jamestech/network-telemetry",
          liveUrl: "https://netmon.jamestech.com",
          featured: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        {
          title: "MediSync Clinic Infrastructure Setup",
          description: "A complete overhaul and modernization of a veterinary group's regional networks. automated systems deployment with Ansible, active directory domains, and secure offsite backups.",
          image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
          category: "IT Support",
          technologies: ["Linux", "Nginx", "Ansible", "Active Directory", "Veeam Backup"],
          githubUrl: "https://github.com/jamestech/ansible-active-directory",
          liveUrl: "https://jamestech.com/case-studies/medisync",
          featured: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        {
          title: "OmniRetail Headless E-Commerce",
          description: "A lightning-fast, SEO-optimized e-commerce portal utilizing headless APIs. Includes instant card processing, customizable inventory filters, and multi-tenant store panels.",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          category: "Web Development",
          technologies: ["React", "Next.js", "GraphQL", "Stripe API", "Tailwind CSS"],
          githubUrl: "https://github.com/jamestech/headless-retail",
          liveUrl: "https://omnicart.jamestech.com",
          featured: false,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        {
          title: "CloudDoc Automated Intake Engine",
          description: "A paperless medical office intake engine utilizing Cloud Vision OCR models to extract and digitize handwritten intake forms into patient charts. Saves front-office staff over 12 hours a week.",
          image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
          category: "Digital Solutions",
          technologies: ["Node.js", "Google Cloud Vision OCR", "Firebase Storage", "React"],
          githubUrl: "https://github.com/jamestech/ocr-intake",
          liveUrl: "https://clouddoc.jamestech.com",
          featured: false,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
      ];

      const batch = adminDb.batch();
      for (const proj of defaultProjects) {
        const ref = projectsCol.doc();
        batch.set(ref, proj);
      }
      await batch.commit();
      console.log("Seeding complete!");
    }
  } catch (error) {
    console.error("Error seeding default projects:", error);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Wait for Firestore seeding (disabled server-side seeding to avoid IAM permission issues)
  // await seedInitialProjects();

  // Authentication Middleware
  const authMiddleware = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing authentication header" });
    }

    const token = authHeader.split("Bearer ")[1];
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      const isMasterAdmin = decodedToken.email === "yaikobdiriba22@gmail.com" && decodedToken.email_verified;
      
      if (isMasterAdmin) {
        req.user = decodedToken;
        return next();
      }

      // Check database admins collection
      const adminDoc = await adminDb.collection("admins").doc(decodedToken.uid).get();
      if (adminDoc.exists) {
        req.user = decodedToken;
        return next();
      }

      return res.status(403).json({ error: "Access denied: Not an authorized administrator" });
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ error: "Unauthorized: Invalid token session" });
    }
  };

  // 1. Projects API (Public Reads, Admin Writes)
  app.get("/api/projects", async (req, res) => {
    try {
      const snapshot = await adminDb.collection("projects").orderBy("createdAt", "desc").get();
      const projects = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        };
      });
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/projects", authMiddleware, async (req, res) => {
    try {
      const { title, description, image, category, technologies, githubUrl, liveUrl, featured } = req.body;
      
      if (!title || !description || !category || !technologies) {
        return res.status(400).json({ error: "Missing required fields for project creation" });
      }

      const projectData = {
        title,
        description,
        image: image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
        category,
        technologies: Array.isArray(technologies) ? technologies : [],
        githubUrl: githubUrl || "",
        liveUrl: liveUrl || "",
        featured: !!featured,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await adminDb.collection("projects").add(projectData);
      res.status(201).json({ id: docRef.id, ...projectData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/projects/:id", authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, image, category, technologies, githubUrl, liveUrl, featured } = req.body;

      const projectRef = adminDb.collection("projects").doc(id);
      const projectDoc = await projectRef.get();
      if (!projectDoc.exists) {
        return res.status(404).json({ error: "Project not found" });
      }

      const updateData: any = {
        updatedAt: Timestamp.now()
      };
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (image !== undefined) updateData.image = image;
      if (category !== undefined) updateData.category = category;
      if (technologies !== undefined) updateData.technologies = Array.isArray(technologies) ? technologies : [];
      if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
      if (liveUrl !== undefined) updateData.liveUrl = liveUrl;
      if (featured !== undefined) updateData.featured = !!featured;

      await projectRef.update(updateData);
      const updatedDoc = await projectRef.get();
      const finalData = updatedDoc.data();
      res.json({
        id,
        ...finalData,
        createdAt: finalData?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: finalData?.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/projects/:id", authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const projectRef = adminDb.collection("projects").doc(id);
      const projectDoc = await projectRef.get();
      if (!projectDoc.exists) {
        return res.status(404).json({ error: "Project not found" });
      }
      await projectRef.delete();
      res.json({ success: true, message: "Project deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 2. Contact Message API (Public Submission, Admin Management)
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Missing required contact form fields" });
      }

      let aiSuggestedReply = "";
      
      // Auto-generate professional response draft using Gemini
      const ai = getGeminiClient();
      if (ai) {
        try {
          const aiResponse = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `You are the professional AI customer relations assistant for James Tech, a software development, networking, and IT support company.
A customer has sent the following message:
Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}

Please write a highly professional, helpful, and personalized email draft reply as the James Tech Relations Team. Address the client by name. Outline how we can help with their inquiry (be encouraging, and note that a system architect will reach out shortly with specifics). Keep it clean, professional, polite, and well-structured. Sign off as 'James Tech Support Team'.`,
          });
          aiSuggestedReply = aiResponse.text || "";
        } catch (aiErr) {
          console.error("Gemini failed to generate response draft:", aiErr);
          aiSuggestedReply = `Hi ${name},\n\nThank you for reaching out to James Tech. We have received your inquiry regarding "${subject}" and our engineering team will review your requirements and get back to you within 24 hours.\n\nBest regards,\nJames Tech Relations Team`;
        }
      } else {
        aiSuggestedReply = `Hi ${name},\n\nThank you for reaching out to James Tech. We have received your inquiry regarding "${subject}" and our engineering team will review your requirements and get back to you within 24 hours.\n\nBest regards,\nJames Tech Relations Team`;
      }

      // Return the generated reply securely; frontend will store the message in Firestore directly
      res.status(200).json({ aiSuggestedReply });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Support Agent Chat API powered securely by Gemini
  app.post("/api/support/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array" });
      }

      const systemInstruction = `You are "James Bot", the official, friendly, and expert Customer Support Agent for James Tech (a premium software engineering, networking, and IT support company).
Your contact details are:
- Phone: 0922067302
- Email: yaikobdiriba22@gmail.com
- Location: Contact James Tech for the current location.

Academy programs include Scratch & Game Development, Web Development, Python Programming, AI & Emerging Technology, Robotics & STEM, and UI/UX & Digital Creativity.

Instructions:
- Be highly helpful, polite, and technical yet easy to understand.
- Keep responses relatively concise and focused.
- If they ask for contact info, always provide the phone number 0922067302 and email yaikobdiriba22@gmail.com.
- Do not make up any other contact information.
- Use markdown formatting for lists or headers where appropriate.`;

      const ai = getGeminiClient();
      if (!ai) {
        // Mock fallback response if Gemini is not configured
        const lastMsg = messages[messages.length - 1]?.text || "";
        let fallbackReply = "Thank you for contacting James Tech support. A team member will respond to you shortly. You can reach us directly at phone: 0922067302 or email: yaikobdiriba22@gmail.com.";
        if (lastMsg.toLowerCase().includes("phone") || lastMsg.toLowerCase().includes("contact") || lastMsg.toLowerCase().includes("call")) {
          fallbackReply = "You can contact our direct support team anytime at 0922067302 or email us at yaikobdiriba22@gmail.com.";
        } else if (lastMsg.toLowerCase().includes("email") || lastMsg.toLowerCase().includes("mail")) {
          fallbackReply = "You can email us at yaikobdiriba22@gmail.com, or reach us via phone at 0922067302.";
        } else if (lastMsg.toLowerCase().includes("service") || lastMsg.toLowerCase().includes("web") || lastMsg.toLowerCase().includes("network")) {
          fallbackReply = "James Tech provides custom web development, full-stack cloud applications, IT support & network architecture. For inquiries, email yaikobdiriba22@gmail.com or call 0922067302.";
        }
        return res.json({ reply: fallbackReply });
      }

      // Convert messages to Gemini format: role ('user' | 'model'), parts [{ text: string }]
      const formattedContents = messages.slice(-15).map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text || "" }]
      }));

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: aiResponse.text || "I am here to help. How can I assist you with James Tech services?" });
    } catch (error: any) {
      console.error("Support chat error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/contact", authMiddleware, async (req, res) => {
    try {
      const snapshot = await adminDb.collection("contactMessages").orderBy("createdAt", "desc").get();
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        };
      });
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/contact/:id", authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status || !["unread", "read", "archived"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      const ref = adminDb.collection("contactMessages").doc(id);
      const doc = await ref.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "Message not found" });
      }

      await ref.update({ status });
      res.json({ success: true, id, status });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/contact/:id", authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const ref = adminDb.collection("contactMessages").doc(id);
      const doc = await ref.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "Message not found" });
      }
      await ref.delete();
      res.json({ success: true, message: "Message deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 3. Analytics API (Admin Only)
  app.get("/api/analytics", authMiddleware, async (req, res) => {
    try {
      const projectsSnap = await adminDb.collection("projects").get();
      const messagesSnap = await adminDb.collection("contactMessages").get();

      const totalProjects = projectsSnap.size;
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

      projectsSnap.docs.forEach(doc => {
        const cat = doc.data().category;
        if (cat && categories[cat] !== undefined) {
          categories[cat]++;
        }
      });

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

      // Sort messages by creation date descending and take top 5
      const sortedMessages = messages
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      const categoryDistribution = Object.keys(categories).map(name => ({
        name,
        value: categories[name],
      }));

      res.json({
        totalProjects,
        totalMessages,
        unreadMessagesCount,
        categoryDistribution,
        recentSubmissions: sortedMessages,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Verify Admin Session Endpoint
  app.post("/api/auth/verify", authMiddleware, async (req: any, res) => {
    try {
      // If authMiddleware passed, they are a validated admin!
      const user = req.user;
      res.json({
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          name: user.name || user.email?.split("@")[0] || "Administrator",
          picture: user.picture || ""
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 4. Vite middleware or Static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {\n  console.error("Failed to start James Tech server:", error);\n  process.exit(1);\n});

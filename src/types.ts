export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: "Web Development" | "Full-Stack Applications" | "IT Support" | "Network Administration" | "Digital Solutions";
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "archived";
  aiSuggestedReply?: string; // Generated automatically by Gemini on the server
  createdAt: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: "admin";
  createdAt: string;
}

export interface AnalyticsSummary {
  totalProjects: number;
  totalMessages: number;
  unreadMessagesCount: number;
  categoryDistribution: { name: string; value: number }[];
  recentSubmissions: ContactMessage[];
}

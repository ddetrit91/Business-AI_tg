export type LeadStatus = "new" | "in_progress" | "closed";
export type LeadSource = "form" | "ai-quiz" | "chat";

export type QuizAnswers = {
  service?: string;
  budget?: string;
  timeline?: string;
};

export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  comment?: string;
  source: LeadSource;
  status: LeadStatus;
  quiz?: QuizAnswers;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

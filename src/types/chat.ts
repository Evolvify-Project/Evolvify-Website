export interface Message {
  role: "user" | "assistant";
  content: string;
  isVoice?: boolean;
  timestamp?: string;
  status?: "pending" | "sent" | "error";
}

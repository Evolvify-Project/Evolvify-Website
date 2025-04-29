import React from "react";
import { Bot, User } from "lucide-react";
import { MessageContent } from "./MessageContent";
import type { Message } from "../../types/chat";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === "assistant";

  return (
    <div
      className={`flex gap-3 ${
        isBot ? "bg-gray-50" : ""
      } p-4 rounded-lg transition-colors duration-200`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isBot ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
        }`}
      >
        {isBot ? <Bot size={20} /> : <User size={20} />}
      </div>
      <MessageContent message={message} />
    </div>
  );
};

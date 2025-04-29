import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownComponents } from "./MarkdownComponents";
import type { Message } from "../../types/chat";

interface MessageContentProps {
  message: Message;
}

export const MessageContent: React.FC<MessageContentProps> = ({ message }) => {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={MarkdownComponents}
        >
          {message.content}
        </ReactMarkdown>
      </div>
      {message.isVoice && (
        <span className="text-xs text-gray-500 mt-1 block">Voice message</span>
      )}
    </div>
  );
};

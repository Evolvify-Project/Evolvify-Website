import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../types/chat';
import userChat from "../assets/images/person.png"
import robotChat from "../assets/images/robot.png"

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'assistant';

  return (
    <div
      className={`flex gap-3 ${
        isBot ? "bg-gray-50" : ""
      } p-4 rounded-lg transition-colors duration-200`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isBot ? "bg-blue-100 text-blue-400" : "bg-gray-100 text-gray-600"
        }`}
      >
        {isBot ? < img src={robotChat}/> : <img src={userChat} />}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => (
                <p className="text-gray-800 mb-2 last:mb-0" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a className="text-blue-600 hover:text-blue-800" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-4 mb-2" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-4 mb-2" {...props} />
              ),
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              h1: ({ node, ...props }) => (
                <h1 className="text-xl font-bold mb-2" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-lg font-bold mb-2" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-md font-bold mb-2" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-gray-200 pl-4 italic mb-2"
                  {...props}
                />
              ),
              code({ className, children, ...props }) {
                const isBlock = className?.includes("language-");

                if (isBlock) {
                  return (
                    <pre className="bg-gray-100 p-2 rounded mb-2 overflow-x-auto">
                      <code className={className}>{children}</code>
                    </pre>
                  );
                }

                return (
                  <code className="bg-gray-100 px-1 rounded" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {message.isVoice && (
          <span className="text-xs text-gray-500 mt-1 block">
            Voice message
          </span>
        )}
      </div>
    </div>
  );
}
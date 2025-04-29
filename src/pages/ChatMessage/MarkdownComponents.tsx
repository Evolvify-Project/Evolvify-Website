import React from "react";
import type { Components } from "react-markdown";

export const MarkdownComponents: Components = {
  p: ({ node, ...props }) => (
    <p className="text-gray-800 mb-2 last:mb-0" {...props} />
  ),
  a: ({ node, ...props }) => (
    <a
      className="text-blue-600 hover:text-blue-800 underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: ({ node, ...props }) => (
    <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />
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
  code: ({ node, inline, ...props }) =>
    inline ? (
      <code className="bg-gray-100 px-1 rounded font-mono text-sm" {...props} />
    ) : (
      <code
        className="block bg-gray-100 p-2 rounded mb-2 font-mono text-sm"
        {...props}
      />
    ),
  pre: ({ node, ...props }) => (
    <pre className="bg-gray-100 p-2 rounded mb-2 overflow-x-auto" {...props} />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="border-l-4 border-gray-200 pl-4 italic mb-2"
      {...props}
    />
  ),
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full divide-y divide-gray-200" {...props} />
    </div>
  ),
  th: ({ node, ...props }) => (
    <th
      className="px-3 py-2 bg-gray-50 text-left text-sm font-semibold text-gray-900"
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td className="px-3 py-2 text-sm text-gray-500" {...props} />
  ),
};

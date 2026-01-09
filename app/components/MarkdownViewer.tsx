/* eslint-disable react/prop-types */
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
  content: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  return (
    <div className="markdown-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 1. 核心修复：拦截 p 标签，将其内部的文本手动包装
          p: ({ children }) => {
            return (
              <p className="mb-4 last:mb-0 leading-relaxed text-zinc-200">
                {React.Children.map(children, (child) => {
                  // 如果是纯文本字符串，包装它以触发动画
                  if (typeof child === "string") {
                    const pre = child.substring(0, child.length - 1);
                    const last = child.charAt(child.length - 1);
                    return (
                      <span>
                        <span>{pre}</span>
                        <span className="animate-message-in">{last}</span>
                      </span>
                    );
                  }
                  // 如果是其他标签（如 strong, em 等），保持原样
                  return child;
                })}
              </p>
            );
          },

          // 2. 同样处理 li 标签，确保列表也有动画
          li: ({ children }) => {
            console.log("li", children)
            return <li className="animate-fade-in-up">{children}</li>;
          },
          // 3. 代码块保持你的原有逻辑，但加上动画类
          code(props) {
            const { children, className } = props;
            const match = /language-(\w+)/.exec(className || "");

            return match ? (
              <div className="my-4 shadow-xl">
                <SyntaxHighlighter
                  PreTag="div"
                  language={match[1]}
                  style={oneDark}
                  customStyle={{ margin: 0, borderRadius: "12px" }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-zinc-700 px-1.5 py-0.5 rounded text-pink-400 animate-message-in">
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default memo(MarkdownViewer);

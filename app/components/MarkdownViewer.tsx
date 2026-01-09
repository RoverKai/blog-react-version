import React, { memo, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
  content: string;
}

type MarkdownLabelProcessorParamType = {
  children?: ReactNode;
  className?: string;
};

type MarkdownLabelProcessor = (
  params: MarkdownLabelProcessorParamType
) => ReactNode;

const processReactChildren = (children: ReactNode) => {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      const pre = child.substring(0, child.length - 1);
      const last = child.charAt(child.length - 1);
      return (
        <>
          {pre}
          <span key={child.length} className="last-char-animation">{last}</span>
        </>
      );
    }
    return child;
  });
};

const pLabelProcessor: MarkdownLabelProcessor = ({ children }) => {
  return (
    <p className="paragraph-node mb-4 last:mb-0 leading-relaxed text-zinc-200">
      {processReactChildren(children)}
    </p>
  );
};

const liLabelProcessor: MarkdownLabelProcessor = ({ children }) => {
  return React.Children.map(children, (child) => {
    if (typeof child == "string") {
      const pre = child.substring(0, child.length - 1);
      const last = child.charAt(child.length - 1);
      return (
        <li className="paragraph-node">
          <span>{pre}</span>
          <span className="last-char-animation">{last}</span>
        </li>
      );
    }
    return children;
  });
};

const codeLabelProcessor: MarkdownLabelProcessor = ({ children, className }) => {
  const match = /language-(\w+)/.exec(className || "");
  const isInline = !match;

  // 1. 处理行内代码 (Inline Code)
  if (isInline) {
    return (
      <code className="bg-zinc-700 px-1.5 py-0.5 rounded text-pink-400">
        {processReactChildren(children)}
      </code>
    );
  }

  // 2. 处理多行代码块 (Code Block)
  return (
    <div className="my-4 shadow-xl overflow-hidden rounded-xl">
      <SyntaxHighlighter
        PreTag="div"
        language={match[1]}
        style={oneDark}
        customStyle={{ margin: 0, borderRadius: "12px" }}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
};

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  return (
    <div className="markdown-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: pLabelProcessor,
          li: liLabelProcessor,
          code: codeLabelProcessor,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default memo(MarkdownViewer);

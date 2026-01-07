/* eslint-disable react/prop-types */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// ✅ 推荐的写法 (直接指向具体文件)
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';
import remarkGfm from 'remark-gfm'; // 用于支持表格、任务列表等

interface MarkdownViewerProps {
  content: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  return (
    <div className="markdown-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 在 v10 中，自定义 code 渲染是实现高亮的关键
          code(props) {
            const { children, className } = props;
            // 检查是否有 language-xx 类名
            const match = /language-(\w+)/.exec(className || '');
            
            return match ? (
              <SyntaxHighlighter
                PreTag="div"
                language={match[1]}
                style={oneDark}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              // 如果没有语言类名，则视为普通的内联代码
              <code className={className}>
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

export default MarkdownViewer;
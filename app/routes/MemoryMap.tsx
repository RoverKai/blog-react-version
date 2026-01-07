import {
  useRef,
  useState,
  useLayoutEffect,
  type TransitionEventHandler
} from "react";
import StackItem from "../components/StackItem";
import PageTransition from "~/components/PageTransition";
import { Link } from "react-router";
import { memoryMap } from "~/utils/MemoryModelUtil";
import Heap from "~/components/Heap";
import { streamChat } from "~/api/Chat";
import type { ChatMessage } from "~/types/Chat";
import MarkdownViewer from "~/components/MarkdownViewer";

const MemoryMap = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [transitionReady, setTransitionReady] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatMode, setChatMode] = useState<boolean>(false);

  /** DOM refs */
  const inspectorRef = useRef<HTMLDivElement>(null);
  const blogRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const professionRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatEditableRef = useRef<HTMLDivElement>(null);

  const handleSelect = (key: string) => {
    setSelected((prev) => (prev === key ? null : key));
  };

  const handleNewMessage = (chunk: string) => {
    setMessages((prev) => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage.role === "assistant") {
        newMessages[newMessages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + chunk,
        };
      }
      return newMessages;
    });
  };

  const handleChatKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const el = chatEditableRef.current;
    if (!el) return;

    const content = el.innerText.trim();
    if (!content) return;

    const userMessage: ChatMessage = {
      role: "user",
      content,
    };

    setChatMode(true);

    // 1️⃣ 先把用户消息和空的assistant消息加入 messages
    const nextMessages = [
      ...messages,
      userMessage,
      { role: "assistant" as const, content: "" },
    ];
    setMessages(nextMessages);

    // 2️⃣ 发起流式请求
    streamChat(nextMessages, handleNewMessage);

    // 3️⃣ 清空输入框
    el.innerText = "";
  };

  useLayoutEffect(() => {
    const inspector = inspectorRef.current;
    if (!inspector) return;

    inspector.style.opacity = "0";

    let target: HTMLElement | null = null;
    if (selected === "projects") target = projectRef.current;
    if (selected === "profession") target = professionRef.current;
    if (selected === "chat_with_me") target = chatInputRef.current;
    if (!target) return;

    setTransitionReady(false);

    const updateInspector = () => {
      const rect = target.getBoundingClientRect();
      const style = getComputedStyle(target);

      inspector.style.opacity = "1";
      inspector.style.top = `${rect.top}px`;
      inspector.style.left = `${rect.left}px`;
      inspector.style.width = `${rect.width}px`;
      inspector.style.height = `${rect.height}px`;

      inspector.style.borderRadius = style.borderRadius;
      inspector.style.boxSizing = style.boxSizing;
    };

    updateInspector();

    console.log(target.style.borderRadius);

    const observer = new ResizeObserver(updateInspector);
    observer.observe(target);

    return () => observer.disconnect();
  }, [selected]);

  const handleTransitionEnd: TransitionEventHandler<HTMLDivElement> = (e) => {
    if (e.target !== inspectorRef.current) return;
    setTransitionReady(true);
  };

  return (
    <div className="relative h-full w-full flex justify-center items-center">
      <PageTransition>
        {/* Stack */}
        <div
          className={`border p-4 w-60 md:w-72 lg:w-80 transition-opacity duration-300 ${chatMode ? "opacity-0" : "opacity-100"}`}
        >
          <div className="mb-2 text-xs text-gray-500">Stack</div>

          {memoryMap.map((item) => (
            <StackItem key={item.key} item={item} onSelect={handleSelect} />
          ))}
        </div>

        {/* Chat Display */}
        <div
          className={`absolute top-0 left-0 w-full flex justify-center max-h-[85%] transition-opacity duration-300 ${chatMode ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {/* 1. 确保主面板有固定的高度或最大高度，并设置 overflow-hidden 防止内容外溢 */}
          <div className="w-full sm:w-3/4 md:w-1/2 mt-16 p-4 bg-zinc-800 text-zinc-100 rounded-[30px] shadow-lg shadow-black/40 border border-white/10 flex flex-col max-h-[70vh]">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <div className="text-xs text-gray-400">Chat</div>
              <button
                onClick={() => setChatMode(false)}
                className="text-xs text-red-400 hover:text-red-600 font-mono"
              >
                Exit
              </button>
            </div>

            {/* 2. 消息滚动区域：添加 overflow-y-auto */}
            <div className="overflow-y-auto pr-2 custom-scrollbar">
              {messages.map((message, index) => (
                <div key={index} className="mb-3 px-4">
                  <span className="font-bold text-green-400">
                    {message.role}:
                  </span>{" "}
                  <MarkdownViewer content={message.content}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inspector */}
        <div
          onTransitionEnd={handleTransitionEnd}
          ref={inspectorRef}
          className={`fixed top-0 left-0 border bg-white/80 backdrop-blur
            pointer-events-none transition-all duration-300 ease-out rounded-none ${chatMode ? "opacity-100" : "opacity-0"}`}
        />

        {/* Blog */}
        <div
          ref={blogRef}
          className={`absolute sm:absolute top-1/2 left-1/2 sm:top-1/5 sm:left-1/8 md:left-1/4 lg:left-1/8 w-3/4 sm:w-1/4 h-1/3 sm:h-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:transform-none
             ${selected === "blogs" && transitionReady ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <Heap memoryMapKey="blogs">
            <Link to={"https://roverkai.github.io/"}>git page</Link>
          </Heap>
        </div>

        {/* Project */}
        <div
          ref={projectRef}
          className={`absolute sm:absolute top-1/2 left-1/2 sm:top-1/4 sm:right-1/5 md:right-1/5 w-3/4 sm:w-1/5 md:w-1/6 h-1/4 sm:h-1/8 min-w-48 transition-all transform -translate-x-1/2 -translate-y-1/2 sm:transform-none ${selected === "projects" && transitionReady ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <Heap memoryMapKey="projects">
            <Link to={"https://gitee.com/roverkai/same-wave"}>same-wave</Link>
            <Link to={"http://www.cshwxc.com"}>huiwang-material</Link>
          </Heap>
        </div>

        {/* profession */}
        <div
          ref={professionRef}
          className={`profession absolute sm:absolute top-1/4 left-1/2 sm:left-2/5 md:left-1/6 sm:bottom-1/6 h-1/6 sm:h-1/8 w-3/4 sm:w-1/3 md:w-1/5 transition-all transform -translate-x-1/2 -translate-y-1/2 sm:transform-none ${selected === "profession" && transitionReady ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <Heap memoryMapKey="profession">
            <div className="flex justify-around h-full items-center *:cursor-pointer">
              <p>react</p>
              <p>vue</p>
              <p>java</p>
              <p>rust</p>
            </div>
          </Heap>
        </div>

        {/* chat input */}
        <div className="fixed bottom-6 font-mono left-0 w-full flex justify-center px-4">
          <div
            ref={chatInputRef}
            className={`w-full sm:w-3/4 md:w-1/2 h-14 px-5 flex items-center gap-2 rounded-[30px] transition-all bg-zinc-900 text-zinc-100 font-mono text-sm shadow-lg shadow-black/40 border border-white/10 ${selected === "chat_with_me" && transitionReady ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <span className="text-green-400 select-none">user:$</span>
            <div
              ref={chatEditableRef}
              contentEditable
              spellCheck={false}
              onKeyDown={handleChatKeyDown}
              className="flex-1 outline-none whitespace-nowrap overflow-hidden"
            />
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default MemoryMap;

import {
  useRef,
  useState,
  useLayoutEffect,
  type TransitionEventHandler,
  useEffect,
} from "react";
import StackItem from "../components/StackItem";
import PageTransition from "~/components/PageTransition";
import { Link } from "react-router";
import { memoryMap } from "~/utils/MemoryModelUtil";
import Heap from "~/components/Heap";
import { parseBorderRadius } from "~/utils/StyleUtil";
import { streamChat } from "~/api/Chat";
import type { ChatMessage } from "~/types/Chat";

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
    console.log("chatMode", chatMode);

    // 1️⃣ 先把用户消息和空的assistant消息加入 messages
    const nextMessages = [...messages, userMessage, { role: "assistant" as const, content: "" }];
    setMessages(nextMessages);

    // 2️⃣ 发起流式请求
    await streamChat(nextMessages, handleNewMessage);

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

      // 形状
      inspector.style.borderRadius = parseBorderRadius(
        style.borderRadius,
        rect.width,
        rect.height
      );
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
          className={`border p-4 w-60 transition-opacity duration-300 ${chatMode ? "opacity-0" : "opacity-100"}`}
        >
          <div className="mb-2 text-xs text-gray-500">Stack</div>

          {memoryMap.map((item) => (
            <StackItem key={item.key} item={item} onSelect={handleSelect} />
          ))}
        </div>

        {/* Chat Display */}
        <div
          className={`absolute top-0 left-0 p-4 w-full flex justify-center max-h-96 overflow-y-auto transition-opacity duration-300 ${chatMode ? "opacity-100" : "opacity-0"}`}
        >
          <div className="w-1/2">
            <div className="mb-2 text-xs text-gray-500">Chat</div>
            {messages.map((message, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold text-green-400">
                  {message.role}:
                </span>{" "}
                <span className="text-sm">{message.content}</span>
              </div>
            ))}
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
          className={`absolute top-1/5 left-1/8 w-1/4 h-1/2
             ${selected === "blogs" && transitionReady ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <Heap memoryMapKey="blogs">
            <Link to={"https://roverkai.github.io/"}>git page</Link>
          </Heap>
        </div>

        {/* Project */}
        <div
          ref={projectRef}
          className={`absolute w-1/6 h-1/8 top-1/4 right-1/5 min-w-48 transition-all ${selected === "projects" && transitionReady ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <Heap memoryMapKey="projects">
            <Link to={"https://gitee.com/roverkai/same-wave"}>same-wave</Link>
            <Link to={"http://www.cshwxc.com"}>huiwang-material</Link>
          </Heap>
        </div>

        {/* profession */}
        <div
          ref={professionRef}
          className={`absolute left-2/5 bottom-1/6 h-1/8 w-1/4 transition-all ${selected === "profession" && transitionReady ? "opacity-100" : "opacity-0 pointer-events-none"}`}
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
        <div className="fixed bottom-6 font-mono left-0 w-full flex justify-center">
          <div
            ref={chatInputRef}
            className={` w-1/2 h-14 px-5 flex items-center gap-2 rounded-full transition-all bg-zinc-900 text-zinc-100 font-mono text-sm shadow-lg shadow-black/40 border border-white/10 ${selected === "chat_with_me" && transitionReady ? "opacity-100" : "opacity-0 pointer-events-none"}`}
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

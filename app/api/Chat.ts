import type { ChatMessage } from "~/types/Chat"

export const streamChat = async (
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
) => {
  const res = await fetch("http://localhost:8080/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
    }),
    signal,
  });

  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    if (signal?.aborted) break;
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    console.log("收到chunk", chunk)
    onChunk(chunk);
  }
};

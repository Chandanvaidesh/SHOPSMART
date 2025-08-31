import { useEffect, useRef } from "react";

function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col space-y-2 h-full overflow-y-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-2 rounded-2xl px-4 py-2 max-w-xs ${
            msg.sender === "user"
              ? "bg-blue-500 text-white self-end"
              : "bg-gray-200 text-black self-start"
          }`}
        >
          <strong>{msg.sender}:</strong> {msg.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import useLocal from "../utils/useLocal";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useLocal("chat:current", []);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const append = (m) => setChat((c) => [...c, m]);

  async function handleSend(e) {
    e.preventDefault();
    if (!message.trim()) return;

    append({ role: "user", content: message });
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  message: message,
  history: [],
  model: "gemini-1.5-flash"
}),
      });

      if (!res.ok) {
        throw new Error("Chat error " + res.status);
      }

      const data = await res.json();

      append({
        role: "assistant",
        content: data.reply,
        sources: data.sources || [],
      });
    } catch (err) {
      append({
        role: "assistant",
        content: "⚠️ " + err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[75vh]">
      <h2 className="text-xl font-semibold mb-4">
        Chat — Gemini RAG
      </h2>

      <div className="flex-1 overflow-auto space-y-4">
        {chat.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={m.role === "user" ? "text-right" : "text-left"}
          >
            <div className="inline-block p-3 rounded bg-slate-200">
              {m.content}
            </div>

            {m.sources?.length > 0 && (
              <div className="text-xs mt-2">
                <strong>Sources:</strong>
                <ul>
                  {m.sources.map((s, idx) => (
                    <li key={idx}>
                      {s.title} — "{s.excerpt}"
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="flex-1 border p-2"
          placeholder="Ask about uploaded documents..."
        />
        <button
          disabled={loading}
          className="bg-indigo-600 text-white px-4"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
}

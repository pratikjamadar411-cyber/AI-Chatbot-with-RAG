import React from "react";
import useLocal from "../utils/useLocal";

export default function ChatHistory() {
  const [history, setHistory] = useLocal("chat:history", []); // array of {id, chat, createdAt}

function clearAll() {
  if (window.confirm("Are you sure?")) {
    // your delete logic
    setHistory([]); // This will clear all chat history
  }
}



  function restore(item) {
    // Save as current chat (persist under chat:current)
    localStorage.setItem("chat:current", JSON.stringify(item.chat));
    alert("Restored to current session. Go to Chat.");
  }

  function removeOne(idx) {
    const copy = [...history];
    copy.splice(idx, 1);
    setHistory(copy);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Chat History</h2>
        <div>
          <button onClick={clearAll} className="text-sm text-red-500">Clear all</button>
        </div>
      </div>

      <div className="space-y-3">
        {history.length === 0 && <div className="text-slate-400">No saved chats yet</div>}
        {history.map((h, i) => (
          <div key={i} className="p-3 bg-slate-100 dark:bg-slate-700 rounded shadow flex justify-between items-start">
            <div>
              <div className="font-medium">{h.title || `Conversation ${i + 1}`}</div>
              <div className="text-xs text-slate-500 dark:text-slate-300">{new Date(h.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => restore(h)} className="text-sm px-2 py-1 rounded bg-indigo-600 text-white">Restore</button>
              <button onClick={() => removeOne(i)} className="text-sm px-2 py-1 rounded border">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

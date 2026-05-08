import React from "react";
import {  Sun, Moon, MessageSquare, Upload, History } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ theme, toggleTheme }) {
  return (
    <div className="w-64 p-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">AI RAG Chatbot</h1>
        <button onClick={toggleTheme}>
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <nav className="space-y-3">
        <Link to="/chat" className="flex items-center gap-2">
          <MessageSquare size={20} /> Chat
        </Link>

        <Link to="/upload" className="flex items-center gap-2">
          <Upload size={20} /> Upload Documents
        </Link>

        <Link to="/history" className="flex items-center gap-2">
          <History size={20} /> Chat History
        </Link>
      </nav>
    </div>
  );
}


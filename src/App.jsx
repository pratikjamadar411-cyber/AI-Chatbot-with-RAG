import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import ChatPage from "./pages/Home";
import UploadPage from "./pages/Upload";
import ChatHistory from "./components/ChatHistory";

export default function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <Sidebar theme={theme} toggleTheme={toggleTheme} />

        <main className="flex-1 p-6 bg-white dark:bg-slate-900">
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/history" element={<ChatHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

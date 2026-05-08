import { useState } from "react";

export default function useLocal(key, initial) {
  const raw = localStorage.getItem(key);
  const init = raw ? JSON.parse(raw) : initial;
  const [state, setState] = useState(init);

  function set(v) {
    setState((prev) => {
      const next = typeof v === "function" ? v(prev) : v;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }

  return [state, set];
}

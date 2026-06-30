"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

type ToastFn = (msg: string) => void;
const ToastCtx = createContext<ToastFn>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([]);
  const counter = useRef(0);

  const push = useCallback<ToastFn>((msg) => {
    const id = (counter.current += 1);
    setItems((s) => [...s, { id, msg }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 2800);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pf-toasts">
        {items.map((t) => (
          <div key={t.id} className="pf-toast">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5EE6A8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

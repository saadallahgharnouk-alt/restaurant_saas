import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

/* Tiny toast — used by the admin to confirm saves / report upload errors. */

const ToastContext = createContext(null);

let NEXT_ID = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, { tone = 'neutral', ms = 2600 } = {}) => {
    const id = NEXT_ID++;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(
      () => setToasts((t) => t.filter((x) => x.id !== id)),
      ms
    );
  }, []);

  const api = useMemo(
    () => ({
      show:    (m)  => push(m),
      success: (m)  => push(m, { tone: 'success' }),
      error:   (m)  => push(m, { tone: 'error', ms: 4000 }),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.tone}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext) || { show() {}, success() {}, error() {} };
}

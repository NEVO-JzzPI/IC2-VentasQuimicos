import { useState, useCallback } from 'react'
import { ToastContext } from './toast-context.js'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'info') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 3000)
  }, [removeToast])

  const value = { toasts, showToast, removeToast }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

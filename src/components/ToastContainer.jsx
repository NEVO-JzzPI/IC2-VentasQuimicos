import { useToast } from '../context/ToastContext'
import Toast from './Toast'

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-xs">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          
        />
      ))}
    </div>
  )
}

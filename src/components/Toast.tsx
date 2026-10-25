import { CheckIcon } from './icons'

export interface ToastState {
  id: number
  message: string
  action?: { label: string; onPress: () => void }
}

interface ToastProps {
  toast: ToastState | null
  className?: string
}

export function Toast({ toast, className = '' }: ToastProps) {
  if (!toast) return null
  return (
    <div
      key={toast.id}
      role="status"
      aria-live="polite"
      className={`flex h-11 items-center justify-between gap-3 rounded-[14px] bg-text px-4 text-[13px] text-white shadow-lg animate-[toast-in_200ms_ease-out] ${className}`}
    >
      <span className="flex items-center gap-1.5">
        {toast.message}
        {!toast.action && <CheckIcon className="size-3.5" />}
      </span>
      {toast.action && (
        <button
          type="button"
          data-testid="undo-button"
          onClick={toast.action.onPress}
          className="-mr-2 px-2 py-2 font-semibold"
        >
          {toast.action.label}
        </button>
      )}
    </div>
  )
}

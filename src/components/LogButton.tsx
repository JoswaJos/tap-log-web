import { useState } from 'react'
import { PlusIcon } from './icons'

interface LogButtonProps {
  onLog: () => void
}

export function LogButton({ onLog }: LogButtonProps) {
  // Bumped on every press to restart the pulse animation.
  const [pulse, setPulse] = useState(0)

  return (
    <div className="relative grid size-[212px] place-items-center">
      {pulse > 0 && (
        <span
          key={pulse}
          className="absolute inset-0 rounded-full bg-primary/30 animate-[log-pulse_600ms_ease-out_forwards]"
        />
      )}
      <button
        type="button"
        data-testid="log-button"
        onClick={() => {
          setPulse((n) => n + 1)
          onLog()
        }}
        className="relative flex size-full flex-col items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_32px_rgba(47,111,237,0.35)] transition-transform duration-150 ease-out select-none active:scale-[0.94] active:bg-[#2A63D6]"
      >
        <PlusIcon className="mb-2 size-7" strokeWidth={1.6} />
        <span className="text-[28px] leading-8 font-semibold tracking-tight">Log now</span>
        <span className="mt-1 text-[12px] text-white/80">Save this moment</span>
      </button>
    </div>
  )
}

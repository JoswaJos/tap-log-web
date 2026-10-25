import { useRef, useState, type PointerEvent } from 'react'
import type { LogEntry } from '../lib/db'
import { formatTime } from '../lib/time'
import { TagBadge } from './TagChip'
import { TrashIcon } from './icons'

const ACTION_WIDTH = 72

interface HistoryRowProps {
  log: LogEntry
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (log: LogEntry) => void
}

/** A log card that reveals a Delete action when swiped left (touch or mouse drag). */
export function HistoryRow({ log, open, onOpenChange, onDelete }: HistoryRowProps) {
  const [dragX, setDragX] = useState<number | null>(null)
  const gesture = useRef<{ x: number; y: number; base: number; horizontal: boolean | null } | null>(null)

  const offset = dragX ?? (open ? -ACTION_WIDTH : 0)

  function onPointerDown(e: PointerEvent) {
    gesture.current = { x: e.clientX, y: e.clientY, base: open ? -ACTION_WIDTH : 0, horizontal: null }
  }

  function onPointerMove(e: PointerEvent) {
    const g = gesture.current
    if (!g) return
    const dx = e.clientX - g.x
    const dy = e.clientY - g.y
    // Decide once per gesture whether this is a horizontal swipe or a vertical scroll.
    if (g.horizontal === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
      g.horizontal = Math.abs(dx) > Math.abs(dy)
      if (g.horizontal) e.currentTarget.setPointerCapture(e.pointerId)
    }
    if (!g.horizontal) return
    setDragX(Math.min(0, Math.max(-ACTION_WIDTH * 1.5, g.base + dx)))
  }

  function onPointerUp() {
    const g = gesture.current
    gesture.current = null
    if (g?.horizontal && dragX !== null) onOpenChange(dragX < -ACTION_WIDTH / 2)
    setDragX(null)
  }

  return (
    <li className="relative overflow-hidden rounded-card bg-danger">
      <button
        type="button"
        aria-label="Delete log"
        tabIndex={open ? 0 : -1}
        onClick={() => onDelete(log)}
        className="absolute inset-y-0 right-0 flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-white"
        style={{ width: ACTION_WIDTH }}
      >
        <TrashIcon className="size-5" />
        Delete
      </button>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={() => open && onOpenChange(false)}
        className={`relative flex touch-pan-y items-start justify-between gap-3 bg-card px-4 py-3 select-none ${
          dragX === null ? 'transition-transform duration-200 ease-out' : ''
        }`}
        style={{ transform: `translateX(${offset}px)` }}
      >
        <div className="min-w-0">
          <p className="text-[15px] font-semibold tabular-nums">{formatTime(log.timestamp)}</p>
          <p className="mt-0.5 truncate text-[13px] text-muted">{log.note || 'No note'}</p>
        </div>
        {log.tag && <TagBadge tag={log.tag} />}
      </div>
    </li>
  )
}

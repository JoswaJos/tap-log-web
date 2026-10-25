import { useMemo, useState, type ReactNode } from 'react'
import { HistoryRow } from '../components/HistoryRow'
import { HistoryIcon, ShareIcon } from '../components/icons'
import { csvFileName, exportCsv, toCsv } from '../lib/csv'
import type { LogEntry } from '../lib/db'
import { groupByDay } from '../lib/time'

interface HistoryScreenProps {
  logs: LogEntry[]
  onDelete: (log: LogEntry) => void
  onGoToLog: () => void
  toast: ReactNode
}

export function HistoryScreen({ logs, onDelete, onGoToLog, toast }: HistoryScreenProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const groups = useMemo(() => groupByDay(logs), [logs])

  return (
    <div className="relative flex min-h-full flex-col pt-[max(env(safe-area-inset-top),24px)]">
      <header className="flex items-center justify-between px-4 pb-2">
        <h1 className="text-[28px] font-bold tracking-tight">History</h1>
        <button
          type="button"
          data-testid="export-button"
          disabled={logs.length === 0}
          onClick={() => setExporting(true)}
          className="-mr-2 flex items-center gap-1 px-2 py-2 text-[15px] font-medium text-primary disabled:opacity-40"
        >
          <ShareIcon className="size-4" />
          Export
        </button>
      </header>

      {logs.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 pb-16 text-center">
          <div className="grid size-14 place-items-center rounded-full bg-card text-muted shadow-sm">
            <HistoryIcon className="size-6" />
          </div>
          <p className="text-[15px] text-muted">No logs yet. Tap Log now to start.</p>
          <button
            type="button"
            data-testid="go-to-log-button"
            onClick={onGoToLog}
            className="h-11 rounded-xl bg-primary px-6 text-[15px] font-semibold text-white active:opacity-80"
          >
            Go to Log
          </button>
        </div>
      ) : (
        <div data-testid="history-list" className="flex-1 px-4 pb-24">
          {groups.map((group) => (
            <section key={group.label} className="mt-3">
              <h2 className="mb-2 text-[13px] font-medium text-muted">{group.label}</h2>
              <ul className="flex flex-col gap-2">
                {group.items.map((log) => (
                  <HistoryRow
                    key={log.id}
                    log={log}
                    open={openId === log.id}
                    onOpenChange={(open) => setOpenId(open ? log.id : null)}
                    onDelete={(l) => {
                      setOpenId(null)
                      onDelete(l)
                    }}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <div className="pointer-events-none sticky bottom-3 z-10 mt-auto px-4 [&>*]:pointer-events-auto">{toast}</div>

      {exporting && <ExportSheet logs={logs} onClose={() => setExporting(false)} />}
    </div>
  )
}

function ExportSheet({ logs, onClose }: { logs: LogEntry[]; onClose: () => void }) {
  // Export oldest first so the file reads chronologically.
  const csv = useMemo(() => toCsv([...logs].reverse()), [logs])
  const fileName = useMemo(() => csvFileName(), [])

  async function share() {
    const result = await exportCsv(csv, fileName)
    if (result !== 'cancelled') onClose()
  }

  return (
    <div className="fixed inset-0 z-30 mx-auto flex max-w-[430px] flex-col justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/30" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-title"
        className="relative rounded-t-[20px] bg-card px-4 pt-2 pb-[max(env(safe-area-inset-bottom),16px)] animate-[sheet-in_220ms_ease-out]"
      >
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-black/15" />
        <h2 id="export-title" className="text-[22px] font-bold">Export logs</h2>
        <p className="text-[13px] text-muted">{logs.length} {logs.length === 1 ? 'log' : 'logs'} · CSV file</p>
        <p className="mt-4 mb-2 text-[13px] font-medium">{fileName}</p>
        <pre className="max-h-48 overflow-auto rounded-xl bg-bg p-3 font-mono text-[11px] leading-5 whitespace-pre-wrap text-text/80">
          {csv}
        </pre>
        <button
          type="button"
          data-testid="share-button"
          onClick={share}
          className="mt-4 h-12 w-full rounded-xl bg-primary text-[15px] font-semibold text-white active:opacity-80"
        >
          Share
        </button>
        <button
          type="button"
          data-testid="cancel-export-button"
          onClick={onClose}
          className="mt-2 h-12 w-full rounded-xl bg-bg text-[15px] font-semibold active:opacity-70"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

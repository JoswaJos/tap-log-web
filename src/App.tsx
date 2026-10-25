import { useCallback, useEffect, useRef, useState } from 'react'
import { TabBar, type TabId } from './components/TabBar'
import { Toast, type ToastState } from './components/Toast'
import { deleteLog, getLogs, putLog, type LogEntry, type Tag } from './lib/db'
import { formatTime } from './lib/time'
import { HistoryScreen } from './screens/HistoryScreen'
import { LogScreen } from './screens/LogScreen'

const sortNewestFirst = (logs: LogEntry[]) => [...logs].sort((a, b) => b.timestamp - a.timestamp)

export default function App() {
  const [tab, setTab] = useState<TabId>('log')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [toast, setToast] = useState<ToastState | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    getLogs().then(setLogs)
  }, [])

  const showToast = useCallback((message: string, action?: ToastState['action'], duration = 2500) => {
    clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message, action })
    toastTimer.current = setTimeout(() => setToast(null), duration)
  }, [])

  const dismissToast = useCallback(() => {
    clearTimeout(toastTimer.current)
    setToast(null)
  }, [])

  const handleLog = useCallback(
    (note: string, tag: Tag | null) => {
      const entry: LogEntry = {
        id: crypto.randomUUID(),
        timestamp: Math.floor(Date.now() / 1000) * 1000,
        note,
        tag,
      }
      setLogs((prev) => [entry, ...prev])
      putLog(entry)
      showToast(`Logged at ${formatTime(entry.timestamp)}`)
    },
    [showToast],
  )

  const handleDelete = useCallback(
    (entry: LogEntry) => {
      setLogs((prev) => prev.filter((l) => l.id !== entry.id))
      deleteLog(entry.id)
      showToast(
        'Log deleted',
        {
          label: 'Undo',
          onPress: () => {
            setLogs((prev) => sortNewestFirst([...prev, entry]))
            putLog(entry)
            dismissToast()
          },
        },
        5000,
      )
    },
    [showToast, dismissToast],
  )

  function changeTab(next: TabId) {
    if (next !== tab) dismissToast()
    setTab(next)
  }

  const toastNode = <Toast toast={toast} className={tab === 'log' ? 'w-fit' : 'w-full'} />

  return (
    <div className="mx-auto flex h-full max-w-[430px] flex-col bg-bg pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
      <main className="flex-1 overflow-y-auto">
        {tab === 'log' ? (
          <LogScreen lastLog={logs[0]} onLog={handleLog} toast={toastNode} />
        ) : (
          <HistoryScreen logs={logs} onDelete={handleDelete} onGoToLog={() => changeTab('log')} toast={toastNode} />
        )}
      </main>
      <TabBar active={tab} onChange={changeTab} />
    </div>
  )
}

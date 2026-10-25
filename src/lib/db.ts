import { openDB, type DBSchema } from 'idb'

export type Tag = 'work' | 'break' | 'other'

export interface LogEntry {
  id: string
  /** Epoch milliseconds, second precision. */
  timestamp: number
  note: string
  tag: Tag | null
}

interface TapLogDB extends DBSchema {
  logs: { key: string; value: LogEntry; indexes: { timestamp: number } }
}

const dbPromise = openDB<TapLogDB>('tap-log', 1, {
  upgrade(db) {
    const store = db.createObjectStore('logs', { keyPath: 'id' })
    store.createIndex('timestamp', 'timestamp')
  },
})

/** All logs, newest first. */
export async function getLogs(): Promise<LogEntry[]> {
  const logs = await (await dbPromise).getAllFromIndex('logs', 'timestamp')
  return logs.reverse()
}

export async function putLog(entry: LogEntry): Promise<void> {
  await (await dbPromise).put('logs', entry)
}

export async function deleteLog(id: string): Promise<void> {
  await (await dbPromise).delete('logs', id)
}

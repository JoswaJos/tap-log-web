import { HistoryIcon, PlusCircleIcon } from './icons'

export type TabId = 'log' | 'history'

interface TabBarProps {
  active: TabId
  onChange: (tab: TabId) => void
}

const TABS = [
  { id: 'log', label: 'Log', Icon: PlusCircleIcon },
  { id: 'history', label: 'History', Icon: HistoryIcon },
] as const

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="flex border-t border-black/5 bg-card pb-[env(safe-area-inset-bottom)]">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          data-testid={`tab-${id}`}
          aria-current={active === id ? 'page' : undefined}
          onClick={() => onChange(id)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
            active === id ? 'text-primary' : 'text-muted'
          }`}
        >
          <Icon className="size-6" />
          {label}
        </button>
      ))}
    </nav>
  )
}

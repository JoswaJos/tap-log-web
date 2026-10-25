import type { Tag } from '../lib/db'

export const TAGS: Tag[] = ['work', 'break', 'other']

export const TAG_LABEL: Record<Tag, string> = { work: 'Work', break: 'Break', other: 'Other' }

const DOT: Record<Tag, string> = { work: 'bg-work', break: 'bg-break', other: 'bg-other' }
const TINT: Record<Tag, string> = {
  work: 'bg-work/10 text-work',
  break: 'bg-break/12 text-[#248A3D]',
  other: 'bg-other/12 text-muted',
}

interface TagChipProps {
  tag: Tag
  selected: boolean
  onToggle: (tag: Tag) => void
}

/** Selectable tag pill used on the Log screen. */
export function TagChip({ tag, selected, onToggle }: TagChipProps) {
  return (
    <button
      type="button"
      data-testid={`tag-${tag}`}
      aria-pressed={selected}
      onClick={() => onToggle(tag)}
      className={`flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition-colors duration-150 active:scale-95 ${
        selected ? `${DOT[tag]} text-white` : 'bg-card text-text shadow-[0_0_0_1px_rgba(0,0,0,0.06)]'
      }`}
    >
      <span className={`size-1.5 rounded-full ${selected ? 'bg-white' : DOT[tag]}`} />
      {TAG_LABEL[tag]}
    </button>
  )
}

/** Small read-only tag badge used in history rows. */
export function TagBadge({ tag }: { tag: Tag }) {
  return (
    <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${TINT[tag]}`}>
      <span className={`size-1.5 rounded-full ${DOT[tag]}`} />
      {TAG_LABEL[tag]}
    </span>
  )
}

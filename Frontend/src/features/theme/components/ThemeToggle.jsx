import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../state/theme.slice.js'

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-1.8">
      <path d="M21 12.79A9 9 0 1 1 11.21 3c-.06.39-.09.79-.09 1.2a8.6 8.6 0 0 0 8.68 8.59c.4 0 .8-.03 1.2-.1Z" />
    </svg>
  )
}

export default function ThemeToggle() {
  const dispatch = useDispatch()
  const mode = useSelector((state) => state.theme.mode)

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      className="soft-panel inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition hover:scale-[1.02]"
      aria-label="Toggle theme"
    >
      {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
      <span>{mode === 'dark' ? 'Light mode' : 'Dark mode'}</span>
    </button>
  )
}

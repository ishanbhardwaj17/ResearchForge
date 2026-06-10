import { useDispatch, useSelector } from 'react-redux'
import { clearError, sendMessage, setDraft } from '../state/chat.slice.js'

function IconButton({ children, label }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-muted transition hover:text-[var(--text-primary)]"
      aria-label={label}
    >
      {children}
    </button>
  )
}

export default function ChatComposer() {
  const dispatch = useDispatch()
  const draft = useSelector((state) => state.chat.draft)
  const isLoading = useSelector((state) => state.chat.isLoading)
  const error = useSelector((state) => state.chat.error)

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!draft.trim() || isLoading) {
      return
    }

    dispatch(sendMessage(draft))
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-[28px] p-4 sm:p-5">
      {error ? (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => dispatch(clearError())}
            className="text-xs font-medium uppercase tracking-[0.14em] text-rose-100"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <textarea
        value={draft}
        onChange={(event) => dispatch(setDraft(event.target.value))}
        placeholder="Message AI research system..."
        rows={4}
        className="w-full resize-none border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-slate-500"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-muted">
            Create an outline
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-muted">
            Search the web
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-muted">
            Analyze sources
          </span>
        </div>

        <div className="flex items-center gap-2 self-end">
          <IconButton label="Attach context">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-1.8">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </IconButton>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Researching...' : 'Send'}
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  )
}

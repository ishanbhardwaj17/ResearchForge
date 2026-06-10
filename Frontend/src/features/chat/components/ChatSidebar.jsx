const menuItems = ['Home', 'Templates', 'Explore', 'History', 'Wallet']
const historyItems = [
  'What is one lesson I should focus on today?',
  'What is one mistake I must avoid this week?',
  'What is one habit I should stop repeating?',
]

function SidebarIcon() {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/6 text-sky-200 ring-1 ring-white/10">
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-1.8">
        <path d="M4 19.5V8.8A2.8 2.8 0 0 1 6.8 6H17M8.5 18h10.7A2.8 2.8 0 0 0 22 15.2V4.5H11.3A2.8 2.8 0 0 0 8.5 7.3Z" />
      </svg>
    </span>
  )
}

export default function ChatSidebar() {
  return (
    <aside className="glass-panel hidden min-h-[calc(100vh-2rem)] w-72 shrink-0 rounded-[28px] p-4 lg:flex lg:flex-col">
      <div className="flex items-center gap-3">
        <SidebarIcon />
        <div>
          <p className="text-sm font-semibold tracking-[0.24em] text-sky-200 uppercase">
            Axora
          </p>
          <p className="text-xs text-muted">Research copilot</p>
        </div>
      </div>

      <div className="soft-panel mt-6 flex items-center gap-2 rounded-2xl px-3 py-3">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-1.8 text-muted">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="text-sm text-muted">Search chats</span>
      </div>

      <nav className="mt-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item}
            type="button"
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-slate-200 transition hover:bg-white/6"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/6 ring-1 ring-white/10">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-1.8">
                <path d="M5 12h14M12 5v14" />
              </svg>
            </span>
            {item}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
          Tomorrow
        </p>
        <div className="mt-3 space-y-3">
          {historyItems.map((item) => (
            <button
              key={item}
              type="button"
              className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-left text-xs leading-5 text-muted transition hover:border-sky-300/25 hover:text-[var(--text-primary)]"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-400/20 text-sm font-semibold text-sky-200">
          JD
        </div>
        <div>
          <p className="text-sm font-medium">John Researcher</p>
          <p className="text-xs text-muted">Pro plan</p>
        </div>
      </div>
    </aside>
  )
}

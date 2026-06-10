import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ChatComposer from '../components/ChatComposer.jsx'
import ChatHero from '../components/ChatHero.jsx'
import ChatMessageList from '../components/ChatMessageList.jsx'
import ChatSidebar from '../components/ChatSidebar.jsx'
import ChatStarterCards from '../components/ChatStarterCards.jsx'
import ThemeToggle from '../../theme/components/ThemeToggle.jsx'

export default function ChatPage() {
  const mode = useSelector((state) => state.theme.mode)
  const messages = useSelector((state) => state.chat.messages)
  const activeResearch = useSelector((state) => state.chat.activeResearch)
  const isLoading = useSelector((state) => state.chat.isLoading)

  useEffect(() => {
    document.documentElement.classList.toggle('light', mode === 'light')
    window.localStorage.setItem('multi-agent-theme', mode)
  }, [mode])

  return (
    <div className="min-h-screen p-4 text-[var(--text-primary)] sm:p-5">
      <div className="mx-auto flex max-w-[1600px] gap-4">
        <ChatSidebar />

        <main className="min-h-[calc(100vh-2rem)] flex-1 rounded-[32px] border border-white/10 bg-black/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm sm:p-6 lg:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Active report</p>
              <h2 className="mt-1 truncate text-lg font-semibold text-white">
                {activeResearch?.query || 'AI Assistant'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="soft-panel hidden rounded-full px-4 py-2 text-sm sm:flex sm:items-center sm:gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${isLoading ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                {activeResearch?.status || 'Idle'}
                {typeof activeResearch?.sourceCount === 'number' ? (
                  <span className="text-muted">• {activeResearch.sourceCount} sources</span>
                ) : null}
              </div>
              <ThemeToggle />
            </div>
          </div>

          <div className="mx-auto flex max-w-5xl flex-col gap-8 pb-10 pt-6">
            {!messages.length ? <ChatHero /> : null}
            <ChatMessageList />
            <ChatComposer />
            {!messages.length ? <ChatStarterCards /> : null}
          </div>
        </main>
      </div>
    </div>
  )
}

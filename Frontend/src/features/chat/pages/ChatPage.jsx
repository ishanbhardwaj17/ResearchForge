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
            <button
              type="button"
              className="soft-panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              AI Assistant
            </button>
            <ThemeToggle />
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

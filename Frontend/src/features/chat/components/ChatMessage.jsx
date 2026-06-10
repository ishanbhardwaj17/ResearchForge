import ReactMarkdown from 'react-markdown'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl rounded-[24px] px-5 py-4 ${
          isUser
            ? 'bg-[var(--accent)] text-slate-950'
            : 'glass-panel text-[var(--text-primary)]'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-7">{message.content}</p>
        ) : (
          <div className="markdown-body text-sm leading-7">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}

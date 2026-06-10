export default function ChatLoadingMessage() {
  return (
    <div className="flex justify-start">
      <div className="glass-panel w-full max-w-3xl rounded-[24px] px-5 py-5">
        <div className="mb-4 flex gap-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-300" />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-300 [animation-delay:150ms]" />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-300 [animation-delay:300ms]" />
        </div>
        <div className="space-y-3">
          <div className="h-3 rounded-full bg-white/8" />
          <div className="h-3 w-10/12 rounded-full bg-white/8" />
          <div className="h-3 w-8/12 rounded-full bg-white/8" />
        </div>
      </div>
    </div>
  )
}

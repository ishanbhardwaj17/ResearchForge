import { motion } from 'framer-motion'

export default function ChatHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto flex max-w-2xl flex-col items-center px-4 pt-10 text-center"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-sky-400/30 blur-2xl" />
        <div className="relative h-24 w-24 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f8fafc,#c084fc_34%,#38bdf8_62%,#0f172a_100%)] shadow-[0_0_50px_rgba(125,211,252,0.35)]" />
      </div>

      <p className="text-sm tracking-[0.24em] text-sky-200 uppercase">
        Autonomous Research System
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        Good evening. Ready to investigate your next question?
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
        Plan, retrieve, read, and synthesize with a chat-first interface built for deep research workflows.
      </p>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { applySuggestion } from '../state/chat.slice.js'

export default function ChatStarterCards() {
  const dispatch = useDispatch()
  const suggestions = useSelector((state) => state.chat.suggestions)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {suggestions.map((item, index) => (
        <motion.button
          key={item.id}
          type="button"
          onClick={() => dispatch(applySuggestion(`Help me with ${item.title.toLowerCase()}`))}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 + 0.1, duration: 0.45 }}
          className="glass-panel rounded-[24px] p-5 text-left transition hover:-translate-y-1"
        >
          <p className="text-base font-medium">{item.title}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
        </motion.button>
      ))}
    </div>
  )
}

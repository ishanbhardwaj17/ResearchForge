import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import ChatLoadingMessage from './ChatLoadingMessage.jsx'
import ChatMessage from './ChatMessage.jsx'

export default function ChatMessageList() {
  const messages = useSelector((state) => state.chat.messages)
  const isLoading = useSelector((state) => state.chat.isLoading)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isLoading])

  if (!messages.length && !isLoading) {
    return null
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.04 }}
        >
          <ChatMessage message={message} />
        </motion.div>
      ))}
      {isLoading ? <ChatLoadingMessage /> : null}
      <div ref={endRef} />
    </div>
  )
}

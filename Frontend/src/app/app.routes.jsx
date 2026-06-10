import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChatPage from '../features/chat/pages/ChatPage.jsx'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  )
}

import { configureStore } from '@reduxjs/toolkit'
import chatReducer from '../features/chat/state/chat.slice.js'
import themeReducer from '../features/theme/state/theme.slice.js'

export const appStore = configureStore({
  reducer: {
    chat: chatReducer,
    theme: themeReducer,
  },
})

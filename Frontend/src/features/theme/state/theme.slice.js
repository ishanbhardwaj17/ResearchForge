import { createSlice } from '@reduxjs/toolkit'

const getInitialMode = () => {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const savedMode = window.localStorage.getItem('multi-agent-theme')
  if (savedMode === 'light' || savedMode === 'dark') {
    return savedMode
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getInitialMode(),
  },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark'
    },
  },
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const assistantReply = (prompt) => `## Research workspace ready

I can help you turn **"${prompt}"** into a structured multi-agent research run.

- Build a planning workflow
- Coordinate retrieval, reading, and synthesis agents
- Render a clean final report in markdown
`

const initialState = {
  draft: '',
  isLoading: false,
  messages: [],
  suggestions: [
    {
      id: 'smart-budget',
      title: 'Smart Budget',
      description: 'A budget that fits your workflow, not the other way around.',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Track planning confidence, source quality, and agent throughput.',
    },
    {
      id: 'spending',
      title: 'Research Ops',
      description: 'Coordinate sources, drafts, and reports across one workspace.',
    },
  ],
  quickActions: ['Create an outline', 'Search the web', 'Summarize sources'],
}

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message) => {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 1200)
    })

    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: assistantReply(message),
    }
  },
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setDraft(state, action) {
      state.draft = action.payload
    },
    applySuggestion(state, action) {
      state.draft = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        const prompt = action.meta.arg.trim()
        if (!prompt) {
          return
        }

        state.isLoading = true
        state.draft = ''
        state.messages.push({
          id: crypto.randomUUID(),
          role: 'user',
          content: prompt,
        })
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false
        state.messages.push(action.payload)
      })
      .addCase(sendMessage.rejected, (state) => {
        state.isLoading = false
      })
  },
})

export const { setDraft, applySuggestion } = chatSlice.actions
export default chatSlice.reducer

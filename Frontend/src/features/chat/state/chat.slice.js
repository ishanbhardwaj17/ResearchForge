import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { planResearch } from '../services/research.api.js'

const initialState = {
  draft: '',
  isLoading: false,
  error: null,
  activeResearch: null,
  messages: [],
  suggestions: [
    {
      id: 'market-map',
      title: 'Market Map',
      description: 'Map the competitive landscape of AI research assistants.',
    },
    {
      id: 'technical-brief',
      title: 'Technical Brief',
      description: 'Compare RAG, agents, and evaluation patterns for production systems.',
    },
    {
      id: 'policy-watch',
      title: 'Policy Watch',
      description: 'Summarize the latest policy and safety shifts affecting deployment.',
    },
  ],
  quickActions: ['Create an outline', 'Search the web', 'Summarize sources'],
}

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message) => {
    const result = await planResearch(message)

    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        result.finalReport ||
        'The research workflow completed, but no report body was returned.',
      report: {
        id: result.reportId,
        title: result.query,
        reportType: result.reportType,
        provider: result.provider,
        content: result.finalReport,
        sources: Array.isArray(result.sources) ? result.sources : [],
        retrievedChunks: Array.isArray(result.retrievedChunks)
          ? result.retrievedChunks
          : [],
      },
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
    clearError(state) {
      state.error = null
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
        state.error = null
        state.draft = ''
        state.activeResearch = {
          query: prompt,
          status: 'Researching',
          sourceCount: 0,
        }
        state.messages.push({
          id: crypto.randomUUID(),
          role: 'user',
          content: prompt,
        })
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false
        state.activeResearch = {
          query: action.payload.report.title,
          status: 'Complete',
          sourceCount: action.payload.report.sources.length,
        }
        state.messages.push(action.payload)
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false
        state.error =
          action.error.message || 'Something went wrong while contacting the backend.'
        state.activeResearch = {
          query: state.activeResearch?.query || 'Research request',
          status: 'Error',
          sourceCount: 0,
        }
        state.messages.push({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `I couldn't complete that research request.\n\n${state.error}`,
          isError: true,
        })
      })
  },
})

export const { setDraft, applySuggestion, clearError } = chatSlice.actions
export default chatSlice.reducer

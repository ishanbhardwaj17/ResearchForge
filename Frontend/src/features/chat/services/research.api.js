const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://127.0.0.1:3000/api'

export async function planResearch(query) {
  const response = await fetch(`${API_BASE_URL}/research/plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      sourceUrls: [],
      sourceTexts: [],
      searchEnabled: true,
    }),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || 'Unable to complete research request.')
  }

  return payload
}

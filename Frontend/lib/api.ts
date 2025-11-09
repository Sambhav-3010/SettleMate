// API client with environment variable support
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include",
    })
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return response.json()
  },

  async post(endpoint: string, body: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return response.json()
  },

  async put(endpoint: string, body: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return response.json()
  },
}

import axios from 'axios'

const DEFAULT_URL = 'http://localhost:5005/api'
const CANDIDATE_PORTS = [5005, 5000, 5001, 5002, 5003, 5004]
const LS_API_URL = 'mb_api_url'

function getStoredApiUrl() {
  try { return localStorage.getItem(LS_API_URL) || null } catch { return null }
}

function setStoredApiUrl(url) {
  try { localStorage.setItem(LS_API_URL, url) } catch {}
}

const envUrl = import.meta.env.VITE_API_URL
const initialBaseURL = envUrl || getStoredApiUrl() || DEFAULT_URL

export const api = axios.create({ baseURL: initialBaseURL })

export async function initApi() {
  // If env provided, trust it
  if (envUrl) return envUrl
  
  const timeoutConfig = { timeout: 1000 } // 1 second timeout per request
  
  // If stored URL works, keep it
  const stored = getStoredApiUrl()
  if (stored) {
    try {
      await axios.get(stored.replace(/\/$/, '') + '/status', timeoutConfig)
      api.defaults.baseURL = stored
      return stored
    } catch {
      try { localStorage.removeItem(LS_API_URL) } catch {}
    }
  }
  // Detect by probing common ports
  for (const port of CANDIDATE_PORTS) {
    const candidate = `http://localhost:${port}/api`
    try {
      await axios.get(candidate + '/status', timeoutConfig)
      api.defaults.baseURL = candidate
      setStoredApiUrl(candidate)
      return candidate
    } catch {}
  }
  // Fallback to default
  api.defaults.baseURL = DEFAULT_URL
  return DEFAULT_URL
}

// Retry logic: on network/CORS error, re-detect API once and retry the request
let isResolvingApi = false
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const isNetwork = !error.response
    const isCors = error?.message?.toLowerCase().includes('network') || error?.message?.toLowerCase().includes('cors')
    if ((isNetwork || isCors) && !original._retried) {
      if (!isResolvingApi) {
        isResolvingApi = true
        try {
          const url = await initApi()
          api.defaults.baseURL = url
        } finally {
          isResolvingApi = false
        }
      }
      original._retried = true
      return api(original)
    }
    throw error
  }
)

export async function submitMood(userId, mood, note) {
  const res = await api.post('/mood', { userId, mood, note })
  return res.data
}

export async function fetchMoods(userId) {
  const res = await api.get(`/mood/${encodeURIComponent(userId)}`)
  return res.data
}

export async function submitHelp(category, description, location) {
  const res = await api.post('/help', { category, description, location })
  return res.data
}

export async function fetchHelp() {
  const res = await api.get('/help')
  return res.data
}

// Users
export async function registerUser(name, phone, dob) {
  const res = await api.post('/users/register', { name, phone, dob })
  return res.data
}

export async function loginUser(name, phone, dob) {
  const res = await api.post('/users/login', { name, phone, dob })
  return res.data
}

export async function recoverUser(name, phone, dob) {
  const res = await api.post('/users/recover', { name, phone, dob })
  return res.data
}

export async function getProfile(userId) {
  const res = await api.get(`/users/${userId}`)
  return res.data
}

export async function updateProfile(userId, updates) {
  const res = await api.put(`/users/${userId}`, updates)
  return res.data
}

// Seasonal Diseases
export async function getAllDiseases() {
  const res = await api.get('/seasonal-diseases')
  return res.data
}

export async function getDiseaseById(id) {
  const res = await api.get(`/seasonal-diseases/${id}`)
  return res.data
}

export async function getDiseasesBySeason(season) {
  const res = await api.get(`/seasonal-diseases/season/${encodeURIComponent(season)}`)
  return res.data
}

// Doctors
export async function getAllDoctors() {
  try {
    const res = await api.get('/doctors')
    console.log('getAllDoctors API response:', res.data)
    return res.data || []
  } catch (error) {
    console.error('getAllDoctors API error:', error.response || error.message)
    throw error
  }
}

export async function getDoctorById(id) {
  const res = await api.get(`/doctors/${id}`)
  return res.data
}

export async function getDoctorsBySpecialty(specialty) {
  const res = await api.get(`/doctors/specialty/${encodeURIComponent(specialty)}`)
  return res.data
}

export async function searchDoctors(query, specialty, location) {
  const params = new URLSearchParams()
  if (query) params.append('query', query)
  if (specialty) params.append('specialty', specialty)
  if (location) params.append('location', location)
  const res = await api.get(`/doctors/search?${params.toString()}`)
  return res.data
}

// Posts/News Feeds
export async function getAllPosts() {
  const res = await api.get('/posts')
  return res.data
}

export async function getPostById(id) {
  const res = await api.get(`/posts/${id}`)
  return res.data
}

export async function getPostsByCategory(category) {
  const res = await api.get(`/posts/category/${encodeURIComponent(category)}`)
  return res.data
}


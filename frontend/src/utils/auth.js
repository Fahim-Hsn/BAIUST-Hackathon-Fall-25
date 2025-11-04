const STORAGE_KEY = 'mb_user'
const CACHE_PREFIX = 'mb_cache_'

export function saveUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function getUser() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function clearUser() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getIdentityKey(user) {
  if (!user) return null
  const phone = String(user.phone || '').replace(/\s|-/g, '')
  const dob = user.dob || ''
  return `${CACHE_PREFIX}${phone}_${dob}`
}

export function readUserCache(user) {
  const key = getIdentityKey(user)
  if (!key) return null
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function writeUserCache(user, data) {
  const key = getIdentityKey(user)
  if (!key) return
  const payload = { ...data, savedAt: new Date().toISOString() }
  localStorage.setItem(key, JSON.stringify(payload))
}

export function pruneLast7Days(items, dateField) {
  const now = Date.now()
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
  return (items || []).filter(x => {
    const t = new Date(x[dateField] || x.createdAt || x.date).getTime()
    return !Number.isNaN(t) && (now - t) <= sevenDaysMs
  })
}



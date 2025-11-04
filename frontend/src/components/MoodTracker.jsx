import { useEffect, useMemo, useState } from 'react'
import { submitMood, fetchMoods } from '../utils/api.js'
import { getUser, readUserCache, writeUserCache, pruneLast7Days } from '../utils/auth.js'
import AuthModal from './AuthModal.jsx'
import { FaSmile, FaFrown, FaMeh, FaHeart, FaExclamationTriangle, FaCalendarAlt, FaHistory, FaCheckCircle } from 'react-icons/fa'

const MOODS = [
  { key: 'khushi', label: 'খুশি', icon: FaSmile, color: 'from-yellow-400 to-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { key: 'dukhi', label: 'দুঃখী', icon: FaFrown, color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { key: 'chinta', label: 'চিন্তিত', icon: FaExclamationTriangle, color: 'from-orange-400 to-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { key: 'shanto', label: 'শান্ত', icon: FaHeart, color: 'from-green-400 to-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  { key: 'rog', label: 'অসুস্থ', icon: FaExclamationTriangle, color: 'from-red-400 to-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  { key: 'onnanno', label: 'অন্যান্য', icon: FaMeh, color: 'from-gray-400 to-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
]

export default function MoodTracker() {
  const [user, setUser] = useState(getUser())
  const [showAuth, setShowAuth] = useState(false)
  const userId = user?._id || 'anonymous-user'
  const [mood, setMood] = useState('khushi')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const selectedMood = useMemo(() => MOODS.find(m=>m.key===mood) || MOODS[0], [mood])

  async function loadHistory() {
    try {
      setError('')
      const data = await fetchMoods(userId)
      setHistory(data)
      if (user) {
        const existing = readUserCache(user) || { helps: [] }
        writeUserCache(user, { moods: pruneLast7Days(data, 'date'), helps: existing.helps })
      }
    } catch (e) {
      const cache = user ? readUserCache(user) : null
      if (cache?.moods) setHistory(cache.moods)
      else setError('ইতিহাস লোড করা যায়নি')
    }
  }

  useEffect(() => {
    loadHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (!user) { setShowAuth(true); return }
      setLoading(true)
      setError('')
      setSuccess('')
      const saved = await submitMood(userId, mood, note)
      setNote('')
      setSuccess('মুড সফলভাবে সংরক্ষণ হয়েছে!')
      await loadHistory()
      if (user) {
        const cache = readUserCache(user) || { moods: [], helps: [] }
        const updated = [saved, ...cache.moods]
        writeUserCache(user, { moods: pruneLast7Days(updated, 'date'), helps: cache.helps })
      }
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError('সংরক্ষণে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <AuthModal open={showAuth} onClose={()=>setShowAuth(false)} onSuccess={(u)=>{ setUser(u); }} />
      
      {/* Header */}
      <div className="bg-[#33415c] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
            <FaCalendarAlt className="text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">মুড ট্র্যাকার</h2>
            <p className="text-white/90">আজ আপনি কেমন অনুভব করছেন? আপনার মুড রেকর্ড করুন</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mood Form */}
        <div className={`bg-gradient-to-br ${selectedMood.bg} rounded-2xl p-6 shadow-lg border-2 ${selectedMood.border}`}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <selectedMood.icon className={`text-2xl bg-gradient-to-r ${selectedMood.color} bg-clip-text text-transparent`} />
            আপনার আজকের মুড
          </h3>
          
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">একটি মুড নির্বাচন করুন</label>
              <div className="grid grid-cols-3 gap-2">
                {MOODS.map(m => {
                  const Icon = m.icon
                  return (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setMood(m.key)}
                      className={`p-4 rounded-xl border-2 transition ${
                        mood === m.key
                          ? `${m.border} ${m.bg} shadow-lg scale-105`
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`text-2xl mx-auto mb-2 ${
                        mood === m.key ? `bg-gradient-to-r ${m.color} bg-clip-text text-transparent` : 'text-gray-400'
                      }`} />
                      <p className={`text-xs font-semibold ${
                        mood === m.key ? 'text-gray-900' : 'text-gray-500'
                      }`}>{m.label}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Note */}
            <label className="grid gap-2">
              <span className="font-semibold text-gray-700">নোট (ঐচ্ছিক)</span>
              <textarea 
                value={note} 
                onChange={(e)=>setNote(e.target.value)} 
                rows={4} 
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-mainPink focus:border-transparent" 
                placeholder={`আপনি ${selectedMood.label} কেন অনুভব করছেন? আপনার অনুভূতি লিখুন...`} 
              />
            </label>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <FaExclamationTriangle /> {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <FaCheckCircle /> {success}
              </div>
            )}

            <button 
              disabled={loading} 
              className={`bg-[#33415c] hover:shadow-lg text-white px-6 py-3 rounded-xl disabled:opacity-60 w-full font-bold transition transform hover:scale-105`}
            >
              {loading ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-mainOrange/15 rounded-lg">
              <FaHistory className="text-mainOrange text-xl" />
            </div>
            <h3 className="text-xl font-bold">মুড ইতিহাস</h3>
          </div>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaCalendarAlt className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>এখনও কোনো মুড রেকর্ড করা হয়নি</p>
                <p className="text-sm mt-1">আপনার প্রথম মুড রেকর্ড করুন!</p>
              </div>
            ) : (
              history.map(item => {
                const moodData = MOODS.find(m=>m.key===item.mood) || MOODS[MOODS.length-1]
                const Icon = moodData.icon
                return (
                  <div key={item._id} className={`p-4 rounded-xl border-2 ${moodData.border} ${moodData.bg} hover:shadow-md transition`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 bg-gradient-to-r ${moodData.color} rounded-lg text-white`}>
                          <Icon className="text-lg" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 mb-1">{moodData.label}</p>
                          {item.note && (
                            <p className="text-sm text-gray-700 mb-2">{item.note}</p>
                          )}
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FaCalendarAlt /> {new Date(item.date || item.createdAt).toLocaleString('bn-BD', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      {history.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <h4 className="text-lg font-bold mb-4">মুড পরিসংখ্যান</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MOODS.map(m => {
              const count = history.filter(h => h.mood === m.key).length
              if (count === 0) return null
              return (
                <div key={m.key} className="bg-white rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600 mb-1">{m.label}</p>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>{count}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { submitHelp, fetchHelp } from '../utils/api.js'
import { getUser, readUserCache, writeUserCache, pruneLast7Days } from '../utils/auth.js'
import AuthModal from './AuthModal.jsx'
import { FaHandHoldingHeart, FaUserSecret, FaUser, FaMapMarkerAlt, FaListAlt, FaCheckCircle, FaExclamationTriangle, FaClock, FaShieldAlt } from 'react-icons/fa'

const CATS = [
  { key: 'manoshik', label: 'মানসিক', icon: '🧠', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { key: 'sharirik', label: 'শারীরিক', icon: '💪', color: 'from-red-500 to-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  { key: 'arthik', label: 'আর্থিক', icon: '💰', color: 'from-green-500 to-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  { key: 'onnanno', label: 'অন্যান্য', icon: '📋', color: 'from-gray-500 to-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
]

export default function HelpForm() {
  const [user] = useState(getUser())
  const [showAuth, setShowAuth] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(!user)
  const [category, setCategory] = useState('manoshik')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [list, setList] = useState([])

  const selectedCategory = CATS.find(c => c.key === category) || CATS[0]

  async function loadList() {
    try {
      setError('')
      const data = await fetchHelp()
      setList(data)
      if (user) {
        const existing = readUserCache(user) || { moods: [] }
        writeUserCache(user, { helps: pruneLast7Days(data, 'createdAt'), moods: existing.moods })
      }
    } catch (e) {
      const cache = user ? readUserCache(user) : null
      if (cache?.helps) setList(cache.helps)
      else setError('ডেটা লোডে সমস্যা হয়েছে')
    }
  }

  useEffect(() => { 
    if (!user) setIsAnonymous(true)
    loadList() 
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!description.trim()) {
      setError('বিবরণ প্রয়োজন')
      return
    }
    
    if (!isAnonymous && !user) {
      setShowAuth(true)
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      // For anonymous users, we still submit but without user ID
      const saved = await submitHelp(category, description, location)
      setDescription('')
      setLocation('')
      setSuccess('সাহায্যের অনুরোধ সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।')
      await loadList()
      
      if (user) {
        const cache = readUserCache(user) || { moods: [], helps: [] }
        const updated = [saved, ...cache.helps]
        writeUserCache(user, { helps: pruneLast7Days(updated, 'createdAt'), moods: cache.moods })
      }
      
      setTimeout(() => setSuccess(''), 5000)
    } catch (e) {
      setError(e?.response?.data?.message || 'সাবমিট করতে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <AuthModal open={showAuth} onClose={()=>setShowAuth(false)} onSuccess={()=>{ setShowAuth(false); setIsAnonymous(false) }} />
      
      {/* Header */}
      <div className="bg-[#33415c] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
            <FaHandHoldingHeart className="text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mb-1">সাহায্যের অনুরোধ</h2>
            <p className="text-white/90">গোপনে সাহায্য চান, আমরা আপনার সাথে আছি</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Help Form */}
        <div className={`bg-gradient-to-br ${selectedCategory.bg} rounded-2xl p-6 shadow-lg border-2 ${selectedCategory.border}`}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">{selectedCategory.icon}</span>
            সাহায্যের অনুরোধ করুন
          </h3>

          {/* Anonymous Option */}
          {user && (
            <div className="mb-4 p-3 bg-white/70 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isAnonymous ? (
                    <>
                      <FaUserSecret className="text-purple-600" />
                      <span className="text-sm font-semibold text-gray-700">গোপনীয়ভাবে পাঠান</span>
                    </>
                  ) : (
                    <>
                      <FaUser className="text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">আপনার নামে পাঠান</span>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold transition"
                >
                  {isAnonymous ? 'নামে পরিবর্তন' : 'গোপনীয়'}
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {isAnonymous 
                  ? 'আপনার পরিচয় গোপন রাখা হবে' 
                  : 'আপনার নামে সাহায্যের অনুরোধ পাঠানো হবে'}
              </p>
            </div>
          )}

          {!user && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 text-gray-700">
                <FaUserSecret />
                <span className="text-sm font-semibold">গোপনীয় সাহায্য</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">আপনার পরিচয় গোপন রাখা হবে</p>
            </div>
          )}

          <form className="grid gap-4" onSubmit={handleSubmit}>
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">বিভাগ নির্বাচন করুন</label>
              <div className="grid grid-cols-2 gap-2">
                {CATS.map(cat => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`p-3 rounded-xl border-2 transition ${
                      category === cat.key
                        ? `${cat.border} ${cat.bg} shadow-lg scale-105`
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{cat.icon}</span>
                    <p className={`text-xs font-semibold ${
                      category === cat.key ? 'text-gray-900' : 'text-gray-500'
                    }`}>{cat.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <label className="grid gap-2">
              <span className="font-semibold text-gray-700">বিবরণ *</span>
              <textarea 
                value={description} 
                onChange={(e)=>setDescription(e.target.value)} 
                rows={4} 
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-mainOrange focus:border-transparent" 
                placeholder="আপনার সমস্যা বিস্তারিতভাবে লিখুন... আমরা আপনার সাহায্যে এগিয়ে আসবো।" 
              />
            </label>

            {/* Location */}
            <label className="grid gap-2">
              <span className="font-semibold text-gray-700 flex items-center gap-2">
                <FaMapMarkerAlt className="text-mainOrange" /> অবস্থান (ঐচ্ছিক)
              </span>
              <input 
                value={location} 
                onChange={(e)=>setLocation(e.target.value)} 
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-mainOrange focus:border-transparent" 
                placeholder="উপজেলা/গ্রাম/জেলা" 
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
              className={`bg-[#33415c] hover:shadow-lg text-white px-6 py-3 rounded-xl disabled:opacity-60 w-full font-bold transition transform hover:scale-105 flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>পাঠানো হচ্ছে...</>
              ) : (
                <>
                  <FaHandHoldingHeart /> অনুরোধ পাঠান
                </>
              )}
            </button>
          </form>
        </div>

        {/* Help List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-mainOrange/15 rounded-lg">
              <FaListAlt className="text-mainOrange text-xl" />
            </div>
            <h3 className="text-xl font-bold">সাহায্যের তালিকা</h3>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {list.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaHandHoldingHeart className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>এখনও কোনো সাহায্যের অনুরোধ নেই</p>
                <p className="text-sm mt-1">প্রথম সাহায্যের অনুরোধ করুন!</p>
              </div>
            ) : (
              list.map(item => {
                const catData = CATS.find(c=>c.key===item.category) || CATS[CATS.length-1]
                return (
                  <div key={item._id} className={`p-4 rounded-xl border-2 ${catData.border} ${catData.bg} hover:shadow-md transition`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{catData.icon}</span>
                        <p className="font-bold text-gray-900">{catData.label}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FaClock /> {new Date(item.createdAt).toLocaleString('bn-BD', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{item.description}</p>
                    {item.location && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <FaMapMarkerAlt /> {item.location}
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-500">
                      <FaShieldAlt /> গোপনীয় সাহায্য
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gray-100 rounded-xl">
            <FaShieldAlt className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">গোপনীয়তা নিশ্চিত</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              আপনার সব তথ্য সম্পূর্ণ গোপন রাখা হবে। আমরা আপনার পরিচয় কাউকে জানাবো না এবং আপনার অনুরোধটি নিরাপদে সংরক্ষণ করা হবে।
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

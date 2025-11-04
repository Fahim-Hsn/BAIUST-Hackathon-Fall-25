import { useState } from 'react'
import { loginUser, registerUser, fetchMoods, fetchHelp } from '../utils/api.js'
import { saveUser, writeUserCache, pruneLast7Days } from '../utils/auth.js'

export default function AuthModal({ open, onClose, onSuccess }) {
  const [tab, setTab] = useState('login')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name || !phone || !dob) { setError('সব ঘর পূরণ করুন'); return }
    try {
      setLoading(true)
      const user = tab === 'login'
        ? await loginUser(name, phone, dob)
        : await registerUser(name, phone, dob)
      saveUser(user)
      // Preload and cache last 7 days
      try {
        const [moods, helps] = await Promise.all([
          fetchMoods(user._id).catch(()=>[]),
          fetchHelp().catch(()=>[])
        ])
        writeUserCache(user, {
          moods: pruneLast7Days(moods, 'date'),
          helps: pruneLast7Days(helps, 'createdAt')
        })
      } catch {}
      onSuccess?.(user)
      onClose?.()
    } catch (e) {
      setError(e?.response?.data?.message || 'ত্রুটি হয়েছে')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold">প্রবেশ করুন</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={()=>setTab('login')} className={`px-4 py-2 rounded-lg ${tab==='login'?'bg-mainPink text-white':'bg-gray-100'}`}>লগইন</button>
          <button onClick={()=>setTab('register')} className={`px-4 py-2 rounded-lg ${tab==='register'?'bg-mainOrange text-white':'bg-gray-100'}`}>রেজিস্টার</button>
        </div>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <input className="border rounded-lg px-3 py-2" placeholder="নাম" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="border rounded-lg px-3 py-2" placeholder="ফোন" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          <input className="border rounded-lg px-3 py-2" type="date" placeholder="জন্মতারিখ" value={dob} onChange={(e)=>setDob(e.target.value)} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg disabled:opacity-60" disabled={loading}>
            {loading? 'পাঠানো হচ্ছে...': (tab==='login'?'লগইন':'রেজিস্টার')}
          </button>
        </form>
      </div>
    </div>
  )
}



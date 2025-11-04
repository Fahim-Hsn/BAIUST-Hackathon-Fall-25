import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser, fetchMoods, fetchHelp } from '../utils/api.js'
import { saveUser, writeUserCache, pruneLast7Days } from '../utils/auth.js'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name || !phone || !dob) { setError('সব ঘর পূরণ করুন'); return }
    try {
      setLoading(true)
      const user = await registerUser(name, phone, dob)
      saveUser(user)
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
      navigate('/profile')
    } catch (e) {
      setError(e?.response?.data?.message || 'রেজিস্ট্রেশনে সমস্যা হয়েছে')
    } finally { setLoading(false) }
  }

  return (
    <section className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-sm border">
      <h1 className="text-2xl font-extrabold mb-4">রেজিস্ট্রেশন</h1>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <input className="border rounded-lg px-3 py-2" placeholder="নাম" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="border rounded-lg px-3 py-2" placeholder="ফোন" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        <input className="border rounded-lg px-3 py-2" type="date" placeholder="জন্মতারিখ" value={dob} onChange={(e)=>setDob(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="bg-mainPink hover:bg-pink-500 text-white px-4 py-2 rounded-lg disabled:opacity-60" disabled={loading}>
          {loading? 'পাঠানো হচ্ছে...':'রেজিস্টার করুন'}
        </button>
        <p className="text-sm text-gray-600">অ্যাকাউন্ট আছে? <Link to="/login" className="text-mainPink">লগইন</Link></p>
      </form>
    </section>
  )
}



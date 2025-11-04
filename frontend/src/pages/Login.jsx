import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser, recoverUser, fetchMoods, fetchHelp } from '../utils/api.js'
import { saveUser, writeUserCache, pruneLast7Days } from '../utils/auth.js'

export default function Login() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    if (!name || !phone || !dob) { setError('সব ঘর পূরণ করুন'); return }
    try {
      setLoading(true)
      const user = await loginUser(name, phone, dob)
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
      setError(e?.response?.data?.message || 'লগইনে সমস্যা হয়েছে')
    } finally { setLoading(false) }
  }

  async function handleRecover() {
    setError('')
    if (!name || !phone || !dob) { setError('সব ঘর পূরণ করুন'); return }
    try {
      const user = await recoverUser(name, phone, dob)
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
      setError(e?.response?.data?.message || 'রিকভারি ব্যর্থ')
    }
  }

  return (
    <section className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-sm border">
      <h1 className="text-2xl font-extrabold mb-4">লগইন</h1>
      <form className="grid gap-4" onSubmit={handleLogin}>
        <input className="border rounded-lg px-3 py-2" placeholder="নাম" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="border rounded-lg px-3 py-2" placeholder="ফোন" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        <input className="border rounded-lg px-3 py-2" type="date" placeholder="জন্মতারিখ" value={dob} onChange={(e)=>setDob(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button className="bg-mainPink hover:bg-pink-500 text-white px-4 py-2 rounded-lg disabled:opacity-60" disabled={loading}>
            {loading? 'পাঠানো হচ্ছে...':'লগইন'}
          </button>
          <button type="button" onClick={handleRecover} className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg">রিকভারি</button>
        </div>
        <p className="text-sm text-gray-600">নতুন ব্যবহারকারী? <Link to="/register" className="text-mainPink">রেজিস্টার</Link></p>
      </form>
    </section>
  )
}



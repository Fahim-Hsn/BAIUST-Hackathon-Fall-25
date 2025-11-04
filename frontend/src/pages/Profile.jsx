import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, saveUser, clearUser } from '../utils/auth.js'
import { getProfile, updateProfile } from '../utils/api.js'
import { FaWeight, FaRulerVertical, FaHeartbeat, FaNotesMedical, FaUser, FaPhone, FaBirthdayCake, FaSignOutAlt, FaVenusMars, FaHeart, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getUser())
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dob: toYmdSafe(user?.dob || ''),
    gender: user?.gender || '',
    maritalStatus: user?.maritalStatus || '',
    address: user?.address || '',
    occupation: user?.occupation || '',
    weight: user?.weight || '',
    height: user?.height || '',
    bloodPressureSystolic: user?.bloodPressureSystolic || '',
    bloodPressureDiastolic: user?.bloodPressureDiastolic || '',
    healthDetails: user?.healthDetails || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    (async () => {
      try {
        const latest = await getProfile(user._id)
        setUser(latest)
        setForm({
          name: latest.name || '',
          phone: latest.phone || '',
          dob: toYmdSafe(latest.dob || ''),
          gender: latest.gender || '',
          maritalStatus: latest.maritalStatus || '',
          address: latest.address || '',
          occupation: latest.occupation || '',
          weight: latest.weight || '',
          height: latest.height || '',
          bloodPressureSystolic: latest.bloodPressureSystolic || '',
          bloodPressureDiastolic: latest.bloodPressureDiastolic || '',
          healthDetails: latest.healthDetails || ''
        })
        saveUser(latest)
      } catch {}
    })()
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'dob' ? toYmdSafe(value) : value }))
  }

  async function handleUpdate(e) {
    e.preventDefault()
    if (!user) return
    setError(''); setSuccess('')
    try {
      setLoading(true)
      const updated = await updateProfile(user._id, form)
      setUser(updated)
      saveUser(updated)
      setSuccess('প্রোফাইল সফলভাবে আপডেট হয়েছে')
      setEditing(false)
    } catch (e) {
      setError(e?.response?.data?.message || 'আপডেটে সমস্যা হয়েছে')
    } finally { setLoading(false) }
  }

  function handleLogout() {
    clearUser()
    navigate('/login')
  }

  function getBMIStatus(bmi) {
    if (!bmi) return { label: 'নির্ধারণ করা হয়নি', color: 'text-gray-500' }
    if (bmi < 18.5) return { label: 'অপুষ্টি', color: 'text-blue-600' }
    if (bmi < 25) return { label: 'সাধারণ', color: 'text-green-600' }
    if (bmi < 30) return { label: 'অতিরিক্ত ওজন', color: 'text-orange-600' }
    return { label: 'স্থূলতা', color: 'text-red-600' }
  }

  function getBPStatus(systolic, diastolic) {
    if (!systolic || !diastolic) return { label: 'নির্ধারণ করা হয়নি', color: 'text-gray-500' }
    if (systolic < 120 && diastolic < 80) return { label: 'সাধারণ', color: 'text-green-600' }
    if (systolic < 130 && diastolic < 80) return { label: 'উচ্চ', color: 'text-yellow-600' }
    if (systolic >= 130 || diastolic >= 80) return { label: 'উচ্চ রক্তচাপ', color: 'text-red-600' }
    return { label: 'সাধারণ', color: 'text-green-600' }
  }

  if (!user) return null

  const bmiStatus = getBMIStatus(user?.bmi)
  const bpStatus = getBPStatus(user?.bloodPressureSystolic, user?.bloodPressureDiastolic)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#33415c] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold mb-2">স্বাস্থ্য প্রোফাইল</h1>
            <p className="text-white/90">আপনার স্বাস্থ্য তথ্য দেখুন এবং আপডেট করুন</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
            <FaSignOutAlt /> <span>লগআউট</span>
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>}

      {/* Basic Information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaUser className="text-mainPink" /> ব্যক্তিগত তথ্য
          </h2>
          {!editing && (
            <button onClick={() => setEditing(true)} className="text-mainPink hover:text-pink-600 font-semibold">
              সম্পাদনা
            </button>
          )}
        </div>
        <form onSubmit={handleUpdate} className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaUser className="text-mainPink" /> নাম
              </span>
              <input name="name" className="border rounded-lg px-3 py-2" value={form.name} onChange={handleChange} disabled={!editing} />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaPhone className="text-mainPink" /> ফোন
              </span>
              <input name="phone" className="border rounded-lg px-3 py-2" value={form.phone} onChange={handleChange} disabled={!editing} />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaBirthdayCake className="text-mainPink" /> জন্মতারিখ
              </span>
              <input name="dob" type="date" className="border rounded-lg px-3 py-2" value={form.dob} onChange={handleChange} disabled={!editing} />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaVenusMars className="text-mainPink" /> লিঙ্গ
              </span>
              <select name="gender" className="border rounded-lg px-3 py-2" value={form.gender} onChange={handleChange} disabled={!editing}>
                <option value="">নির্বাচন করুন</option>
                <option value="male">পুরুষ</option>
                <option value="female">মহিলা</option>
                <option value="other">অন্যান্য</option>
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaHeart className="text-mainPink" /> বৈবাহিক অবস্থা
              </span>
              <select name="maritalStatus" className="border rounded-lg px-3 py-2" value={form.maritalStatus} onChange={handleChange} disabled={!editing}>
                <option value="">নির্বাচন করুন</option>
                <option value="single">অবিবাহিত</option>
                <option value="married">বিবাহিত</option>
                <option value="divorced">তালাকপ্রাপ্ত</option>
                <option value="widowed">বিধবা/বিধুর</option>
              </select>
            </label>
            <label className="grid gap-1 md:col-span-2">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaMapMarkerAlt className="text-mainPink" /> ঠিকানা
              </span>
              <input name="address" className="border rounded-lg px-3 py-2" value={form.address} onChange={handleChange} disabled={!editing} placeholder="আপনার সম্পূর্ণ ঠিকানা" />
            </label>
            <label className="grid gap-1 md:col-span-2">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaBriefcase className="text-mainPink" /> পেশা
              </span>
              <input name="occupation" className="border rounded-lg px-3 py-2" value={form.occupation} onChange={handleChange} disabled={!editing} placeholder="আপনার পেশা" />
            </label>
          </div>
          {editing && (
            <div className="flex gap-2">
              <button type="submit" className="bg-mainPink hover:bg-pink-500 text-white px-4 py-2 rounded-lg disabled:opacity-60" disabled={loading}>
                {loading ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
              </button>
              <button type="button" onClick={() => { setEditing(false); setError(''); setSuccess('') }} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">
                বাতিল
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Health Information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaNotesMedical className="text-mainOrange" /> স্বাস্থ্য তথ্য
          </h2>
          {!editing && (
            <button onClick={() => setEditing(true)} className="text-mainOrange hover:text-orange-600 font-semibold">
              সম্পাদনা
            </button>
          )}
        </div>
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Weight & Height */}
          <div className="grid md:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaWeight className="text-mainOrange" /> ওজন (কেজি)
              </span>
              <input name="weight" type="number" step="0.1" min="0" className="border rounded-lg px-3 py-2" value={form.weight} onChange={handleChange} disabled={!editing} placeholder="যেমন: 65" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaRulerVertical className="text-mainOrange" /> উচ্চতা (সেমি)
              </span>
              <input name="height" type="number" step="0.1" min="0" className="border rounded-lg px-3 py-2" value={form.height} onChange={handleChange} disabled={!editing} placeholder="যেমন: 170" />
            </label>
          </div>

          {/* BMI Display */}
          {user?.bmi && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">বডি মাস ইনডেক্স (BMI)</p>
                  <p className="text-2xl font-bold text-gray-900">{user.bmi}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${bmiStatus.color}`}>{bmiStatus.label}</p>
                </div>
              </div>
            </div>
          )}

          {/* Blood Pressure */}
          <div className="grid md:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaHeartbeat className="text-red-500" /> সিস্টোলিক (উপরের) mmHg
              </span>
              <input name="bloodPressureSystolic" type="number" min="0" max="250" className="border rounded-lg px-3 py-2" value={form.bloodPressureSystolic} onChange={handleChange} disabled={!editing} placeholder="যেমন: 120" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaHeartbeat className="text-red-500" /> ডায়াস্টোলিক (নিচের) mmHg
              </span>
              <input name="bloodPressureDiastolic" type="number" min="0" max="150" className="border rounded-lg px-3 py-2" value={form.bloodPressureDiastolic} onChange={handleChange} disabled={!editing} placeholder="যেমন: 80" />
            </label>
          </div>

          {/* Blood Pressure Status */}
          {(user?.bloodPressureSystolic || user?.bloodPressureDiastolic) && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">রক্তচাপ</p>
                  <p className="text-lg font-bold text-gray-900">
                    {user.bloodPressureSystolic}/{user.bloodPressureDiastolic} mmHg
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${bpStatus.color}`}>{bpStatus.label}</p>
                </div>
              </div>
            </div>
          )}

          {/* Health Details */}
          <label className="grid gap-1">
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaNotesMedical className="text-mainOrange" /> স্বাস্থ্য বিবরণ (ঐচ্ছিক)
            </span>
            <textarea name="healthDetails" rows={4} className="border rounded-lg px-3 py-2" value={form.healthDetails} onChange={handleChange} disabled={!editing} placeholder="আপনার স্বাস্থ্য সম্পর্কিত অতিরিক্ত তথ্য লিখুন..." />
          </label>

          {editing && (
            <div className="flex gap-2">
              <button type="submit" className="bg-mainOrange hover:bg-orange-500 text-white px-4 py-2 rounded-lg disabled:opacity-60" disabled={loading}>
                {loading ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
              </button>
              <button type="button" onClick={() => { setEditing(false); setError(''); setSuccess('') }} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">
                বাতিল
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Health Summary Card */}
      {(user?.bmi || user?.bloodPressureSystolic || user?.weight || user?.height) && (
        <div className="bg-gradient-to-br from-mainPink/10 to-mainOrange/10 rounded-2xl p-6 border border-pink-200">
          <h3 className="text-lg font-bold mb-4">স্বাস্থ্য সারাংশ</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {user?.weight && (
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-sm text-gray-600">ওজন</p>
                <p className="text-xl font-bold">{user.weight} কেজি</p>
              </div>
            )}
            {user?.height && (
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-sm text-gray-600">উচ্চতা</p>
                <p className="text-xl font-bold">{user.height} সেমি</p>
              </div>
            )}
            {user?.bmi && (
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-sm text-gray-600">BMI</p>
                <p className="text-xl font-bold">{user.bmi} <span className={`text-sm ${bmiStatus.color}`}>({bmiStatus.label})</span></p>
              </div>
            )}
            {(user?.bloodPressureSystolic || user?.bloodPressureDiastolic) && (
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-sm text-gray-600">রক্তচাপ</p>
                <p className="text-xl font-bold">{user.bloodPressureSystolic}/{user.bloodPressureDiastolic} <span className={`text-sm ${bpStatus.color}`}>({bpStatus.label})</span></p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function toYmdSafe(input) {
  if (!input) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input
  const d = new Date(input)
  if (isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth()+1).padStart(2,'0')
  const day = String(d.getDate()).padStart(2,'0')
  return `${y}-${m}-${day}`
}

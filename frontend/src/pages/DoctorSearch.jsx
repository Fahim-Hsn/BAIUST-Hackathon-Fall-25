import { useEffect, useState } from 'react'
import { getAllDoctors, getDoctorsBySpecialty, searchDoctors } from '../utils/api.js'
import { FaUserMd, FaPhoneAlt, FaHospital, FaMapMarkerAlt, FaSearch, FaStethoscope, FaFilter } from 'react-icons/fa'

const SPECIALTIES = [
  { key: 'সব', label: 'সব বিশেষতা', icon: '🔍' },
  { key: 'মানসিক', label: 'মানসিক', icon: '🧠' },
  { key: 'শারীরিক', label: 'শারীরিক', icon: '💪' },
  { key: 'হৃদরোগ', label: 'হৃদরোগ', icon: '❤️' },
  { key: 'শিশু', label: 'শিশু', icon: '👶' },
  { key: 'নার্সিং', label: 'নার্সিং', icon: '🏥' },
  { key: 'সাধারণ', label: 'সাধারণ', icon: '⚕️' },
  { key: 'অন্যান্য', label: 'অন্যান্য', icon: '📋' },
]

const SPECIALTY_COLORS = {
  'মানসিক': 'bg-blue-600',
  'শারীরিক': 'bg-blue-600',
  'হৃদরোগ': 'bg-blue-600',
  'শিশু': 'bg-blue-600',
  'নার্সিং': 'bg-blue-600',
  'সাধারণ': 'bg-blue-600',
  'অন্যান্য': 'bg-gray-600',
}

export default function DoctorSearch() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSpecialty, setSelectedSpecialty] = useState('সব')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  useEffect(() => {
    // Only load when specialty changes, not when search is triggered
    if (!searchQuery && !locationFilter) {
      loadDoctors()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSpecialty])

  async function loadDoctors() {
    try {
      setLoading(true)
      console.log('Loading doctors, specialty:', selectedSpecialty)
      let data
      if (selectedSpecialty === 'সব' || !selectedSpecialty) {
        console.log('Calling getAllDoctors...')
        data = await getAllDoctors()
        console.log('getAllDoctors response:', data)
      } else {
        console.log('Calling getDoctorsBySpecialty:', selectedSpecialty)
        data = await getDoctorsBySpecialty(selectedSpecialty)
        console.log('getDoctorsBySpecialty response:', data)
      }
      console.log('Loaded doctors:', data, 'Count:', data?.length)
      setDoctors(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Failed to load doctors:', e)
      console.error('Error details:', e.response || e.message)
      setDoctors([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch() {
    try {
      setLoading(true)
      console.log('Search triggered:', { searchQuery, selectedSpecialty, locationFilter })
      
      // If all fields are empty, load all doctors
      if (!searchQuery.trim() && !locationFilter.trim() && (selectedSpecialty === 'সব' || !selectedSpecialty)) {
        console.log('All fields empty, loading all doctors')
        const data = await getAllDoctors()
        setDoctors(Array.isArray(data) ? data : [])
        return
      }
      
      // Always use search API with all filters
      const specialty = selectedSpecialty === 'সব' ? null : selectedSpecialty
      const query = searchQuery.trim() || null
      const location = locationFilter.trim() || null
      
      console.log('Searching with:', { query, specialty, location })
      const data = await searchDoctors(query, specialty, location)
      console.log('Search result:', data, 'Count:', data?.length)
      setDoctors(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Search failed:', e)
      console.error('Error details:', e.response || e.message)
      // On error, try to load all doctors
      try {
        const data = await getAllDoctors()
        setDoctors(Array.isArray(data) ? data : [])
      } catch {
        setDoctors([])
      }
    } finally {
      setLoading(false)
    }
  }

  function handleCall(phone) {
    window.location.href = `tel:${phone}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 rounded-xl backdrop-blur">
            <FaUserMd className="text-4xl" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold mb-2">ডাক্তার খুঁজুন</h1>
            <p className="text-lg text-white/90">আপনার সমস্যা অনুযায়ী ডাক্তার খুঁজে নিন এবং যোগাযোগ করুন</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="ডাক্তারের নাম বা হাসপাতাল খুঁজুন..."
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="এলাকা/জেলা (যেমন: ঢাকা)"
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white px-6 py-3 rounded-xl font-bold transition transform hover:scale-105 flex items-center justify-center gap-2 flex-1"
          >
            <FaSearch /> খুঁজুন
          </button>
          {(searchQuery || locationFilter) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setLocationFilter('')
                loadDoctors()
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-xl font-semibold transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Specialty Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border">
        <div className="flex items-center gap-3 mb-4">
          <FaFilter className="text-mainOrange text-xl" />
          <h3 className="text-xl font-bold">বিশেষতা অনুযায়ী ফিল্টার</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {SPECIALTIES.map(spec => (
            <button
              key={spec.key}
              onClick={() => {
                setSelectedSpecialty(spec.key)
                // Clear search fields when specialty filter changes
                setSearchQuery('')
                setLocationFilter('')
              }}
              className={`px-5 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                selectedSpecialty === spec.key
                  ? spec.key === 'সব'
                    ? 'bg-gray-600 text-white shadow-lg scale-105'
                    : `${SPECIALTY_COLORS[spec.key] || 'bg-gray-600'} text-white shadow-lg scale-105`
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <span>{spec.icon}</span>
              <span>{spec.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">ডাক্তার তালিকা</h3>
          <p className="text-gray-600">
            {loading ? 'লোড হচ্ছে...' : `${doctors.length} জন ডাক্তার পাওয়া গেছে`}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainPink mx-auto mb-4"></div>
            <p>ডাক্তার খুঁজছি...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border shadow-lg">
            <FaUserMd className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-bold text-gray-700 mb-2">কোনো ডাক্তার পাওয়া যায়নি</p>
            <p className="text-gray-600 mb-4">অনুগ্রহ করে অন্য ফিল্টার ব্যবহার করুন বা সার্চ ফিল্ড খালি করুন</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setLocationFilter('')
                setSelectedSpecialty('সব')
                loadDoctors()
              }}
              className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white px-6 py-3 rounded-xl font-bold transition"
            >
              সব ফিল্টার সরান
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map(doctor => {
              const specialtyData = SPECIALTIES.find(s => s.key === doctor.specialty) || SPECIALTIES[SPECIALTIES.length - 1]
              const colorClass = SPECIALTY_COLORS[doctor.specialty] || 'bg-gray-600'
              
              return (
                <div
                  key={doctor._id}
                  className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-mainPink hover:shadow-xl transition"
                >
                  {/* Doctor Header */}
                  <div className={`${colorClass} rounded-xl p-4 text-white mb-4`}>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                        <FaUserMd className="text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold">{doctor.name}</h4>
                        <p className="text-white/90 text-sm flex items-center gap-1 mt-1">
                          <FaStethoscope /> {doctor.specialty}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <FaHospital className="text-mainOrange text-lg mt-1" />
                      <div>
                        <p className="text-xs text-gray-600">হাসপাতাল/ক্লিনিক</p>
                        <p className="font-semibold text-gray-900">{doctor.hospital}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-red-500 text-lg mt-1" />
                      <div>
                        <p className="text-xs text-gray-600">অবস্থান</p>
                        <p className="font-semibold text-gray-900">{doctor.location}</p>
                        {doctor.area && (
                          <p className="text-sm text-gray-600">{doctor.area}</p>
                        )}
                        {doctor.address && (
                          <p className="text-xs text-gray-500 mt-1">{doctor.address}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                      <FaPhoneAlt className="text-green-600 text-lg" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600">যোগাযোগ</p>
                        <a
                          href={`tel:${doctor.phone}`}
                          onClick={(e) => {
                            e.preventDefault()
                            handleCall(doctor.phone)
                          }}
                          className="text-lg font-bold text-mainPink hover:text-pink-600 transition"
                        >
                          {doctor.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Call Button */}
                  <button
                    onClick={() => handleCall(doctor.phone)}
                    className={`w-full mt-4 ${colorClass} hover:shadow-lg text-white px-4 py-3 rounded-xl font-bold transition transform hover:scale-105 flex items-center justify-center gap-2`}
                  >
                    <FaPhoneAlt /> কল করুন
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gray-100 rounded-xl">
            <FaUserMd className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">জরুরি অবস্থায়</h4>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              যদি আপনার জরুরি চিকিৎসার প্রয়োজন হয়, তাহলে সরাসরি জরুরি বিভাগে যোগাযোগ করুন বা নিকটস্থ হাসপাতালে যান।
            </p>
            <p className="text-sm font-semibold text-gray-900">
              জরুরি নম্বর: <span className="text-red-600">৯৯৯</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

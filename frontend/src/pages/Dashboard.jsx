import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaChartLine, FaCalendarAlt, FaHandHoldingHeart, FaUser, FaThermometerHalf, FaArrowRight, FaUserMd, FaBaby, FaNewspaper } from 'react-icons/fa'
import { getUser } from '../utils/auth.js'
import { fetchMoods } from '../utils/api.js'
import MoodTracker from '../components/MoodTracker.jsx'
import HelpForm from '../components/HelpForm.jsx'
import SeasonalDiseasesPreview from '../components/SeasonalDiseasesPreview.jsx'

export default function Dashboard() {
  const user = getUser()
  const [moodStats, setMoodStats] = useState({ total: 0, thisWeek: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?._id) {
      loadMoodStats()
    }
  }, [user])

  async function loadMoodStats() {
    try {
      setLoading(true)
      const moods = await fetchMoods(user._id)
      const now = Date.now()
      const weekAgo = now - (7 * 24 * 60 * 60 * 1000)
      const thisWeek = moods.filter(m => {
        const date = new Date(m.date || m.createdAt).getTime()
        return date >= weekAgo
      }).length
      setMoodStats({ total: moods.length, thisWeek })
    } catch (e) {
      console.error('Failed to load mood stats:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* Dashboard Header */}
      <div className="bg-[#33415c] rounded-3xl p-8 md:p-10 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-white">
              ড্যাশবোর্ড
            </h1>
            <p className="text-lg md:text-xl text-white/95 font-medium">
              {user ? `স্বাগতম, ${user.name}!` : 'আপনার স্বাস্থ্য তথ্য দেখুন'} 
            </p>
          </div>
          {user && (
            <Link to="/profile" className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 border-2 border-white/30">
              <FaUser /> প্রোফাইল
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards - Organized Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
          <h2 className="text-2xl font-extrabold text-gray-900">পরিসংখ্যান</h2>
          <div className="h-1 flex-1 bg-blue-600 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-7 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="p-4 bg-[#33415c] rounded-xl text-white">
                <FaCalendarAlt className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 font-medium mb-1">মোট মুড</p>
                <p className="text-4xl font-extrabold text-gray-900">{loading ? '...' : moodStats.total}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 font-medium">আপনার মোট রেকর্ড করা মুড</p>
          </div>

          <div className="bg-white rounded-2xl p-7 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="p-4 bg-[#33415c] rounded-xl text-white">
                <FaChartLine className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 font-medium mb-1">এই সপ্তাহ</p>
                <p className="text-4xl font-extrabold text-gray-900">{loading ? '...' : moodStats.thisWeek}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 font-medium">সপ্তাহের মুড এন্ট্রি</p>
          </div>

          <Link to="/emergency" className="bg-white rounded-2xl p-7 border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-5">
              <div className="p-4 bg-[#33415c] rounded-xl text-white">
                <FaHandHoldingHeart className="text-3xl" />
              </div>
              <div className="text-right flex-1">
                <p className="text-sm text-gray-600 font-medium mb-1">সাহায্য</p>
                <p className="text-4xl font-extrabold text-gray-900">২৪/৭</p>
              </div>
              <FaArrowRight className="text-blue-600 group-hover:translate-x-2 transition text-xl" />
            </div>
            <p className="text-sm text-gray-700 font-medium">সর্বদা উপলব্ধ</p>
            <p className="text-xs text-gray-600 mt-2 font-medium">জরুরি যোগাযোগ দেখুন →</p>
          </Link>
        </div>
      </section>

      {/* Quick Actions - Organized Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
          <h2 className="text-2xl font-extrabold text-gray-900">দ্রুত কার্যক্রম</h2>
          <div className="h-1 flex-1 bg-blue-600 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/mood" className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-[#33415c] rounded-xl text-white">
                <FaCalendarAlt className="text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">মুড ট্র্যাকার</h3>
                <p className="text-sm text-gray-600">আজকের মুড রেকর্ড করুন</p>
              </div>
              <FaArrowRight className="text-blue-600 group-hover:translate-x-2 transition" />
            </div>
          </Link>

          <Link to="/help" className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-[#33415c] rounded-xl text-white">
                <FaHandHoldingHeart className="text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">সাহায্য চান</h3>
                <p className="text-sm text-gray-600">গোপনীয় সাহায্যের অনুরোধ</p>
              </div>
              <FaArrowRight className="text-blue-600 group-hover:translate-x-2 transition" />
            </div>
          </Link>

          <Link to="/doctors" className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-[#33415c] rounded-xl text-white">
                <FaUserMd className="text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">ডাক্তার খুঁজুন</h3>
                <p className="text-sm text-gray-600">সমস্যা অনুযায়ী ডাক্তার</p>
              </div>
              <FaArrowRight className="text-blue-600 group-hover:translate-x-2 transition" />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">আপনার সমস্যা অনুযায়ী ডাক্তার খুঁজে নিন এবং সরাসরি যোগাযোগ করুন</p>
          </Link>

          <Link to="/mother-child" className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-[#33415c] rounded-xl text-white">
                <FaBaby className="text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">মাতৃ ও শিশু</h3>
                <p className="text-sm text-gray-600">মা ও শিশুর স্বাস্থ্য ট্র্যাকিং</p>
              </div>
              <FaArrowRight className="text-blue-600 group-hover:translate-x-2 transition" />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">মায়ের এবং শিশুর স্বাস্থ্য তথ্য, ঔষধ রেকর্ড এবং টিকা সিডিউল ট্র্যাক করুন</p>
          </Link>

          <Link to="/news" className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-[#33415c] rounded-xl text-white">
                <FaNewspaper className="text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">খবরাখবর</h3>
                <p className="text-sm text-gray-600">সহায়ক পোস্ট এবং তথ্য</p>
              </div>
              <FaArrowRight className="text-blue-600 group-hover:translate-x-2 transition" />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">স্বাস্থ্য, রক্তদান, স্বেচ্ছাসেবা এবং অন্যান্য সহায়ক পোস্ট দেখুন</p>
          </Link>
        </div>
      </section>

      {/* Mood Tracker Section */}
      <section className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-blue-600 rounded-xl">
            <FaCalendarAlt className="text-3xl text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">মুড ট্র্যাকার</h2>
            <p className="text-sm text-gray-600 mt-1">আপনার মানসিক অবস্থা ট্র্যাক করুন</p>
          </div>
        </div>
        <MoodTracker />
      </section>

      {/* Help Form Section */}
      <section className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-blue-600 rounded-xl">
            <FaHandHoldingHeart className="text-3xl text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">সাহায্যের অনুরোধ</h2>
            <p className="text-sm text-gray-600 mt-1">গোপনে সাহায্য চান</p>
          </div>
        </div>
        <HelpForm />
      </section>

      {/* Seasonal Diseases Preview */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
          <h2 className="text-3xl font-extrabold text-gray-900">মৌসুমি রোগ</h2>
          <div className="h-1 flex-1 bg-blue-600 rounded-full"></div>
        </div>
        <SeasonalDiseasesPreview />
      </section>
    </div>
  )
}

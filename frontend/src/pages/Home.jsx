import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaHeartbeat, FaCalendarAlt, FaMapMarkerAlt, FaArrowRight, FaUserMd, FaHandHoldingHeart, FaExclamationTriangle, FaNewspaper, FaHeart, FaTint, FaUsers } from 'react-icons/fa'
import ClinicMap from '../components/ClinicMap.jsx'
import SeasonalDiseasesPreview from '../components/SeasonalDiseasesPreview.jsx'
import VoiceAssistant from '../components/VoiceAssistant.jsx'
import { getAllPosts } from '../utils/api.js'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    try {
      setPostsLoading(true)
      const data = await getAllPosts()
      setPosts((data.posts || []).slice(0, 6)) // Show first 6 posts
    } catch (error) {
      console.error('Failed to load posts:', error)
      setPosts([])
    } finally {
      setPostsLoading(false)
    }
  }

  function getCategoryIcon(category) {
    switch (category) {
      case 'health': return FaHeart
      case 'blood-donation': return FaTint
      case 'volunteering': return FaUsers
      case 'emergency': return FaExclamationTriangle
      default: return FaNewspaper
    }
  }

  function getCategoryColor(category) {
    return 'bg-blue-600' // Simple consistent color
  }

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="bg-[#33415c] rounded-3xl p-8 md:p-12 text-white shadow-lg">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-xl">
                <FaHeartbeat className="text-5xl !text-white" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
                  মনবন্ধু
                </h1>
                <p className="text-lg text-white/90 mt-1">স্বাস্থ্যের বিশ্বস্ত সাথী</p>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-white leading-relaxed font-semibold">
              আপনার স্বাস্থ্যের বিশ্বস্ত সাথী
            </p>
            <p className="text-base md:text-lg text-white/90 leading-relaxed">
              গ্রামের মানুষের জন্য সহজ ও নিরাপদ মানসিক ও শারীরিক সহায়তা। আপনার মুড ট্র্যাক করুন, গোপনে সাহায্য চান, এবং নিকটস্থ ক্লিনিক খুঁজে নিন।
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/mood" className="bg-white text-blue-600 hover:bg-gray-50 px-7 py-3.5 rounded-xl font-bold shadow-md transition-all flex items-center gap-2">
                <FaCalendarAlt className="text-lg !text-blue-600" /> মুড ট্র্যাকার
              </Link>
              <Link to="/help" className="bg-white/20 hover:bg-white/30 text-white px-7 py-3.5 rounded-xl font-bold border-2 border-white/50 transition-all flex items-center gap-2">
                <FaHandHoldingHeart className="text-lg !text-white" /> সাহায্য চান
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="h-96 rounded-3xl bg-white/10 border-2 border-white/20 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-white">আজ আপনি কেমন আছেন?</p>
                  <p className="text-white/90 text-lg">আমরা আপনার সাথে আছি</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions - Organized Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
          <h2 className="text-3xl font-extrabold text-gray-900">দ্রুত কার্যক্রম</h2>
          <div className="h-1 flex-1 bg-blue-600 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/mood" className="bg-white rounded-2xl p-7 border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all group">
            <div className="flex items-start gap-4 mb-5">
              <div className="p-4 bg-[#33415c] rounded-xl text-white">
                <FaCalendarAlt className="text-2xl !text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">মুড ট্র্যাকার</h3>
                <p className="text-sm text-gray-600">আপনার মানসিক অবস্থা</p>
              </div>
            </div>
            <p className="text-gray-700 mb-5 leading-relaxed">প্রতিদিন আপনার মুড ট্র্যাক করুন এবং মানসিক স্বাস্থ্যের উন্নতি করুন।</p>
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <span>শুরু করুন</span>
              <FaArrowRight className="group-hover:translate-x-2 transition" />
            </div>
          </Link>

          <Link to="/help" className="bg-white rounded-2xl p-7 border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all group">
            <div className="flex items-start gap-4 mb-5">
              <div className="p-4 bg-[#33415c] rounded-xl text-white">
                <FaHandHoldingHeart className="text-2xl !text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">সাহায্য চান</h3>
                <p className="text-smbg-[#33415c] text-gray-600">গোপনীয় সাহায্য</p>
              </div>
            </div>
            <p className="text-gray-700 mb-5 leading-relaxed">গোপনে সাহায্য চান এবং প্রয়োজনীয় সহায়তা পান।</p>
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <span>অনুরোধ করুন</span>
              <FaArrowRight className="group-hover:translate-x-2 transition" />
            </div>
          </Link>

          <Link to="/dashboard" className="bg-white rounded-2xl p-7 border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all group">
            <div className="flex items-start gap-4 mb-5">
              <div className="p-4  rounded-xl text-white">
                <FaUserMd className="text-2xl !text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">ড্যাশবোর্ড</h3>
                <p className="text-sm text-gray-600">সবকিছু একসাথে</p>
              </div>
            </div>
            <p className="text-gray-700 mb-5 leading-relaxed">আপনার সমস্ত স্বাস্থ্য তথ্য এবং কার্যকলাপ দেখুন।</p>
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <span>দেখুন</span>
              <FaArrowRight className="group-hover:translate-x-2 transition" />
            </div>
          </Link>
        </div>
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

      {/* News Feed Section */}
      <section className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#33415c] rounded-xl text-white">
              <FaNewspaper className="text-3xl !text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">একটু দেখুন</h2>
              <p className="text-sm text-gray-600 mt-1">সহায়ক পোস্ট এবং তথ্য</p>
            </div>
          </div>
          <Link to="/news" className="px-5 py-3 bg-[#33415c] hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2">
            <span>সব দেখুন</span>
            <FaArrowRight />
          </Link>
        </div>
        {postsLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">লোড হচ্ছে...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <FaNewspaper className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">কোনো পোস্ট পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => {
              const Icon = getCategoryIcon(post.category)
              const colorClass = getCategoryColor(post.category)
              return (
                <div
                  key={post._id || index}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 bg-[#33415c] rounded-xl text-white group-hover:scale-105 transition-all`}>
                      <Icon className="text-xl !text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {post.content}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Emergency Contact Card */}
      <Link to="/emergency" className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all group block">
        <div className="flex items-center gap-6 mb-5">
          <div className="p-5 bg-[#33415c] rounded-xl text-white">
            <FaExclamationTriangle className="text-4xl !text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">জরুরি যোগাযোগ</h2>
            <p className="text-base text-gray-600">জরুরি অবস্থায় এই নম্বরগুলোতে যোগাযোগ করুন</p>
          </div>
          <FaArrowRight className="text-blue-600 group-hover:translate-x-2 transition text-2xl" />
        </div>
        <p className="text-base text-gray-700 font-medium">পুলিশ, অ্যাম্বুলেন্স, ফায়ার সার্ভিস, এবং অন্যান্য জরুরি সেবা দেখুন →</p>
      </Link>

      {/* Clinic Map */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
          <h2 className="text-3xl font-extrabold text-gray-900">নিকটস্থ ক্লিনিক</h2>
          <div className="h-1 flex-1 bg-blue-600 rounded-full"></div>
        </div>
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-lg">
          <ClinicMap />
        </div>
      </section>

      {/* Voice Assistant */}
      <VoiceAssistant />
    </div>
  )
}

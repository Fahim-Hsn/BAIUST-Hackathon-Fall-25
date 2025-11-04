import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaHeart, FaTint, FaHandHoldingHeart, FaExclamationTriangle, FaNewspaper, FaFilter, FaEye } from 'react-icons/fa'
import { getAllPosts, getPostsByCategory } from '../utils/api.js'

const CATEGORIES = {
  all: { label: 'সব', icon: FaNewspaper, color: 'bg-[#33415c]' },
  health: { label: 'স্বাস্থ্য', icon: FaHeart, color: 'bg-[#33415c]' },
  'blood-donation': { label: 'রক্তদান', icon: FaTint, color: 'bg-[#33415c]' },
  volunteering: { label: 'স্বেচ্ছাসেবা', icon: FaHandHoldingHeart, color: 'bg-[#33415c]' },
  emergency: { label: 'জরুরি', icon: FaExclamationTriangle, color: 'bg-[#33415c]' },
  general: { label: 'সাধারণ', icon: FaNewspaper, color: 'bg-[#33415c]' }
}

export default function NewsFeed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadPosts()
  }, [selectedCategory])

  async function loadPosts() {
    try {
      setLoading(true)
      let data
      if (selectedCategory === 'all') {
        data = await getAllPosts()
      } else {
        data = await getPostsByCategory(selectedCategory)
      }
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Failed to load posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  function getCategoryInfo(category) {
    return CATEGORIES[category] || CATEGORIES.general
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#33415c] rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            to="/dashboard"
            className="bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2"
          >
            <FaArrowLeft /> ফিরে যান
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 backdrop-blur rounded-2xl">
            <FaNewspaper className="text-4xl" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold mb-2">খবরাখবর</h1>
            <p className="text-lg text-white/90">
              সহায়ক পোস্ট এবং তথ্য দেখুন
            </p>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white rounded-2xl p-6 border shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          
          <h2 className="text-xl font-bold">বিষয় অনুযায়ী ফিল্টার</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(CATEGORIES).map(([key, info]) => {
            const Icon = info.icon
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-5 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                  selectedCategory === key
                    ? `${info.color} text-white shadow-lg scale-105`
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Icon />
                <span>{info.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">লোড হচ্ছে...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border">
          <FaNewspaper className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600">কোনো পোস্ট পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => {
            const categoryInfo = getCategoryInfo(post.category)
            const Icon = categoryInfo.icon
            return (
              <div
                key={post._id || index}
                className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-mainPink hover:shadow-xl transition cursor-pointer group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 bg-gradient-to-r ${categoryInfo.color} rounded-xl text-white group-hover:scale-110 transition`}>
                    <Icon className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <div className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold mb-2 bg-gradient-to-r ${categoryInfo.color} text-white`}>
                      {categoryInfo.label}
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-mainPink transition">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {post.content}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaEye />
                    <span>{post.views || 3} বার দেখা হয়েছে</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {post.author || 'Admin'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { getUser } from '../utils/auth.js'
import { FaHeartbeat, FaNewspaper, FaHome, FaCalendarAlt, FaHandHoldingHeart, FaThLarge, FaUserCircle, FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa'

export default function Navbar() {
  const user = getUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-white via-pink-50/50 to-white backdrop-blur-md border-b-2 border-pink-200/50 sticky top-0 z-20 shadow-lg">
      <div className="container mx-auto px-4 md:px-6 lg:px-10 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              
             
            </div>
            <div>
              <span className="text-2xl font-extrabold bg-[#226f54] from-mainPink to-mainOrange bg-clip-text text-transparent">
                মনবন্ধু
              </span>
              <p className="text-xs text-gray-600 hidden md:block">আপনার স্বাস্থ্যের সাথী</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 text-sm">
            <NavLink 
              to="/" 
              end 
              className={({isActive})=>`px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg scale-105' 
                  : 'hover:bg-pink-100 text-gray-700 hover:scale-105'
              }`}
            >
              <FaHome className="text-sm" />
              <span>হোম</span>
            </NavLink>
            
            <NavLink 
              to="/mood" 
              className={({isActive})=>`px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105' 
                  : 'hover:bg-orange-100 text-gray-700 hover:scale-105'
              }`}
            >
              <FaCalendarAlt className="text-sm" />
              <span>মুড</span>
            </NavLink>
            
            <NavLink 
              to="/help" 
              className={({isActive})=>`px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg scale-105' 
                  : 'hover:bg-pink-100 text-gray-700 hover:scale-105'
              }`}
            >
              <FaHandHoldingHeart className="text-sm" />
              <span>সাহায্য</span>
            </NavLink>
            
            <NavLink 
              to="/news" 
              className={({isActive})=>`px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : 'hover:bg-gray-100 text-gray-700 hover:scale-105'
              }`}
            >
              <FaNewspaper className="text-sm" />
              <span>খবরাখবর</span>
            </NavLink>
            
            <NavLink 
              to="/dashboard" 
              className={({isActive})=>`px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg scale-105' 
                  : 'hover:bg-gray-100 text-gray-700 hover:scale-105'
              }`}
            >
              <FaThLarge className="text-sm" />
              <span>ড্যাশবোর্ড</span>
            </NavLink>
            
            {user ? (
              <NavLink 
                to="/profile" 
                className={({isActive})=>`px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105' 
                    : 'hover:bg-green-100 text-gray-700 hover:scale-105'
                }`}
              >
                <FaUserCircle className="text-lg" />
                <span className="hidden lg:inline">{user.name?.split(' ')[0] || 'প্রোফাইল'}</span>
                <span className="lg:hidden">প্রোফাইল</span>
              </NavLink>
            ) : (
              <NavLink 
                to="/login" 
                className={({isActive})=>`px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg scale-105' 
                    : 'hover:bg-gray-100 text-gray-700 hover:scale-105'
                }`}
              >
                <FaSignInAlt className="text-sm" />
                <span>লগইন</span>
              </NavLink>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-pink-100 transition"
          >
            {mobileMenuOpen ? (
              <FaTimes className="text-2xl text-gray-700" />
            ) : (
              <FaBars className="text-2xl text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2 pb-4">
            <NavLink 
              to="/" 
              end 
              onClick={() => setMobileMenuOpen(false)}
              className={({isActive})=>`block px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition ${
                isActive 
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white' 
                  : 'bg-pink-50 text-gray-700 hover:bg-pink-100'
              }`}
            >
              <FaHome />
              <span>হোম</span>
            </NavLink>
            
            <NavLink 
              to="/mood" 
              onClick={() => setMobileMenuOpen(false)}
              className={({isActive})=>`block px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition ${
                isActive 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' 
                  : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
              }`}
            >
              <FaCalendarAlt />
              <span>মুড</span>
            </NavLink>
            
            <NavLink 
              to="/help" 
              onClick={() => setMobileMenuOpen(false)}
              className={({isActive})=>`block px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition ${
                isActive 
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white' 
                  : 'bg-pink-50 text-gray-700 hover:bg-pink-100'
              }`}
            >
              <FaHandHoldingHeart />
              <span>সাহায্য</span>
            </NavLink>
            
            <NavLink 
              to="/news" 
              onClick={() => setMobileMenuOpen(false)}
              className={({isActive})=>`block px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaNewspaper />
              <span>একটু দেখুন</span>
            </NavLink>
            
            <NavLink 
              to="/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className={({isActive})=>`block px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition ${
                isActive 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaThLarge />
              <span>ড্যাশবোর্ড</span>
            </NavLink>
            
            {user ? (
              <NavLink 
                to="/profile" 
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive})=>`block px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition ${
                  isActive 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                    : 'bg-green-50 text-gray-700 hover:bg-green-100'
                }`}
              >
                <FaUserCircle className="text-xl" />
                <span>{user.name?.split(' ')[0] || 'প্রোফাইল'}</span>
              </NavLink>
            ) : (
              <NavLink 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className={({isActive})=>`block px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition ${
                  isActive 
                    ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaSignInAlt />
                <span>লগইন</span>
              </NavLink>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}



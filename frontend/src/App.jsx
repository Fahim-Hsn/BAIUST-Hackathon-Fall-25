import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { initApi } from './utils/api.js'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MoodTracker from './components/MoodTracker.jsx'
import HelpForm from './components/HelpForm.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import DoctorSearch from './pages/DoctorSearch.jsx'
import EmergencyContact from './pages/EmergencyContact.jsx'
import MotherChildHealth from './pages/MotherChildHealth.jsx'
import NewsFeed from './pages/NewsFeed.jsx'
import SeasonalDiseasesPage from './pages/SeasonalDiseases.jsx'

export default function App() {
  const [apiUrl, setApiUrl] = useState('http://localhost:5005/api') // Default URL for immediate render

  useEffect(() => {
    let mounted = true
    
    // Initialize API in background (non-blocking)
    ;(async () => {
      try {
        const url = await initApi()
        if (mounted) {
          setApiUrl(url)
        }
      } catch (error) {
        console.error('API initialization error:', error)
        // Already using default URL, so no need to update
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col mb-gradient font-bangla text-gray-900">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 lg:px-10 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mood" element={<MoodTracker />} />
          <Route path="/help" element={<HelpForm />} />
          <Route path="/doctors" element={<DoctorSearch />} />
          <Route path="/emergency" element={<EmergencyContact />} />
          <Route path="/mother-child" element={<MotherChildHealth />} />
          <Route path="/news" element={<NewsFeed />} />
          <Route path="/seasonal-diseases" element={<SeasonalDiseasesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}



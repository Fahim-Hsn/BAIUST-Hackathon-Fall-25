import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import SeasonalDiseases from '../components/SeasonalDiseases.jsx'

export default function SeasonalDiseasesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            to="/dashboard"
            className="bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2"
          >
            <FaArrowLeft />
            <span>ফিরে যান</span>
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">মৌসুমি রোগ</h1>
        <p className="text-lg md:text-xl text-white/95 font-medium">
          বিভিন্ন মৌসুমের রোগ সম্পর্কে বিস্তারিত জানুন এবং সুরক্ষিত থাকুন
        </p>
      </div>

      {/* Full Seasonal Diseases Component */}
      <SeasonalDiseases />
    </div>
  )
}


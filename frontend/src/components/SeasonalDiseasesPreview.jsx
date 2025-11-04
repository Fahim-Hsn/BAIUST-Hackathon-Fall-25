import { Link } from 'react-router-dom'
import { FaArrowRight, FaThermometerHalf } from 'react-icons/fa'

// Sample diseases - only first 4 for preview
const SAMPLE_DISEASES = [
  {
    _id: '1',
    name: 'ডেঙ্গু',
    season: 'বর্ষা',
    details: 'ডেঙ্গু একটি মশাবাহিত রোগ যা বর্ষাকালে বেশি দেখা যায়। এডিস মশা এর বাহক।',
    severity: 'তীব্র'
  },
  {
    _id: '2',
    name: 'সর্দি-কাশি',
    season: 'শীত',
    details: 'শীতকালে ঠান্ডা আবহাওয়ার কারণে সর্দি-কাশি বেশি দেখা যায়।',
    severity: 'হালকা'
  },
  {
    _id: '3',
    name: 'হিট স্ট্রোক',
    season: 'গ্রীষ্ম',
    details: 'গ্রীষ্মকালে অতিরিক্ত গরমে শরীরে পানির ঘাটতি হলে হিট স্ট্রোক হতে পারে।',
    severity: 'তীব্র'
  },
  {
    _id: '4',
    name: 'ডায়রিয়া',
    season: 'সবসময়',
    details: 'দূষিত পানি বা খাবার খাওয়ার কারণে ডায়রিয়া হতে পারে।',
    severity: 'মাঝারি'
  }
]

const SEVERITY_COLORS = {
  'হালকা': 'bg-green-100 text-green-800 border-green-300',
  'মাঝারি': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'তীব্র': 'bg-red-100 text-red-800 border-red-300'
}

export default function SeasonalDiseasesPreview() {
  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#33415c]">
            <FaThermometerHalf className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">মৌসুমি রোগ</h2>
            <p className="text-sm text-gray-600">বিভিন্ন মৌসুমের রোগ সম্পর্কে জানুন</p>
          </div>
        </div>
        <Link 
          to="/seasonal-diseases" 
          className="px-5 py-3 bg-[#33415c] hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
        >
          <span>সব দেখুন</span>
          <FaArrowRight />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SAMPLE_DISEASES.map(disease => (
          <Link
            key={disease._id}
            to="/seasonal-diseases"
            className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition cursor-pointer group block"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">{disease.name}</h3>
              <span className={`px-2 py-1 rounded text-xs font-semibold border ${SEVERITY_COLORS[disease.severity] || SEVERITY_COLORS['মাঝারি']}`}>
                {disease.severity}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span className="px-2 py-1 rounded bg-[#33415c] text-white text-xs font-semibold">
                {disease.season}
              </span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2 mb-3">{disease.details}</p>
            <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold">
              <span>বিস্তারিত দেখুন</span>
              <FaArrowRight className="group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


import { FaPhoneAlt, FaAmbulance, FaShieldAlt, FaHospital, FaUserMd, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const EMERGENCY_CONTACTS = [
  {
    id: 1,
    name: 'পুলিশ',
    number: '৯৯৯',
    description: 'জরুরি পুলিশ সেবা',
    icon: FaShieldAlt,
    color: 'bg-blue-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    details: 'কোনো জরুরি পরিস্থিতিতে, নিরাপত্তা ঝুঁকি, অপরাধ বা সহায়তার প্রয়োজন হলে সরাসরি ৯৯৯ নম্বরে কল করুন।'
  },
  {
    id: 2,
    name: 'অ্যাম্বুলেন্স',
    number: '৯৯৯',
    description: 'জরুরি চিকিৎসা সহায়তা',
    icon: FaAmbulance,
    color: 'bg-blue-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    details: 'জরুরি চিকিৎসা সহায়তা, আহত ব্যক্তি পরিবহন, বা জীবন-মৃত্যুর পরিস্থিতিতে ৯৯৯ নম্বরে কল করুন।'
  },
  {
    id: 3,
    name: 'ফায়ার সার্ভিস',
    number: '৯৯৯',
    description: 'জরুরি অগ্নিনির্বাপন',
    icon: FaExclamationTriangle,
    color: 'bg-blue-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    details: 'আগুন লাগা, ধোঁয়া, গ্যাস লিক, বা অগ্নি নিরাপত্তা সংক্রান্ত কোনো সমস্যায় ৯৯৯ নম্বরে কল করুন।'
  },
  {
    id: 4,
    name: 'জাতীয় হেল্পলাইন',
    number: '১০৯',
    description: 'সরকারি হেল্পলাইন',
    icon: FaPhoneAlt,
    color: 'bg-blue-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    details: 'সরকারি সেবা, তথ্য, বা সহায়তার জন্য জাতীয় হেল্পলাইন ১০৯ নম্বরে কল করুন।'
  },
  {
    id: 5,
    name: 'ডাক্তার সেবা',
    number: '১৬২৬৩',
    description: '২৪/৭ ডাক্তার পরামর্শ',
    icon: FaUserMd,
    color: 'bg-blue-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    details: '২৪ ঘন্টা চিকিৎসা পরামর্শ, স্বাস্থ্য সংক্রান্ত তথ্য, বা জরুরি চিকিৎসা সহায়তার জন্য ১৬২৬৩ নম্বরে কল করুন।'
  },
  {
    id: 6,
    name: 'হাসপাতাল',
    number: '৯৯৯',
    description: 'নিকটস্থ হাসপাতাল',
    icon: FaHospital,
    color: 'bg-blue-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    details: 'নিকটস্থ হাসপাতাল খুঁজে পেতে বা জরুরি চিকিৎসা সহায়তার জন্য ৯৯৯ নম্বরে কল করুন।'
  }
]

export default function EmergencyContact() {
  function handleCall(number) {
    // Convert Bengali digits to English for phone call
    const bengaliToEnglish = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    }
    const englishNumber = number.split('').map(char => bengaliToEnglish[char] || char).join('')
    window.location.href = `tel:${englishNumber}`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl">
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
            <FaExclamationTriangle className="text-4xl" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold mb-2">জরুরি যোগাযোগ</h1>
            <p className="text-lg text-white/90">
              জরুরি অবস্থায় এই নম্বরগুলোতে যোগাযোগ করুন
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contacts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EMERGENCY_CONTACTS.map(contact => {
          const Icon = contact.icon
          return (
            <div
              key={contact.id}
              className={`${contact.bg} rounded-2xl p-6 border-2 ${contact.border} shadow-lg hover:shadow-xl transition cursor-pointer group`}
              onClick={() => handleCall(contact.number)}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-4 ${contact.color} rounded-xl text-white group-hover:scale-110 transition`}>
                  <Icon className="text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-1">{contact.name}</h3>
                  <p className="text-sm text-gray-700 font-medium">{contact.description}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 leading-relaxed">{contact.details}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                <div>
                  <p className="text-xs text-gray-600 mb-1">যোগাযোগ নম্বর</p>
                  <a
                    href={`tel:${contact.number}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCall(contact.number)
                    }}
                    className="text-3xl font-extrabold text-gray-900 hover:text-mainPink transition"
                  >
                    {contact.number}
                  </a>
                </div>
                <div className={`p-3 ${contact.color} rounded-xl text-white group-hover:scale-110 transition`}>
                  <FaPhoneAlt className="text-xl" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Important Notice */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600 rounded-xl text-white">
            <FaExclamationTriangle className="text-2xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">জরুরি অবস্থায় কী করবেন?</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>শান্ত থাকুন এবং জরুরি অবস্থা সম্পর্কে স্পষ্টভাবে জানান</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>আপনার অবস্থান, ঠিকানা, এবং প্রয়োজনীয় তথ্য স্পষ্টভাবে দিন</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>জরুরি পরিস্থিতির ধরন (আগুন, আহত, অপরাধ ইত্যাদি) জানান</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>আহত ব্যক্তির সংখ্যা এবং অবস্থা জানান (যদি থাকে)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>ফোনে অপারেটরের নির্দেশ অনুযায়ী কাজ করুন</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        <h3 className="text-xl font-extrabold text-gray-900 mb-4">দ্রুত সাহায্য</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-1">জরুরি অবস্থা</h4>
            <p className="text-sm text-gray-600">সরাসরি ৯৯৯ নম্বরে কল করুন</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <h4 className="font-bold text-gray-900 mb-1">চিকিৎসা পরামর্শ</h4>
            <p className="text-sm text-gray-600">১৬২৬৩ নম্বরে কল করুন</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <h4 className="font-bold text-gray-900 mb-1">সরকারি সেবা</h4>
            <p className="text-sm text-gray-600">১০৯ নম্বরে কল করুন</p>
          </div>
        </div>
      </div>
    </div>
  )
}


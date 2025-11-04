import { FaPhoneAlt, FaAmbulance, FaShieldAlt, FaHospital, FaUserMd, FaExclamationTriangle } from 'react-icons/fa'

const EMERGENCY_CONTACTS = [
  {
    id: 1,
    name: 'পুলিশ',
    number: '৯৯৯',
    description: 'জরুরি পুলিশ সেবা',
    icon: FaShieldAlt,
    color: 'bg-blue-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200'
  },
  {
    id: 2,
    name: 'অ্যাম্বুলেন্স',
    number: '৯৯৯',
    description: 'জরুরি চিকিৎসা সহায়তা',
    icon: FaAmbulance,
    color: 'bg-blue-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200'
  },
  {
    id: 3,
    name: 'ফায়ার সার্ভিস',
    number: '৯৯৯',
    description: 'জরুরি অগ্নিনির্বাপন',
    icon: FaExclamationTriangle,
    color: 'bg-blue-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200'
  },
  {
    id: 4,
    name: 'জাতীয় হেল্পলাইন',
    number: '১০৯',
    description: 'সরকারি হেল্পলাইন',
    icon: FaPhoneAlt,
    color: 'bg-blue-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200'
  },
  {
    id: 5,
    name: 'ডাক্তার সেবা',
    number: '১৬২৬৩',
    description: '২৪/৭ ডাক্তার পরামর্শ',
    icon: FaUserMd,
    color: 'bg-blue-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200'
  },
  {
    id: 6,
    name: 'হাসপাতাল',
    number: '৯৯৯',
    description: 'নিকটস্থ হাসপাতাল',
    icon: FaHospital,
    color: 'bg-blue-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200'
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
    <section className="bg-white rounded-2xl p-6 shadow-lg border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-600 rounded-xl text-white">
          <FaExclamationTriangle className="text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold">জরুরি যোগাযোগ</h2>
          <p className="text-sm text-gray-600">জরুরি অবস্থায় এই নম্বরগুলোতে যোগাযোগ করুন</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EMERGENCY_CONTACTS.map(contact => {
          const Icon = contact.icon
          return (
            <div
              key={contact.id}
              className={`${contact.bg} rounded-xl p-4 border-2 ${contact.border} hover:shadow-lg transition cursor-pointer group`}
              onClick={() => handleCall(contact.number)}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 ${contact.color} rounded-lg text-white group-hover:scale-110 transition`}>
                  <Icon className="text-lg" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{contact.name}</h3>
                  <p className="text-xs text-gray-600">{contact.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 mb-1">যোগাযোগ</p>
                  <a
                    href={`tel:${contact.number}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCall(contact.number)
                    }}
                    className="text-xl font-extrabold text-gray-900 hover:text-mainPink transition"
                  >
                    {contact.number}
                  </a>
                </div>
                <div className={`p-2 ${contact.color} rounded-lg text-white group-hover:scale-110 transition`}>
                  <FaPhoneAlt />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="text-orange-600 text-xl mt-1" />
          <div>
            <p className="font-semibold text-gray-900 mb-1">জরুরি অবস্থায়</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              কোনো জরুরি পরিস্থিতিতে সরাসরি ৯৯৯ নম্বরে কল করুন। আপনার অবস্থান, সমস্যা এবং প্রয়োজনীয় তথ্য স্পষ্টভাবে জানান।
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}


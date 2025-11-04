import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaBaby, FaUser, FaHeartbeat, FaWeight, FaRulerVertical, FaThermometerHalf, FaPills, FaCalendarCheck, FaNotesMedical, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

export default function MotherChildHealth() {
  const [activeTab, setActiveTab] = useState('mother') // 'mother' or 'child'

  // Mother Health Data
  const [motherData, setMotherData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    bloodPressure: { systolic: '', diastolic: '' },
    lastMenstrualPeriod: '',
    pregnancyWeek: '',
    dueDate: '',
    bloodGroup: '',
    hemoglobin: '',
    bloodSugar: '',
    notes: ''
  })

  // Child Health Data
  const [childData, setChildData] = useState({
    name: '',
    birthDate: '',
    age: '',
    weight: '',
    height: '',
    bloodGroup: '',
    notes: ''
  })

  // Medicine Records
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'প্যারাসিটামল', date: '2024-01-15', time: '10:00', dose: '1 টি', reason: 'জ্বর' },
    { id: 2, name: 'ভিটামিন ডি', date: '2024-01-14', time: '08:00', dose: '1 টি', reason: 'সাপ্লিমেন্ট' }
  ])

  // Vaccination Schedule
  const [vaccinations, setVaccinations] = useState([
    { id: 1, name: 'BCG', date: '2024-01-10', status: 'completed', dueDate: '2024-01-10', notes: '' },
    { id: 2, name: 'DPT (১ম ডোজ)', date: '', status: 'pending', dueDate: '2024-02-15', notes: '' },
    { id: 3, name: 'পোলিও (১ম ডোজ)', date: '', status: 'pending', dueDate: '2024-02-15', notes: '' },
    { id: 4, name: 'হেপাটাইটিস বি (১ম ডোজ)', date: '', status: 'pending', dueDate: '2024-02-15', notes: '' },
    { id: 5, name: 'DPT (২য় ডোজ)', date: '', status: 'pending', dueDate: '2024-03-15', notes: '' },
    { id: 6, name: 'পোলিও (২য় ডোজ)', date: '', status: 'pending', dueDate: '2024-03-15', notes: '' }
  ])

  function handleMotherChange(field, value) {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setMotherData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }))
    } else {
      setMotherData(prev => ({ ...prev, [field]: value }))
    }
  }

  function handleChildChange(field, value) {
    setChildData(prev => ({ ...prev, [field]: value }))
  }

  function addMedicine() {
    const newMedicine = {
      id: medicines.length + 1,
      name: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      dose: '',
      reason: ''
    }
    setMedicines([...medicines, newMedicine])
  }

  function updateMedicine(id, field, value) {
    setMedicines(medicines.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  function deleteMedicine(id) {
    setMedicines(medicines.filter(m => m.id !== id))
  }

  function updateVaccination(id, field, value) {
    setVaccinations(vaccinations.map(v => {
      if (v.id === id) {
        const updated = { ...v, [field]: value }
        if (field === 'date' && value) {
          updated.status = 'completed'
        }
        return updated
      }
      return v
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
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
            <FaBaby className="text-4xl" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold mb-2">মাতৃ ও শিশু স্বাস্থ্য</h1>
            <p className="text-lg text-white/90">
              মায়ের এবং শিশুর স্বাস্থ্য তথ্য ট্র্যাক করুন
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 bg-white rounded-2xl p-2 shadow-lg border">
        <button
          onClick={() => setActiveTab('mother')}
          className={`flex-1 px-6 py-4 rounded-xl font-bold transition flex items-center justify-center gap-3 ${
            activeTab === 'mother'
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaUser className="text-xl" />
          <span>মা</span>
        </button>
        <button
          onClick={() => setActiveTab('child')}
          className={`flex-1 px-6 py-4 rounded-xl font-bold transition flex items-center justify-center gap-3 ${
            activeTab === 'child'
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaBaby className="text-xl" />
          <span>শিশু</span>
        </button>
      </div>

      {/* Mother Section */}
      {activeTab === 'mother' && (
        <div className="space-y-6">
          {/* Personal Info */}
          <section className="bg-white rounded-2xl p-6 border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-pink-100 rounded-xl">
                <FaUser className="text-pink-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-extrabold">ব্যক্তিগত তথ্য</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">নাম</label>
                <input
                  type="text"
                  value={motherData.name}
                  onChange={(e) => handleMotherChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="মায়ের নাম"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">বয়স</label>
                <input
                  type="number"
                  value={motherData.age}
                  onChange={(e) => handleMotherChange('age', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="বয়স"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">রক্তের গ্রুপ</label>
                <select
                  value={motherData.bloodGroup}
                  onChange={(e) => handleMotherChange('bloodGroup', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">শেষ মাসিক তারিখ</label>
                <input
                  type="date"
                  value={motherData.lastMenstrualPeriod}
                  onChange={(e) => handleMotherChange('lastMenstrualPeriod', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">গর্ভাবস্থার সপ্তাহ</label>
                <input
                  type="number"
                  value={motherData.pregnancyWeek}
                  onChange={(e) => handleMotherChange('pregnancyWeek', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="সপ্তাহ"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">প্রত্যাশিত তারিখ</label>
                <input
                  type="date"
                  value={motherData.dueDate}
                  onChange={(e) => handleMotherChange('dueDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          </section>

          {/* Health Metrics */}
          <section className="bg-white rounded-2xl p-6 border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FaHeartbeat className="text-purple-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-extrabold">স্বাস্থ্য পরিমাপ</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaWeight /> ওজন (কেজি)
                </label>
                <input
                  type="number"
                  value={motherData.weight}
                  onChange={(e) => handleMotherChange('weight', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="ওজন"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaRulerVertical /> উচ্চতা (সেমি)
                </label>
                <input
                  type="number"
                  value={motherData.height}
                  onChange={(e) => handleMotherChange('height', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="উচ্চতা"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaThermometerHalf /> রক্তচাপ
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={motherData.bloodPressure.systolic}
                    onChange={(e) => handleMotherChange('bloodPressure.systolic', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="উচ্চ"
                  />
                  <span className="self-center">/</span>
                  <input
                    type="number"
                    value={motherData.bloodPressure.diastolic}
                    onChange={(e) => handleMotherChange('bloodPressure.diastolic', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="নিম্ন"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">হিমোগ্লোবিন (gm/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={motherData.hemoglobin}
                  onChange={(e) => handleMotherChange('hemoglobin', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="হিমোগ্লোবিন"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">রক্ত শর্করা (mg/dL)</label>
                <input
                  type="number"
                  value={motherData.bloodSugar}
                  onChange={(e) => handleMotherChange('bloodSugar', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="রক্ত শর্করা"
                />
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="bg-white rounded-2xl p-6 border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <FaNotesMedical className="text-yellow-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-extrabold">নোট</h2>
            </div>
            <textarea
              value={motherData.notes}
              onChange={(e) => handleMotherChange('notes', e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="মায়ের স্বাস্থ্য সম্পর্কিত গুরুত্বপূর্ণ নোট..."
            />
          </section>
        </div>
      )}

      {/* Child Section */}
      {activeTab === 'child' && (
        <div className="space-y-6">
          {/* Child Info */}
          <section className="bg-white rounded-2xl p-6 border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gray-100 rounded-xl">
                <FaBaby className="text-blue-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-extrabold">শিশুর তথ্য</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">শিশুর নাম</label>
                <input
                  type="text"
                  value={childData.name}
                  onChange={(e) => handleChildChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="শিশুর নাম"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">জন্ম তারিখ</label>
                <input
                  type="date"
                  value={childData.birthDate}
                  onChange={(e) => handleChildChange('birthDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">বয়স</label>
                <input
                  type="text"
                  value={childData.age}
                  onChange={(e) => handleChildChange('age', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="উদা: ১ বছর ২ মাস"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">রক্তের গ্রুপ</label>
                <select
                  value={childData.bloodGroup}
                  onChange={(e) => handleChildChange('bloodGroup', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ওজন (কেজি)</label>
                <input
                  type="number"
                  step="0.1"
                  value={childData.weight}
                  onChange={(e) => handleChildChange('weight', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ওজন"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">উচ্চতা (সেমি)</label>
                <input
                  type="number"
                  value={childData.height}
                  onChange={(e) => handleChildChange('height', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="উচ্চতা"
                />
              </div>
            </div>
          </section>

          {/* Medicine Records */}
          <section className="bg-white rounded-2xl p-6 border shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <FaPills className="text-green-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-extrabold">ঔষধ রেকর্ড</h2>
              </div>
              <button
                onClick={addMedicine}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition"
              >
                + যোগ করুন
              </button>
            </div>
            <div className="space-y-4">
              {medicines.map((medicine) => (
                <div key={medicine.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                  <div className="grid md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">ঔষধের নাম</label>
                      <input
                        type="text"
                        value={medicine.name}
                        onChange={(e) => updateMedicine(medicine.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        placeholder="ঔষধের নাম"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">তারিখ</label>
                      <input
                        type="date"
                        value={medicine.date}
                        onChange={(e) => updateMedicine(medicine.id, 'date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">সময়</label>
                      <input
                        type="time"
                        value={medicine.time}
                        onChange={(e) => updateMedicine(medicine.id, 'time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">ডোজ</label>
                      <input
                        type="text"
                        value={medicine.dose}
                        onChange={(e) => updateMedicine(medicine.id, 'dose', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        placeholder="ডোজ"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <input
                        type="text"
                        value={medicine.reason}
                        onChange={(e) => updateMedicine(medicine.id, 'reason', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        placeholder="কারণ"
                      />
                      <button
                        onClick={() => deleteMedicine(medicine.id)}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Vaccination Schedule */}
          <section className="bg-white rounded-2xl p-6 border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-100 rounded-xl">
                <FaCalendarCheck className="text-orange-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-extrabold">টিকা সিডিউল</h2>
            </div>
            <div className="space-y-4">
              {vaccinations.map((vaccine) => (
                <div
                  key={vaccine.id}
                  className={`border-2 rounded-xl p-4 ${
                    vaccine.status === 'completed'
                      ? 'border-green-300 bg-green-50'
                      : 'border-orange-300 bg-orange-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {vaccine.status === 'completed' ? (
                        <FaCheckCircle className="text-green-600 text-xl" />
                      ) : (
                        <FaExclamationCircle className="text-orange-600 text-xl" />
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900">{vaccine.name}</h3>
                        <p className="text-sm text-gray-600">
                          {vaccine.status === 'completed' ? 'সম্পন্ন হয়েছে' : `প্রত্যাশিত তারিখ: ${vaccine.dueDate}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">টিকা গ্রহণের তারিখ</label>
                      <input
                        type="date"
                        value={vaccine.date}
                        onChange={(e) => updateVaccination(vaccine.id, 'date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">নোট</label>
                      <input
                        type="text"
                        value={vaccine.notes}
                        onChange={(e) => updateVaccination(vaccine.id, 'notes', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        placeholder="নোট"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Child Notes */}
          <section className="bg-white rounded-2xl p-6 border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <FaNotesMedical className="text-yellow-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-extrabold">নোট</h2>
            </div>
            <textarea
              value={childData.notes}
              onChange={(e) => handleChildChange('notes', e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="শিশুর স্বাস্থ্য সম্পর্কিত গুরুত্বপূর্ণ নোট..."
            />
          </section>
        </div>
      )}
    </div>
  )
}


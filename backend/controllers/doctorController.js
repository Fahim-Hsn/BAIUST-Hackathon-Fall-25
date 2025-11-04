import { Doctor } from '../models/doctorModel.js';

const useMemory = String(process.env.SKIP_DB).toLowerCase() === 'true';
const memoryDoctors = [
  {
    _id: '1',
    name: 'ডাঃ আহমেদ হাসান',
    specialty: 'মানসিক',
    phone: '01712345678',
    hospital: 'ঢাকা মেডিকেল কলেজ',
    location: 'ঢাকা',
    area: 'রমনা',
    address: 'রমনা, ঢাকা',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'ডাঃ ফাতেমা বেগম',
    specialty: 'শারীরিক',
    phone: '01987654321',
    hospital: 'চট্টগ্রাম মেডিকেল কলেজ',
    location: 'চট্টগ্রাম',
    area: 'আগরতলা',
    address: 'আগরতলা, চট্টগ্রাম',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'ডাঃ রহমান মিয়া',
    specialty: 'হৃদরোগ',
    phone: '01876543210',
    hospital: 'ন্যাশনাল হার্ট ইনস্টিটিউট',
    location: 'ঢাকা',
    area: 'শেরে বাংলা',
    address: 'শেরে বাংলা নগর, ঢাকা',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '4',
    name: 'ডাঃ সুমাইয়া খাতুন',
    specialty: 'শিশু',
    phone: '01654321098',
    hospital: 'শিশু হাসপাতাল',
    location: 'ঢাকা',
    area: 'ঢাকা',
    address: 'শ্যামলী, ঢাকা',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '5',
    name: 'ডাঃ করিম উদ্দিন',
    specialty: 'সাধারণ',
    phone: '01543210987',
    hospital: 'সরকারি হাসপাতাল',
    location: 'রাজশাহী',
    area: 'রাজশাহী',
    address: 'রাজশাহী সদর',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '6',
    name: 'ডাঃ নাজমা আক্তার',
    specialty: 'নার্সিং',
    phone: '01432109876',
    hospital: 'নার্সিং হোম',
    location: 'সিলেট',
    area: 'সিলেট',
    address: 'সিলেট সদর',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '7',
    name: 'ডাঃ মোশাররফ হোসেন',
    specialty: 'মানসিক',
    phone: '01321098765',
    hospital: 'মানসিক স্বাস্থ্য ইনস্টিটিউট',
    location: 'ঢাকা',
    area: 'পল্লবী',
    address: 'পল্লবী, ঢাকা',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '8',
    name: 'ডাঃ রোকেয়া সুলতানা',
    specialty: 'শারীরিক',
    phone: '01210987654',
    hospital: 'জেনারেল হাসপাতাল',
    location: 'খুলনা',
    area: 'খুলনা',
    address: 'খুলনা সদর',
    available: true,
    createdAt: new Date().toISOString()
  }
];

export async function getAllDoctors(req, res, next) {
  try {
    console.log('getAllDoctors called, useMemory:', useMemory);
    console.log('memoryDoctors count:', memoryDoctors.length);
    
    if (useMemory) {
      console.log('Returning memory doctors:', memoryDoctors.length);
      return res.json(memoryDoctors);
    }
    
    // Try DB, fallback to memory if fails
    try {
      const doctors = await Doctor.find({ available: true }).sort({ name: 1 });
      console.log('Returning DB doctors:', doctors.length);
      if (doctors && doctors.length > 0) {
        return res.json(doctors);
      }
    } catch (dbErr) {
      console.warn('DB query failed, using memory doctors:', dbErr.message);
    }
    
    // Fallback to memory doctors
    console.log('Using memory doctors as fallback:', memoryDoctors.length);
    return res.json(memoryDoctors);
  } catch (err) {
    console.error('getAllDoctors error:', err);
    // Last resort: return memory doctors even on error
    return res.json(memoryDoctors);
  }
}

export async function getDoctorById(req, res, next) {
  try {
    const { id } = req.params;
    if (useMemory) {
      const doctor = memoryDoctors.find(d => d._id === id);
      if (!doctor) return res.status(404).json({ message: 'ডাক্তার পাওয়া যায়নি' });
      return res.json(doctor);
    }
    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: 'ডাক্তার পাওয়া যায়নি' });
    res.json(doctor);
  } catch (err) { next(err); }
}

export async function getDoctorsBySpecialty(req, res, next) {
  try {
    const { specialty } = req.params;
    if (useMemory) {
      const doctors = memoryDoctors.filter(d => d.specialty === specialty && d.available);
      return res.json(doctors);
    }
    const doctors = await Doctor.find({ specialty, available: true }).sort({ name: 1 });
    res.json(doctors);
  } catch (err) { next(err); }
}

export async function searchDoctors(req, res, next) {
  try {
    const { query, specialty, location } = req.query;
    
    // If no filters, return all doctors
    if (!query && !specialty && !location) {
      if (useMemory) {
        return res.json(memoryDoctors.filter(d => d.available));
      }
      const doctors = await Doctor.find({ available: true }).sort({ name: 1 });
      return res.json(doctors);
    }

    let searchQuery = { available: true };
    
    if (specialty && specialty !== 'সব' && specialty !== 'null') {
      searchQuery.specialty = specialty;
    }
    
    if (location) {
      searchQuery.$or = [
        { location: { $regex: location, $options: 'i' } },
        { area: { $regex: location, $options: 'i' } }
      ];
    }
    
    if (query) {
      const nameOrHospital = [
        { name: { $regex: query, $options: 'i' } },
        { hospital: { $regex: query, $options: 'i' } }
      ];
      
      if (searchQuery.$or) {
        searchQuery.$and = [
          { $or: searchQuery.$or },
          { $or: nameOrHospital }
        ];
        delete searchQuery.$or;
      } else {
        searchQuery.$or = nameOrHospital;
      }
    }

    if (useMemory) {
      let doctors = memoryDoctors.filter(d => d.available);
      
      if (specialty && specialty !== 'সব' && specialty !== 'null') {
        doctors = doctors.filter(d => d.specialty === specialty);
      }
      
      if (location) {
        doctors = doctors.filter(d => 
          d.location.toLowerCase().includes(location.toLowerCase()) ||
          (d.area && d.area.toLowerCase().includes(location.toLowerCase()))
        );
      }
      
      if (query) {
        doctors = doctors.filter(d =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.hospital.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      return res.json(doctors);
    }

    const doctors = await Doctor.find(searchQuery).sort({ name: 1 });
    res.json(doctors);
  } catch (err) { 
    console.error('Search doctors error:', err);
    next(err); 
  }
}

export async function createDoctor(req, res, next) {
  try {
    const { name, specialty, phone, hospital, location, area, address } = req.body;
    if (!name || !specialty || !phone || !hospital || !location) {
      return res.status(400).json({ message: 'name, specialty, phone, hospital, location প্রয়োজন' });
    }
    if (useMemory) {
      const doctor = {
        _id: `${Date.now()}-${Math.random()}`,
        name,
        specialty,
        phone,
        hospital,
        location,
        area: area || '',
        address: address || '',
        available: true,
        createdAt: new Date().toISOString()
      };
      memoryDoctors.push(doctor);
      return res.status(201).json(doctor);
    }
    const doctor = await Doctor.create({
      name,
      specialty,
      phone,
      hospital,
      location,
      area: area || '',
      address: address || '',
      available: true
    });
    res.status(201).json(doctor);
  } catch (err) { next(err); }
}


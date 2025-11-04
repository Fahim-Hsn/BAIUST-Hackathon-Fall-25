import { User } from '../models/userModel.js';

const useMemory = String(process.env.SKIP_DB).toLowerCase() === 'true';
const memoryUsers = [];

function normalizePhone(phone) {
  return String(phone).replace(/\s|-/g, '');
}

export async function register(req, res, next) {
  try {
    let { name, phone, dob } = req.body;
    name = String(name || '').trim();
    phone = normalizePhone(phone || '');
    dob = String(dob || '').trim();

    if (!name || !phone || !dob) {
      return res.status(400).json({ message: 'name, phone, dob প্রয়োজন' });
    }
    // Basic validation
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      return res.status(400).json({ message: 'DOB ফরম্যাট YYYY-MM-DD হতে হবে' });
    }
    if (!/^\d{6,}$/.test(phone)) {
      return res.status(400).json({ message: 'ফোন নম্বর সঠিক নয়' });
    }

    if (useMemory) {
      const exists = memoryUsers.find(u => u.phone === phone && u.dob === dob);
      if (exists) return res.status(409).json({ message: 'ইতিমধ্যে নিবন্ধিত' });
      const user = { _id: `${Date.now()}-${Math.random()}`, name, phone, dob, createdAt: new Date().toISOString() };
      memoryUsers.push(user);
      return res.status(201).json(user);
    }

    const exists = await User.findOne({ phone, dob });
    if (exists) return res.status(409).json({ message: 'ইতিমধ্যে নিবন্ধিত' });
    // Explicitly only include name, phone, dob to avoid validation errors for optional fields
    const user = await User.create({ name, phone, dob });
    res.status(201).json(user);
  } catch (err) {
    console.error('Register error:', err);
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'ইতিমধ্যে নিবন্ধিত' });
    }
    res.status(400).json({ message: err?.message || 'রেজিস্ট্রেশনে সমস্যা হয়েছে' });
  }
}

export async function login(req, res, next) {
  try {
    let { name, phone, dob } = req.body;
    if (!phone || !dob) return res.status(400).json({ message: 'phone, dob প্রয়োজন' });
    phone = normalizePhone(phone);

    if (useMemory) {
      const user = memoryUsers.find(u => u.phone === phone && u.dob === dob);
      if (!user) return res.status(404).json({ message: 'ব্যবহারকারী পাওয়া যায়নি' });
      if (name && user.name !== name) user.name = name; // নাম আপডেট
      return res.json(user);
    }
    let user = await User.findOne({ phone, dob });
    if (!user) return res.status(404).json({ message: 'ব্যবহারকারী পাওয়া যায়নি' });
    if (name && user.name !== name) {
      user.name = name;
      await user.save();
    }
    res.json(user);
  } catch (err) { next(err); }
}

export async function recover(req, res, next) {
  try {
    let { name, phone, dob } = req.body;
    if (!phone || !dob) return res.status(400).json({ message: 'phone, dob প্রয়োজন' });
    phone = normalizePhone(phone);
    if (useMemory) {
      const user = memoryUsers.find(u => u.phone === phone && u.dob === dob);
      if (!user) return res.status(404).json({ message: 'ডেটা পাওয়া যায়নি' });
      if (name && user.name !== name) user.name = name;
      return res.json(user);
    }
    let user = await User.findOne({ phone, dob });
    if (!user) return res.status(404).json({ message: 'ডেটা পাওয়া যায়নি' });
    if (name && user.name !== name) {
      user.name = name;
      await user.save();
    }
    res.json(user);
  } catch (err) { next(err); }
}

export async function getProfile(req, res, next) {
  try {
    const { id } = req.params;
    if (useMemory) {
      const user = memoryUsers.find(u => u._id === id);
      if (!user) return res.status(404).json({ message: 'ব্যবহারকারী পাওয়া যায়নি' });
      return res.json(user);
    }
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'ব্যবহারকারী পাওয়া যায়নি' });
    res.json(user);
  } catch (err) { next(err); }
}

function calculateBMI(weight, height) {
  // weight in kg, height in cm
  if (!weight || !height || height <= 0) return null;
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

export async function updateProfile(req, res, next) {
  try {
    const { id } = req.params;
    const { 
      name, phone, dob, 
      gender, maritalStatus, address, occupation,
      weight, height, 
      bloodPressureSystolic, bloodPressureDiastolic,
      healthDetails 
    } = req.body;
    
    // Calculate BMI if weight and height provided
    const bmi = (weight && height) ? calculateBMI(Number(weight), Number(height)) : null;
    
    if (useMemory) {
      const idx = memoryUsers.findIndex(u => u._id === id);
      if (idx === -1) return res.status(404).json({ message: 'ব্যবহারকারী পাওয়া যায়নি' });
      const updated = {
        ...memoryUsers[idx],
        name: name ?? memoryUsers[idx].name,
        phone: phone ? normalizePhone(phone) : memoryUsers[idx].phone,
        dob: dob ?? memoryUsers[idx].dob,
        gender: (gender !== undefined && gender !== '' && gender !== null) ? gender : memoryUsers[idx].gender,
        maritalStatus: (maritalStatus !== undefined && maritalStatus !== '' && maritalStatus !== null) ? maritalStatus : memoryUsers[idx].maritalStatus,
        address: address !== undefined ? String(address).trim() : memoryUsers[idx].address,
        occupation: occupation !== undefined ? String(occupation).trim() : memoryUsers[idx].occupation,
        weight: weight !== undefined ? Number(weight) : memoryUsers[idx].weight,
        height: height !== undefined ? Number(height) : memoryUsers[idx].height,
        bmi: bmi !== null ? bmi : memoryUsers[idx].bmi,
        bloodPressureSystolic: bloodPressureSystolic !== undefined ? Number(bloodPressureSystolic) : memoryUsers[idx].bloodPressureSystolic,
        bloodPressureDiastolic: bloodPressureDiastolic !== undefined ? Number(bloodPressureDiastolic) : memoryUsers[idx].bloodPressureDiastolic,
        healthDetails: healthDetails !== undefined ? String(healthDetails).trim() : memoryUsers[idx].healthDetails,
        updatedAt: new Date().toISOString()
      };
      memoryUsers[idx] = updated;
      return res.json(updated);
    }
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = normalizePhone(phone);
    if (dob !== undefined) updateData.dob = dob;
    // Only set gender/maritalStatus if they have valid non-empty values
    if (gender !== undefined && gender !== '' && gender !== null) updateData.gender = gender;
    if (maritalStatus !== undefined && maritalStatus !== '' && maritalStatus !== null) updateData.maritalStatus = maritalStatus;
    if (address !== undefined) updateData.address = String(address).trim();
    if (occupation !== undefined) updateData.occupation = String(occupation).trim();
    if (weight !== undefined) updateData.weight = Number(weight);
    if (height !== undefined) updateData.height = Number(height);
    if (bmi !== null) updateData.bmi = bmi;
    if (bloodPressureSystolic !== undefined) updateData.bloodPressureSystolic = Number(bloodPressureSystolic);
    if (bloodPressureDiastolic !== undefined) updateData.bloodPressureDiastolic = Number(bloodPressureDiastolic);
    if (healthDetails !== undefined) updateData.healthDetails = String(healthDetails).trim();
    
    const updated = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'ব্যবহারকারী পাওয়া যায়নি' });
    res.json(updated);
  } catch (err) {
    // Handle uniqueness conflict for phone+dob
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'এই ফোন/জন্মতারিখে ব্যবহারকারী আছে' });
    }
    next(err);
  }
}



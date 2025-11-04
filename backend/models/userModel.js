import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    dob: { type: String, required: true, trim: true }, // ISO date string (YYYY-MM-DD)
    gender: { type: String, enum: ['male', 'female', 'other'], required: false },
    maritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed'], required: false },
    address: { type: String, trim: true },
    occupation: { type: String, trim: true },
    // Health information
    weight: { type: Number }, // kg
    height: { type: Number }, // cm
    bmi: { type: Number },
    bloodPressureSystolic: { type: Number }, // mmHg
    bloodPressureDiastolic: { type: Number }, // mmHg
    healthDetails: { type: String, trim: true }, // Additional health notes
  },
  { timestamps: true }
);

// Composite uniqueness: a user is uniquely identified by phone+dob
userSchema.index({ phone: 1, dob: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);



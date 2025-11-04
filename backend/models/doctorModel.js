import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { 
      type: String, 
      required: true, 
      enum: ['মানসিক', 'শারীরিক', 'হৃদরোগ', 'শিশু', 'নার্সিং', 'সাধারণ', 'অন্যান্য'] 
    },
    phone: { type: String, required: true, trim: true },
    hospital: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    area: { type: String, trim: true },
    address: { type: String, trim: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

doctorSchema.index({ specialty: 1, available: 1 });

export const Doctor = mongoose.model('Doctor', doctorSchema);


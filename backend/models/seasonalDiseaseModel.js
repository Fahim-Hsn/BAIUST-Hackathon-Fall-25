import mongoose from 'mongoose';

const seasonalDiseaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // রোগের নাম
    season: { type: String, required: true, enum: ['বর্ষা', 'শীত', 'গ্রীষ্ম', 'শরৎ', 'সবসময়'] },
    symptoms: [{ type: String }], // লক্ষণসমূহ
    details: { type: String, required: true, trim: true }, // বিস্তারিত বিবরণ
    prevention: [{ type: String }], // প্রতিরোধের উপায়
    treatment: { type: String, required: true, trim: true }, // চিকিৎসা/সমাধান
    solution: { type: String, trim: true }, // সমাধান
    tips: [{ type: String }], // টিপস
    severity: { type: String, enum: ['হালকা', 'মাঝারি', 'তীব্র'], default: 'মাঝারি' },
  },
  { timestamps: true }
);

export const SeasonalDisease = mongoose.model('SeasonalDisease', seasonalDiseaseSchema);


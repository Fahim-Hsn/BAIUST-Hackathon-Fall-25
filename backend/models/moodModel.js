import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    mood: {
      type: String,
      required: true,
      enum: ['khushi', 'dukhi', 'chinta', 'shanto', 'rog', 'onnanno']
    },
    note: { type: String }
  },
  { timestamps: { createdAt: 'date', updatedAt: 'updatedAt' } }
);

export const Mood = mongoose.model('Mood', moodSchema);



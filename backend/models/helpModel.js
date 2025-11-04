import mongoose from 'mongoose';

const helpSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['manoshik', 'sharirik', 'arthik', 'onnanno']
    },
    description: { type: String, required: true },
    location: { type: String },
  },
  { timestamps: true }
);

export const Help = mongoose.model('Help', helpSchema);



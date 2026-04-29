import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String },
  atsScore: { type: Number, default: 0 },
  extractedSkills: [{ type: String }],
  suggestions: [{
    type: { type: String, enum: ['good', 'improve', 'warning'] },
    text: String,
  }],
  predictedSalary: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },
  recommendedRoles: [{
    title: String,
    match: Number,
  }],
  analyzedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);

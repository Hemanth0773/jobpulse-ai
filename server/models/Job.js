import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  description: { type: String, default: '' },
  requirements: [{ type: String }],
  salary: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },
  location: { type: String, default: 'Remote' },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Hybrid', 'On-site', 'Remote'], default: 'Full-time' },
  domain: { type: String, default: 'General' },
  tags: [{ type: String }],
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

jobSchema.index({ title: 'text', company: 'text', domain: 'text' });

export default mongoose.model('Job', jobSchema);

import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, required: true }, // Бүтэн цаг, Хагас цаг, etc.
  sector: { type: String, required: true },
  location: { type: String, required: true },
  deadline: { type: String, required: true },
  salFrom: { type: Number, default: null },
  salTo: { type: Number, default: null },
  description: { type: String, required: true },
  benefits: { type: String, default: '' },
  workHours: { type: String, default: '09:00–18:00' },
  workDays: { type: String, default: '5 өдөр' },
  workEnvironment: { type: String, default: 'Оффис' },
  education: { type: String, default: 'Хамаарахгүй' },
  experience: { type: String, default: 'Шаардахгүй' },
  gender: { type: String, default: 'Хамаарахгүй' },
  ageRange: { type: String, default: 'Хамаарахгүй' },
  skills: [{ type: String }],
  requirements: [{ type: String }],
  extra: { type: String, default: '' },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, default: '' },
  plan: { type: String, default: 'Үнэгүй' },
  status: { type: String, enum: ['pending', 'active', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

jobSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

const Job = mongoose.model('Job', jobSchema)
export default Job
import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  seekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  cv: { type: String, default: null },
  coverLetter: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'viewed', 'shortlisted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
})

const Application = mongoose.model('Application', applicationSchema)
export default Application
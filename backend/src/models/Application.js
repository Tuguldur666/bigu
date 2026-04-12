import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  seekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['new', 'seen', 'shortlisted', 'rejected', 'hired'], default: 'new' },
  coverLetter: { type: String, default: '' },
  appliedAt: { type: Date, default: Date.now }
})

const Application = mongoose.model('Application', applicationSchema)
export default Application
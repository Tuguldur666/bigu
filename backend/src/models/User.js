import mongoose from 'mongoose'

// User Schema
const userSchema = new mongoose.Schema({
  lastname: { type: String, required: true },
  firstname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['seeker', 'employer'], required: true },
  
  // Ажил хайгч (Job Seeker) fields
  profession: { type: String, default: null },
  experience: { type: String, default: null },
  
  // Ажил олгогч (Employer) fields
  companyName: { type: String, default: null },
  sector: { type: String, default: null },
  employees: { type: String, default: null },
  logo: { type: String, default: null },
  backgroundImage: { type: String, default: null },
  description: { type: String, default: null },
  website: { type: String, default: null },
  address: { type: String, default: null },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

userSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

const User = mongoose.model('User', userSchema)
export default User
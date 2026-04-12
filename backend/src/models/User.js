import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  lastname: { type: String, required: true },
  firstname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['seeker', 'employer'], required: true },
  
  // Ажил хайгч (Job Seeker) fields - Хувийн мэдээлэл
  birthDate: { type: String, default: null },
  gender: { type: String, default: null },
  address: { type: String, default: null },
  photo: { type: String, default: null },
  
  // Боловсрол (Education)
  education: [{
    school: { type: String, default: null },
    degree: { type: String, default: null },
    field: { type: String, default: null },
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
    description: { type: String, default: null }
  }],
  
  // Ажлын туршлага (Work Experience)
  experience: [{
    company: { type: String, default: null },
    position: { type: String, default: null },
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, default: null }
  }],
  
  // Ур чадвар (Skills)
  skills: [{ type: String }],
  languages: [{ type: String }],
  computerSkills: [{ type: String }],
  
  // Сертификат, сургалт
  certificates: [{
    name: { type: String, default: null },
    issuer: { type: String, default: null },
    date: { type: String, default: null },
    description: { type: String, default: null }
  }],
  
  // Хувийн танилцуулга
  about: { type: String, default: null },
  careerGoal: { type: String, default: null },
  
  // Нэмэлт мэдээлэл
  hobbies: [{ type: String }],
  awards: [{ type: String }],
  references: [{
    name: { type: String, default: null },
    position: { type: String, default: null },
    phone: { type: String, default: null },
    email: { type: String, default: null }
  }],
  
  // CV file
  cv: { type: String, default: null },
  
  // Ажил олгогч (Employer) fields
  companyName: { type: String, default: null },
  sector: { type: String, default: null },
  employees: { type: String, default: null },
  logo: { type: String, default: null },
  backgroundImage: { type: String, default: null },
  description: { type: String, default: null },
  website: { type: String, default: null },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

userSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

const User = mongoose.model('User', userSchema)
export default User
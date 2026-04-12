import { Router } from 'express'
import multer from 'multer'
import { fileURLToPath } from 'url'
import path from 'path'
import User from '../models/User.js'
import { authMiddleware } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    if (extname) {
      return cb(null, true)
    }
    cb(new Error('Зөвхөн зураг эсвэл PDF/DOC файл'))
  }
})

const router = Router()

router.get('/seeker', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' })
    }
    res.json({ user })
  } catch (error) {
    console.error('Get seeker error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
})

router.put('/seeker', authMiddleware, async (req, res) => {
  try {
    const {
      lastname, firstname, phone, birthDate, gender, address,
      education, experience, skills, languages, computerSkills,
      certificates, about, careerGoal, hobbies, awards, references
    } = req.body

    const updateData = {}
    if (lastname) updateData.lastname = lastname
    if (firstname) updateData.firstname = firstname
    if (phone) updateData.phone = phone
    if (birthDate) updateData.birthDate = birthDate
    if (gender) updateData.gender = gender
    if (address) updateData.address = address
    if (education) updateData.education = education
    if (experience) updateData.experience = experience
    if (skills) updateData.skills = skills
    if (languages) updateData.languages = languages
    if (computerSkills) updateData.computerSkills = computerSkills
    if (certificates) updateData.certificates = certificates
    if (about) updateData.about = about
    if (careerGoal) updateData.careerGoal = careerGoal
    if (hobbies) updateData.hobbies = hobbies
    if (awards) updateData.awards = awards
    if (references) updateData.references = references

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true })
    res.json({ message: 'Профайл шинэчлэгдлээ', user })
  } catch (error) {
    console.error('Update seeker error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
})

router.post('/seeker/photo', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл сонгоогүй байна' })
    }
    const photoUrl = `/uploads/${req.file.filename}`
    const user = await User.findByIdAndUpdate(req.user.id, { photo: photoUrl }, { new: true })
    res.json({ message: 'Зураг upload хийгдлээ', photo: photoUrl })
  } catch (error) {
    console.error('Photo upload error:', error)
    res.status(500).json({ error: 'Upload алдаа' })
  }
})

router.post('/seeker/cv', authMiddleware, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл сонгоогүй байна' })
    }
    const cvUrl = `/uploads/${req.file.filename}`
    const user = await User.findByIdAndUpdate(req.user.id, { cv: cvUrl }, { new: true })
    res.json({ message: 'CV upload хийгдлээ', cv: cvUrl })
  } catch (error) {
    console.error('CV upload error:', error)
    res.status(500).json({ error: 'Upload алдаа' })
  }
})

router.post('/seeker/certificate-upload', authMiddleware, upload.single('certificate'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл сонгоогүй байна' })
    }
    const fileUrl = `/uploads/${req.file.filename}`
    res.json({ message: 'Сертификат файл upload хийгдлээ', file: fileUrl })
  } catch (error) {
    console.error('Certificate upload error:', error)
    res.status(500).json({ error: 'Upload алдаа' })
  }
})

export default router
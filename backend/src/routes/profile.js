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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) {
      return cb(null, true)
    }
    cb(new Error('Зөвхөн зураг файлууд (jpg, png, gif)'))
  }
})

const router = Router()

const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 1 }
])

router.post('/upload', authMiddleware, uploadFields, async (req, res) => {
  try {
    const updateData = {}
    
    if (req.files?.logo) {
      updateData.logo = `/uploads/${req.files.logo[0].filename}`
    }
    if (req.files?.backgroundImage) {
      updateData.backgroundImage = `/uploads/${req.files.backgroundImage[0].filename}`
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Файл сонгоогүй байна' })
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    )

    res.json({ 
      message: 'Амжилттай Upload хийгдлээ', 
      logo: user.logo,
      backgroundImage: user.backgroundImage
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
})

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' })
    }

    const userInfo = {
      id: user._id,
      lastname: user.lastname,
      firstname: user.firstname,
      email: user.email,
      phone: user.phone,
      type: user.type,
      companyName: user.companyName,
      sector: user.sector,
      employees: user.employees,
      logo: user.logo,
      backgroundImage: user.backgroundImage,
      description: user.description,
      website: user.website,
      address: user.address
    }

    res.json({ user: userInfo })
  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
})

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { companyName, sector, employees, lastname, firstname, phone, description, website, address } = req.body

    const updateData = {}
    if (companyName) updateData.companyName = companyName
    if (sector) updateData.sector = sector
    if (employees) updateData.employees = employees
    if (lastname) updateData.lastname = lastname
    if (firstname) updateData.firstname = firstname
    if (phone) updateData.phone = phone
    if (description) updateData.description = description
    if (website) updateData.website = website
    if (address) updateData.address = address

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    )

    res.json({ 
      message: 'Профайл амжилттай шинэчлэгдлээ',
      user: {
        id: user._id,
        lastname: user.lastname,
        firstname: user.firstname,
        companyName: user.companyName,
        sector: user.sector,
        employees: user.employees,
        logo: user.logo,
        backgroundImage: user.backgroundImage,
        description: user.description,
        website: user.website,
        address: user.address
      }
    })
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
})

export default router
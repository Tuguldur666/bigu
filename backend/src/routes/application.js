import { Router } from 'express'
import multer from 'multer'
import { fileURLToPath } from 'url'
import path from 'path'
import { applyToJob, getMyApplications, getJobApplications } from '../controllers/applicationController.js'
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
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      return cb(null, true)
    }
    cb(new Error('Зөвхөн PDF файл'))
  }
})

const router = Router()

router.post('/apply', authMiddleware, upload.single('cv'), applyToJob)
router.get('/my', authMiddleware, getMyApplications)
router.get('/job/:jobId', authMiddleware, getJobApplications)

export default router
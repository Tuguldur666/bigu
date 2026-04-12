import { Router } from 'express'
import { registerSeeker, registerEmployer, login, getMe } from '../controllers/authController.js'
import { getMyJobs, createJob, getAllJobs, getJobById } from '../controllers/jobController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// Auth routes
router.post('/register/seeker', registerSeeker)
router.post('/register/employer', registerEmployer)
router.post('/login', login)
router.get('/me', getMe)

// Job routes
router.get('/jobs', authMiddleware, getMyJobs)
router.post('/jobs', authMiddleware, createJob)
router.get('/jobs/all', getAllJobs)
router.get('/jobs/:id', getJobById)

// Activate job (for testing)
router.put('/jobs/:id/activate', async (req, res) => {
  try {
    const Job = (await import('../models/Job.js')).default
    const job = await Job.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true })
    res.json({ message: 'Зар идэвхжлээ', job })
  } catch (error) {
    res.status(500).json({ error: 'Алдаа' })
  }
})

// Get company by ID
router.get('/company/:id', async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ error: 'Компани олдсонгүй' })
    }
    res.json({ user })
  } catch (error) {
    console.error('Get company error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
})

export default router
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.js'
import profileRoutes from './routes/profile.js'
import applicationRoutes from './routes/application.js'
import seekerRoutes from './routes/seeker.js'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/seeker', seekerRoutes)

app.get('/api/health', async (req, res) => {
  res.json({ status: 'ok', message: 'Zangia API is running', database: 'MongoDB' })
})

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}).catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
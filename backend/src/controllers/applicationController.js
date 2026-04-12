import Application from '../models/Application.js'
import Job from '../models/Job.js'
import User from '../models/User.js'

export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body
    
    if (!req.file) {
      return res.status(400).json({ error: 'CV файл сонгоно уу' })
    }

    const existingApp = await Application.findOne({ jobId, seekerId: req.user.id })
    if (existingApp) {
      return res.status(400).json({ error: 'Та аль хэдийн өргөдөл илгээсэн байна' })
    }

    const seeker = await User.findById(req.user.id)
    const cvPath = `/uploads/${req.file.filename}`

    const application = new Application({
      jobId,
      seekerId: req.user.id,
      name: `${seeker.lastname} ${seeker.firstname}`,
      email: seeker.email,
      phone: seeker.phone,
      cv: cvPath
    })

    await application.save()

    res.status(201).json({ message: 'Өргөдөл амжилттай илгээгдлээ', application })
  } catch (error) {
    console.error('Apply error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
}

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ seekerId: req.user.id })
      .populate('jobId', 'title location salary')
      .sort({ createdAt: -1 })
    res.json({ applications })
  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
}

export const getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('seekerId', 'firstname lastname email phone profession')
      .sort({ createdAt: -1 })
    res.json({ applications })
  } catch (error) {
    console.error('Get job applications error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
}
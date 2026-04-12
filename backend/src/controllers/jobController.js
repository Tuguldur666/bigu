import Job from '../models/Job.js'

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.user.id }).sort({ createdAt: -1 })
    res.json({ jobs })
  } catch (error) {
    console.error('Get jobs error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
}

export const createJob = async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      employerId: req.user.id
    })
    await job.save()
    res.status(201).json({ message: 'Ажлын зар амжилттай нийтлэгдлээ', job })
  } catch (error) {
    console.error('Create job error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
}

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: { $in: ['pending', 'active'] } })
      .sort({ createdAt: -1 })
      .populate('employerId', 'companyName logo sector')
    res.json({ jobs })
  } catch (error) {
    console.error('Get all jobs error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
}

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employerId', 'companyName logo sector email phone address')
    if (!job) {
      return res.status(404).json({ error: 'Зар олдсонгүй' })
    }
    res.json({ job })
  } catch (error) {
    console.error('Get job error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
}
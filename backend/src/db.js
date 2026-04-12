// In-memory database (replace with real DB in production)
export const users = []
export const jobs = []
export const applications = []

// Helper to find user by email
export const findUserByEmail = (email) => users.find(u => u.email === email)

// Helper to find user by phone
export const findUserByPhone = (phone) => users.find(u => u.phone === phone)

// Add new user
export const addUser = (user) => {
  users.push(user)
  return user
}

// Add new job
export const addJob = (job) => {
  jobs.push(job)
  return job
}

// Get jobs by employer
export const getJobsByEmployer = (employerId) => jobs.filter(j => j.employerId === employerId)

// Add application
export const addApplication = (application) => {
  applications.push(application)
  return application
}

// Get applications by job
export const getApplicationsByJob = (jobId) => applications.filter(a => a.jobId === jobId)
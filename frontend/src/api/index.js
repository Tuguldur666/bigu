const API_URL = 'http://localhost:3001/api'

export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('zangia_token')
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Алдаа гарлаа')
    }

    return data
  },

  async upload(endpoint, file) {
    const token = localStorage.getItem('zangia_token')
    const formData = new FormData()
    formData.append('logo', file)

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Upload алдаа')
    }

    return data
  },

  // Auth
  registerSeeker: (data) => api.request('/auth/register/seeker', { method: 'POST', body: JSON.stringify(data) }),
  registerEmployer: (data) => api.request('/auth/register/employer', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => api.request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => api.request('/auth/me', { method: 'GET' }),

  // Jobs
  getMyJobs: () => api.request('/auth/jobs', { method: 'GET' }),
  createJob: (data) => api.request('/auth/jobs', { method: 'POST', body: JSON.stringify(data) }),
  getAllJobs: () => api.request('/auth/jobs/all', { method: 'GET' }),
  getJobById: (id) => api.request(`/auth/jobs/${id}`, { method: 'GET' }),

  // Company
  getCompanyById: (id) => api.request(`/auth/company/${id}`, { method: 'GET' }),

  // Profile
  getProfile: () => api.request('/profile/profile', { method: 'GET' }),
  updateProfile: (data) => api.request('/profile/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Applications
  applyToJob: async (jobId, data, cvFile) => {
    const token = localStorage.getItem('zangia_token')
    const formData = new FormData()
    formData.append('jobId', jobId)
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('phone', data.phone || '')
    formData.append('coverLetter', data.coverLetter || '')
    if (cvFile) formData.append('cv', cvFile)

    const response = await fetch(`${API_URL}/applications/apply`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error || 'Алдаа гарлаа')
    }
    return result
  },

  getMyApplications: () => api.request('/applications/my', { method: 'GET' }),
  getJobApplications: (jobId) => api.request(`/applications/job/${jobId}`, { method: 'GET' }),

  // Seeker Profile
  getSeekerProfile: () => api.request('/seeker/seeker', { method: 'GET' }),
  updateSeekerProfile: (data) => api.request('/seeker/seeker', { method: 'PUT', body: JSON.stringify(data) }),
  uploadSeekerPhoto: async (file) => {
    const token = localStorage.getItem('zangia_token')
    const formData = new FormData()
    formData.append('photo', file)
    const response = await fetch(`${API_URL}/seeker/seeker/photo`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Upload алдаа')
    return data
  },
  uploadSeekerCV: async (file) => {
    const token = localStorage.getItem('zangia_token')
    const formData = new FormData()
    formData.append('cv', file)
    const response = await fetch(`${API_URL}/seeker/seeker/cv`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Upload алдаа')
    return data
  },
  uploadCertificate: async (file) => {
    const token = localStorage.getItem('zangia_token')
    const formData = new FormData()
    formData.append('certificate', file)
    const response = await fetch(`${API_URL}/seeker/seeker/certificate-upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Upload алдаа')
    return data
  },
}

export default api
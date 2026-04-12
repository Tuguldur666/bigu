import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState({ posts: 0, applications: 0, shortlist: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await api.getMyJobs()
        const userJobs = jobsRes.jobs || []
        setJobs(userJobs)
        
        let appCount = 0
        for (const job of userJobs) {
          const apps = await api.getJobApplications(job._id)
          appCount += (apps.applications?.length || 0)
        }
        setStats(s => ({ ...s, posts: userJobs.length, applications: appCount }))
      } catch (error) {
        console.log('No jobs yet')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const displayName = user?.companyName || user?.firstname || "Хэрэглэгч"

  const statusLabel = (status) => {
    if (status === "new") return "Шинэ"
    if (status === "seen") return "Харсан"
    return "Сонгосон"
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard__title">Түр хүлээнэ үү...</div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard__title">Сайн байна уу, {displayName}!</div>
      <div className="dashboard__stats">
        <div className="dashboard__stat">
          <div className="dashboard__stat-num">{stats.posts}</div>
          <div className="dashboard__stat-label">Нийтлэсэн зар</div>
        </div>
        <div className="dashboard__stat">
          <div className="dashboard__stat-num">{stats.applications}</div>
          <div className="dashboard__stat-label">Ирсэн өргөдөл</div>
        </div>
        <div className="dashboard__stat">
          <div className="dashboard__stat-num">{stats.shortlist}</div>
          <div className="dashboard__stat-label">Шортлист</div>
        </div>
      </div>
      <div className="dashboard__header">
        <div className="dashboard__header-title">Миний зарууд</div>
        <button className="btn btn--primary" onClick={() => navigate('/job-post')}>+ Зар нийтлэх ↗</button>
      </div>
      {jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
          <p>Та одоогоор ямар ч зар нийтлээгүй байна.</p>
          <button className="btn btn--primary" style={{ marginTop: 16 }} onClick={() => navigate('/job-post')}>
            + Шинэ зар нийтлэх
          </button>
        </div>
      ) : (
        <div className="dashboard__applicants">
          {jobs.map((job, i) => (
            <div key={i} className="applicant-item" onClick={() => navigate(`/job/${job._id}`)} style={{ cursor: 'pointer' }}>
              <div>
                <div className="applicant-item__name">{job.title}</div>
                <div className="applicant-item__meta">{job.sector} · {job.location}</div>
              </div>
              <span className="badge badge--new">{new Date(job.createdAt).toLocaleDateString('mn-MN')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
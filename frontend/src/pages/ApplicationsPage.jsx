import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function ApplicationsPage() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const myJobs = await api.getMyJobs()
      if (myJobs.jobs?.length > 0) {
        const allApps = []
        for (const job of myJobs.jobs) {
          try {
            const apps = await api.getJobApplications(job._id)
            allApps.push(...apps.applications.map(app => ({ ...app, jobTitle: job.title })))
          } catch (e) {}
        }
        setApplications(allApps)
      }
    } catch (error) {
      console.log('Error loading applications')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="dashboard"><div className="dashboard__title">Түр хүлээнэ үү...</div></div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard__title">Ирсэн өргөдөлүүд</div>
      
      {applications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
          Одоогоор өргөдөл байхгүй байна
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((app, i) => (
            <div key={i} className="application-card">
              <div className="application-card__header">
                <div className="application-card__avatar">
                  {app.seekerId?.firstname?.[0] || 'A'}
                </div>
                <div className="application-card__info">
                  <div className="application-card__name">
                    {app.seekerId?.firstname} {app.seekerId?.lastname}
                  </div>
                  <div className="application-card__job">Зар: {app.jobTitle}</div>
                  <div className="application-card__meta">
                    <span>📧 {app.email}</span>
                    <span>📞 {app.phone || 'Байхгүй'}</span>
                    <span>🕒 {new Date(app.createdAt).toLocaleDateString('mn-MN')}</span>
                  </div>
                </div>
                <div className="application-card__status">
                  <span className={`badge ${app.status === 'pending' ? 'badge--new' : app.status === 'shortlisted' ? 'badge--hired' : 'badge--seen'}`}>
                    {app.status === 'pending' ? 'Шинэ' : app.status === 'viewed' ? 'Харсан' : app.status === 'shortlisted' ? 'Сонгосон' : 'Татгалзсан'}
                  </span>
                </div>
              </div>
              {app.coverLetter && (
                <div className="application-card__letter">
                  <strong>Холбох захиа:</strong>
                  <p>{app.coverLetter}</p>
                </div>
              )}
              <div className="application-card__cv">
                {app.cv && (
                  <a href={`http://localhost:3001${app.cv}`} target="_blank" rel="noopener" className="btn btn--outline btn--sm">
                    📄 CV үзэх
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
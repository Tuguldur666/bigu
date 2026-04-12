import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const SECTOR_LABELS = {
  tech: 'Технологи',
  finance: 'Санхүү',
  retail: 'Эрхлэх',
  manufacture: 'Үйлдвэрлэл',
  education: 'Боловсрол',
  health: 'Эрүүл мэнд',
  other: 'Бусад'
}

export default function CompaniesPage() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const jobsRes = await api.getAllJobs()
      setJobs(jobsRes.jobs || [])
      
      const uniqueCompanies = {}
      ;(jobsRes.jobs || []).forEach(job => {
        if (job.employerId?._id) {
          uniqueCompanies[job.employerId._id] = job.employerId
        }
      })
      setCompanies(Object.values(uniqueCompanies))
    } catch (error) {
      console.log('Error loading data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Түр хүлээнэ үү...</div>
  }

  return (
    <div className="companies-page">
      <div className="section">
        <div className="section__header">
          <div className="section__title">Бүх компани ({companies.length})</div>
        </div>
        
        {companies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
            Одоогоор компани байхгүй байна
          </div>
        ) : (
          <div className="company-grid-large">
            {companies.map(comp => {
              const companyJobs = jobs.filter(j => j.employerId?._id === comp._id)
              return (
                <div 
                  key={comp._id} 
                  className="company-card-large"
                  onClick={() => navigate(`/company/${comp._id}`)}
                >
                  <div className="company-card-large__logo">
                    {comp.logo ? (
                      <img src={`http://localhost:3001${comp.logo}`} alt="" />
                    ) : (
                      <span>{comp.companyName?.[0] || 'C'}</span>
                    )}
                  </div>
                  <div className="company-card-large__info">
                    <div className="company-card-large__name">{comp.companyName}</div>
                    <div className="company-card-large__sector">{SECTOR_LABELS[comp.sector] || comp.sector}</div>
                    <div className="company-card-large__jobs">{companyJobs.length} ажлын зар</div>
                  </div>
                  <div className="company-card-large__arrow">→</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
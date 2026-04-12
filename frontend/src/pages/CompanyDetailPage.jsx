import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

export default function CompanyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCompany()
  }, [id])

  const loadCompany = async () => {
    try {
      const [companyRes, allJobsRes] = await Promise.all([
        api.getCompanyById(id),
        api.getAllJobs()
      ])
      
      const companyData = companyRes.user
      const companyJobs = (allJobsRes.jobs || []).filter(j => j.employerId?._id === id)
      
      setCompany(companyData)
      setJobs(companyJobs)
    } catch (error) {
      console.log('Error loading company')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Түр хүлээнэ үү...</div>
  }

  if (!company) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Компани олдсонгүй</div>
  }

  return (
    <div className="company-detail">
      <button className="btn btn--outline" onClick={() => navigate('/')} style={{ marginBottom: 20 }}>
        ← Буцах
      </button>

      <div className="company-detail__header" style={{
        backgroundImage: company.backgroundImage 
          ? `url(http://localhost:3001${company.backgroundImage})` 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="company-detail__overlay">
          <div className="company-detail__logo">
            {company.logo ? (
              <img src={`http://localhost:3001${company.logo}`} alt="" />
            ) : (
              <span>{company.companyName?.[0] || 'C'}</span>
            )}
          </div>
          <div className="company-detail__info">
            <h1>{company.companyName}</h1>
            <p>{company.sector}</p>
            <div className="company-detail__meta">
              <span>📍 {company.address || 'Хаяг тодорхойгүй'}</span>
              <span>👥 {company.employees || '0'} ажилтан</span>
              {company.website && <span>🌐 <a href={company.website} target="_blank" rel="noopener">{company.website.replace(/^https?:\/\//, '')}</a></span>}
            </div>
          </div>
        </div>
      </div>

      <div className="company-detail__section">
        <h2>Компанийн танилцуулга</h2>
        <div className="company-detail__text">
          {company.description || 'Танд танилцуулга байхгүй байна.'}
        </div>
      </div>

      <div className="company-detail__section">
        <h2>Холбогдох мэдээлэл</h2>
        <div className="company-detail__grid">
          <div>📧 <strong>Имэйл:</strong> {company.email}</div>
          <div>📞 <strong>Утас:</strong> {company.phone || 'Бүртгэгдээгүй'}</div>
          <div>👤 <strong>Холбогдох хүн:</strong> {company.lastname} {company.firstname}</div>
          <div>📍 <strong>Хаяг:</strong> {company.address || 'Бүртгэгдээгүй'}</div>
        </div>
      </div>

      <div className="company-detail__section">
        <h2>Нийтлэсэн зарууд ({jobs.length})</h2>
        {jobs.length === 0 ? (
          <p style={{ color: '#999' }}>Одоогоор зар байхгүй байна</p>
        ) : (
          <div className="job-list">
            {jobs.map(job => (
              <div key={job._id} className="job-card">
                <div className="job-card__header">
                  <div className="job-card__info">
                    <div className="job-card__title">{job.title}</div>
                    <div className="job-card__meta">
                      <span>📍 {job.location}</span>
                      <span>💼 {job.sector}</span>
                      <span>🕒 {new Date(job.createdAt).toLocaleDateString('mn-MN')}</span>
                    </div>
                  </div>
                  <div className="job-card__salary">
                    {job.salFrom || job.salTo 
                      ? `${job.salFrom ? Number(job.salFrom).toLocaleString() : ''}${job.salFrom && job.salTo ? ' - ' : ''}${job.salTo ? Number(job.salTo).toLocaleString() : ''} ₮`
                      : 'Тохиролцоно'}
                  </div>
                </div>
                <div className="job-card__footer">
                  <button className="btn btn--primary btn--sm" onClick={() => navigate(`/job/${job._id}`)}>
                    Үзэх
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
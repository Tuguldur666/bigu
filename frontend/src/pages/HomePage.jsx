import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const SECTOR_LABELS = {
  'IT / Технологи': 'Технологи',
  'Санхүү / Нягтлан': 'Санхүү',
  'Маркетинг': 'Маркетинг',
  'Инженер': 'Инженер',
  'Эрүүл мэнд': 'Эрүүл мэнд',
  'Боловсрол': 'Боловсрол',
  'Уул уурхай': 'Уул уурхай',
  'Бусад': 'Бусад'
}

const SECTOR_OPTIONS = Object.keys(SECTOR_LABELS)

const JOB_TYPES = ['Бүтэн цаг', 'Хагас цаг', 'Цагийн', 'Гэрээт', 'Дадлага', 'Зайнаас']
const LOCATIONS = ['Улаанбаатар', 'Дархан', 'Эрдэнэт', 'Зайнаас', 'Бусад аймаг']

export default function HomePage() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    sector: '',
    location: '',
    type: '',
    salaryMin: '',
    salaryMax: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [jobsRes] = await Promise.all([
        api.getAllJobs()
      ])
      
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

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (search && !job.title.toLowerCase().includes(search.toLowerCase()) && 
          !job.description?.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      if (filters.sector && job.sector !== filters.sector) return false
      if (filters.location && job.location !== filters.location) return false
      if (filters.type && job.type !== filters.type) return false
      if (filters.salaryMin && (!job.salFrom || job.salFrom < Number(filters.salaryMin))) return false
      if (filters.salaryMax && (!job.salTo || job.salTo > Number(filters.salaryMax))) return false
      return true
    })
  }, [jobs, search, filters])

  const clearFilters = () => {
    setFilters({
      sector: '',
      location: '',
      type: '',
      salaryMin: '',
      salaryMax: ''
    })
    setSearch('')
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Түр хүлээнэ үү...</div>
  }

  return (
    <div>
      <div className="hero">
        <div className="hero__search">
          <input 
            className="hero__input" 
            placeholder="Ажил хайх..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            className="hero__filter-btn"
            onClick={() => setShowFilters(!showFilters)}
            style={{ background: showFilters ? '#1447c0' : '#1a56db' }}
          >
            <svg width={15} height={15} viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M6 10h8M9 15h2" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
            </svg>
            Шүүлт {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-row">
              <div className="filter-group">
                <label>Салбар</label>
                <select 
                  value={filters.sector} 
                  onChange={(e) => setFilters(f => ({ ...f, sector: e.target.value }))}
                >
                  <option value="">Бүх салбар</option>
                  {SECTOR_OPTIONS.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Байршил</label>
                <select 
                  value={filters.location} 
                  onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
                >
                  <option value="">Бүх байршил</option>
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Ажлын төрөл</label>
                <select 
                  value={filters.type} 
                  onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
                >
                  <option value="">Бүх төрөл</option>
                  {JOB_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="filter-row">
              <div className="filter-group">
                <label>Цалин (доод)</label>
                <input 
                  type="number" 
                  placeholder="0₮"
                  value={filters.salaryMin}
                  onChange={(e) => setFilters(f => ({ ...f, salaryMin: e.target.value }))}
                />
              </div>
              <div className="filter-group">
                <label>Цалин (дээд)</label>
                <input 
                  type="number" 
                  placeholder="0₮"
                  value={filters.salaryMax}
                  onChange={(e) => setFilters(f => ({ ...f, salaryMax: e.target.value }))}
                />
              </div>
              <button className="btn btn--outline" onClick={clearFilters}>
                Цэвэрлэх
              </button>
            </div>
          </div>
        )}

        <div className="hero__tags">
          {SECTOR_OPTIONS.map(sector => (
            <div 
              key={sector} 
              className={`ftag ${filters.sector === sector ? 'ftag--active' : ''}`}
              onClick={() => setFilters(f => ({ ...f, sector: f.sector === sector ? '' : sector }))}
            >
              {sector}
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <div className="section__title">Ажлын зар ({filteredJobs.length})</div>
          {activeFilterCount > 0 && (
            <div style={{ fontSize: 13, color: '#666' }}>
              {search && `"${search}"`} {filteredJobs.length} / {jobs.length} зар
            </div>
          )}
        </div>
        <div className="job-list">
          {filteredJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              Одоогоор зар байхгүй байна
              {activeFilterCount > 0 && <button className="btn btn--outline" style={{ marginTop: 10 }} onClick={clearFilters}>Шүүлт цэвэрлэх</button>}
            </div>
          ) : (
            filteredJobs.map(job => (
              <div key={job._id} className="job-card">
                <div className="job-card__header">
                  <div className="job-card__logo">
                    {job.employerId?.logo ? (
                      <img src={`http://localhost:3001${job.employerId.logo}`} alt="" />
                    ) : (
                      <span>{job.employerId?.companyName?.[0] || 'C'}</span>
                    )}
                  </div>
                  <div className="job-card__info">
                    <div className="job-card__title">{job.title}</div>
                    <div className="job-card__company">{job.employerId?.companyName || 'Компани'}</div>
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
                  <span className={`badge ${job.status === 'active' ? 'badge--new' : ''}`}>
                    {job.status === 'active' ? 'Идэвхтэй' : 'Хүлээгдэж байна'}
                  </span>
                  <button className="btn btn--primary btn--sm" onClick={() => navigate(`/job/${job._id}`)}>
                    Үзэх
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <div className="section__title">Компани ({companies.length})</div>
        </div>
        <div className="company-grid">
          {companies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              Одоогоор компани байхгүй байна
            </div>
          ) : (
            companies.map(comp => (
              <div key={comp._id} className="company-card" onClick={() => navigate(`/company/${comp._id}`)}>
                <div className="company-card__logo">
                  {comp.logo ? (
                    <img src={`http://localhost:3001${comp.logo}`} alt="" />
                  ) : (
                    <span>{comp.companyName?.[0] || 'C'}</span>
                  )}
                </div>
                <div className="company-card__name">{comp.companyName}</div>
                <div className="company-card__sector">{comp.sector}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
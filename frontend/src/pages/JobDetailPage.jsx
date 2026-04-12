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

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applyMode, setApplyMode] = useState(false)
  const [appData, setAppData] = useState({ cv: null })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadJob()
  }, [id])

  const loadJob = async () => {
    try {
      const res = await api.getJobById(id)
      setJob(res.job)
    } catch (error) {
      alert('Зар олдсонгүй')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type !== 'application/pdf') {
      alert('Зөвхөн PDF файл оруулна уу')
      return
    }
    setAppData(p => ({ ...p, cv: file }))
  }

  const handleApply = async () => {
    if (!appData.cv) {
      alert('CV файл сонгоно уу')
      return
    }
    setSending(true)
    try {
      await api.applyToJob(id, {}, appData.cv)
      alert('Өргөдөл амжилттай илгээгдлээ!')
      setApplyMode(false)
      setAppData({ cv: null })
    } catch (error) {
      alert(error.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Түр хүлээнэ үү...</div>
  }

  if (!job) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Зар олдсонгүй</div>
  }

  const employer = job.employerId

  return (
    <div className="job-detail">
      <button className="btn btn--outline" onClick={() => navigate('/')} style={{ marginBottom: 20 }}>
        ← Буцах
      </button>

      <div className="job-detail__header">
        <div className="job-detail__logo">
          {employer?.logo ? (
            <img src={`http://localhost:3001${employer.logo}`} alt="" />
          ) : (
            <span>{employer?.companyName?.[0] || 'C'}</span>
          )}
        </div>
        <div className="job-detail__info">
          <h1>{job.title}</h1>
          <div className="job-detail__company">{employer?.companyName}</div>
          <div className="job-detail__meta">
            <span>📍 {job.location}</span>
            <span>💼 {job.sector}</span>
            <span>🕒 {new Date(job.createdAt).toLocaleDateString('mn-MN')}</span>
          </div>
        </div>
        <div className="job-detail__salary">
          {job.salFrom || job.salTo 
            ? `${job.salFrom ? Number(job.salFrom).toLocaleString() : ''}${job.salFrom && job.salTo ? ' - ' : ''}${job.salTo ? Number(job.salTo).toLocaleString() : ''} ₮`
            : 'Тохиролцоно'}
        </div>
      </div>

      {!applyMode ? (
        <div className="job-detail__actions">
          <button className="btn btn--primary btn--lg" onClick={() => setApplyMode(true)}>
            Өргөдөл илгээх
          </button>
          <button className="btn btn--outline" onClick={() => navigate(`/company/${employer?._id}`)}>
            Компани үзэх
          </button>
        </div>
      ) : (
        <div className="job-detail__apply">
          <h3>Өргөдөл илгээх</h3>
          <div className="form-field">
            <label className="form-field__label">CV файл (PDF) <span>*</span></label>
            <input type="file" accept=".pdf" onChange={handleFileChange} className="form-field__input" />
            {appData.cv && <div style={{ fontSize: 12, color: '#22c55e', marginTop: 4 }}>✓ Сонгосон: {appData.cv.name}</div>}
          </div>
          <div className="form-actions">
            <button className="btn btn--outline" onClick={() => setApplyMode(false)}>Буцах</button>
            <button className="btn btn--primary" onClick={handleApply} disabled={sending || !appData.cv}>
              {sending ? 'Илгээж байна...' : 'Илгээх'}
            </button>
          </div>
        </div>
      )}

      <div className="job-detail__section">
        <h3>Тайлбар</h3>
        <div className="job-detail__text">{job.description}</div>
      </div>

      {job.benefits && (
        <div className="job-detail__section">
          <h3>Давуу тал / Урамшуулал</h3>
          <div className="job-detail__text">{job.benefits}</div>
        </div>
      )}

      <div className="job-detail__section">
        <h3>Ажлын нөхцөл</h3>
        <div className="job-detail__grid">
          <div>🕒 <strong>Ажлын цаг:</strong> {job.workHours}</div>
          <div>📅 <strong>7 хоногт:</strong> {job.workDays}</div>
          <div>🏢 <strong>Орчин:</strong> {job.workEnvironment}</div>
        </div>
      </div>

      <div className="job-detail__section">
        <h3>Шаардлага</h3>
        <div className="job-detail__grid">
          <div>🎓 <strong>Боловсрол:</strong> {job.education}</div>
          <div>💼 <strong>Туршлага:</strong> {job.experience}</div>
          <div>👤 <strong>Хүйс:</strong> {job.gender}</div>
          <div>🎂 <strong>Нас:</strong> {job.ageRange}</div>
        </div>
        {job.skills?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <strong>Ур чадвар:</strong>
            <div className="skills" style={{ marginTop: 8 }}>
              {job.skills.map((s, i) => (
                <div key={i} className="skill-tag">{s}</div>
              ))}
            </div>
          </div>
        )}
        {job.extra && (
          <div style={{ marginTop: 12 }}>
            <strong>Нэмэлт:</strong> {job.extra}
          </div>
        )}
      </div>

      <div className="job-detail__section">
        <h3>Холбогдох</h3>
        <div className="job-detail__grid">
          <div>📧 <strong>Имэйл:</strong> {job.contactEmail}</div>
          {job.contactPhone && <div>📞 <strong>Утас:</strong> {job.contactPhone}</div>}
        </div>
      </div>
    </div>
  )
}
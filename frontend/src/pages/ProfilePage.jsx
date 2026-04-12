import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
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

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [myJobs, setMyJobs] = useState([])
  const [profile, setProfile] = useState({
    companyName: '',
    sector: '',
    employees: '',
    lastname: '',
    firstname: '',
    phone: '',
    email: '',
    logo: null,
    backgroundImage: null,
    description: '',
    website: '',
    address: ''
  })
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  useEffect(() => {
    loadProfile()
    loadMyJobs()
  }, [])

  const loadProfile = async () => {
    try {
      const res = await api.getProfile()
      const p = res.user
      setProfile({
        companyName: p.companyName || '',
        sector: p.sector || '',
        employees: p.employees || '',
        lastname: p.lastname || '',
        firstname: p.firstname || '',
        phone: p.phone || '',
        email: p.email || '',
        logo: p.logo || null,
        backgroundImage: p.backgroundImage || null,
        description: p.description || '',
        website: p.website || '',
        address: p.address || ''
      })
    } catch (error) {
      console.log('Error loading profile')
    } finally {
      setLoading(false)
    }
  }

  const loadMyJobs = async () => {
    try {
      const res = await api.getMyJobs()
      setMyJobs(res.jobs || [])
    } catch (error) {
      console.log('No jobs')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(p => ({ ...p, [name]: value }))
  }

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      if (field === 'logo') {
        formData.append('logo', file)
      } else {
        formData.append('backgroundImage', file)
      }
      
      const token = localStorage.getItem('zangia_token')
      const res = await fetch('http://localhost:3001/api/profile/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      
      if (field === 'logo') {
        setProfile(p => ({ ...p, logo: data.logo }))
      } else {
        setProfile(p => ({ ...p, backgroundImage: data.backgroundImage }))
      }
      setMessage({ type: 'success', text: 'Зураг амжилттай Upload хийгдлээ' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload алдаа: ' + error.message })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      await api.updateProfile(profile)
      setMessage({ type: 'success', text: 'Профайл амжилттай шинэчлэгдлээ' })
      if (updateUser) {
        updateUser({ ...user, ...profile })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Алдаа: ' + error.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="dashboard"><div className="dashboard__title">Түр хүлээнэ үү...</div></div>
  }

  return (
    <div className="company-profile">
      <div className="company-profile__header" style={{
        backgroundImage: profile.backgroundImage 
          ? `url(http://localhost:3001${profile.backgroundImage})` 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="company-profile__header-overlay">
          <label className="company-profile__bg-upload" title="Background зураг сонгох">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageUpload(e, 'background')}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            <span>📷</span>
          </label>
          <div className="company-profile__header-content">
            <div className="company-profile__logo-container">
              <div className="company-profile__logo" style={{
                backgroundImage: profile.logo 
                  ? `url(http://localhost:3001${profile.logo})` 
                  : 'none'
              }}>
                {!profile.logo && <span>{profile.companyName?.[0] || 'C'}</span>}
              </div>
              <label className="company-profile__logo-upload" title="Лого сонгох">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, 'logo')}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
                <span>✏️</span>
              </label>
            </div>
            <div className="company-profile__info">
              <h1>{profile.companyName || 'Компанийн нэр'}</h1>
              <p>{SECTOR_LABELS[profile.sector] || 'Салбар тодорхойгүй'}</p>
              <div className="company-profile__meta">
                <span>📍 {profile.address || 'Хаяг тодорхойгүй'}</span>
                <span>👥 {profile.employees || '0'} ажилтан</span>
                {profile.website && (
                  <span>🌐 <a href={profile.website} target="_blank" rel="noopener">{profile.website.replace(/^https?:\/\//, '')}</a></span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="company-profile__tabs">
        <button 
          className={`company-profile__tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Компанийн мэдээлэл
        </button>
        <button 
          className={`company-profile__tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Нийтлэсэн зарууд ({myJobs.length})
        </button>
        <button 
          className={`company-profile__tab ${activeTab === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          Засварлах
        </button>
      </div>

      <div className="company-profile__content">
        {message && (
          <div className={`message message--${message.type}`} style={{ 
            padding: 14, marginBottom: 20, borderRadius: 8,
            background: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            animation: 'fadeIn 0.3s ease'
          }}>
            {message.text}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="company-profile__about">
            <div className="form-section">
              <h2 className="form-section__title">Компанийн танилцуулга</h2>
              <div className="form-card">
                <p style={{ color: profile.description ? '#333' : '#999', lineHeight: '1.7' }}>
                  {profile.description || 'Танд танилцуулга байхгүй байна. Засварлах цэсээр нэмнэ үү.'}
                </p>
              </div>
            </div>

            <div className="form-section">
              <h2 className="form-section__title">Холбогдох мэдээлэл</h2>
              <div className="form-card">
                <div className="form-grid-2">
                  <div className="form-field">
                    <div className="form-field__label">Имэйл</div>
                    <div className="form-field__value">{profile.email}</div>
                  </div>
                  <div className="form-field">
                    <div className="form-field__label">Утас</div>
                    <div className="form-field__value">{profile.phone || 'Бүртгэгдээгүй'}</div>
                  </div>
                  <div className="form-field">
                    <div className="form-field__label">Холбогдох хүн</div>
                    <div className="form-field__value">{profile.lastname} {profile.firstname}</div>
                  </div>
                  <div className="form-field">
                    <div className="form-field__label">Хаяг</div>
                    <div className="form-field__value">{profile.address || 'Бүртгэгдээгүй'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="company-profile__jobs">
            {myJobs.length === 0 ? (
              <div className="company-profile__empty">
                <div className="form-card" style={{ padding: 40, textAlign: 'center' }}>
                  <p style={{ color: '#999', marginBottom: 16 }}>Танд нийтлэсэн зар байхгүй байна.</p>
                  <button className="btn btn--primary" onClick={() => navigate('/job-post')}>
                    + Шинэ зар нийтлэх
                  </button>
                </div>
              </div>
            ) : (
              <div className="company-profile__jobs-list">
                {myJobs.map((job) => (
                  <div key={job._id} className="company-card">
                    <div className="company-card__header">
                      <div className="company-card__logo">
                        {profile.logo ? (
                          <img src={`http://localhost:3001${profile.logo}`} alt="" />
                        ) : (
                          <span>{profile.companyName?.[0] || 'C'}</span>
                        )}
                      </div>
                      <div className="company-card__info">
                        <h3>{job.title}</h3>
                        <p>{profile.companyName}</p>
                      </div>
                      <div className="company-card__badge">
                        <span className="badge badge--new">{job.status || 'Идэвхтэй'}</span>
                      </div>
                    </div>
                    <div className="company-card__meta">
                      <span>📍 {job.location}</span>
                      <span>💼 {SECTOR_LABELS[job.sector] || job.sector}</span>
                      <span>🕒 {new Date(job.createdAt).toLocaleDateString('mn-MN')}</span>
                    </div>
                    <div className="company-card__actions">
                      <button className="btn btn--outline" style={{ fontSize: 13, padding: '6px 14px' }}>Засварлах</button>
                      <button className="btn btn--primary" style={{ fontSize: 13, padding: '6px 14px' }}>Үзэх</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'edit' && (
          <form onSubmit={handleSubmit} className="company-profile__form">
            <div className="form-section">
              <h2 className="form-section__title">Компанийн мэдээлэл</h2>
              <div className="form-card">
                <div className="form-grid-2">
                  <div className="form-field">
                    <label className="form-field__label">Компанийн нэр</label>
                    <input 
                      type="text" 
                      name="companyName" 
                      value={profile.companyName} 
                      onChange={handleChange}
                      className="form-field__input"
                      placeholder="Компанийн нэр"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-field__label">Салбар</label>
                    <select 
                      name="sector" 
                      value={profile.sector} 
                      onChange={handleChange}
                      className="form-field__select"
                    >
                      <option value="">Салбар сонгох</option>
                      {Object.entries(SECTOR_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label className="form-field__label">Ажилчдын тоо</label>
                    <select 
                      name="employees" 
                      value={profile.employees} 
                      onChange={handleChange}
                      className="form-field__select"
                    >
                      <option value="">Тоо сонгох</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-100">51-100</option>
                      <option value="101-500">101-500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-field__label">Вебсайт</label>
                    <input 
                      type="text" 
                      name="website" 
                      value={profile.website} 
                      onChange={handleChange}
                      className="form-field__input"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-field__label">Хаяг</label>
                  <input 
                    type="text" 
                    name="address" 
                    value={profile.address} 
                    onChange={handleChange}
                    className="form-field__input"
                    placeholder="Улаанбаатар, Сүхбаатар дүүрэг"
                  />
                </div>

                <div className="form-field">
                  <label className="form-field__label">Компанийн танилцуулга</label>
                  <textarea 
                    name="description" 
                    value={profile.description} 
                    onChange={handleChange}
                    className="form-field__textarea"
                    rows={4}
                    placeholder="Компанийн тухай товч танилцуулга..."
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="form-section__title">Холбогдох хүн</h2>
              <div className="form-card">
                <div className="form-grid-2">
                  <div className="form-field">
                    <label className="form-field__label">Овог</label>
                    <input 
                      type="text" 
                      name="lastname" 
                      value={profile.lastname} 
                      onChange={handleChange}
                      className="form-field__input"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-field__label">Нэр</label>
                    <input 
                      type="text" 
                      name="firstname" 
                      value={profile.firstname} 
                      onChange={handleChange}
                      className="form-field__input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-field__label">Утас</label>
                  <input 
                    type="text" 
                    name="phone" 
                    value={profile.phone} 
                    onChange={handleChange}
                    className="form-field__input"
                    placeholder="Утасны дугаар"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Хадгалж байна...' : 'Хадгалах'}
              </button>
              <button 
                type="button" 
                className="btn btn--outline"
                onClick={() => setActiveTab('profile')}
              >
                Буцах
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function SeekerProfilePage() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [message, setMessage] = useState(null)

  const [profile, setProfile] = useState({
    lastname: '',
    firstname: '',
    phone: '',
    email: '',
    birthDate: '',
    gender: '',
    address: '',
    photo: null,
    cv: null,
    education: [],
    experience: [],
    skills: [],
    languages: [],
    computerSkills: [],
    certificates: [],
    about: '',
    careerGoal: '',
    hobbies: [],
    awards: [],
    references: []
  })

  const handleAddCertificate = () => {
    const newCerts = [...profile.certificates]
    newCerts.push({ name: '', issuer: '', date: '', file: null, description: '' })
    setProfile(p => ({ ...p, certificates: newCerts }))
  }

  const handleCertificateFileUpload = async (i, e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await api.uploadCertificate(file)
      const newCert = [...profile.certificates]
      newCert[i].file = res.file
      setProfile(p => ({ ...p, certificates: newCert }))
      setMessage({ type: 'success', text: 'Сертификат файл upload хийгдлээ' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload алдаа' })
    } finally {
      setUploading(false)
    }
  }

  const handleAddReference = () => {
    const newRefs = [...profile.references]
    newRefs.push({ name: '', position: '', phone: '', email: '' })
    setProfile(p => ({ ...p, references: newRefs }))
  }

  const handleAddHobby = () => {
    if (newHobby.trim()) {
      setProfile(p => ({ ...p, hobbies: [...p.hobbies, newHobby.trim()] }))
      setNewHobby('')
    }
  }

  const handleAddAward = () => {
    if (newAward.trim()) {
      setProfile(p => ({ ...p, awards: [...p.awards, newAward.trim()] }))
      setNewAward('')
    }
  }

  const [newSkill, setNewSkill] = useState('')
  const [newLang, setNewLang] = useState('')
  const [newCompSkill, setNewCompSkill] = useState('')
  const [newHobby, setNewHobby] = useState('')
  const [newAward, setNewAward] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const loadProfile = async () => {
    try {
      const res = await api.getSeekerProfile()
      const p = res.user
      setProfile({
        lastname: p.lastname || '',
        firstname: p.firstname || '',
        phone: p.phone || '',
        email: p.email || '',
        birthDate: p.birthDate || '',
        gender: p.gender || '',
        address: p.address || '',
        photo: p.photo || null,
        cv: p.cv || null,
        education: p.education || [],
        experience: p.experience || [],
        skills: p.skills || [],
        languages: p.languages || [],
        computerSkills: p.computerSkills || [],
        certificates: p.certificates || [],
        about: p.about || '',
        careerGoal: p.careerGoal || '',
        hobbies: p.hobbies || [],
        awards: p.awards || [],
        references: p.references || []
      })
    } catch (error) {
      console.log('Error loading profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(p => ({ ...p, [name]: value }))
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await api.uploadSeekerPhoto(file)
      setProfile(p => ({ ...p, photo: res.photo }))
      setMessage({ type: 'success', text: 'Зураг амжилттай upload хийгдлээ' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload алдаа' })
    } finally {
      setUploading(false)
    }
  }

  const handleCVUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await api.uploadSeekerCV(file)
      setProfile(p => ({ ...p, cv: res.cv }))
      setMessage({ type: 'success', text: 'CV амжилттай upload хийгдлээ' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload алдаа' })
    } finally {
      setUploading(false)
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setProfile(p => ({ ...p, skills: [...p.skills, newSkill.trim()] }))
      setNewSkill('')
    }
  }

  const handleAddLang = () => {
    if (newLang.trim()) {
      setProfile(p => ({ ...p, languages: [...p.languages, newLang.trim()] }))
      setNewLang('')
    }
  }

  const handleAddCompSkill = () => {
    if (newCompSkill.trim()) {
      setProfile(p => ({ ...p, computerSkills: [...p.computerSkills, newCompSkill.trim()] }))
      setNewCompSkill('')
    }
  }

  const handleRemoveItem = (field, index) => {
    setProfile(p => ({ ...p, [field]: p[field].filter((_, i) => i !== index) }))
  }

  const handleAddEducation = () => {
    const newEdu = [...profile.education]
    newEdu.push({ school: '', degree: '', field: '', startDate: '', endDate: '', description: '' })
    setProfile(p => ({ ...p, education: newEdu }))
  }

  const handleAddExperience = () => {
    const newExp = [...profile.experience]
    newExp.push({ company: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '' })
    setProfile(p => ({ ...p, experience: newExp }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.updateSeekerProfile(profile)
      setMessage({ type: 'success', text: 'Профайл амжилттай хадгалгдлаа' })
      if (updateUser) updateUser({ ...user, ...profile })
    } catch (error) {
      setMessage({ type: 'error', text: 'Алдаа: ' + error.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="dashboard"><div className="dashboard__title">Түр хүлээнэ үү...</div></div>
  }

  const tabs = [
    { id: 'personal', label: 'Хувийн мэдээлэл' },
    { id: 'education', label: 'Боловсрол' },
    { id: 'experience', label: 'Ажлын туршлага' },
    { id: 'skills', label: 'Ур чадвар' },
    { id: 'certificates', label: 'Сертификат' },
    { id: 'about', label: 'Хувийн танилцуулга' },
    { id: 'additional', label: 'Нэмэлт мэдээлэл' }
  ]

  return (
    <div className="seeker-profile">
      <div className="seeker-profile__header">
        <div className="seeker-profile__photo">
          {profile.photo ? (
            <img src={`http://localhost:3001${profile.photo}`} alt="" />
          ) : (
            <span>{profile.firstname?.[0] || 'U'}</span>
          )}
          <label className="seeker-profile__photo-edit">
            <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} style={{ display: 'none' }} />
            📷
          </label>
        </div>
        <div className="seeker-profile__info">
          <h1>{profile.lastname} {profile.firstname}</h1>
          <p>{profile.email}</p>
          {profile.cv && (
            <a href={`http://localhost:3001${profile.cv}`} target="_blank" rel="noopener" className="btn btn--outline btn--sm">
              📄 CV татах
            </a>
          )}
        </div>
      </div>

      {message && (
        <div className={`message message--${message.type}`} style={{ 
          padding: 14, marginBottom: 20, borderRadius: 8,
          background: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24'
        }}>
          {message.text}
        </div>
      )}

      <div className="seeker-profile__tabs">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`seeker-profile__tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="seeker-profile__content">
        {activeTab === 'personal' && (
          <div className="form-section">
            <div className="form-card">
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-field__label">Овог</label>
                  <input className="form-field__input" name="lastname" value={profile.lastname} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label className="form-field__label">Нэр</label>
                  <input className="form-field__input" name="firstname" value={profile.firstname} onChange={handleChange} />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-field__label">Төрсөн огноо</label>
                  <input className="form-field__input" type="date" name="birthDate" value={profile.birthDate} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label className="form-field__label">Хүйс</label>
                  <select className="form-field__select" name="gender" value={profile.gender} onChange={handleChange}>
                    <option value="">Сонгох</option>
                    <option value="male">Эрэгтэй</option>
                    <option value="female">Эмэгтэй</option>
                  </select>
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-field__label">Утас</label>
                  <input className="form-field__input" name="phone" value={profile.phone} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label className="form-field__label">Имэйл</label>
                  <input className="form-field__input" name="email" value={profile.email} disabled style={{ background: '#f5f5f5' }} />
                </div>
              </div>
              <div className="form-field">
                <label className="form-field__label">Оршин суугаа хаяг</label>
                <input className="form-field__input" name="address" value={profile.address} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label className="form-field__label">CV файл</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleCVUpload} className="form-field__input" />
                {profile.cv && <div style={{ fontSize: 12, color: '#22c55e', marginTop: 4 }}>✓ CV оруулсан</div>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="form-section">
            {profile.education.map((edu, i) => (
              <div key={i} className="form-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h4>Боловсрол #{i + 1}</h4>
                  <button type="button" onClick={() => handleRemoveItem('education', i)} style={{ color: '#e53e3e' }}>Устгах</button>
                </div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Сургууль</label>
                    <input className="form-field__input" value={edu.school} onChange={(e) => {
                      const newEdu = [...profile.education]
                      newEdu[i].school = e.target.value
                      setProfile(p => ({ ...p, education: newEdu }))
                    }} />
                  </div>
                  <div className="form-field">
                    <label>Зэрэг</label>
                    <select className="form-field__select" value={edu.degree} onChange={(e) => {
                      const newEdu = [...profile.education]
                      newEdu[i].degree = e.target.value
                      setProfile(p => ({ ...p, education: newEdu }))
                    }}>
                      <option value="">Сонгох</option>
                      <option value="Бакалавр">Бакалавр</option>
                      <option value="Магистр">Магистр</option>
                      <option value="Доктор">Доктор</option>
                    </select>
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Мэргэжил</label>
                    <input className="form-field__input" value={edu.field} onChange={(e) => {
                      const newEdu = [...profile.education]
                      newEdu[i].field = e.target.value
                      setProfile(p => ({ ...p, education: newEdu }))
                    }} />
                  </div>
                  <div className="form-field">
                    <label>Хугацаа</label>
                    <input className="form-field__input" placeholder="2015-2019" value={edu.startDate} onChange={(e) => {
                      const newEdu = [...profile.education]
                      newEdu[i].startDate = e.target.value
                      setProfile(p => ({ ...p, education: newEdu }))
                    }} />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn--outline" onClick={handleAddEducation}>+ Боловсрол нэмэх</button>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="form-section">
            {profile.experience.map((exp, i) => (
              <div key={i} className="form-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h4>Ажлын туршлага #{i + 1}</h4>
                  <button type="button" onClick={() => handleRemoveItem('experience', i)} style={{ color: '#e53e3e' }}>Устгах</button>
                </div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Байгууллага</label>
                    <input className="form-field__input" value={exp.company} onChange={(e) => {
                      const newExp = [...profile.experience]
                      newExp[i].company = e.target.value
                      setProfile(p => ({ ...p, experience: newExp }))
                    }} />
                  </div>
                  <div className="form-field">
                    <label>Албан тушаал</label>
                    <input className="form-field__input" value={exp.position} onChange={(e) => {
                      const newExp = [...profile.experience]
                      newExp[i].position = e.target.value
                      setProfile(p => ({ ...p, experience: newExp }))
                    }} />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Эхлэх огноо</label>
                    <input className="form-field__input" type="month" value={exp.startDate} onChange={(e) => {
                      const newExp = [...profile.experience]
                      newExp[i].startDate = e.target.value
                      setProfile(p => ({ ...p, experience: newExp }))
                    }} />
                  </div>
                  <div className="form-field">
                    <label>Дуусах огноо</label>
                    <input className="form-field__input" type="month" value={exp.endDate} disabled={exp.isCurrent} onChange={(e) => {
                      const newExp = [...profile.experience]
                      newExp[i].endDate = e.target.value
                      setProfile(p => ({ ...p, experience: newExp }))
                    }} />
                  </div>
                </div>
                <div className="form-field" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={exp.isCurrent} onChange={(e) => {
                    const newExp = [...profile.experience]
                    newExp[i].isCurrent = e.target.checked
                    if (e.target.checked) newExp[i].endDate = ''
                    setProfile(p => ({ ...p, experience: newExp }))
                  }} />
                  <label>Одоогийн ажил</label>
                </div>
                <div className="form-field">
                  <label>Тайлбар / Үүрэг</label>
                  <textarea className="form-field__textarea" rows={3} value={exp.description} onChange={(e) => {
                    const newExp = [...profile.experience]
                    newExp[i].description = e.target.value
                    setProfile(p => ({ ...p, experience: newExp }))
                  }} />
                </div>
              </div>
            ))}
            <button type="button" className="btn btn--outline" onClick={handleAddExperience}>+ Ажлын туршлага нэмэх</button>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="form-section">
            <div className="form-card">
              <h3>Мэргэжлийн ур чадвар</h3>
              <div className="skills">
                {profile.skills.map((s, i) => (
                  <div key={i} className="skill-tag">
                    {s}
                    <button type="button" onClick={() => handleRemoveItem('skills', i)}>×</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-7">
                <input className="form-field__input" style={{ flex: 1 }} value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Ур чадвар нэмэх" />
                <button type="button" className="btn btn--primary" onClick={handleAddSkill}>+ Нэмэх</button>
              </div>
            </div>
            <div className="form-card">
              <h3>Хэлний мэдлэг</h3>
              <div className="skills">
                {profile.languages.map((l, i) => (
                  <div key={i} className="skill-tag">
                    {l}
                    <button type="button" onClick={() => handleRemoveItem('languages', i)}>×</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-7">
                <input className="form-field__input" style={{ flex: 1 }} value={newLang} onChange={(e) => setNewLang(e.target.value)} placeholder="Хэл нэмэх" />
                <button type="button" className="btn btn--primary" onClick={handleAddLang}>+ Нэмэх</button>
              </div>
            </div>
            <div className="form-card">
              <h3>Компьютерийн хэрэглээ</h3>
              <div className="skills">
                {profile.computerSkills.map((c, i) => (
                  <div key={i} className="skill-tag">
                    {c}
                    <button type="button" onClick={() => handleRemoveItem('computerSkills', i)}>×</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-7">
                <input className="form-field__input" style={{ flex: 1 }} value={newCompSkill} onChange={(e) => setNewCompSkill(e.target.value)} placeholder="Програм нэмэх" />
                <button type="button" className="btn btn--primary" onClick={handleAddCompSkill}>+ Нэмэх</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="form-section">
            {profile.certificates.map((cert, i) => (
              <div key={i} className="form-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h4>Сертификат #{i + 1}</h4>
                  <button type="button" onClick={() => handleRemoveItem('certificates', i)} style={{ color: '#e53e3e' }}>Устгах</button>
                </div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Нэр</label>
                    <input className="form-field__input" value={cert.name} onChange={(e) => {
                      const newCert = [...profile.certificates]
                      newCert[i].name = e.target.value
                      setProfile(p => ({ ...p, certificates: newCert }))
                    }} />
                  </div>
                  <div className="form-field">
                    <label>Олгосон байгууллага</label>
                    <input className="form-field__input" value={cert.issuer} onChange={(e) => {
                      const newCert = [...profile.certificates]
                      newCert[i].issuer = e.target.value
                      setProfile(p => ({ ...p, certificates: newCert }))
                    }} />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Огноо</label>
                    <input className="form-field__input" value={cert.date} onChange={(e) => {
                      const newCert = [...profile.certificates]
                      newCert[i].date = e.target.value
                      setProfile(p => ({ ...p, certificates: newCert }))
                    }} />
                  </div>
                  <div className="form-field">
                    <label>Файл</label>
                    <input type="file" accept=".pdf" onChange={(e) => handleCertificateFileUpload(i, e)} className="form-field__input" />
                    {cert.file && <div style={{ fontSize: 12, color: '#22c55e', marginTop: 4 }}>✓ Файл оруулсан</div>}
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn--outline" onClick={handleAddCertificate}>+ Сертификат нэмэх</button>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="form-section">
            <div className="form-card">
              <div className="form-field">
                <label className="form-field__label">Хувийн танилцуулга</label>
                <textarea className="form-field__textarea" rows={5} name="about" value={profile.about} onChange={handleChange} placeholder="Өөрийгөө товч танилцуулна уу..." />
              </div>
              <div className="form-field">
                <label className="form-field__label">Ажилд орох зорилго</label>
                <textarea className="form-field__textarea" rows={3} name="careerGoal" value={profile.careerGoal} onChange={handleChange} placeholder="Таны карьерын зорилго..." />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'additional' && (
          <div className="form-section">
            <div className="form-card">
              <h3>Хобби, сонирхол</h3>
              <div className="skills">
                {profile.hobbies.map((h, i) => (
                  <div key={i} className="skill-tag">
                    {h}
                    <button type="button" onClick={() => handleRemoveItem('hobbies', i)}>×</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-7">
                <input className="form-field__input" style={{ flex: 1 }} value={newHobby} onChange={(e) => setNewHobby(e.target.value)} placeholder="Хобби нэмэх" />
                <button type="button" className="btn btn--primary" onClick={handleAddHobby}>+ Нэмэх</button>
              </div>
            </div>
            <div className="form-card">
              <h3>Шагнал, урамшуулал</h3>
              <div className="skills">
                {profile.awards.map((a, i) => (
                  <div key={i} className="skill-tag">
                    {a}
                    <button type="button" onClick={() => handleRemoveItem('awards', i)}>×</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-7">
                <input className="form-field__input" style={{ flex: 1 }} value={newAward} onChange={(e) => setNewAward(e.target.value)} placeholder="Шагнал нэмэх" />
                <button type="button" className="btn btn--primary" onClick={handleAddAward}>+ Нэмэх</button>
              </div>
            </div>
            <div className="form-card">
              <h3>Референс (Холбогдох хүн)</h3>
              {profile.references.map((ref, i) => (
                <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>Референс #{i + 1}</span>
                    <button type="button" onClick={() => handleRemoveItem('references', i)} style={{ color: '#e53e3e' }}>Устгах</button>
                  </div>
                  <div className="form-grid-2">
                    <div className="form-field">
                      <label>Нэр</label>
                      <input className="form-field__input" value={ref.name} onChange={(e) => {
                        const newRef = [...profile.references]
                        newRef[i].name = e.target.value
                        setProfile(p => ({ ...p, references: newRef }))
                      }} />
                    </div>
                    <div className="form-field">
                      <label>Албан тушаал</label>
                      <input className="form-field__input" value={ref.position} onChange={(e) => {
                        const newRef = [...profile.references]
                        newRef[i].position = e.target.value
                        setProfile(p => ({ ...p, references: newRef }))
                      }} />
                    </div>
                  </div>
                  <div className="form-grid-2">
                    <div className="form-field">
                      <label>Утас</label>
                      <input className="form-field__input" value={ref.phone} onChange={(e) => {
                        const newRef = [...profile.references]
                        newRef[i].phone = e.target.value
                        setProfile(p => ({ ...p, references: newRef }))
                      }} />
                    </div>
                    <div className="form-field">
                      <label>Имэйл</label>
                      <input className="form-field__input" value={ref.email} onChange={(e) => {
                        const newRef = [...profile.references]
                        newRef[i].email = e.target.value
                        setProfile(p => ({ ...p, references: newRef }))
                      }} />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn--outline" onClick={handleAddReference}>+ Референс нэмэх</button>
            </div>
          </div>
        )}

        <div className="form-actions" style={{ marginTop: 20 }}>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Хадгалж байна...' : 'Хадгалах'}
          </button>
        </div>
      </form>
    </div>
  )
}
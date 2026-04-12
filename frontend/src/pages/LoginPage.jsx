import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, registerSeeker, registerEmployer } = useAuth()
  
  const initialTab = location.state?.tab || "seeker"
  const [activeTab, setActiveTab] = useState(initialTab)
  const [section, setSection] = useState("login")
  const [regStep, setRegStep] = useState(1)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  const [form, setForm] = useState({
    lastname: "", firstname: "", phone: "", email: "",
    elast: "", efirst: "", ephone: "", eemail: "", cname: "",
    profession: "", experience: "", sector: "", employees: "",
    loginId: "", loginPass: "", password: ""
  })

  const leftStat = activeTab === "employer" ? "10'000+" : "1,200,000"
  const leftLabel = activeTab === "employer" ? "байгууллага хүний нөөцөө бүрдүүлж байна" : "хэрэглэгчтэй"

  const handleLogin = async () => {
    if (!form.loginId || !form.loginPass) {
      setError("Имэйл эсвэл утасны дугаар, нууц үг оруулна уу")
      return
    }
    setLoading(true)
    setError("")
    try {
      await login({ emailOrPhone: form.loginId, password: form.loginPass, type: activeTab })
      navigate(activeTab === "employer" ? "/dashboard" : "/")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    setError("")
    try {
      if (activeTab === "seeker") {
        await registerSeeker({
          lastname: form.lastname,
          firstname: form.firstname,
          phone: form.phone,
          email: form.email,
          password: form.password,
          profession: form.profession,
          experience: form.experience
        })
      } else {
        await registerEmployer({
          lastname: form.elast,
          firstname: form.efirst,
          phone: form.ephone,
          email: form.eemail,
          password: form.password,
          companyName: form.cname,
          sector: form.sector,
          employees: form.employees
        })
      }
      navigate(activeTab === "employer" ? "/dashboard" : "/")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateForm = (field, value) => setForm(p => ({ ...p, [field]: value }))

  return (
    <div className="modal-overlay" onClick={() => navigate('/')}>
      <div style={{ position: "relative" }}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal__left">
            <div className="modal__avatar">
              <svg width={70} height={70} viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="28" r="18" fill="#f97316"/>
                <ellipse cx="40" cy="72" rx="28" ry="18" fill="#f97316"/>
              </svg>
            </div>
            <div className="modal__stat">{leftStat}</div>
            <div className="modal__stat-label">{leftLabel}</div>
            <div className="modal__text">Zangia.mn-д бүртгэлгүй юу?</div>
            <button className="btn btn--primary" style={{ width: '100%' }} onClick={() => { setSection(section === "login" ? "register" : "login"); setRegStep(1); setError(""); }}>
              {section === "login" ? "Бүртгүүлэх" : "Нэвтрэх"}
            </button>
          </div>
          <div className="modal__right">
            <div className="modal__tabs">
              <div className={`modal__tab ${activeTab === "seeker" ? "modal__tab--active" : ""}`} onClick={() => setActiveTab("seeker")}>
                Ажил хайгч
              </div>
              <div className={`modal__tab ${activeTab === "employer" ? "modal__tab--active" : ""}`} onClick={() => setActiveTab("employer")}>
                🏢 Ажил олгогч
              </div>
            </div>

            {error && <div className="form-field__error" style={{ marginBottom: 10 }}>{error}</div>}

            {section === "login" && (
              <div className="form-section form-section--active">
                <div className="modal__title">Нэвтрэх</div>
                <div className="form-field">
                  <label className="form-field__label">Утасны дугаар эсвэл имэйл хаяг</label>
                  <input className="form-field__input" value={form.loginId} onChange={e => updateForm("loginId", e.target.value)} placeholder="Заавал оруулах" />
                </div>
                <div className="form-field">
                  <label className="form-field__label">Нууц үг <span style={{ float: "right", color: "#1a56db", fontSize: 12, cursor: "pointer" }}>Нууц үг сэргээх</span></label>
                  <div className="pass-wrap">
                    <input className="form-field__input" type={showPass ? "text" : "password"} value={form.loginPass} onChange={e => updateForm("loginPass", e.target.value)} placeholder="Заавал оруулах" />
                    <button className="pass-wrap__toggle" onClick={() => setShowPass(!showPass)}>{showPass ? "🙈" : "👁"}</button>
                  </div>
                </div>
                <label className="checkbox">
                  <input type="checkbox" /> Сануулах
                </label>
                <button className="btn btn--primary" style={{ width: '100%', marginTop: 6 }} onClick={handleLogin} disabled={loading}>
                  {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
                </button>
                <div className="divider">
                  <div className="divider__line"></div>
                  <span className="divider__text">эсвэл</span>
                  <div className="divider__line"></div>
                </div>
                <button className="social-btn">Google-р нэвтрэх</button>
              </div>
            )}

            {section === "register" && (
              <div className="form-section form-section--active">
                <div className="step-indicator">
                  <div className={`step-indicator__step ${regStep >= 1 ? "step-indicator__step--active" : ""}`}>1</div>
                  <div className={`step-indicator__line ${regStep >= 2 ? "step-indicator__line--done" : ""}`}></div>
                  <div className={`step-indicator__step ${regStep >= 2 ? "step-indicator__step--done" : ""}`}>2</div>
                </div>
                <div className="modal__title">{regStep === 1 ? "Бүртгүүлэх" : "Нэмэлт мэдээлэл"}</div>

                {regStep === 1 && (
                  <div>
                    {activeTab === "seeker" ? (
                      <>
                        <div className="form-field"><label className="form-field__label">Овог <span>*</span></label><input className="form-field__input" value={form.lastname} onChange={e => updateForm("lastname", e.target.value)} placeholder="Заавал оруулах" /></div>
                        <div className="form-field"><label className="form-field__label">Нэр <span>*</span></label><input className="form-field__input" value={form.firstname} onChange={e => updateForm("firstname", e.target.value)} placeholder="Заавал оруулах" /></div>
                        <div className="form-field"><label className="form-field__label">Утасны дугаар <span>*</span></label><input className="form-field__input" value={form.phone} onChange={e => updateForm("phone", e.target.value)} placeholder="Заавал оруулах" type="tel" /></div>
                        <div className="form-field"><label className="form-field__label">Имэйл хаяг <span>*</span></label><input className="form-field__input" value={form.email} onChange={e => updateForm("email", e.target.value)} placeholder="Заавал оруулах" type="email" /></div>
                      </>
                    ) : (
                      <>
                        <div className="form-field"><label className="form-field__label">Төлөөлөгчийн овог <span>*</span></label><input className="form-field__input" value={form.elast} onChange={e => updateForm("elast", e.target.value)} placeholder="Заавал оруулах" /></div>
                        <div className="form-field"><label className="form-field__label">Төлөөлөгчийн нэр <span>*</span></label><input className="form-field__input" value={form.efirst} onChange={e => updateForm("efirst", e.target.value)} placeholder="Заавал оруулах" /></div>
                        <div className="form-field"><label className="form-field__label">Утасны дугаар <span>*</span></label><input className="form-field__input" value={form.ephone} onChange={e => updateForm("ephone", e.target.value)} placeholder="Заавал оруулах" type="tel" /></div>
                        <div className="form-field"><label className="form-field__label">Имэйл хаяг <span>*</span></label><input className="form-field__input" value={form.eemail} onChange={e => updateForm("eemail", e.target.value)} placeholder="Заавал оруулах" type="email" /></div>
                      </>
                    )}
                    <div className="form-field">
                      <label className="form-field__label">Нэвтрэх нууц үг <span>*</span></label>
                      <div className="pass-wrap">
                        <input className="form-field__input" type={showPass ? "text" : "password"} value={form.password} onChange={e => updateForm("password", e.target.value)} placeholder="Заавал оруулах" />
                        <button className="pass-wrap__toggle" onClick={() => setShowPass(!showPass)}>{showPass ? "🙈" : "👁"}</button>
                      </div>
                    </div>
                    <button className="btn btn--primary" style={{ width: '100%' }} onClick={() => setRegStep(2)}>Үргэлжлүүлэх</button>
                  </div>
                )}

                {regStep === 2 && (
                  <div>
                    {activeTab === "seeker" ? (
                      <>
                        <div className="form-field">
                          <label className="form-field__label">Мэргэжил / чиглэл</label>
                          <select className="form-field__select" value={form.profession} onChange={e => updateForm("profession", e.target.value)}>
                            <option value="">Сонгох...</option>
                            <option>IT / Технологи</option>
                            <option>Санхүү / Нягтлан</option>
                            <option>Маркетинг</option>
                            <option>Инженер</option>
                            <option>Эрүүл мэнд</option>
                            <option>Боловсрол</option>
                            <option>Бусад</option>
                          </select>
                        </div>
                        <div className="form-field">
                          <label className="form-field__label">Туршлагын жил</label>
                          <select className="form-field__select" value={form.experience} onChange={e => updateForm("experience", e.target.value)}>
                            <option>Туршлагагүй</option>
                            <option>1-2 жил</option>
                            <option>3-5 жил</option>
                            <option>5+ жил</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="form-field"><label className="form-field__label">Компанийн нэр <span>*</span></label><input className="form-field__input" value={form.cname} onChange={e => updateForm("cname", e.target.value)} placeholder="Заавал оруулах" /></div>
                        <div className="form-field">
                          <label className="form-field__label">Салбар</label>
                          <select className="form-field__select" value={form.sector} onChange={e => updateForm("sector", e.target.value)}>
                            <option>IT / Технологи</option>
                            <option>Уул уурхай</option>
                            <option>Санхүү / Банк</option>
                            <option>Худалдаа</option>
                            <option>Бусад</option>
                          </select>
                        </div>
                        <div className="form-field">
                          <label className="form-field__label">Ажилтны тоо</label>
                          <select className="form-field__select" value={form.employees} onChange={e => updateForm("employees", e.target.value)}>
                            <option>1-10</option>
                            <option>11-50</option>
                            <option>51-200</option>
                            <option>200+</option>
                          </select>
                        </div>
                      </>
                    )}
                    <button className="btn btn--primary" style={{ width: '100%' }} onClick={handleRegister} disabled={loading}>
                      {loading ? "Түр хүлээнэ үү..." : "Бүртгүүлэх"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <button className="modal__close" onClick={() => navigate('/')}>✕</button>
      </div>
    </div>
  )
}
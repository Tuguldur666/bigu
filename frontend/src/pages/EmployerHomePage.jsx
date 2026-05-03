import { useState, useEffect } from "react";
import JobPostPage from "./JobPostPage";

const styles = {
  navbar: { background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 28px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
  logoImg: { width: 34, height: 34, background: "#1a56db", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { display: "flex", flexDirection: "column" },
  logoName: { fontSize: 20, fontWeight: 700, color: "#1a56db", lineHeight: 1 },
  logoTagline: { fontSize: 8, color: "#999", lineHeight: 1.4 },
  navLinks: { display: "flex", gap: 20, alignItems: "center" },
  navLink: { fontSize: 14, color: "#333", cursor: "pointer", fontWeight: 500 },
  navRight: { display: "flex", gap: 10, alignItems: "center" },
  btnNevtreh: { background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  btnAjilOlgogch: { background: "#fff", color: "#1a56db", border: "1.5px solid #1a56db", borderRadius: 8, padding: "8px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  hero: { background: "#fff", padding: "32px 28px 24px", textAlign: "center", borderBottom: "1px solid #eee" },
  searchWrap: { display: "flex", maxWidth: 660, margin: "0 auto 18px", gap: 10 },
  searchInput: { flex: 1, border: "1.5px solid #d0d8f0", borderRadius: 10, padding: "12px 16px", fontSize: 15, outline: "none", background: "#fff", color: "#333" },
  btnFilter: { background: "#1a56db", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" },
  filterTags: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 760, margin: "0 auto" },
  ftag: { background: "#fff", border: "1px solid #dde3f0", borderRadius: 20, padding: "7px 16px", fontSize: 13, color: "#444", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
  section: { padding: "24px 28px" },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: "#222", marginBottom: 16 },
  companyGrid: { display: "flex", flexWrap: "wrap", gap: 10 },
  companyCard: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 90, height: 60, cursor: "pointer" },
  companyName: { fontSize: 12, fontWeight: 700, color: "#1a56db", textAlign: "center" },
  overlay: { display: "none", position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, alignItems: "center", justifyContent: "center" },
  modal: { background: "#fff", borderRadius: 16, overflow: "hidden", display: "flex", width: 820, maxWidth: "96vw", minHeight: 460, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" },
  modalLeft: { background: "#1a56db", width: 300, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "36px 24px", textAlign: "center" },
  modalRight: { flex: 1, padding: "36px 32px", overflowY: "auto" },
  field: { marginBottom: 14 },
  fieldLabel: { display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 5 },
  input: { width: "100%", border: "1.5px solid #d0d8f0", borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", color: "#333", background: "#fff" },
  btnSubmit: { width: "100%", background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 6 },
  modalTab: { display: "flex", marginBottom: 24, gap: 0 },
  mtab: { flex: 1, padding: 10, border: "1px solid #dde3f0", fontSize: 14, fontWeight: 600, cursor: "pointer", textAlign: "center", color: "#888", background: "#f9f9f9" },
  modalTitle: { fontSize: 22, fontWeight: 700, color: "#1a56db", marginBottom: 20 },
  formSection: { display: "none" },
  passWrap: { position: "relative" },
  eyeBtn: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 16 },
  stepIndicator: { display: "flex", alignItems: "center", gap: 6, marginBottom: 20 },
  step: { width: 28, height: 28, borderRadius: "50%", border: "2px solid #dde3f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#aaa" },
  stepLine: { flex: 1, height: 2, background: "#dde3f0" },
  closeBtn: { position: "absolute", top: 14, right: 18, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#aaa", zIndex: 1 },
  successBox: { textAlign: "center", padding: "20px 0" },
  successIcon: { width: 64, height: 64, background: "#e8f5e9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32 },
  successTitle: { fontSize: 20, fontWeight: 700, color: "#22c55e", marginBottom: 8 },
  successSub: { fontSize: 14, color: "#666", marginBottom: 20 },
  leftStat: { fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.2 },
  leftText: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 14 },
  btnRegister: { background: "#fff", color: "#1a56db", border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%" },
  divider: { display: "flex", alignItems: "center", gap: 10, margin: "14px 0" },
  dividerLine: { flex: 1, height: 1, background: "#e8e8e8" },
  dividerText: { fontSize: 13, color: "#aaa", whiteSpace: "nowrap" },
  errorMsg: { fontSize: 12, color: "#e53e3e", marginTop: 4, display: "none" },
  pwdHint: { fontSize: 11, color: "#aaa", display: "flex", alignItems: "center", gap: 5, marginTop: 3 },
  dashboard: { padding: 28 },
  dashTitle: { fontSize: 15, fontWeight: 700, color: "#222", marginBottom: 12 },
  dashStats: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 },
  dstat: { background: "#fff", borderRadius: 8, padding: 12, textAlign: "center", border: "1px solid #eee" },
  dstatNum: { fontSize: 20, fontWeight: 700, color: "#1a56db" },
  dstatLabel: { fontSize: 11, color: "#888", marginTop: 2 },
  applicantList: { display: "flex", flexDirection: "column", gap: 8 },
  applicantItem: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  applicantName: { fontSize: 14, fontWeight: 600, color: "#222" },
  applicantMeta: { fontSize: 12, color: "#888", marginTop: 2 },
  badge: { display: "inline-block", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 },
  navbarUser: { display: "flex", alignItems: "center", gap: 10 },
  userAvatar: { width: 32, height: 32, background: "#1a56db", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 },
  userName: { fontSize: 14, color: "#333", fontWeight: 500 },
  btnLogout: { background: "none", border: "1px solid #dde3f0", borderRadius: 6, padding: "5px 12px", fontSize: 12, color: "#666", cursor: "pointer" },
  jobPostBtn: { background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
};

const companies = ['МОНОС', 'МАК', 'GS25', 'Голомт Банк', 'Skytel', 'mobicom', 'gmobile', 'MCS', 'BSB', 'MOGUL', 'Pepsi', 'APU', 'Санар', 'MSM', 'TESO', 'Витафит', 'Макс Групп', 'PC mall', 'Жур Ур', 'Шунхлай', 'Азифарм', 'InvesCore', 'next', 'Арюун', 'Badrakh Energy'];

const Navbar = ({ user, onLogin, onLogout, onShowHome }) => (
  <div style={styles.navbar}>
    <div style={styles.logo} onClick={onShowHome}>
      <div style={styles.logoImg}><span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Z</span></div>
      <div style={styles.logoText}>
        <span style={styles.logoName}>Bigu.mn</span>
        <span style={styles.logoTagline}>МОНГОЛЫН ИРГЭН БҮРД АЖЛЫН БАЙР!</span>
      </div>
    </div>
    <div style={styles.navLinks}>
      <span style={styles.navLink}>Ажлын зар</span>
      <span style={styles.navLink}>Компани</span>
      <span style={styles.navLink}>GWA</span>
    </div>
    <div style={styles.navRight}>
      {user ? (
        <div style={styles.navbarUser}>
          <div style={styles.userAvatar}>{user.name[0].toUpperCase()}</div>
          <span style={styles.userName}>{user.name}</span>
          <button style={styles.btnLogout} onClick={onLogout}>Гарах</button>
        </div>
      ) : (
        <>
          <button style={styles.btnNevtreh} onClick={() => onLogin("seeker")}>Нэвтрэх</button>
          <button style={styles.btnAjilOlgogch} onClick={() => onLogin("employer")}>Ажил олгогч</button>
        </>
      )}
    </div>
  </div>
);

const Modal = ({ show, onClose, activeTab, onTabChange, onLogin, onRegister, onSwitchSide }) => {
  const [section, setSection] = useState("login");
  const [regStep, setRegStep] = useState(1);
  const [form, setForm] = useState({});
  const [showPass, setShowPass] = useState(false);

  if (!show) return null;

  const leftStat = activeTab === "employer" ? "10'000+" : "1,200,000";
  const leftLabel = activeTab === "employer" ? "байгууллага хүний нөөцөө бүрдүүлж байна" : "хэрэглэгчтэй";

  return (
    <div style={{ ...styles.overlay, display: "flex" }} onClick={onClose}>
      <div style={{ position: "relative" }}>
        <div style={styles.modal} onClick={e => e.stopPropagation()}>
          <div style={styles.modalLeft}>
            <div style={{ width: 110, height: 110, background: "rgba(255,255,255,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22, border: "3px solid rgba(255,255,255,0.3)" }}>
              <svg width={70} height={70} viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="28" r="18" fill="#f97316"/>
                <ellipse cx="40" cy="72" rx="28" ry="18" fill="#f97316"/>
              </svg>
            </div>
            <div style={styles.leftStat}>{leftStat}</div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.9)", marginBottom: 4 }}>{leftLabel}</div>
            <div style={styles.leftText}>Bigu.mn-д бүртгэлгүй юу?</div>
            <button style={styles.btnRegister} onClick={() => { setSection("register"); setRegStep(1); }}>
              {section === "login" ? "Бүртгүүлэх" : "Нэвтрэх"}
            </button>
          </div>
          <div style={styles.modalRight}>
            <div style={styles.modalTab}>
              <div style={{ ...styles.mtab, borderRadius: "8px 0 0 8px", ...(activeTab === "seeker" ? { background: "#1a56db", color: "#fff", borderColor: "#1a56db" } : {}) }} onClick={() => onTabChange("seeker")}>
                Ажил хайгч
              </div>
              <div style={{ ...styles.mtab, borderRadius: "0 8px 8px 0", ...(activeTab === "employer" ? { background: "#1a56db", color: "#fff", borderColor: "#1a56db" } : {}) }} onClick={() => onTabChange("employer")}>
                🏢 Ажил олгогч
              </div>
            </div>

            {section === "login" && (
              <div style={{ display: "block" }}>
                <div style={styles.modalTitle}>Нэвтрэх</div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Утасны дугаар эсвэл имэйл хаяг</label>
                  <input style={styles.input} placeholder="Заавал оруулах" />
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Нууц үг <span style={{ float: "right", color: "#1a56db", fontSize: 12, cursor: "pointer" }}>Нууц үг сэргээх</span></label>
                  <div style={styles.passWrap}>
                    <input style={{ ...styles.input, paddingRight: 42 }} type={showPass ? "text" : "password"} placeholder="Заавал оруулах" />
                    <button style={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>{showPass ? "🙈" : "👁"}</button>
                  </div>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#555", marginBottom: 14, cursor: "pointer" }}>
                  <input type="checkbox" style={{ width: 14, height: 14 }} /> Сануулах
                </label>
                <button style={styles.btnSubmit} onClick={onLogin}>Нэвтрэх</button>
                <div style={styles.divider}>
                  <div style={styles.dividerLine}></div>
                  <span style={styles.dividerText}>эсвэл</span>
                  <div style={styles.dividerLine}></div>
                </div>
                <button style={{ ...styles.btnSubmit, background: "#fff", color: "#333", border: "1.5px solid #dde3f0" }}>Google-р нэвтрэх</button>
              </div>
            )}

            {section === "register" && (
              <div>
                <div style={styles.stepIndicator}>
                  <div style={{ ...styles.step, ...(regStep >= 1 ? { borderColor: "#1a56db", background: "#1a56db", color: "#fff" } : {}) }}>1</div>
                  <div style={{ ...styles.stepLine, ...(regStep >= 2 ? { background: "#22c55e" } : {}) }}></div>
                  <div style={{ ...styles.step, ...(regStep >= 2 ? { borderColor: "#22c55e", background: "#22c55e", color: "#fff" } : {}) }}>2</div>
                </div>
                <div style={styles.modalTitle}>{regStep === 1 ? "Бүртгүүлэх" : "Нэмэлт мэдээлэл"}</div>

                {regStep === 1 && (
                  <div>
                    {activeTab === "seeker" ? (
                      <>
                        <div style={styles.field}><label style={styles.fieldLabel}>Овог <span style={{ color: "#e53e3e" }}>*</span></label><input style={styles.input} placeholder="Заавал оруулах" /></div>
                        <div style={styles.field}><label style={styles.fieldLabel}>Нэр <span style={{ color: "#e53e3e" }}>*</span></label><input style={styles.input} placeholder="Заавал оруулах" /></div>
                        <div style={styles.field}><label style={styles.fieldLabel}>Утасны дугаар <span style={{ color: "#e53e3e" }}>*</span></label><input style={styles.input} placeholder="Заавал оруулах" type="tel" /></div>
                        <div style={styles.field}><label style={styles.fieldLabel}>Имэйл хаяг <span style={{ color: "#e53e3e" }}>*</span></label><input style={styles.input} placeholder="Заавал оруулах" type="email" /></div>
                      </>
                    ) : (
                      <>
                        <div style={styles.field}><label style={styles.fieldLabel}>Төлөөлөгчийн овог <span style={{ color: "#e53e3e" }}>*</span></label><input style={styles.input} placeholder="Заавал оруулах" /></div>
                        <div style={styles.field}><label style={styles.fieldLabel}>Төлөөлөгчийн нэр <span style={{ color: "#e53e3e" }}>*</span></label><input style={styles.input} placeholder="Заавал оруулах" /></div>
                        <div style={styles.field}><label style={styles.fieldLabel}>Утасны дугаар <span style={{ color: "#e53e3e" }}>*</span></label><input style={styles.input} placeholder="Заавал оруулах" type="tel" /></div>
                        <div style={styles.field}><label style={styles.fieldLabel}>Имэйл хаяг <span style={{ color: "#e53e3e" }}>*</span></label><input style={styles.input} placeholder="Заавал оруулах" type="email" /></div>
                      </>
                    )}
                    <div style={styles.field}>
                      <label style={styles.fieldLabel}>Нэвтрэх нууц үг <span style={{ color: "#e53e3e" }}>*</span></label>
                      <div style={styles.passWrap}>
                        <input style={{ ...styles.input, paddingRight: 42 }} type={showPass ? "text" : "password"} placeholder="Заавал оруулах" />
                        <button style={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>{showPass ? "🙈" : "👁"}</button>
                      </div>
                    </div>
                    <button style={styles.btnSubmit} onClick={() => setRegStep(2)}>Үргэлжлүүлэх</button>
                  </div>
                )}

                {regStep === 2 && (
                  <div>
                    {activeTab === "seeker" ? (
                      <>
                        <div style={styles.field}>
                          <label style={styles.fieldLabel}>Мэргэжил / чиглэл</label>
                          <select style={styles.input}>
                            <option>Сонгох...</option>
                            <option>IT / Технологи</option>
                            <option>Санхүү / Нягтлан</option>
                            <option>Маркетинг</option>
                            <option>Инженер</option>
                            <option>Эрүүл мэнд</option>
                            <option>Боловсрол</option>
                            <option>Бусад</option>
                          </select>
                        </div>
                        <div style={styles.field}>
                          <label style={styles.fieldLabel}>Туршлагын жил</label>
                          <select style={styles.input}>
                            <option>Туршлагагүй</option>
                            <option>1-2 жил</option>
                            <option>3-5 жил</option>
                            <option>5+ жил</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={styles.field}><label style={styles.fieldLabel}>Компанийн нэр <span style={{ color: "#e53e3e" }}>*</span></label><input style={styles.input} placeholder="Заавал оруулах" /></div>
                        <div style={styles.field}>
                          <label style={styles.fieldLabel}>Салбар</label>
                          <select style={styles.input}>
                            <option>IT / Технологи</option>
                            <option>Уул уурхай</option>
                            <option>Санхүү / Банк</option>
                            <option>Худалдаа</option>
                            <option>Бусад</option>
                          </select>
                        </div>
                        <div style={styles.field}>
                          <label style={styles.fieldLabel}>Ажилтны тоо</label>
                          <select style={styles.input}>
                            <option>1-10</option>
                            <option>11-50</option>
                            <option>51-200</option>
                            <option>200+</option>
                          </select>
                        </div>
                      </>
                    )}
                    <button style={styles.btnSubmit} onClick={onRegister}>Бүртгүүлэх</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

const HomePage = () => (
  <div>
    <div style={styles.hero}>
      <div style={styles.searchWrap}>
        <input style={styles.searchInput} placeholder="Та ямар ажил хайж байна вэ?" />
        <button style={styles.btnFilter}>
          <svg width={15} height={15} viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M6 10h8M9 15h2" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
          </svg>
          Дэлгэрэнгүй шүүлт
        </button>
      </div>
      <div style={styles.filterTags}>
        {["📍 Надад ойр", "🕐 Цагийн ажил", "💵 Өндөр цалинтай", "🌐 Jobs in English", "👤 Туршлага хамаарахгүй", "Internship & Mentorship"].map((tag, i) => (
          <div key={i} style={{ ...styles.ftag, ...(i === 5 ? { background: "#0bc5b8", borderColor: "#0bc5b8", color: "#fff" } : {}) }}>{tag}</div>
        ))}
      </div>
    </div>
    <div style={styles.section}>
      <div style={styles.sectionTitle}>Алтан гишүүд</div>
      <div style={styles.companyGrid}>
        {companies.map(c => (
          <div key={c} style={styles.companyCard}><div style={styles.companyName}>{c}</div></div>
        ))}
      </div>
    </div>
  </div>
);

const Dashboard = ({ user, onJobPost }) => (
  <div style={styles.dashboard}>
    <div style={styles.dashTitle}>Сайн байна уу, {user.name}!</div>
    <div style={styles.dashStats}>
      <div style={styles.dstat}><div style={styles.dstatNum}>2</div><div style={styles.dstatLabel}>Нийтлэсэн зар</div></div>
      <div style={styles.dstat}><div style={styles.dstatNum}>18</div><div style={styles.dstatLabel}>Ирсэн өргөдөл</div></div>
      <div style={styles.dstat}><div style={styles.dstatNum}>5</div><div style={styles.dstatLabel}>Шортлист</div></div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#222" }}>Ирсэн өргөдлүүд</div>
      <button style={styles.jobPostBtn} onClick={onJobPost}>+ Зар нийтлэх ↗</button>
    </div>
    <div style={styles.applicantList}>
      <div style={styles.applicantItem}>
        <div><div style={styles.applicantName}>Батболд Дорж</div><div style={styles.applicantMeta}>Frontend Developer · 3 жилийн туршлага</div></div>
        <span style={{ ...styles.badge, background: "#e8f0fe", color: "#1a56db" }}>Шинэ</span>
      </div>
      <div style={styles.applicantItem}>
        <div><div style={styles.applicantName}>Мөнхзул Б.</div><div style={styles.applicantMeta}>UI/UX Designer · 2 жилийн туршлага</div></div>
        <span style={{ ...styles.badge, background: "#fef3c7", color: "#b45309" }}>Харсан</span>
      </div>
      <div style={styles.applicantItem}>
        <div><div style={styles.applicantName}>Энхтүвшин Г.</div><div style={styles.applicantMeta}>React Native Dev · 4 жилийн туршлага</div></div>
        <span style={{ ...styles.badge, background: "#dcfce7", color: "#16a34a" }}>Сонгосон</span>
      </div>
    </div>
  </div>
);

export default function EmployerHomePage() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState("seeker");
  const [page, setPage] = useState("home");

  const handleLogin = (tab) => {
    setModalTab(tab);
    setShowModal(true);
  };

  const handleLoginSubmit = () => {
    setUser({ name: modalTab === "employer" ? "Компани" : "Хэрэглэгч", role: modalTab });
    setShowModal(false);
    setPage(modalTab === "employer" ? "dashboard" : "home");
  };

  const handleRegister = () => {
    setUser({ name: "Хэрэглэгч", role: modalTab });
    setShowModal(false);
    setPage(modalTab === "employer" ? "dashboard" : "home");
  };

  const handleLogout = () => {
    setUser(null);
    setPage("home");
  };

  const handleJobPost = () => {
    setPage("jobpost");
  };

  if (page === "jobpost") {
    return (
      <div>
        <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} onShowHome={() => setPage("home")} />
        <JobPostPage />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI',Arial,sans-serif", background: "#f5f6fa", minHeight: 600 }}>
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} onShowHome={() => setPage("home")} />
      {page === "home" && <HomePage />}
      {page === "dashboard" && <Dashboard user={user} onJobPost={handleJobPost} />}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        activeTab={modalTab}
        onTabChange={setModalTab}
        onLogin={handleLoginSubmit}
        onRegister={handleRegister}
      />
    </div>
  );
}
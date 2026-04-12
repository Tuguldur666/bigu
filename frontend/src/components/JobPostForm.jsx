import { useState } from "react";

const STEPS = ["Үндсэн мэдээлэл", "Дэлгэрэнгүй", "Шаардлага", "Нийтлэх"];

const Field = ({ label, required, error, children, hint }) => (
  <div className="form-field">
    <label className="form-field__label">
      {label} {required && <span>*</span>}
    </label>
    {children}
    {hint && <div className="form-field__hint">{hint}</div>}
    {error && <div className="form-field__error">{error}</div>}
  </div>
);

const RadioGroup = ({ options, value, onChange }) => (
  <div className="radio-group">
    {options.map(o => (
      <div key={o} className={`radio-group__item ${value === o ? 'radio-group__item--active' : ''}`} onClick={() => onChange(o)}>
        {o}
      </div>
    ))}
  </div>
);

export const Sidebar = ({ currentStep }) => (
  <div className="sidebar">
    <div className="sidebar__title">Алхамууд</div>
    {STEPS.map((label, i) => (
      <div key={i}>
        <div className={`sidebar__step ${i === currentStep ? 'sidebar__step--active' : ''} ${i < currentStep ? 'sidebar__step--done' : ''}`}>
          <div className="sidebar__step-icon">{i < currentStep ? "✓" : i + 1}</div>
          <span className="sidebar__step-label">{label}</span>
        </div>
        {i < 3 && <div className={`sidebar__line ${i < currentStep ? 'sidebar__line--done' : ''}`} />}
      </div>
    ))}
  </div>
);

export const JobPostForm = ({ onSubmit, loading = false }) => {
  const [step, setStep] = useState(0);
  const [draftMsg, setDraftMsg] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [f, setF] = useState({
    title: "", type: "", sector: "", location: "", deadline: "",
    salFrom: "", salTo: "",
    desc: "", benefit: "", hours: "09:00–18:00", days: "5 өдөр", env: "Оффис",
    edu: "Хамаарахгүй", exp: "Шаардахгүй", gender: "Хамаарахгүй", age: "Хамаарахгүй", extra: "",
    email: "", phone: "", plan: "Үнэгүй",
  });
  const [errs, setErrs] = useState({});

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (!f.title) e.title = "Ажлын байрны нэр оруулна уу";
      if (!f.type) e.type = "Ажлын төрөл сонгоно уу";
      if (!f.sector) e.sector = "Салбар сонгоно уу";
      if (!f.location) e.location = "Байршил сонгоно уу";
      if (!f.deadline) e.deadline = "Огноо сонгоно уу";
    }
    if (s === 1) {
      if (!f.desc.trim()) e.desc = "Тайлбар оруулна уу";
    }
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);
  const draft = () => { setDraftMsg("✓ Хадгалсан"); setTimeout(() => setDraftMsg(""), 2000); };
  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !skills.includes(v)) { setSkills(p => [...p, v]); setSkillInput(""); }
  };
  const sal = f.salFrom || f.salTo
    ? (f.salFrom ? Number(f.salFrom).toLocaleString() : "") + (f.salTo ? " – " + Number(f.salTo).toLocaleString() : "") + " ₮"
    : "Тохиролцоно";

  const card = (children, title, icon) => (
    <div className="form-card">
      {title && <div className="form-card__title">{icon} {title}</div>}
      {children}
    </div>
  );

  const btnRow = (showBack = true) => (
    <div className="form-actions">
      {showBack && <button className="form-actions__btn-back" onClick={back}>← Буцах</button>}
      <button className={`form-actions__btn-draft ${draftMsg ? 'form-actions__btn-draft--saved' : ''}`} onClick={draft}>{draftMsg || "Ноороглох"}</button>
      {step < 3
        ? <button className="form-actions__btn-next" onClick={next}>Дараах →</button>
        : <button className="form-actions__btn-submit" onClick={() => onSubmit({ 
          title: f.title,
          type: f.type,
          sector: f.sector,
          location: f.location,
          deadline: f.deadline,
          salFrom: f.salFrom ? Number(f.salFrom) : null,
          salTo: f.salTo ? Number(f.salTo) : null,
          description: f.desc,
          benefits: f.benefit,
          workHours: f.hours,
          workDays: f.days,
          workEnvironment: f.env,
          education: f.edu,
          experience: f.exp,
          gender: f.gender,
          ageRange: f.age,
          skills: skills,
          extra: f.extra,
          contactEmail: f.email,
          contactPhone: f.phone,
          plan: f.plan,
        })} disabled={loading}>
          {loading ? 'Нийтлэж байна...' : '✓ Нийтлэх'}
        </button>
      }
    </div>
  );

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="form-progress">
        <div className="form-progress__bar" style={{ width: `${(step + 1) * 25}%` }} />
      </div>

      {step === 0 && <>
        {card(<>
          <Field label="Ажлын байрны нэр" required error={errs.title}>
            <input className="form-field__input" style={{ borderColor: errs.title ? "#e53e3e" : "" }} value={f.title} onChange={e => set("title", e.target.value)} placeholder="Жишээ: Frontend Developer, Нягтлан бодогч..." />
          </Field>
          <div className="grid-2">
            <Field label="Ажлын төрөл" required error={errs.type}>
              <select className="form-field__select" style={{ borderColor: errs.type ? "#e53e3e" : "" }} value={f.type} onChange={e => set("type", e.target.value)}>
                <option value="">Сонгох...</option>
                {["Бүтэн цаг","Хагас цаг","Цагийн","Гэрээт","Дадлага","Зайнаас"].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Салбар" required error={errs.sector}>
              <select className="form-field__select" style={{ borderColor: errs.sector ? "#e53e3e" : "" }} value={f.sector} onChange={e => set("sector", e.target.value)}>
                <option value="">Сонгох...</option>
                {["IT / Технологи","Санхүү / Нягтлан","Маркетинг","Инженер","Эрүүл мэнд","Боловсрол","Уул уурхай","Бусад"].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid-2">
            <Field label="Байршил" required error={errs.location}>
              <select className="form-field__select" style={{ borderColor: errs.location ? "#e53e3e" : "" }} value={f.location} onChange={e => set("location", e.target.value)}>
                <option value="">Сонгох...</option>
                {["Улаанбаатар","Дархан","Эрдэнэт","Зайнаас","Бусад аймаг"].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Дуусах огноо" required error={errs.deadline}>
              <input type="date" className="form-field__input" style={{ borderColor: errs.deadline ? "#e53e3e" : "" }} value={f.deadline} min={new Date().toISOString().split("T")[0]} onChange={e => set("deadline", e.target.value)} />
            </Field>
          </div>
          <Field label="Цалин (₮)" hint="Хоосон орхивол 'Тохиролцоно' харагдана">
            <div className="salary-input">
              <input className="form-field__input salary-input__field" type="number" min="0" value={f.salFrom} onChange={e => set("salFrom", e.target.value)} placeholder="800,000" />
              <span className="salary-input__separator">—</span>
              <input className="form-field__input salary-input__field" type="number" min="0" value={f.salTo} onChange={e => set("salTo", e.target.value)} placeholder="2,000,000" />
              <div className="salary-input__currency">₮</div>
            </div>
          </Field>
        </>, "Үндсэн мэдээлэл", "📋")}
        {btnRow(false)}
      </>}

      {step === 1 && <>
        {card(<>
          <Field label="Тайлбар" required error={errs.desc}>
            <textarea className="form-field__textarea" style={{ borderColor: errs.desc ? "#e53e3e" : "" }} value={f.desc} onChange={e => set("desc", e.target.value)} placeholder="Ажлын байрны үндсэн чиг үүрэг, хариуцах ажлуудаа тайлбарлана уу..." />
            <div className="form-field__count">{f.desc.length}/1000</div>
          </Field>
          <Field label="Давуу тал / Урамшуулал">
            <textarea className="form-field__textarea" value={f.benefit} onChange={e => set("benefit", e.target.value)} placeholder="Жишээ: Уян хатан цагийн хуваарь, эрүүл мэндийн даатгал..." />
            <div className="form-field__count">{f.benefit.length}/500</div>
          </Field>
        </>, "Ажлын байрны тайлбар", "📝")}
        {card(<>
          <div className="grid-3">
            <Field label="Ажлын цаг"><select className="form-field__select" value={f.hours} onChange={e => set("hours", e.target.value)}>{["09:00–18:00","08:00–17:00","Уян хатан","Ээлжийн"].map(o=><option key={o}>{o}</option>)}</select></Field>
            <Field label="7 хоногт"><select className="form-field__select" value={f.days} onChange={e => set("days", e.target.value)}>{["5 өдөр","6 өдөр","Уян хатан"].map(o=><option key={o}>{o}</option>)}</select></Field>
            <Field label="Орчин"><select className="form-field__select" value={f.env} onChange={e => set("env", e.target.value)}>{["Оффис","Зайнаас","Хосолсон"].map(o=><option key={o}>{o}</option>)}</select></Field>
          </div>
        </>, "Ажлын нөхцөл", "🏢")}
        {btnRow()}
      </>}

      {step === 2 && <>
        {card(<>
          <div className="grid-2">
            <Field label="Боловсрол"><select className="form-field__select" value={f.edu} onChange={e => set("edu", e.target.value)}>{["Хамаарахгүй","Дунд боловсрол","Техникийн","Бакалавр","Магистр","Доктор"].map(o=><option key={o}>{o}</option>)}</select></Field>
            <Field label="Туршлага"><select className="form-field__select" value={f.exp} onChange={e => set("exp", e.target.value)}>{["Шаардахгүй","1 жилээс дээш","2 жилээс дээш","3 жилээс дээш","5 жилээс дээш"].map(o=><option key={o}>{o}</option>)}</select></Field>
          </div>
          <Field label="Хүйс"><RadioGroup options={["Хамаарахгүй","Эрэгтэй","Эмэгтэй"]} value={f.gender} onChange={v => set("gender", v)} /></Field>
          <Field label="Насны хязгаар"><RadioGroup options={["Хамаарахгүй","18–25","25–35","35–45","45+"]} value={f.age} onChange={v => set("age", v)} /></Field>
          <Field label="Ур чадвар">
            <div className="skills">
              {skills.map((s, i) => (
                <div key={i} className="skill-tag">
                  {s}
                  <button className="skill-tag__remove" onClick={() => setSkills(p => p.filter((_, j) => j !== i))}>×</button>
                </div>
              ))}
            </div>
            <div className="flex gap-7">
              <input className="form-field__input" style={{ flex: 1 }} value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} placeholder="React, Python, Excel... оруулж Enter дарна" />
              <button className="btn btn--primary" style={{ padding: "9px 14px", fontSize: 12, whiteSpace: "nowrap" }} onClick={addSkill}>+ Нэмэх</button>
            </div>
          </Field>
          <Field label="Нэмэлт шаардлага">
            <textarea className="form-field__textarea" value={f.extra} onChange={e => set("extra", e.target.value)} placeholder="Жишээ: Унаатай байх, гадаад хэл мэдэх..." />
          </Field>
        </>, "Шаардлага", "🎯")}
        {btnRow()}
      </>}

      {step === 3 && <>
        <div className="warning-box">👁 Нийтлэхээс өмнө шалгана уу</div>
        {card(<>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1a56db" }}>{f.title}</div>
            <div className="flex flex-wrap" style={{ gap: 5, marginTop: 7 }}>
              {[f.type, f.sector, `📍 ${f.location}`, f.deadline ? `📅 ${f.deadline} хүртэл` : ""].filter(Boolean).map(t => (
                <span key={t} style={{ background: "#eef3ff", borderRadius: 20, padding: "2px 10px", fontSize: 11, color: "#1a56db" }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ fontWeight: 700, color: "#22c55e", fontSize: 14, marginBottom: 10 }}>💵 {sal}</div>
          {f.desc && <div style={{ marginBottom: 10 }}><div style={{ fontWeight: 600, fontSize: 13 }}>Тайлбар</div><div style={{ color: "#555", fontSize: 13, marginTop: 4, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{f.desc}</div></div>}
          {f.benefit && <div style={{ marginBottom: 10 }}><div style={{ fontWeight: 600, fontSize: 13 }}>Давуу тал</div><div style={{ color: "#555", fontSize: 13, marginTop: 4, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{f.benefit}</div></div>}
          <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}><b>Боловсрол:</b> {f.edu} &nbsp;|&nbsp; <b>Туршлага:</b> {f.exp}</div>
          {skills.length > 0 && <div style={{ fontSize: 12 }}><b>Ур чадвар:</b> {skills.map(s => <span key={s} style={{ background: "#eef3ff", borderRadius: 20, padding: "2px 8px", fontSize: 11, color: "#1a56db", marginLeft: 4 }}>{s}</span>)}</div>}
        </>, "Урьдчилан харах", "🔍")}
        {card(<>
          <Field label="Өргөдөл хүлээн авах имэйл">
            <input className="form-field__input" type="email" value={f.email} onChange={e => set("email", e.target.value)} placeholder="hr@company.mn" />
          </Field>
          <Field label="Холбогдох утас">
            <input className="form-field__input" type="tel" value={f.phone} onChange={e => set("phone", e.target.value)} placeholder="+976 9911 2233" />
          </Field>
          <Field label="Нийтлэлийн төрөл">
            <RadioGroup options={["Үнэгүй","Стандарт (₮49,000)","Алтан (₮99,000)"]} value={f.plan} onChange={v => set("plan", v)} />
          </Field>
        </>, "Нийтлэлийн тохиргоо", "⚙️")}
        {btnRow()}
      </>}
    </div>
  );
};

export { STEPS };
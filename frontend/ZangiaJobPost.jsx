import { useState } from "react";

const STEPS = ["Үндсэн мэдээлэл", "Дэлгэрэнгүй", "Шаардлага", "Нийтлэх"];

const Field = ({ label, required, error, children, hint }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5 }}>
      {label} {required && <span style={{ color: "#e53e3e" }}>*</span>}
    </label>
    {children}
    {hint && <div style={{ fontSize: 11, color: "#bbb", marginTop: 3 }}>{hint}</div>}
    {error && <div style={{ fontSize: 11, color: "#e53e3e", marginTop: 3 }}>{error}</div>}
  </div>
);

const inp = {
  width: "100%", border: "1.5px solid #d0d8f0", borderRadius: 7,
  padding: "9px 12px", fontSize: 13, outline: "none", color: "#333",
  background: "#fff", fontFamily: "inherit",
};

const sel = { ...inp };
const ta = { ...inp, resize: "vertical", minHeight: 90, lineHeight: 1.6 };

const RadioGroup = ({ options, value, onChange }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 5 }}>
    {options.map(o => (
      <div key={o} onClick={() => onChange(o)}
        style={{
          border: `1.5px solid ${value === o ? "#1a56db" : "#d0d8f0"}`,
          borderRadius: 7, padding: "7px 14px", fontSize: 13,
          cursor: "pointer", fontWeight: value === o ? 600 : 400,
          color: value === o ? "#1a56db" : "#666",
          background: value === o ? "#eef3ff" : "#fff",
          userSelect: "none",
        }}>
        {o}
      </div>
    ))}
  </div>
);

export default function ZangiaJobPost() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [draftMsg, setDraftMsg] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [f, setF] = useState({
    title: "", type: "", sector: "", location: "", deadline: "",
    salFrom: "", salTo: "",
    desc: "", benefit: "", hours: "09:00–18:00", days: "5 өдөр", env: "Оффис",
    edu: "Хамаарахгүй", exp: "Шаардахгүй", gender: "Хамаарахгүй", age: "Хамаарахгүй", extra: "",
    email: "", plan: "Үнэгүй",
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
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8e8e8", padding: "22px 24px", marginBottom: 14 }}>
      {title && (
        <div style={{ fontSize: 15, fontWeight: 700, color: "#222", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f2f2f2" }}>
          {icon} {title}
        </div>
      )}
      {children}
    </div>
  );

  const btnRow = (showBack = true) => (
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
      {showBack && <button onClick={back} style={{ background: "#fff", color: "#555", border: "1.5px solid #dde3f0", borderRadius: 7, padding: "9px 18px", fontSize: 13, cursor: "pointer" }}>← Буцах</button>}
      <button onClick={draft} style={{ background: "#fff", color: draftMsg ? "#22c55e" : "#1a56db", border: `1.5px solid ${draftMsg ? "#22c55e" : "#1a56db"}`, borderRadius: 7, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{draftMsg || "Ноороглох"}</button>
      {step < 3
        ? <button onClick={next} style={{ background: "#1a56db", color: "#fff", border: "none", borderRadius: 7, padding: "9px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Дараах →</button>
        : <button onClick={() => setDone(true)} style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: 7, padding: "9px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>✓ Нийтлэх</button>
      }
    </div>
  );

  if (done) return (
    <div style={{ fontFamily: "'Segoe UI',Arial,sans-serif", background: "#f5f6fa", minHeight: 600 }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, background: "#1a56db", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>Z</div>
          <span style={{ fontSize: 19, fontWeight: 700, color: "#1a56db" }}>zangia.mn</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, background: "#1a56db", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>М</div>
          <span style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>Миний Компани</span>
        </div>
      </div>
      <div style={{ maxWidth: 560, margin: "60px auto", textAlign: "center", padding: "0 20px" }}>
        <div style={{ width: 72, height: 72, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 16px" }}>✓</div>
        <div style={{ fontSize: 21, fontWeight: 700, color: "#16a34a", marginBottom: 6 }}>Ажлын зар амжилттай нийтлэгдлээ!</div>
        <div style={{ fontSize: 14, color: "#666", marginBottom: 22, lineHeight: 1.6 }}>Таны зар шалгагдаж байна.<br />Ихэвчлэн 1–2 цагийн дотор идэвхжинэ.</div>
        <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: 20, textAlign: "left", marginBottom: 22 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#1a56db", marginBottom: 3 }}>{f.title}</div>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 10 }}>Миний Компани</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
            {[f.type, f.sector, f.location].filter(Boolean).map(t => (
              <span key={t} style={{ background: "#eef3ff", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#1a56db" }}>{t}</span>
            ))}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#22c55e" }}>💵 {sal}</div>
        </div>
        <button onClick={() => { setDone(false); setStep(0); setF({ title:"",type:"",sector:"",location:"",deadline:"",salFrom:"",salTo:"",desc:"",benefit:"",hours:"09:00–18:00",days:"5 өдөр",env:"Оффис",edu:"Хамаарахгүй",exp:"Шаардахгүй",gender:"Хамаарахгүй",age:"Хамаарахгүй",extra:"",email:"",plan:"Үнэгүй" }); setSkills([]); }}
          style={{ background: "#fff", color: "#1a56db", border: "1.5px solid #1a56db", borderRadius: 7, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          + Шинэ зар нийтлэх
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI',Arial,sans-serif", background: "#f5f6fa", minHeight: 600 }}>
      {/* Navbar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, background: "#1a56db", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>Z</div>
          <div>
            <span style={{ fontSize: 19, fontWeight: 700, color: "#1a56db" }}>zangia.mn</span>
            <span style={{ display: "block", fontSize: 8, color: "#aaa" }}>МОНГОЛЫН ИРГЭН БҮРД АЖЛЫН БАЙР!</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          {["Ажлын зар", "Компани", "GWA"].map(l => <span key={l} style={{ fontSize: 13, color: "#444", cursor: "pointer", fontWeight: 500 }}>{l}</span>)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, background: "#1a56db", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>М</div>
          <span style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>Миний Компани</span>
          <button style={{ border: "1px solid #dde3f0", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#666", cursor: "pointer", background: "#fff" }}>Гарах</button>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "18px 20px" }}>
        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 6 }}>Ажил олгогч / <span style={{ color: "#1a56db", fontWeight: 500 }}>Ажлын зар нийтлэх</span></div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#222", marginBottom: 18 }}>Шинэ ажлын зар нийтлэх</div>

        <div style={{ display: "flex", gap: 20 }}>
          {/* Sidebar */}
          <div style={{ width: 185, flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 12 }}>Алхамууд</div>
            {STEPS.map((label, i) => (
              <div key={i}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, background: i === step ? "#eef3ff" : "transparent", marginBottom: 2 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", border: `2px solid ${i === step ? "#1a56db" : i < step ? "#22c55e" : "#dde3f0"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i === step ? "#fff" : i < step ? "#fff" : "#bbb", background: i === step ? "#1a56db" : i < step ? "#22c55e" : "transparent", flexShrink: 0 }}>{i < step ? "✓" : i + 1}</div>
                  <span style={{ fontSize: 13, color: i === step ? "#1a56db" : i < step ? "#22c55e" : "#777", fontWeight: i === step ? 600 : 500 }}>{label}</span>
                </div>
                {i < 3 && <div style={{ width: 2, height: 14, background: i < step ? "#22c55e" : "#e8e8e8", margin: "0 0 2px 22px" }} />}
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ background: "#e8eef8", borderRadius: 4, height: 4, marginBottom: 18, overflow: "hidden" }}>
              <div style={{ height: 4, background: "#1a56db", borderRadius: 4, width: `${(step + 1) * 25}%`, transition: "width .3s" }} />
            </div>

            {/* Step 1 */}
            {step === 0 && <>
              {card(<>
                <Field label="Ажлын байрны нэр" required error={errs.title}>
                  <input style={{ ...inp, borderColor: errs.title ? "#e53e3e" : "#d0d8f0" }} value={f.title} onChange={e => set("title", e.target.value)} placeholder="Жишээ: Frontend Developer, Нягтлан бодогч..." />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Ажлын төрөл" required error={errs.type}>
                    <select style={{ ...sel, borderColor: errs.type ? "#e53e3e" : "#d0d8f0" }} value={f.type} onChange={e => set("type", e.target.value)}>
                      <option value="">Сонгох...</option>
                      {["Бүтэн цаг","Хагас цаг","Цагийн","Гэрээт","Дадлага","Зайнаас"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field label="Салбар" required error={errs.sector}>
                    <select style={{ ...sel, borderColor: errs.sector ? "#e53e3e" : "#d0d8f0" }} value={f.sector} onChange={e => set("sector", e.target.value)}>
                      <option value="">Сонгох...</option>
                      {["IT / Технологи","Санхүү / Нягтлан","Маркетинг","Инженер","Эрүүл мэнд","Боловсрол","Уул уурхай","Бусад"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Байршил" required error={errs.location}>
                    <select style={{ ...sel, borderColor: errs.location ? "#e53e3e" : "#d0d8f0" }} value={f.location} onChange={e => set("location", e.target.value)}>
                      <option value="">Сонгох...</option>
                      {["Улаанбаатар","Дархан","Эрдэнэт","Зайнаас","Бусад аймаг"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field label="Дуусах огноо" required error={errs.deadline}>
                    <input type="date" style={{ ...inp, borderColor: errs.deadline ? "#e53e3e" : "#d0d8f0" }} value={f.deadline} min={new Date().toISOString().split("T")[0]} onChange={e => set("deadline", e.target.value)} />
                  </Field>
                </div>
                <Field label="Цалин (₮)" hint="Хоосон орхивол 'Тохиролцоно' харагдана">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input style={{ ...inp, flex: 1 }} type="number" min="0" value={f.salFrom} onChange={e => set("salFrom", e.target.value)} placeholder="800,000" />
                    <span style={{ fontSize: 13, color: "#bbb" }}>—</span>
                    <input style={{ ...inp, flex: 1 }} type="number" min="0" value={f.salTo} onChange={e => set("salTo", e.target.value)} placeholder="2,000,000" />
                    <div style={{ background: "#f5f5f5", border: "1.5px solid #d0d8f0", borderRadius: 7, padding: "9px 10px", fontSize: 13, color: "#555", fontWeight: 600, width: 52, textAlign: "center" }}>₮</div>
                  </div>
                </Field>
              </>, "Үндсэн мэдээлэл", "📋")}
              {btnRow(false)}
            </>}

            {/* Step 2 */}
            {step === 1 && <>
              {card(<>
                <Field label="Тайлбар" required error={errs.desc}>
                  <textarea style={{ ...ta, borderColor: errs.desc ? "#e53e3e" : "#d0d8f0" }} value={f.desc} onChange={e => set("desc", e.target.value)} placeholder="Ажлын байрны үндсэн чиг үүрэг, хариуцах ажлуудаа тайлбарлана уу..." />
                  <div style={{ fontSize: 11, color: "#bbb", textAlign: "right" }}>{f.desc.length}/1000</div>
                </Field>
                <Field label="Давуу тал / Урамшуулал">
                  <textarea style={ta} value={f.benefit} onChange={e => set("benefit", e.target.value)} placeholder="Жишээ: Уян хатан цагийн хуваарь, эрүүл мэндийн даатгал..." />
                  <div style={{ fontSize: 11, color: "#bbb", textAlign: "right" }}>{f.benefit.length}/500</div>
                </Field>
              </>, "Ажлын байрны тайлбар", "📝")}
              {card(<>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <Field label="Ажлын цаг"><select style={sel} value={f.hours} onChange={e => set("hours", e.target.value)}>{["09:00–18:00","08:00–17:00","Уян хатан","Ээлжийн"].map(o=><option key={o}>{o}</option>)}</select></Field>
                  <Field label="7 хоногт"><select style={sel} value={f.days} onChange={e => set("days", e.target.value)}>{["5 өдөр","6 өдөр","Уян хатан"].map(o=><option key={o}>{o}</option>)}</select></Field>
                  <Field label="Орчин"><select style={sel} value={f.env} onChange={e => set("env", e.target.value)}>{["Оффис","Зайнаас","Хосолсон"].map(o=><option key={o}>{o}</option>)}</select></Field>
                </div>
              </>, "Ажлын нөхцөл", "🏢")}
              {btnRow()}
            </>}

            {/* Step 3 */}
            {step === 2 && <>
              {card(<>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Боловсрол"><select style={sel} value={f.edu} onChange={e => set("edu", e.target.value)}>{["Хамаарахгүй","Дунд боловсрол","Техникийн","Бакалавр","Магистр","Доктор"].map(o=><option key={o}>{o}</option>)}</select></Field>
                  <Field label="Туршлага"><select style={sel} value={f.exp} onChange={e => set("exp", e.target.value)}>{["Шаардахгүй","1 жилээс дээш","2 жилээс дээш","3 жилээс дээш","5 жилээс дээш"].map(o=><option key={o}>{o}</option>)}</select></Field>
                </div>
                <Field label="Хүйс"><RadioGroup options={["Хамаарахгүй","Эрэгтэй","Эмэгтэй"]} value={f.gender} onChange={v => set("gender", v)} /></Field>
                <Field label="Насны хязгаар"><RadioGroup options={["Хамаарахгүй","18–25","25–35","35–45","45+"]} value={f.age} onChange={v => set("age", v)} /></Field>
                <Field label="Ур чадвар">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {skills.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, background: "#eef3ff", border: "1px solid #c7d7fa", borderRadius: 20, padding: "4px 11px", fontSize: 12, color: "#1a56db", fontWeight: 500 }}>
                        {s}
                        <button onClick={() => setSkills(p => p.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#1a56db", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 7 }}>
                    <input style={{ ...inp, flex: 1 }} value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} placeholder="React, Python, Excel... оруулж Enter дарна" />
                    <button onClick={addSkill} style={{ background: "#1a56db", color: "#fff", border: "none", borderRadius: 7, padding: "9px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>+ Нэмэх</button>
                  </div>
                </Field>
                <Field label="Нэмэлт шаардлага">
                  <textarea style={ta} value={f.extra} onChange={e => set("extra", e.target.value)} placeholder="Жишээ: Унаатай байх, гадаад хэл мэдэх..." />
                </Field>
              </>, "Шаардлага", "🎯")}
              {btnRow()}
            </>}

            {/* Step 4 Preview */}
            {step === 3 && <>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff8e1", border: "1px solid #ffc107", borderRadius: 7, padding: "7px 13px", fontSize: 12, color: "#856404", marginBottom: 14 }}>
                👁 Нийтлэхээс өмнө шалгана уу
              </div>
              {card(<>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#1a56db" }}>{f.title}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
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
                  <input style={inp} type="email" value={f.email} onChange={e => set("email", e.target.value)} placeholder="hr@company.mn" />
                </Field>
                <Field label="Нийтлэлийн төрөл">
                  <RadioGroup options={["Үнэгүй","Стандарт (₮49,000)","Алтан (₮99,000)"]} value={f.plan} onChange={v => set("plan", v)} />
                </Field>
              </>, "Нийтлэлийн тохиргоо", "⚙️")}
              {btnRow()}
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}

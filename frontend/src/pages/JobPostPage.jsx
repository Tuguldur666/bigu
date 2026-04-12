import { useState } from "react";
import { JobPostForm } from "../components/JobPostForm";
import { Sidebar } from "../components/Sidebar";

export default function JobPostPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleSubmit = (data) => {
    setFormData(data);
    setDone(true);
  };

  const reset = () => {
    setDone(false);
    setStep(0);
    setFormData(null);
  };

  const sal = formData?.salFrom || formData?.salTo
    ? (formData.salFrom ? Number(formData.salFrom).toLocaleString() : "") + (formData.salTo ? " – " + Number(formData.salTo).toLocaleString() : "") + " ₮"
    : "Тохиролцоно";

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
          <div style={{ fontSize: 17, fontWeight: 700, color: "#1a56db", marginBottom: 3 }}>{formData?.title}</div>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 10 }}>Миний Компани</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
            {[formData?.type, formData?.sector, formData?.location].filter(Boolean).map(t => (
              <span key={t} style={{ background: "#eef3ff", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#1a56db" }}>{t}</span>
            ))}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#22c55e" }}>💵 {sal}</div>
        </div>
        <button onClick={reset}
          style={{ background: "#fff", color: "#1a56db", border: "1.5px solid #1a56db", borderRadius: 7, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          + Шинэ зар нийтлэх
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI',Arial,sans-serif", background: "#f5f6fa", minHeight: 600 }}>
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
          <Sidebar currentStep={step} />
          <JobPostForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
import { STEPS } from "../components/JobPostForm";

export const Sidebar = ({ currentStep }) => (
  <div style={{ width: 185, flexShrink: 0 }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 12 }}>Алхамууд</div>
    {STEPS.map((label, i) => (
      <div key={i}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, background: i === currentStep ? "#eef3ff" : "transparent", marginBottom: 2 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", border: `2px solid ${i === currentStep ? "#1a56db" : i < currentStep ? "#22c55e" : "#dde3f0"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i === currentStep ? "#fff" : i < currentStep ? "#fff" : "#bbb", background: i === currentStep ? "#1a56db" : i < currentStep ? "#22c55e" : "transparent", flexShrink: 0 }}>{i < currentStep ? "✓" : i + 1}</div>
          <span style={{ fontSize: 13, color: i === currentStep ? "#1a56db" : i < currentStep ? "#22c55e" : "#777", fontWeight: i === currentStep ? 600 : 500 }}>{label}</span>
        </div>
        {i < 3 && <div style={{ width: 2, height: 14, background: i < currentStep ? "#22c55e" : "#e8e8e8", margin: "0 0 2px 22px" }} />}
      </div>
    ))}
  </div>
);
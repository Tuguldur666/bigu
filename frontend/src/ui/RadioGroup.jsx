export const RadioGroup = ({ options, value, onChange }) => (
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
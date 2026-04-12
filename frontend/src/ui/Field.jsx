export const Field = ({ label, required, error, children, hint }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5 }}>
      {label} {required && <span style={{ color: "#e53e3e" }}>*</span>}
    </label>
    {children}
    {hint && <div style={{ fontSize: 11, color: "#bbb", marginTop: 3 }}>{hint}</div>}
    {error && <div style={{ fontSize: 11, color: "#e53e3e", marginTop: 3 }}>{error}</div>}
  </div>
);
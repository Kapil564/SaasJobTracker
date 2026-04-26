import { useState, useEffect } from "react";

const STAGES = ["Saved", "Applied", "Screening", "Interviewing", "Offer", "Rejected"];
const JOB_TYPES = ["Remote", "Hybrid", "On-site"];
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
const EXPERIENCE_LEVELS = ["Entry level", "Mid level", "Senior level", "Lead", "Executive"];

const STAGE_COLORS = {
  Saved:        { bg: "#E8E8FF", color: "#4b4bcc", dot: "#6b6bff" },
  Applied:      { bg: "#DCEEFF", color: "#1a6fb5", dot: "#3b9eff" },
  Screening:    { bg: "#FFF3CC", color: "#9a6c00", dot: "#f5b800" },
  Interviewing: { bg: "#D6F5E3", color: "#1a7a47", dot: "#22c55e" },
  Offer:        { bg: "#E8FFF3", color: "#0d7a5f", dot: "#10b981" },
  Rejected:     { bg: "#FFE5EC", color: "#b51a3b", dot: "#f43f5e" },
};

const JOB_TYPE_EMOJI = { Remote: "🚀", Hybrid: "🏢", "On-site": "📍" };

function Select({ label, required, options, value, onChange, placeholder, renderOption }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      {label && (
        <label style={formStyles.label}>
          {label} {required && <span style={{ color: "#f43f5e" }}>*</span>}
        </label>
      )}
      <div
        onClick={() => setOpen(!open)}
        style={{
          ...formStyles.input,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          userSelect: "none",
        }}
      >
        <span style={{ color: value ? "#111" : "#aaa", fontSize: "13px" }}>
          {value ? (renderOption ? renderOption(value) : value) : placeholder}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="#aaa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "0.2s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#1e2130", borderRadius: "12px", zIndex: 100,
          overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}>
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: opt === value ? 600 : 400,
                background: opt === value ? "#3b5bff" : "transparent",
                color: opt === value ? "white" : "#ccc",
                transition: "background 0.15s",
                display: "flex", alignItems: "center", gap: "8px",
              }}
              onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = "#2a2f47"; }}
              onMouseLeave={e => { if (opt !== value) e.currentTarget.style.background = "transparent"; }}
            >
              {renderOption ? renderOption(opt) : opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Input({ label, required, icon, placeholder, value, onChange, type = "text" }) {
  return (
    <div>
      {label && (
        <label style={formStyles.label}>
          {label} {required && <span style={{ color: "#f43f5e" }}>*</span>}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position: "absolute", left: "13px", top: "50%",
            transform: "translateY(-50%)", fontSize: "14px",
          }}>{icon}</span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ ...formStyles.input, paddingLeft: icon ? "36px" : "14px" }}
        />
      </div>
    </div>
  );
}

export default function AddJobModal({ onClose, onSaveJob, addToast, initialData }) {
  const [form, setForm] = useState({
    role: "", company: "", location: "", salary: "",
    jobType: "", employmentType: "", experienceLevel: "",
    stage: "Saved", applyUrl: "", deadline: "", notes: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        role: initialData.role || "",
        company: initialData.company || "",
        location: initialData.location || "",
        salary: initialData.salary || "",
        jobType: initialData.workType || "",
        employmentType: initialData.employmentType || "",
        experienceLevel: initialData.experienceLevel || "",
        stage: initialData.status ? initialData.status.charAt(0).toUpperCase() + initialData.status.slice(1) : "Saved",
        applyUrl: initialData.applyUrl || "",
        deadline: initialData.deadline || "",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.role.trim()) e.role = "Role is required";
    if (!form.company.trim()) e.company = "Company is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    
    // Map data back to match the app's internal representation
    const mappedData = {
      ...form,
      workType: form.jobType,
      status: form.stage.toLowerCase(),
    };

    if (onSaveJob) onSaveJob(mappedData);
    if (addToast) addToast(initialData ? 'Job updated successfully!' : 'Job application added successfully!', 'success');
    
    setSubmitted(true);
  };

  // Convert the styles.page to a modal overlay
  const overlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    zIndex: 50,
    overflowY: "auto",
  };

  if (submitted) {
    const s = STAGE_COLORS[form.stage] || STAGE_COLORS.Saved;
    return (
      <div className="hide-scrollbar" style={overlayStyle} onClick={onClose}>
        <style>
          {`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div className="hide-scrollbar" style={{ ...styles.card, textAlign: "center", gap: "16px", padding: "40px 32px" }} onClick={e => e.stopPropagation()}>
          <div style={{ fontSize: "48px" }}>🎉</div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111", margin: 0 }}>
            {initialData ? 'Job Updated!' : 'Job Added!'}
          </h2>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: s.bg, color: s.color,
            fontSize: "12px", fontWeight: 600,
            padding: "4px 12px", borderRadius: "20px",
            margin: "0 auto"
          }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.dot, display: "inline-block" }} />
            {form.stage}
          </div>
          <p style={{ color: "#666", fontSize: "14px", margin: "4px 0 0" }}>
            <strong>{form.role}</strong> at <strong>{form.company}</strong>
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
             {!initialData && (
                <button onClick={() => { setSubmitted(false); setForm({ role:"",company:"",location:"",salary:"",jobType:"",employmentType:"",experienceLevel:"",stage:"Saved",applyUrl:"",deadline:"",notes:"" }); }}
                  style={styles.cancelBtn}>
                  Add Another
                </button>
             )}
             <button onClick={onClose} style={styles.submitBtn}>
                Done
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hide-scrollbar" style={overlayStyle} onClick={onClose}>
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="hide-scrollbar" style={{...styles.card, maxHeight: "90vh", overflowY: "auto"}} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ marginBottom: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={styles.heading}>{initialData ? 'Edit Job' : 'Add Job'}</h1>
              <p style={styles.subheading}>{initialData ? 'Update your application details' : 'Track a new job application'}</p>
            </div>
            <div style={{ fontSize: "32px" }}>💼</div>
          </div>
        </div>

        <div style={styles.divider} />

        {/* Role */}
        <Input label="ROLE" required icon="🧳" placeholder="eg. Frontend Engineer"
          value={form.role} onChange={set("role")} />
        {errors.role && <span style={styles.error}>{errors.role}</span>}

        {/* Company */}
        <Input label="COMPANY" required icon="🏛️" placeholder="eg. Google"
          value={form.company} onChange={set("company")} />
        {errors.company && <span style={styles.error}>{errors.company}</span>}

        {/* Location + Salary */}
        <div style={styles.row}>
          <Input label="LOCATION" icon="📍" placeholder="eg. India"
            value={form.location} onChange={set("location")} />
          <Input label="SALARY" icon="₹" placeholder="eg. 15 LPA"
            value={form.salary} onChange={set("salary")} />
        </div>

        {/* Job Type + Employment Type */}
        <div style={styles.row}>
          <Select label="JOB TYPE" placeholder="Select type" options={JOB_TYPES}
            value={form.jobType} onChange={set("jobType")}
            renderOption={(o) => `${JOB_TYPE_EMOJI[o]} ${o}`} />
          <Select label="EMPLOYMENT" placeholder="Select" options={EMPLOYMENT_TYPES}
            value={form.employmentType} onChange={set("employmentType")} />
        </div>

        {/* Experience + Stage */}
        <div style={styles.row}>
          <Select label="EXPERIENCE" placeholder="Select level" options={EXPERIENCE_LEVELS}
            value={form.experienceLevel} onChange={set("experienceLevel")} />
          <Select label="STAGE" placeholder="Select stage" options={STAGES}
            value={form.stage} onChange={set("stage")}
            renderOption={(o) => {
              const s = STAGE_COLORS[o] || STAGE_COLORS.Saved;
              return (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.dot, display: "inline-block", flexShrink: 0 }} />
                  {o}
                </span>
              );
            }} />
        </div>

        {/* Apply URL */}
        <Input label="JOB URL" icon="🔗" placeholder="https://jobs.company.com/..."
          value={form.applyUrl} onChange={set("applyUrl")} />

        {/* Deadline */}
        <Input label="APPLICATION DEADLINE" icon="📅" placeholder="Pick a date"
          type="date" value={form.deadline} onChange={set("deadline")} />

        {/* Notes */}
        <div>
          <label style={formStyles.label}>NOTES</label>
          <textarea
            placeholder="Add any notes, referral contacts, interview tips..."
            value={form.notes}
            onChange={e => set("notes")(e.target.value)}
            rows={3}
            style={{
              ...formStyles.input,
              height: "auto",
              resize: "vertical",
              paddingTop: "12px",
              lineHeight: 1.5,
            }}
          />
        </div>

        <div style={styles.divider} />

        {/* Stage preview pill */}
        {form.stage && (() => {
          const s = STAGE_COLORS[form.stage] || STAGE_COLORS.Saved;
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", color: "#888", fontWeight: 500 }}>Current stage:</span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                background: s.bg, color: s.color,
                fontSize: "11px", fontWeight: 700,
                padding: "3px 10px", borderRadius: "20px",
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.dot, display: "inline-block" }} />
                {form.stage}
              </span>
            </div>
          );
        })()}

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          {onClose && (
            <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          )}
          <button onClick={handleSubmit} style={styles.submitBtn}>
            {initialData ? 'Update Job →' : 'Save Job →'}
          </button>
        </div>

      </div>
    </div>
  );
}

const formStyles = {
  label: {
    display: "block",
    fontSize: "10px",
    fontWeight: 700,
    color: "#888",
    letterSpacing: "0.8px",
    marginBottom: "6px",
    fontFamily: "'Sora', sans-serif",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    fontSize: "13px",
    fontFamily: "'Sora', sans-serif",
    border: "1.5px solid #eaeaea",
    borderRadius: "12px",
    outline: "none",
    color: "#111",
    background: "white",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
};

const styles = {
  card: {
    background: "white",
    borderRadius: "24px",
    padding: "28px 28px",
    width: "100%",
    maxWidth: "520px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
    fontFamily: "'Sora', sans-serif",
  },
  heading: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#111",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  subheading: {
    fontSize: "13px",
    color: "#999",
    margin: "4px 0 0",
  },
  divider: {
    height: "1px",
    background: "#f0f0f0",
    margin: "2px 0",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  error: {
    fontSize: "11px",
    color: "#f43f5e",
    marginTop: "-8px",
    display: "block",
  },
  submitBtn: {
    flex: 1,
    background: "#111",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "13px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    letterSpacing: "0.2px",
  },
  cancelBtn: {
    flex: 1,
    background: "#f5f5f5",
    color: "#555",
    border: "none",
    borderRadius: "12px",
    padding: "13px 20px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
  },
};

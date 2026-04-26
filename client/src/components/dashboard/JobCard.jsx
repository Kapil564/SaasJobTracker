import { useMemo, useState } from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const CARD_COLORS = [
  "#FDF6EE",
  "#EEF6FD",
  "#F0FDF4",
  "#FDF2F8",
  "#F5F3FF",
  "#FFFBEB",
  "#F0FDFA",
  "#FEF2F2",
];

const TAG_COLORS = [
  "#EEE5FF",
  "#D6F5E3",
  "#FFE5EC",
  "#FFF3CC",
  "#DCEEFF",
  "#FFE8D6",
  "#E8F5E9",
  "#F3E5F5",
];

const STAGE_STYLES = {
  Saved:        { bg: "#E8E8FF", color: "#4b4bcc", dot: "#6b6bff", wrapperBorder: "#c5c5f5" },
  Applied:      { bg: "#DCEEFF", color: "#1a6fb5", dot: "#3b9eff", wrapperBorder: "#b0d8ff" },
  Screening:    { bg: "#FFF3CC", color: "#9a6c00", dot: "#f5b800", wrapperBorder: "#f5dfa0" },
  Interviewing: { bg: "#E8F5E9", color: "#1a7a47", dot: "#22c55e", wrapperBorder: "#a8e6be" },
  Offer:        { bg: "#E8FFF3", color: "#0d7a5f", dot: "#10b981", wrapperBorder: "#86efcb" },
  Rejected:     { bg: "#FFE5EC", color: "#b51a3b", dot: "#f43f5e", wrapperBorder: "#ffc0cb" },
};

const JOB_TYPE_CONFIG = {
  Remote:   { emoji: "🚀", bg: "#EEF6FD", color: "#1a6fb5" },
  Hybrid:   { emoji: "🏢", bg: "#F0FDF4", color: "#1a7a47" },
  "On-site": { emoji: "📍", bg: "#FFF3CC", color: "#9a6c00" },
};

function BookmarkIcon({ starred }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={starred ? "#f5b800" : "none"}
      stroke={starred ? "#f5b800" : "#aaa"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="#6b9cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

function IconBtn({ children, onPointerDown, label }) {
  return (
    <button aria-label={label} onPointerDown={onPointerDown} style={{
      width: "28px", height: "28px",
      border: "1.5px solid #e5e5e5",
      borderRadius: "8px",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", background: "white", padding: 0, flexShrink: 0,
      transition: "all 0.2s"
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
    onMouseLeave={(e) => e.currentTarget.style.background = "white"}
    >
      {children}
    </button>
  );
}

function JobTypeBadge({ jobType }) {
  const cfg = JOB_TYPE_CONFIG[jobType] || JOB_TYPE_CONFIG["Remote"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      background: cfg.bg,
      color: cfg.color,
      fontSize: "10px", fontWeight: 600,
      padding: "3px 8px", borderRadius: "20px",
    }}>
      <span style={{ fontSize: "10px" }}>{cfg.emoji}</span>
      {jobType}
    </span>
  );
}

const JobCard = ({ job, toggleStar, isOverlay, isList, onEdit, onDelete }) => {
  const [showNotes, setShowNotes] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: sortableIsDragging } = useSortable({
    id: isOverlay ? `overlay-${job.id}` : job.id,
    data: { ...job },
    disabled: isOverlay || isList
  });

  const isDragging = isOverlay ? true : (isList ? false : sortableIsDragging);

  const dragStyle = {
    transform: (isOverlay || isList) ? undefined : CSS.Transform.toString(transform),
    transition: (isOverlay || isList) ? undefined : transition,
    zIndex: isDragging ? 50 : 1,
    opacity: job.status === 'rejected' && (!isOverlay && !isList) ? 0.7 : (isOverlay ? 1 : (isDragging ? 0.7 : 1)),
    scale: isDragging ? 1.05 : 1,
    rotate: isDragging ? '2deg' : '0deg',
    cursor: isList ? 'default' : (isDragging ? 'grabbing' : 'grab'),
  };

  // Map job data to card design props
  const date = job.date || job.created_at || "Recent";
  const company = job.company || "Unknown";
  const title = job.role || "Role";
  const logoText = company.charAt(0).toUpperCase();
  // Deterministic logo bg color based on company name
  const logoBgColors = ["#232F3E", "#4285F4", "#635BFF", "#191919", "#E1306C", "#0077B5"];
  const logoBg = logoBgColors[company.length % logoBgColors.length];
  
  // Deterministic card bg color
  const cardBgId = typeof job.id === 'number' ? job.id : String(job.id).charCodeAt(0);
  const cardBg = CARD_COLORS[cardBgId % CARD_COLORS.length];
  
  const tags = [job.employmentType, job.experienceLevel].filter(Boolean);
  const salary = job.salary || "";
  const location = job.location ? job.location.split(',')[0] : "";
  const stage = job.status ? (job.status.charAt(0).toUpperCase() + job.status.slice(1)) : "Saved";
  const jobType = job.workType || "Remote";

  const tagColors = useMemo(() => {
    // Deterministic tag colors based on tags
    return tags.map((t, i) => TAG_COLORS[(t.length + i) % TAG_COLORS.length]);
  }, [tags]);

  const stageStyle = STAGE_STYLES[stage] || STAGE_STYLES["Saved"];

  return (
    <div 
      ref={isList ? undefined : setNodeRef} 
      style={{
        ...styles.wrapper,
        ...dragStyle,
        border: `1.5px solid ${stageStyle.wrapperBorder}`,
      }}
      {...(isList ? {} : attributes)} 
      {...(isList ? {} : listeners)}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* ── Card ── */}
      <div style={{ ...styles.card, background: cardBg }}>

        {/* Top row */}
        <div style={styles.topRow}>
          <span style={styles.date}>{date}</span>
          <div style={{ display: "flex", gap: "6px" }}>
            {onEdit && (
              <IconBtn label="Edit job" onPointerDown={(e) => { e.stopPropagation(); onEdit(); }}>
                <EditIcon />
              </IconBtn>
            )}
            {onDelete && (
              <IconBtn label="Delete job" onPointerDown={(e) => { e.stopPropagation(); onDelete(); }}>
                <DeleteIcon />
              </IconBtn>
            )}
            {toggleStar && (
              <IconBtn label="Save job" onPointerDown={(e) => { e.stopPropagation(); toggleStar(job.id); }}>
                <BookmarkIcon starred={job.starred} />
              </IconBtn>
            )}
          </div>
        </div>

        {/* Company row — name + jobType badge on left, logo on right */}
        <div style={styles.companyRow}>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={styles.companyLabel} className="truncate">{company}</span>
              <JobTypeBadge jobType={jobType} />
            </div>
            <h2 style={styles.title} className="truncate">{title}</h2>
          </div>
          <div style={{ ...styles.logo, background: logoBg }}>{logoText}</div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={styles.tags}>
            {tags.map((tag, i) => (
              <span key={tag} style={{ ...styles.tag, background: tagColors[i] }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0, paddingRight: "10px" }}>
            <p style={styles.salary} className="truncate">{salary}</p>
            <p style={styles.location} className="truncate">{location}</p>
          </div>
          <button 
            style={styles.detailsBtn} 
            onPointerDown={(e) => { e.stopPropagation(); setShowNotes(!showNotes); }}
          >
            {showNotes ? "Hide" : "Details"}
          </button>
        </div>

        {/* Notes Expansion */}
        {showNotes && (
          <div style={styles.notesContainer} onPointerDown={(e) => e.stopPropagation()}>
            <strong style={{ color: "#111", fontWeight: 600 }}>Notes:</strong><br/>
            {job.notes ? job.notes : <span style={{ color: "#888", fontStyle: "italic" }}>No notes added.</span>}
          </div>
        )}

      </div>

      {/* ── Stage strip on outer wrapper ── */}
      <div style={styles.stageStrip}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          background: stageStyle.bg,
          color: stageStyle.color,
          fontSize: "10px", fontWeight: 700,
          padding: "3px 10px", borderRadius: "20px",
          letterSpacing: "0.3px",
        }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: stageStyle.dot, display: "inline-block", flexShrink: 0,
          }} />
          {stage}
        </span>
      </div>

    </div>
  );
};

const styles = {
  wrapper: {
    padding: "10px",
    background: "#ffffff",
    borderRadius: "24px",
    display: "inline-flex",
    flexDirection: "column",
    gap: "8px",
    fontFamily: "'DM Sans', sans-serif",
    width: "100%",
    boxSizing: "border-box",
  },
  stageStrip: {
    display: "flex",
    justifyContent: "center",
    paddingBottom: "2px",
  },
  card: {
    borderRadius: "18px",
    padding: "16px",
    width: "100%",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "11px",
    boxSizing: "border-box",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: "11px",
    color: "#888",
    fontWeight: 400,
    background: "white",
    padding: "4px 10px",
    borderRadius: "20px",
  },
  companyRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  },
  companyLabel: {
    fontSize: "11px",
    color: "#888",
    fontWeight: 400,
  },
  title: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#111",
    lineHeight: 1.25,
    margin: 0,
  },
  logo: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "14px",
    fontWeight: 600,
    flexShrink: 0,
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
  },
  tag: {
    fontSize: "9px",
    fontWeight: 500,
    padding: "3px 8px",
    borderRadius: "20px",
    color: "#111",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "2px",
  },
  salary: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#22c55e",
    margin: 0,
  },
  location: {
    fontSize: "11px",
    color: "#999",
    marginTop: "1px",
    marginBottom: 0,
  },
  detailsBtn: {
    background: "#111",
    color: "white",
    border: "none",
    borderRadius: "20px",
    padding: "8px 16px",
    fontSize: "12px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    flexShrink: 0,
  },
  notesContainer: {
    marginTop: "12px", 
    padding: "12px", 
    background: "rgba(0,0,0,0.04)", 
    borderRadius: "12px", 
    fontSize: "12px", 
    color: "#444",
    border: "1px solid rgba(0,0,0,0.05)",
    lineHeight: 1.4,
    cursor: "text",
    userSelect: "text",
  },
};

export default JobCard;

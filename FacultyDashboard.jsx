import { useState, useEffect, useCallback, useRef } from "react";
import { ThemeToggle } from "./App";

const faculty = {
  name: "Dr. Priya Suresh", id: "FAC-007", dept: "Mathematics",
  students: 187, subjects: 3, avgAttend: 83, atRisk: 12,
};

const navItems = [
  { id: "dashboard",    label: "Dashboard",          icon: "🏠", section: "MAIN" },
  { id: "qr",          label: "QR Attendance",       icon: "📲", section: "MAIN", badge: "Live" },
  { id: "records",     label: "Attendance Records",  icon: "📊", section: "MAIN" },
  { id: "marks",       label: "Internal Marks",      icon: "📝", section: "TEACHING" },
  { id: "timetable",   label: "Timetable",           icon: "📅", section: "TEACHING" },
  { id: "announcements",label: "Announcements",      icon: "📢", section: "TEACHING" },
  { id: "imsbot",      label: "IMS Bot",             icon: "🤖", section: "TOOLS" },
];

const todaysClasses = [
  { order: "1st", subject: "Data Structures", time: "09:00–10:00", section: "CSE-B", room: "A101", status: "ONGOING" },
  { order: "2nd", subject: "DS Lab",          time: "10:00–11:00", section: "CSE-A", room: "Lab-1", status: "COUNT", count: "28/30" },
  { order: "3rd", subject: "Algorithms",      time: "11:15–12:15", section: "CSE-C", room: "A103", status: "UPCOMING" },
  { order: "4th", subject: "Data Structures", time: "14:00–15:00", section: "CSE-A", room: "B201", status: "UPCOMING" },
];

const attendanceStats = [
  { subject: "Data Structures", sections: "Sections: CSE A,B,C", pct: 86, color: "#1a9e8f" },
  { subject: "DS Lab",          sections: "Sections: CSE A,B",   pct: 91, color: "#1a9e8f" },
  { subject: "Algorithms",      sections: "Sections: CSE C",     pct: 79, color: "#f0a500" },
];

const studentOverview = [
  { name: "Arjun Ravi", id: "21CSE001", attend: 88, cgpa: 8.4, status: "OK",   section: "CSE-A" },
  { name: "Priya Nair", id: "21CSE002", attend: 72, cgpa: 7.9, status: "WARN", section: "CSE-B" },
  { name: "Kiran Raj",  id: "21CSE003", attend: 91, cgpa: 9.1, status: "OK",   section: "CSE-A" },
  { name: "Anjali M.",  id: "21CSE004", attend: 63, cgpa: 6.8, status: "RISK", section: "CSE-C" },
  { name: "Ravi Kumar", id: "21CSE005", attend: 85, cgpa: 8.0, status: "OK",   section: "CSE-B" },
];

const announcements = [
  { tag: "URGENT",   tagColor: "#ef4444", tagBg: "#ef444422", border: "#ef4444", title: "Mid-Semester Examinations",      body: "Mid-semester exams from April 15–22. Check hall ticket on portal.", date: "Apr 8" },
  { tag: "EVENT",    tagColor: "#3b82f6", tagBg: "#3b82f622", border: "#3b82f6", title: "Annual Cultural Fest 'Raga 24'", body: "Register for cultural events before April 20th.",                   date: "Apr 7" },
  { tag: "ACADEMIC", tagColor: "#1a9e8f", tagBg: "#1a9e8f22", border: "#1a9e8f", title: "Assignment Submission Reminder",body: "Database Systems project due April 18 at 11:59 PM.",                date: "Apr 6" },
];

const subjects    = ["Data Structures", "DS Lab", "Algorithms", "Mathematics III"];
const allSections = ["CSE-A", "CSE-B", "CSE-C"];
const QR_LIFETIME = 30;

// ── Timetable Data ────────────────────────────────────────────────────────────
const timetableData = {
  Mon: [
    { time: "09:00–10:00", subject: "Data Structures", teacher: "Dr. Ravi K.",  room: "A101" },
    { time: "10:00–11:00", subject: "DS Lab",          teacher: "Dr. Priya S.", room: "Lab-1" },
    { time: "11:15–12:15", subject: "Algorithms",      teacher: "Prof. James",  room: "A103" },
    { time: "14:00–15:00", subject: "Mathematics III", teacher: "Dr. Priya S.", room: "A102" },
  ],
  Tue: [
    { time: "09:00–10:00", subject: "Database Systems",teacher: "Prof. Ahmed",  room: "A103" },
    { time: "11:00–12:00", subject: "Data Structures", teacher: "Dr. Ravi K.",  room: "A101" },
    { time: "14:00–15:00", subject: "Mathematics III", teacher: "Dr. Priya S.", room: "A102" },
  ],
  Wed: [
    { time: "09:00–10:00", subject: "Data Structures", teacher: "Dr. Ravi K.",  room: "A101" },
    { time: "10:00–11:00", subject: "Algorithms",      teacher: "Prof. James",  room: "B201" },
    { time: "13:00–14:00", subject: "DS Lab",          teacher: "Dr. Priya S.", room: "Lab-1" },
  ],
  Thu: [
    { time: "10:00–11:00", subject: "Database Systems",teacher: "Prof. Ahmed",  room: "A103" },
    { time: "11:15–12:15", subject: "Mathematics III", teacher: "Dr. Priya S.", room: "A102" },
    { time: "14:00–15:00", subject: "Data Structures", teacher: "Dr. Ravi K.",  room: "A101" },
  ],
  Fri: [
    { time: "09:00–10:00", subject: "Data Structures", teacher: "Dr. Ravi K.",  room: "A101" },
    { time: "10:00–11:00", subject: "Database Systems",teacher: "Prof. Ahmed",  room: "A103" },
    { time: "14:00–15:00", subject: "Mathematics III", teacher: "Dr. Priya S.", room: "A102" },
  ],
};

// ── Student Marks + CGPA Data ─────────────────────────────────────────────────
const rosterData = {
  "CSE-A": [
    { name: "Arjun Ravi", id: "21CSE001" },
    { name: "Kiran Raj",  id: "21CSE003" },
    { name: "Meena S.",   id: "21CSE006" },
    { name: "Rohit P.",   id: "21CSE007" },
    { name: "Sneha K.",   id: "21CSE008" },
  ],
  "CSE-B": [
    { name: "Priya Nair", id: "21CSE002" },
    { name: "Ravi Kumar", id: "21CSE005" },
    { name: "Arun M.",    id: "21CSE009" },
    { name: "Divya R.",   id: "21CSE010" },
    { name: "Suresh T.",  id: "21CSE011" },
  ],
  "CSE-C": [
    { name: "Anjali M.",  id: "21CSE004" },
    { name: "Vikram B.",  id: "21CSE012" },
    { name: "Nisha L.",   id: "21CSE013" },
    { name: "Praveen C.", id: "21CSE014" },
    { name: "Lakshmi D.", id: "21CSE015" },
  ],
};

const marksData = {
  "21CSE001": { cat1: 43, cat2: 45, assignment: 18, lab: 24, total: 130, cgpa: 8.4 },
  "21CSE003": { cat1: 47, cat2: 48, assignment: 19, lab: 25, total: 139, cgpa: 9.1 },
  "21CSE006": { cat1: 38, cat2: 40, assignment: 15, lab: 22, total: 115, cgpa: 7.6 },
  "21CSE007": { cat1: 44, cat2: 46, assignment: 17, lab: 23, total: 130, cgpa: 8.2 },
  "21CSE008": { cat1: 36, cat2: 38, assignment: 14, lab: 20, total: 108, cgpa: 7.2 },
  "21CSE002": { cat1: 30, cat2: 32, assignment: 12, lab: 18, total: 92,  cgpa: 6.1 },
  "21CSE005": { cat1: 42, cat2: 44, assignment: 16, lab: 22, total: 124, cgpa: 8.0 },
  "21CSE009": { cat1: 28, cat2: 30, assignment: 11, lab: 17, total: 86,  cgpa: 5.7 },
  "21CSE010": { cat1: 48, cat2: 49, assignment: 20, lab: 25, total: 142, cgpa: 9.4 },
  "21CSE011": { cat1: 35, cat2: 37, assignment: 14, lab: 20, total: 106, cgpa: 7.0 },
  "21CSE004": { cat1: 25, cat2: 27, assignment: 10, lab: 15, total: 77,  cgpa: 5.1 },
  "21CSE012": { cat1: 41, cat2: 43, assignment: 17, lab: 23, total: 124, cgpa: 8.2 },
  "21CSE013": { cat1: 33, cat2: 35, assignment: 13, lab: 19, total: 100, cgpa: 6.7 },
  "21CSE014": { cat1: 46, cat2: 47, assignment: 19, lab: 24, total: 136, cgpa: 9.0 },
  "21CSE015": { cat1: 22, cat2: 24, assignment: 9,  lab: 14, total: 69,  cgpa: 4.6 },
};

const mockHistory = {
  "21CSE001": { "Data Structures": { present: 18, total: 21 }, "DS Lab": { present: 10, total: 11 }, "Algorithms": { present: 0, total: 0 } },
  "21CSE003": { "Data Structures": { present: 20, total: 21 }, "DS Lab": { present: 11, total: 11 }, "Algorithms": { present: 0, total: 0 } },
  "21CSE006": { "Data Structures": { present: 15, total: 21 }, "DS Lab": { present: 8,  total: 11 }, "Algorithms": { present: 0, total: 0 } },
  "21CSE007": { "Data Structures": { present: 19, total: 21 }, "DS Lab": { present: 9,  total: 11 }, "Algorithms": { present: 0, total: 0 } },
  "21CSE008": { "Data Structures": { present: 16, total: 21 }, "DS Lab": { present: 10, total: 11 }, "Algorithms": { present: 0, total: 0 } },
  "21CSE002": { "Data Structures": { present: 14, total: 21 }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 0, total: 0 } },
  "21CSE005": { "Data Structures": { present: 18, total: 21 }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 0, total: 0 } },
  "21CSE009": { "Data Structures": { present: 12, total: 21 }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 0, total: 0 } },
  "21CSE010": { "Data Structures": { present: 20, total: 21 }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 0, total: 0 } },
  "21CSE011": { "Data Structures": { present: 17, total: 21 }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 0, total: 0 } },
  "21CSE004": { "Data Structures": { present: 0,  total: 0  }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 13, total: 21 } },
  "21CSE012": { "Data Structures": { present: 0,  total: 0  }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 18, total: 21 } },
  "21CSE013": { "Data Structures": { present: 0,  total: 0  }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 15, total: 21 } },
  "21CSE014": { "Data Structures": { present: 0,  total: 0  }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 20, total: 21 } },
  "21CSE015": { "Data Structures": { present: 0,  total: 0  }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 10, total: 21 } },
};

const uid = () => Math.random().toString(36).slice(2, 10).toUpperCase();
const thStyle = (t) => ({ padding: "11px 18px", textAlign: "left", fontSize: 11, color: t.subtext, fontWeight: 700, letterSpacing: 1 });
const tdStyle = (t) => ({ padding: "13px 18px", fontSize: 13, color: t.text });

// ── QR SVG ────────────────────────────────────────────────────────────────────
function QRDisplay({ value, size = 200 }) {
  const cells = 21, cell = size / cells;
  const grid = [];
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const inFinder = (r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7);
      const hash = [...value].reduce((a, ch) => a + ch.charCodeAt(0), 0);
      if (inFinder || ((r * cells + c + hash) % 3 !== 0)) grid.push({ r, c });
    }
  }
  return (
    <svg width={size} height={size} style={{ borderRadius: 8 }}>
      <rect width={size} height={size} fill="#fff" rx="8" />
      {grid.map(({ r, c }, i) => <rect key={i} x={c * cell} y={r * cell} width={cell - 0.5} height={cell - 0.5} fill="#0d1b2a" rx="1" />)}
      <rect x={size/2-18} y={size/2-18} width={36} height={36} fill="#1a9e8f" rx="6" />
      <text x={size/2} y={size/2+5} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">IMS</text>
    </svg>
  );
}

function CountdownRing({ seconds, total }) {
  const r = 22, circ = 2 * Math.PI * r;
  const color = seconds > total*0.5 ? "#22c55e" : seconds > total*0.25 ? "#f59e0b" : "#ef4444";
  return (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <circle cx="30" cy="30" r={r} fill="none" stroke="#1e3a52" strokeWidth="4" />
      <circle cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={circ} strokeDashoffset={circ-(seconds/total)*circ}
        strokeLinecap="round" transform="rotate(-90 30 30)"
        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }} />
      <text x="30" y="35" textAnchor="middle" fill={color} fontSize="13" fontWeight="bold">{seconds}</text>
    </svg>
  );
}

// ── TIMETABLE PAGE ────────────────────────────────────────────────────────────
function TimetablePage({ t }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3);
  const [selectedDay, setSelectedDay] = useState(days.includes(todayName) ? todayName : "Mon");
  const classes = timetableData[selectedDay] || [];

  const subjectColor = (sub) => {
    if (sub.includes("Data")) return "#1a9e8f";
    if (sub.includes("Math")) return "#3b82f6";
    if (sub.includes("Algorithm")) return "#a855f7";
    if (sub.includes("Database")) return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📅 Weekly Schedule</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: t.text }}>Timetable</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>Your weekly class schedule.</p>
      </div>

      <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 28 }}>
        {/* Day tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {days.map(day => (
            <button key={day} onClick={() => setSelectedDay(day)} style={{
              padding: "9px 24px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
              background: selectedDay === day ? "linear-gradient(135deg,#1a9e8f,#17b897)" : t.input,
              color: selectedDay === day ? "#fff" : t.subtext,
              border: `1px solid ${selectedDay === day ? "transparent" : t.border}`,
            }}>{day}</button>
          ))}
        </div>

        {/* Classes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {classes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: t.subtext }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>No classes today!</div>
            </div>
          ) : classes.map((cls, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 22px", borderRadius: 12, background: t.rowBg, border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 13, color: t.subtext, minWidth: 110, fontWeight: 500 }}>{cls.time}</div>
              <div style={{ width: 4, height: 40, background: subjectColor(cls.subject), borderRadius: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{cls.subject}</div>
                <div style={{ fontSize: 12, color: t.subtext, marginTop: 3 }}>{cls.teacher}</div>
              </div>
              <div style={{ background: subjectColor(cls.subject) + "22", color: subjectColor(cls.subject), border: `1px solid ${subjectColor(cls.subject)}55`, borderRadius: 8, padding: "5px 14px", fontSize: 13, fontWeight: 700 }}>
                {cls.room}
              </div>
            </div>
          ))}
        </div>

        {/* Week summary */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 14 }}>Weekly Overview</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
            {days.map(day => (
              <div key={day} onClick={() => setSelectedDay(day)} style={{ background: selectedDay === day ? "#1a9e8f22" : t.input, border: `1px solid ${selectedDay === day ? "#1a9e8f" : t.border}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: selectedDay === day ? "#1a9e8f" : t.subtext, marginBottom: 4 }}>{day}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: selectedDay === day ? "#1a9e8f" : t.text }}>{timetableData[day]?.length || 0}</div>
                <div style={{ fontSize: 10, color: t.subtext }}>classes</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── INTERNAL MARKS PAGE ───────────────────────────────────────────────────────
function InternalMarksPage({ t }) {
  const [activeSection, setActiveSection] = useState("CSE-A");
  const [activeTab, setActiveTab] = useState("marks"); // "marks" | "cgpa"
  const [search, setSearch] = useState("");

  const roster = rosterData[activeSection] || [];

  const getMarkStatus = (total) => {
    if (total >= 120) return { label: "GOOD",  color: "#22c55e", bg: "#22c55e22", border: "#22c55e55" };
    if (total >= 90)  return { label: "PASS",  color: "#f59e0b", bg: "#f59e0b22", border: "#f59e0b55" };
    return                   { label: "RISK",  color: "#ef4444", bg: "#ef444422", border: "#ef444455" };
  };

  const getCGPAStatus = (cgpa) => {
    if (cgpa >= 8.0) return { label: "EXCEL", color: "#22c55e", bg: "#22c55e22", border: "#22c55e55" };
    if (cgpa >= 6.5) return { label: "GOOD",  color: "#3b82f6", bg: "#3b82f622", border: "#3b82f655" };
    if (cgpa >= 5.0) return { label: "PASS",  color: "#f59e0b", bg: "#f59e0b22", border: "#f59e0b55" };
    return                  { label: "RISK",  color: "#ef4444", bg: "#ef444422", border: "#ef444455" };
  };

  const filtered = roster.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const sectionMarks = roster.map(s => marksData[s.id]).filter(Boolean);
  const avgTotal     = sectionMarks.length ? Math.round(sectionMarks.reduce((a, m) => a + m.total, 0) / sectionMarks.length) : 0;
  const avgCGPA      = sectionMarks.length ? (sectionMarks.reduce((a, m) => a + m.cgpa, 0) / sectionMarks.length).toFixed(2) : 0;
  const atRisk       = sectionMarks.filter(m => m.total < 90).length;
  const topScorer    = roster.reduce((best, s) => {
    const m = marksData[s.id];
    return m && (!best || m.total > marksData[best.id]?.total) ? s : best;
  }, null);

  // CGPA Bar chart data
  const cgpaBarData = filtered.map(s => ({ name: s.name.split(" ")[0], cgpa: marksData[s.id]?.cgpa || 0, id: s.id }));

  const maxCGPA = 10;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📝 Academic Performance</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: t.text }}>Internal Marks</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>CAT scores, assignments, lab marks and CGPA per section.</p>
      </div>

      {/* Section Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {allSections.map(sec => (
          <button key={sec} onClick={() => setActiveSection(sec)} style={{
            padding: "9px 24px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
            background: activeSection === sec ? "linear-gradient(135deg,#1a9e8f,#17b897)" : t.input,
            color: activeSection === sec ? "#fff" : t.subtext,
            border: `1px solid ${activeSection === sec ? "transparent" : t.border}`,
          }}>{sec}</button>
        ))}
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { icon: "🏆", value: avgTotal, label: "AVG TOTAL (/150)",  color: "#1a9e8f",  grad: "linear-gradient(135deg,#0d3d2e,#0d1b2a)" },
          { icon: "🎓", value: avgCGPA,  label: "AVG CGPA",          color: "#3b82f6",  grad: "linear-gradient(135deg,#0d2040,#0d1b2a)" },
          { icon: "⚠️", value: atRisk,   label: "AT RISK (<90)",     color: "#ef4444",  grad: "linear-gradient(135deg,#3d0d0d,#0d1b2a)" },
          { icon: "⭐", value: topScorer?.name.split(" ")[0] || "—", label: "TOP SCORER", color: "#f59e0b", grad: "linear-gradient(135deg,#3d2a00,#0d1b2a)" },
        ].map((c, i) => (
          <div key={i} style={{ background: c.grad, borderRadius: 14, padding: "20px 18px", border: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#7a9ab5", marginTop: 6, letterSpacing: 1, fontWeight: 700 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tab Switch */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[{ id: "marks", label: "📋 Internal Marks Table" }, { id: "cgpa", label: "📊 CGPA Bar Chart" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: "9px 20px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
            background: activeTab === tab.id ? "linear-gradient(135deg,#1a9e8f,#17b897)" : t.input,
            color: activeTab === tab.id ? "#fff" : t.subtext,
            border: `1px solid ${activeTab === tab.id ? "transparent" : t.border}`,
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.input, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 14px", marginBottom: 18, maxWidth: 340 }}>
        <span>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..."
          style={{ background: "none", border: "none", outline: "none", color: t.text, fontSize: 13, width: "100%" }} />
      </div>

      {activeTab === "marks" ? (
        // ── Marks Table ───────────────────────────────────────────────────────
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>Internal Assessment — {activeSection}</div>
            <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>CAT 1 (50) + CAT 2 (50) + Assignment (20) + Lab (25) = 150 marks</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ background: t.tableHead }}>
                  {["STUDENT", "ID", "CAT 1 /50", "CAT 2 /50", "ASSIGN /20", "LAB /25", "TOTAL /150", "PERCENT", "STATUS"].map(h => (
                    <th key={h} style={thStyle(t)}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((stu, i) => {
                  const m  = marksData[stu.id] || { cat1: 0, cat2: 0, assignment: 0, lab: 0, total: 0, cgpa: 0 };
                  const pct = Math.round((m.total / 150) * 100);
                  const st = getMarkStatus(m.total);
                  return (
                    <tr key={i} style={{ borderTop: `1px solid ${t.border}`, background: i % 2 === 0 ? "transparent" : t.rowBg }}>
                      <td style={tdStyle(t)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{stu.name[0]}</div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{stu.name}</span>
                        </div>
                      </td>
                      <td style={{ ...tdStyle(t), color: t.subtext, fontSize: 12 }}>{stu.id}</td>
                      <td style={{ ...tdStyle(t), fontWeight: 700, color: m.cat1 >= 40 ? "#22c55e" : m.cat1 >= 30 ? "#f59e0b" : "#ef4444" }}>{m.cat1}</td>
                      <td style={{ ...tdStyle(t), fontWeight: 700, color: m.cat2 >= 40 ? "#22c55e" : m.cat2 >= 30 ? "#f59e0b" : "#ef4444" }}>{m.cat2}</td>
                      <td style={{ ...tdStyle(t), color: t.text }}>{m.assignment}</td>
                      <td style={{ ...tdStyle(t), color: t.text }}>{m.lab}</td>
                      <td style={{ ...tdStyle(t), fontWeight: 800, fontSize: 15, color: st.color }}>{m.total}</td>
                      <td style={{ ...tdStyle(t) }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ background: t.border, borderRadius: 6, height: 6, width: 80, overflow: "hidden", flexShrink: 0 }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: st.color, borderRadius: 6 }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: st.color }}>{pct}%</span>
                        </div>
                      </td>
                      <td style={tdStyle(t)}>
                        <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // ── CGPA Bar Chart ────────────────────────────────────────────────────
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 28 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 4 }}>CGPA Chart — {activeSection}</div>
          <div style={{ fontSize: 12, color: t.subtext, marginBottom: 28 }}>Student CGPA out of 10.0 — red bars indicate at-risk students</div>

          {/* Bar Chart */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 240, paddingBottom: 8, borderBottom: `1px solid ${t.border}`, position: "relative" }}>
            {/* Y axis lines */}
            {[2, 4, 6, 8, 10].map(val => (
              <div key={val} style={{ position: "absolute", left: 0, right: 0, bottom: `${(val / maxCGPA) * 230}px`, borderTop: `1px dashed ${t.border}`, display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 10, color: t.subtext, position: "absolute", left: -28, lineHeight: 1 }}>{val}</span>
              </div>
            ))}

            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, width: "100%", paddingLeft: 32, height: "100%" }}>
              {cgpaBarData.map((s, i) => {
                const st    = getCGPAStatus(s.cgpa);
                const heightPct = (s.cgpa / maxCGPA) * 100;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: st.color }}>{s.cgpa}</div>
                    <div style={{ width: "100%", maxWidth: 52, height: `${heightPct}%`, background: `linear-gradient(to top, ${st.color}, ${st.color}88)`, borderRadius: "6px 6px 0 0", position: "relative", transition: "height 0.8s ease", minHeight: 4, cursor: "pointer" }}
                      title={`${s.name}: ${s.cgpa} CGPA`}>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: st.color, borderRadius: "6px 6px 0 0", opacity: 0.3 }} />
                    </div>
                    <div style={{ fontSize: 11, color: t.subtext, textAlign: "center", whiteSpace: "nowrap" }}>{s.name}</div>
                    <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 700 }}>{st.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
            {[
              { label: "EXCEL (≥8.0)", color: "#22c55e" },
              { label: "GOOD (6.5–7.9)", color: "#3b82f6" },
              { label: "PASS (5.0–6.4)", color: "#f59e0b" },
              { label: "RISK (<5.0)", color: "#ef4444" },
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.subtext }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>

          {/* Risk Students Alert */}
          {filtered.filter(s => (marksData[s.id]?.cgpa || 0) < 5.0).length > 0 && (
            <div style={{ marginTop: 20, background: "#ef444411", border: "1px solid #ef444444", borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", marginBottom: 8 }}>⚠️ At-Risk Students (CGPA &lt; 5.0)</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {filtered.filter(s => (marksData[s.id]?.cgpa || 0) < 5.0).map((s, i) => (
                  <div key={i} style={{ background: "#ef444422", border: "1px solid #ef444455", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
                    <span style={{ fontWeight: 700, color: "#ef4444" }}>{s.name}</span>
                    <span style={{ color: "#ef4444", marginLeft: 6 }}>CGPA: {marksData[s.id]?.cgpa}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CGPA Table below chart */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 14 }}>Detailed CGPA Breakdown</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: t.tableHead }}>
                  {["STUDENT", "ID", "CGPA", "GRADE BAR", "STATUS"].map(h => <th key={h} style={thStyle(t)}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[...filtered].sort((a, b) => (marksData[b.id]?.cgpa || 0) - (marksData[a.id]?.cgpa || 0)).map((stu, i) => {
                  const cgpa = marksData[stu.id]?.cgpa || 0;
                  const st   = getCGPAStatus(cgpa);
                  return (
                    <tr key={i} style={{ borderTop: `1px solid ${t.border}`, background: i % 2 === 0 ? "transparent" : t.rowBg }}>
                      <td style={tdStyle(t)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>{stu.name[0]}</div>
                          <span style={{ fontWeight: 600, color: t.text }}>{stu.name}</span>
                        </div>
                      </td>
                      <td style={{ ...tdStyle(t), color: t.subtext, fontSize: 12 }}>{stu.id}</td>
                      <td style={{ ...tdStyle(t), fontWeight: 800, fontSize: 16, color: st.color }}>{cgpa}</td>
                      <td style={{ ...tdStyle(t), minWidth: 160 }}>
                        <div style={{ background: t.border, borderRadius: 6, height: 10, overflow: "hidden" }}>
                          <div style={{ width: `${(cgpa / 10) * 100}%`, height: "100%", background: st.color, borderRadius: 6, transition: "width 0.8s ease" }} />
                        </div>
                      </td>
                      <td style={tdStyle(t)}>
                        <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ATTENDANCE RECORDS PAGE ───────────────────────────────────────────────────
function AttendanceRecordsPage({ qrLog, t }) {
  const [activeSection, setActiveSection] = useState("CSE-A");
  const [activeSubject, setActiveSubject] = useState("All Subjects");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const subjectOptions = ["All Subjects", ...subjects];

  const buildAttendance = (studentId, subject) => {
    const hist = mockHistory[studentId]?.[subject] || { present: 0, total: 0 };
    const livePresent = qrLog.filter(r => r.studentId === studentId && r.subject === subject && r.section === activeSection).length;
    return { present: hist.present + livePresent, total: hist.total + (livePresent > 0 ? livePresent : 0) };
  };

  const getPct = (present, total) => total === 0 ? null : Math.round((present / total) * 100);

  const getStatus = (pct) => {
    if (pct === null) return { label: "N/A",  color: "#7a9ab5", bg: "#7a9ab522", border: "#7a9ab555" };
    if (pct >= 85)   return { label: "GOOD",  color: "#22c55e", bg: "#22c55e22", border: "#22c55e55" };
    if (pct >= 75)   return { label: "OK",    color: "#f59e0b", bg: "#f59e0b22", border: "#f59e0b55" };
    return                  { label: "RISK",  color: "#ef4444", bg: "#ef444422", border: "#ef444455" };
  };

  const roster = rosterData[activeSection] || [];
  const rows = roster.map(stu => {
    const subjectStats = subjects.map(sub => {
      const { present, total } = buildAttendance(stu.id, sub);
      return { subject: sub, present, total, pct: getPct(present, total) };
    });
    const overall = subjectStats.filter(s => s.total > 0);
    const overallPct = overall.length ? Math.round(overall.reduce((a, s) => a + s.pct, 0) / overall.length) : null;
    return { ...stu, subjectStats, overallPct };
  });

  const filtered = rows
    .filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()))
    .filter(r => filterStatus === "All" || getStatus(r.overallPct).label === filterStatus);

  const sectionAvg = rows.filter(r => r.overallPct !== null);
  const avgPct   = sectionAvg.length ? Math.round(sectionAvg.reduce((a, r) => a + r.overallPct, 0) / sectionAvg.length) : 0;
  const atRisk   = rows.filter(r => r.overallPct !== null && r.overallPct < 75).length;
  const liveScans= qrLog.filter(r => r.section === activeSection).length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📊 Section-wise Records</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: t.text }}>Attendance Records</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>Per-student attendance across all subjects and sections.</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {allSections.map(sec => (
          <button key={sec} onClick={() => setActiveSection(sec)} style={{
            padding: "9px 24px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
            background: activeSection === sec ? "linear-gradient(135deg,#1a9e8f,#17b897)" : t.input,
            color: activeSection === sec ? "#fff" : t.subtext,
            border: `1px solid ${activeSection === sec ? "transparent" : t.border}`,
          }}>{sec}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { icon: "👥", value: roster.length, label: "STUDENTS",       color: "#3b82f6", grad: "linear-gradient(135deg,#0d2040,#0d1b2a)" },
          { icon: "📈", value: `${avgPct}%`,  label: "AVG ATTENDANCE", color: "#1a9e8f", grad: "linear-gradient(135deg,#0d3d2e,#0d1b2a)" },
          { icon: "⚠️", value: atRisk,        label: "AT RISK (<75%)", color: "#ef4444", grad: "linear-gradient(135deg,#3d0d0d,#0d1b2a)" },
          { icon: "✅", value: liveScans,      label: "LIVE SCANS",     color: "#22c55e", grad: "linear-gradient(135deg,#0d3d1e,#0d1b2a)" },
        ].map((c, i) => (
          <div key={i} style={{ background: c.grad, borderRadius: 14, padding: "20px 18px", border: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#7a9ab5", marginTop: 6, letterSpacing: 1, fontWeight: 700 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.input, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 14px", flex: 1, minWidth: 200 }}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..."
            style={{ background: "none", border: "none", outline: "none", color: t.text, fontSize: 13, width: "100%" }} />
        </div>
        <select value={activeSubject} onChange={e => setActiveSubject(e.target.value)} style={{ padding: "9px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 13, outline: "none" }}>
          {subjectOptions.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "9px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 13, outline: "none" }}>
          {["All", "GOOD", "OK", "RISK"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {activeSubject === "All Subjects" ? (
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>All Subjects — {activeSection}</div>
            <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>{filtered.length} students</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ background: t.tableHead }}>
                  <th style={thStyle(t)}>STUDENT</th>
                  <th style={thStyle(t)}>ID</th>
                  {subjects.map(s => <th key={s} style={thStyle(t)}>{s.split(" ")[0]}</th>)}
                  <th style={thStyle(t)}>OVERALL</th>
                  <th style={thStyle(t)}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => {
                  const st = getStatus(row.overallPct);
                  return (
                    <tr key={i} style={{ borderTop: `1px solid ${t.border}`, background: i % 2 === 0 ? "transparent" : t.rowBg }}>
                      <td style={tdStyle(t)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{row.name[0]}</div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{row.name}</span>
                        </div>
                      </td>
                      <td style={{ ...tdStyle(t), color: t.subtext, fontSize: 12 }}>{row.id}</td>
                      {row.subjectStats.map((s, j) => (
                        <td key={j} style={tdStyle(t)}>
                          {s.total === 0 ? <span style={{ color: t.subtext, fontSize: 12 }}>—</span> : (
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: s.pct >= 85 ? "#22c55e" : s.pct >= 75 ? "#f59e0b" : "#ef4444" }}>{s.pct}%</div>
                              <div style={{ fontSize: 10, color: t.subtext }}>{s.present}/{s.total}</div>
                            </div>
                          )}
                        </td>
                      ))}
                      <td style={tdStyle(t)}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: row.overallPct >= 85 ? "#22c55e" : row.overallPct >= 75 ? "#f59e0b" : "#ef4444" }}>{row.overallPct ?? "—"}%</div>
                      </td>
                      <td style={tdStyle(t)}>
                        <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>{activeSubject} — {activeSection}</div>
            <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>{filtered.length} students</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.tableHead }}>
                {["STUDENT", "ID", "PRESENT", "TOTAL", "ATTEND. %", "PROGRESS", "STATUS"].map(h => <th key={h} style={thStyle(t)}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const stat = row.subjectStats.find(s => s.subject === activeSubject);
                const st   = getStatus(stat.pct);
                return (
                  <tr key={i} style={{ borderTop: `1px solid ${t.border}`, background: i % 2 === 0 ? "transparent" : t.rowBg }}>
                    <td style={tdStyle(t)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>{row.name[0]}</div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{row.name}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle(t), color: t.subtext, fontSize: 12 }}>{row.id}</td>
                    <td style={{ ...tdStyle(t), fontWeight: 700, color: "#22c55e" }}>{stat.present}</td>
                    <td style={{ ...tdStyle(t), color: t.subtext }}>{stat.total}</td>
                    <td style={{ ...tdStyle(t), fontWeight: 800, fontSize: 15, color: stat.pct >= 85 ? "#22c55e" : stat.pct >= 75 ? "#f59e0b" : "#ef4444" }}>{stat.pct ?? "—"}{stat.pct !== null ? "%" : ""}</td>
                    <td style={{ ...tdStyle(t), minWidth: 120 }}>
                      {stat.total > 0 ? (
                        <div style={{ background: t.border, borderRadius: 6, height: 8, overflow: "hidden" }}>
                          <div style={{ width: `${stat.pct}%`, height: "100%", background: stat.pct >= 85 ? "#22c55e" : stat.pct >= 75 ? "#f59e0b" : "#ef4444", borderRadius: 6 }} />
                        </div>
                      ) : <span style={{ color: t.subtext, fontSize: 12 }}>No data</span>}
                    </td>
                    <td style={tdStyle(t)}>
                      <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{st.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {qrLog.filter(r => r.section === activeSection).length > 0 && (
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden", marginTop: 24 }}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>🔴 Live QR Scans — {activeSection}</div>
            <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>Scans recorded in this session</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.tableHead }}>
                {["STUDENT ID", "SUBJECT", "DATE", "TIME", "TOKEN", "STATUS"].map(h => <th key={h} style={thStyle(t)}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {qrLog.filter(r => r.section === activeSection).map((row, i) => (
                <tr key={row.id} style={{ borderTop: `1px solid ${t.border}`, background: i % 2 === 0 ? "transparent" : t.rowBg }}>
                  <td style={{ ...tdStyle(t), fontWeight: 700 }}>{row.studentId}</td>
                  <td style={tdStyle(t)}>{row.subject}</td>
                  <td style={{ ...tdStyle(t), color: t.subtext }}>{row.date}</td>
                  <td style={{ ...tdStyle(t), color: t.subtext }}>{row.time}</td>
                  <td style={tdStyle(t)}><span style={{ fontFamily: "monospace", fontSize: 12, color: "#1a9e8f", background: "#1a9e8f11", padding: "2px 8px", borderRadius: 4 }}>{row.token}</span></td>
                  <td style={tdStyle(t)}><span style={{ background: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e55", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>PRESENT</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── QR ATTENDANCE PAGE ────────────────────────────────────────────────────────
function QRAttendancePage({ t, qrLog, setQrLog }) {
  const [subject,       setSubject]   = useState(subjects[0]);
  const [section,       setSection]   = useState(allSections[0]);
  const [date]                        = useState(new Date().toISOString().split("T")[0]);
  const [sessionActive, setSession]   = useState(false);
  const [token,         setToken]     = useState("");
  const [timeLeft,      setTimeLeft]  = useState(QR_LIFETIME);
  const [scannedBy,     setScannedBy] = useState(null);
  const [usedTokens,    setUsedTokens]= useState({});
  const [simId,         setSimId]     = useState("");
  const [simMsg,        setSimMsg]    = useState(null);
  const timerRef = useRef(null);

  const generateToken = useCallback(() => { setToken(uid()); setScannedBy(null); setTimeLeft(QR_LIFETIME); }, []);

  const toggleSession = () => {
    if (sessionActive) { clearInterval(timerRef.current); setSession(false); setToken(""); setTimeLeft(QR_LIFETIME); setScannedBy(null); }
    else { setSession(true); generateToken(); }
  };

  useEffect(() => {
    if (!sessionActive) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { generateToken(); return QR_LIFETIME; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [sessionActive, generateToken]);

  const handleScan = () => {
    const studentId = simId.trim().toUpperCase();
    if (!studentId)         { setSimMsg({ type: "error", text: "Enter a student ID." }); return; }
    if (!sessionActive)     { setSimMsg({ type: "error", text: "No active QR session." }); return; }
    if (usedTokens[token])  { setSimMsg({ type: "error", text: `❌ QR already used by ${usedTokens[token]}.` }); return; }
    const already = qrLog.find(r => r.studentId === studentId && r.subject === subject && r.section === section && r.date === date);
    if (already)            { setSimMsg({ type: "error", text: `⚠️ ${studentId} already marked present.` }); return; }
    const row = { id: uid(), studentId, subject, section, date, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), token, status: "PRESENT" };
    setUsedTokens(prev => ({ ...prev, [token]: studentId }));
    setScannedBy(studentId);
    setQrLog(prev => [row, ...prev]);
    setSimMsg({ type: "success", text: `✅ ${studentId} marked PRESENT for ${subject} (${section})` });
    setSimId("");
    setTimeout(() => { generateToken(); setTimeLeft(QR_LIFETIME); }, 1500);
  };

  const presentCount = qrLog.filter(r => r.subject === subject && r.section === section && r.date === date).length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📲 Live Attendance</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: t.text }}>QR Attendance</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>Each QR code is single-use — one scan per student per token.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 14, marginBottom: 24 }}>
        {[{ label: "Subject", value: subject, setter: setSubject, options: subjects }, { label: "Section", value: section, setter: setSection, options: allSections }, { label: "Date", value: date, setter: null, options: [] }].map((f, i) => (
          <div key={i}>
            <div style={{ fontSize: 12, color: t.subtext, marginBottom: 6 }}>{f.label}</div>
            {f.setter
              ? <select value={f.value} onChange={e => f.setter(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14, outline: "none" }}>{f.options.map(o => <option key={o}>{o}</option>)}</select>
              : <div style={{ padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14 }}>{f.value}</div>}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button onClick={toggleSession} style={{ padding: "10px 22px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", background: sessionActive ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#1a9e8f,#17b897)", color: "#fff" }}>
            {sessionActive ? "⏹ Stop" : "▶ Start Session"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: t.text, alignSelf: "flex-start" }}>Live QR Code</div>
          {sessionActive ? (
            <>
              <div style={{ position: "relative" }}>
                <QRDisplay value={token} size={200} />
                {scannedBy && (
                  <div style={{ position: "absolute", inset: 0, background: "#22c55ecc", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
                    <div style={{ fontSize: 32 }}>✅</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Scanned by {scannedBy}</div>
                    <div style={{ fontSize: 11, color: "#fff" }}>Rotating...</div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CountdownRing seconds={timeLeft} total={QR_LIFETIME} />
                <div>
                  <div style={{ fontSize: 12, color: t.subtext }}>Token expires in</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{timeLeft}s — then auto-rotates</div>
                </div>
              </div>
              <div style={{ background: t.input, borderRadius: 8, padding: "8px 14px", width: "100%", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: t.subtext, marginBottom: 2 }}>TOKEN (single-use)</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a9e8f", letterSpacing: 2 }}>{token}</div>
                <div style={{ fontSize: 11, color: usedTokens[token] ? "#ef4444" : "#22c55e", marginTop: 4 }}>{usedTokens[token] ? `🔒 Used by ${usedTokens[token]}` : "🟢 Available"}</div>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "40px 0", color: t.subtext }}>
              <div style={{ fontSize: 48 }}>📲</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>No Active Session</div>
              <div style={{ fontSize: 13 }}>Select subject & section, then start.</div>
            </div>
          )}
        </div>

        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 28 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 6 }}>Simulate Student Scan</div>
          <div style={{ fontSize: 13, color: t.subtext, marginBottom: 20 }}>Enter a student ID to simulate a QR scan.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
            {[{ label: "Present Today", value: presentCount, color: "#22c55e" }, { label: "Tokens Used", value: Object.keys(usedTokens).length, color: "#3b82f6" }, { label: "Session", value: sessionActive ? "LIVE" : "OFF", color: sessionActive ? "#22c55e" : "#ef4444" }].map((s, i) => (
              <div key={i} style={{ background: t.input, borderRadius: 10, padding: "12px 14px", textAlign: "center", border: `1px solid ${t.border}` }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: t.subtext, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: t.subtext, marginBottom: 6 }}>Student ID</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <input value={simId} onChange={e => { setSimId(e.target.value); setSimMsg(null); }} onKeyDown={e => e.key === "Enter" && handleScan()} placeholder="e.g. 21CSE001"
              style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14, outline: "none" }} />
            <button onClick={handleScan} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#1a9e8f,#17b897)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Scan</button>
          </div>
          {simMsg && (
            <div style={{ padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 500, background: simMsg.type === "success" ? "#22c55e22" : "#ef444422", border: `1px solid ${simMsg.type === "success" ? "#22c55e55" : "#ef444455"}`, color: simMsg.type === "success" ? "#22c55e" : "#ef4444" }}>
              {simMsg.text}
            </div>
          )}
          <div style={{ fontSize: 12, color: t.subtext, marginBottom: 8 }}>Quick fill:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {studentOverview.map(s => (
              <button key={s.id} onClick={() => { setSimId(s.id); setSimMsg(null); }} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${t.border}`, background: t.input, color: t.subtext, fontSize: 12, cursor: "pointer" }}>{s.id}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>📋 Attendance Database</div>
            <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>Live records — each row = one verified scan</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ background: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e55", borderRadius: 6, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>{qrLog.length} record{qrLog.length !== 1 ? "s" : ""}</span>
            {qrLog.length > 0 && <button onClick={() => setQrLog([])} style={{ padding: "5px 14px", borderRadius: 6, border: `1px solid ${t.border}`, background: t.input, color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Clear All</button>}
          </div>
        </div>
        {qrLog.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: t.subtext }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🗃️</div>
            <div style={{ fontSize: 14 }}>No records yet. Start a session and simulate scans.</div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: t.tableHead }}>{["#", "STUDENT ID", "SUBJECT", "SECTION", "DATE", "TIME", "TOKEN", "STATUS"].map(h => <th key={h} style={thStyle(t)}>{h}</th>)}</tr></thead>
            <tbody>
              {qrLog.map((row, i) => (
                <tr key={row.id} style={{ borderTop: `1px solid ${t.border}`, background: i % 2 === 0 ? "transparent" : t.rowBg }}>
                  <td style={{ ...tdStyle(t), color: t.subtext, fontSize: 12 }}>{qrLog.length - i}</td>
                  <td style={{ ...tdStyle(t), fontWeight: 700 }}>{row.studentId}</td>
                  <td style={tdStyle(t)}>{row.subject}</td>
                  <td style={{ ...tdStyle(t), color: t.subtext }}>{row.section}</td>
                  <td style={{ ...tdStyle(t), color: t.subtext }}>{row.date}</td>
                  <td style={{ ...tdStyle(t), color: t.subtext }}>{row.time}</td>
                  <td style={tdStyle(t)}><span style={{ fontFamily: "monospace", fontSize: 12, color: "#1a9e8f", background: "#1a9e8f11", padding: "2px 8px", borderRadius: 4 }}>{row.token}</span></td>
                  <td style={tdStyle(t)}><span style={{ background: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e55", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>PRESENT</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── STUB ──────────────────────────────────────────────────────────────────────
function StubPage({ title, icon, t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16 }}>
      <div style={{ fontSize: 56 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: t.text }}>{title}</div>
      <div style={{ fontSize: 14, color: t.subtext }}>This section is under construction.</div>
    </div>
  );
}

// ── DASHBOARD CONTENT ─────────────────────────────────────────────────────────
function DashboardContent({ t }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const statCards = [
    { icon: "👥", value: faculty.students, label: "MY STUDENTS",  sub: "Across 4 sections", color: "#a855f7", grad: "linear-gradient(135deg,#2d1a52,#1a0d2e)", iconBg: "#a855f722" },
    { icon: "📚", value: faculty.subjects, label: "SUBJECTS",     sub: "Current semester",  color: "#3b82f6", grad: "linear-gradient(135deg,#0d2040,#091528)", iconBg: "#3b82f622" },
    { icon: "✅", value: `${faculty.avgAttend}%`, label: "AVG ATTEND.", sub: "Class average", color: "#22c55e", grad: "linear-gradient(135deg,#0d3d1e,#091a10)", iconBg: "#22c55e22" },
    { icon: "⚠️", value: faculty.atRisk, label: "AT RISK", sub: "Below 75%", color: "#f59e0b", grad: "linear-gradient(135deg,#3d2a00,#1a1000)", iconBg: "#f59e0b22" },
  ];

  const statusStyle = (status) => {
    if (status === "ONGOING") return { bg: "#1a9e8f22", color: "#1a9e8f", border: "1px solid #1a9e8f55", label: "ONGOING" };
    if (status === "COUNT")   return { bg: "#3b82f622", color: "#3b82f6", border: "1px solid #3b82f655", label: null };
    return { bg: t.rowBg, color: t.subtext, border: `1px solid ${t.border}`, label: "UPCOMING" };
  };

  const studentStatusStyle = (s) => {
    if (s === "OK")   return { bg: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e55" };
    if (s === "WARN") return { bg: "#f59e0b22", color: "#f59e0b", border: "1px solid #f59e0b55" };
    return                   { bg: "#ef444422", color: "#ef4444", border: "1px solid #ef444455" };
  };

  const attendColor = (pct) => pct >= 85 ? "#22c55e" : pct >= 75 ? "#f59e0b" : "#ef4444";

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📅 {today}</div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 6px", color: t.text }}>{greeting}, {faculty.name} 🧑‍🏫</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>{todaysClasses.length} classes scheduled today.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
        {statCards.map((c, i) => (
          <div key={i} style={{ background: c.grad, borderRadius: 16, padding: "24px 20px", border: `1px solid ${t.border}` }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{c.icon}</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#7a9ab5", marginTop: 6, letterSpacing: 1, fontWeight: 700 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: "#22c55e", marginTop: 8 }}>↑ {c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>Today's Classes</div>
              <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>Live schedule</div>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#1a9e8f,#17b897)", border: "none", borderRadius: 10, padding: "8px 16px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>📲 QR Attend.</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {todaysClasses.map((cls, i) => {
              const st = statusStyle(cls.status);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, background: cls.status === "ONGOING" ? t.rowActive : t.rowBg, border: cls.status === "ONGOING" ? "1px solid #1a9e8f44" : `1px solid ${t.border}` }}>
                  <div style={{ minWidth: 36, height: 36, borderRadius: 8, background: cls.status === "ONGOING" ? "#1a9e8f22" : t.toggleBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: cls.status === "ONGOING" ? "#1a9e8f" : t.subtext }}>{cls.order}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{cls.subject}</div>
                    <div style={{ fontSize: 11, color: t.subtext, marginTop: 2 }}>{cls.time} · {cls.section} · {cls.room}</div>
                  </div>
                  {cls.status === "COUNT"
                    ? <span style={{ background: "#3b82f622", color: "#3b82f6", border: "1px solid #3b82f655", borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 700 }}>{cls.count}</span>
                    : <span style={{ background: st.bg, color: st.color, border: st.border, borderRadius: 8, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>{st.label}</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>Attendance Stats</div>
            <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>Current semester</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {attendanceStats.map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{s.subject}</div>
                    <div style={{ fontSize: 11, color: t.subtext }}>{s.sections}</div>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.pct}%</div>
                </div>
                <div style={{ background: t.border, borderRadius: 8, height: 8, overflow: "hidden" }}>
                  <div style={{ width: `${s.pct}%`, height: "100%", background: s.color, borderRadius: 8 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 28, paddingTop: 20, borderTop: `1px solid ${t.border}` }}>
            {[{ value: "84", label: "Total Classes" }, { value: "187", label: "Students" }, { value: "83%", label: "Avg Attend." }].map((item, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#1a9e8f" }}>{item.value}</div>
                <div style={{ fontSize: 11, color: t.subtext, marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>Student Overview</div>
            <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>Recent performance</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: t.tableHead }}>{["STUDENT", "ID", "ATTEND.", "CGPA", "STATUS"].map(h => <th key={h} style={thStyle(t)}>{h}</th>)}</tr></thead>
            <tbody>
              {studentOverview.map((s, i) => {
                const st = studentStatusStyle(s.status);
                return (
                  <tr key={i} style={{ borderTop: `1px solid ${t.border}` }}>
                    <td style={tdStyle(t)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{s.name[0]}</div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle(t), color: t.subtext, fontSize: 12 }}>{s.id}</td>
                    <td style={{ ...tdStyle(t), fontWeight: 700, color: attendColor(s.attend) }}>{s.attend}%</td>
                    <td style={{ ...tdStyle(t), fontWeight: 600 }}>{s.cgpa}</td>
                    <td style={tdStyle(t)}><span style={{ background: st.bg, color: st.color, border: st.border, borderRadius: 6, padding: "3px 12px", fontSize: 11, fontWeight: 700 }}>{s.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>Announcements</div>
            <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>For faculty</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {announcements.map((a, i) => (
              <div key={i} style={{ padding: "18px 24px", borderTop: i > 0 ? `1px solid ${t.border}` : "none", borderLeft: `3px solid ${a.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ background: a.tagBg, color: a.tagColor, border: `1px solid ${a.tagColor}55`, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{a.tag}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{a.title}</span>
                </div>
                <div style={{ fontSize: 13, color: t.subtext, lineHeight: 1.5 }}>{a.body}</div>
                <div style={{ fontSize: 11, color: t.sectionLabel, marginTop: 8 }}>{a.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SHELL ─────────────────────────────────────────────────────────────────────
export default function FacultyDashboard({ onLogout, isDark, toggleTheme, t }) {
  const [active, setActive]       = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [qrLog, setQrLog]         = useState([]);
  const sections = ["MAIN", "TEACHING", "TOOLS"];

  const renderPage = () => {
    if (active === "dashboard")     return <DashboardContent t={t} />;
    if (active === "qr")            return <QRAttendancePage t={t} qrLog={qrLog} setQrLog={setQrLog} />;
    if (active === "records")       return <AttendanceRecordsPage t={t} qrLog={qrLog} />;
    if (active === "marks")         return <InternalMarksPage t={t} />;
    if (active === "timetable")     return <TimetablePage t={t} />;
    if (active === "announcements") return <StubPage title="Announcements" icon="📢" t={t} />;
    if (active === "imsbot")        return <StubPage title="IMS Bot" icon="🤖" t={t} />;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", background: t.bg, fontFamily: "'Segoe UI', sans-serif", color: t.text, overflow: "hidden", transition: "all 0.3s" }}>
      <aside style={{ width: sidebarOpen ? 220 : 64, background: t.sidebar, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", padding: "20px 0", transition: "width 0.3s", overflow: "hidden", minHeight: "100vh", position: "relative", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px 24px" }}>
          <div style={{ minWidth: 40, height: 40, borderRadius: 8, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>MS</span>
          </div>
          {sidebarOpen && <div><div style={{ fontSize: 16, fontWeight: 700, whiteSpace: "nowrap", color: t.text }}>CollegeIMS</div><div style={{ fontSize: 11, color: t.subtext, whiteSpace: "nowrap" }}>Smart Campus Portal</div></div>}
        </div>

        {sidebarOpen && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.navActive, margin: "0 12px 20px", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", color: t.text }}>{faculty.name}</div>
              <div style={{ fontSize: 11, color: t.subtext }}>{faculty.id}</div>
            </div>
          </div>
        )}

        {sections.map(sec => (
          <div key={sec}>
            {sidebarOpen && <div style={{ fontSize: 10, color: t.sectionLabel, fontWeight: 700, letterSpacing: 1, padding: "12px 20px 4px" }}>{sec}</div>}
            {navItems.filter(n => n.section === sec).map(item => (
              <button key={item.id} onClick={() => setActive(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 18px", border: "none", background: active === item.id ? t.navActive : "none", color: active === item.id ? t.text : t.subtext, borderLeft: active === item.id ? "3px solid #1a9e8f" : "3px solid transparent", cursor: "pointer", fontSize: 14, justifyContent: sidebarOpen ? "flex-start" : "center", transition: "all 0.15s" }}>
                <span style={{ fontSize: 17, minWidth: 22, textAlign: "center" }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
                {item.badge && sidebarOpen && <span style={{ marginLeft: "auto", background: "#22c55e", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}

        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 18px", marginTop: "auto", border: "none", background: "none", color: "#ef4444", cursor: "pointer", fontSize: 14, justifyContent: sidebarOpen ? "flex-start" : "center" }}>
          <span style={{ fontSize: 17, minWidth: 22, textAlign: "center" }}>🚪</span>
          {sidebarOpen && <span>Logout</span>}
        </button>

        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ position: "absolute", bottom: 16, right: 8, background: t.toggleBg, border: `1px solid ${t.border}`, color: t.subtext, borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 13 }}>
          {sidebarOpen ? "←" : "→"}
        </button>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", borderBottom: `1px solid ${t.border}`, background: t.sidebar, transition: "all 0.3s" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.text }}>{navItems.find(n => n.id === active)?.label || "Dashboard"}</div>
            <div style={{ fontSize: 12, color: t.subtext }}>Home / {navItems.find(n => n.id === active)?.label || "Dashboard"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.searchBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 14px" }}>
              <span>🔍</span>
              <input placeholder="Search students, courses..." style={{ background: "none", border: "none", outline: "none", color: t.text, fontSize: 13, width: 180 }} />
            </div>
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} t={t} />
            <div style={{ fontSize: 20, cursor: "pointer" }}>🔔</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#fff" }}>DPS</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{faculty.name}</div>
                <div style={{ fontSize: 11, color: t.subtext }}>Faculty — {faculty.dept}</div>
              </div>
            </div>
          </div>
        </header>
        <div style={{ padding: 32, flex: 1, overflowY: "auto" }}>{renderPage()}</div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  MapPin, Shield, Clock, LogOut, ChevronRight, Check, X, Siren, User, 
  Lock, Mail, IdCard, Flame, HeartPulse, ShieldAlert, PackageX, 
  MoreHorizontal, Radio, CheckCircle2, CircleDot, Building2 
} from "lucide-react";

// ---------------------------------------------------------------------------
// Constants & Styles
// ---------------------------------------------------------------------------
const INCIDENT_TYPES = [
  { id: "medical", label: "Medical", icon: HeartPulse },
  { id: "fire", label: "Fire", icon: Flame },
  { id: "assault", label: "Assault / Threat", icon: ShieldAlert },
  { id: "theft", label: "Theft", icon: PackageX },
  { id: "other", label: "Other", icon: MoreHorizontal },
];

const CAMPUS_LOCATIONS = [
  { name: "Faculty of Science Complex", lat: 8.9758, lng: 7.1801 },
  { name: "Faculty of Arts Theatre", lat: 8.9771, lng: 7.1789 },
  { name: "Senate Building", lat: 8.9749, lng: 7.1813 },
  { name: "Main Library", lat: 8.9763, lng: 7.1795 },
  { name: "Student Hostel Block C", lat: 8.9781, lng: 7.1822 },
  { name: "Sports Complex", lat: 8.9739, lng: 7.1770 },
  { name: "Main Gate", lat: 8.9720, lng: 7.1755 },
  { name: "Teaching Hospital Wing", lat: 8.9795, lng: 7.1840 },
];

const STATUS = {
  new: { label: "New", order: 0, color: "#EF4444" },
  acknowledged: { label: "Acknowledged", order: 1, color: "#F59E0B" },
  responding: { label: "Responding", order: 2, color: "#3B82F6" },
  resolved: { label: "Resolved", order: 3, color: "#10B981" },
};

const type = {
  eyebrow: { fontSize: "11px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" },
  h2: { fontSize: "20px", fontWeight: "700" },
  h3: { fontSize: "16px", fontWeight: "600" },
  body: { fontSize: "14px", lineHeight: "1.5" },
  small: { fontSize: "13px" },
  caption: { fontSize: "12px" },
  mono: { fontFamily: "monospace", fontSize: "12px" },
  numeral: { fontSize: "24px", fontWeight: "800" }
};

const styles = {
  bootScreen: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#0F1A2B" },
  appShell: { backgroundColor: "#0B131F", color: "#F5F3EE", minHeight: "100vh", fontFamily: "sans-serif" },
  authWrap: { display: "flex", minHeight: "100vh" },
  authLeft: { flex: 1, backgroundColor: "#0F1A2B", padding: "40px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  authRight: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" },
  brandRow: { display: "flex", alignItems: "center", gap: "12px" },
  brandMark: { padding: "8px", backgroundColor: "#E8A33D", borderRadius: "8px" },
  pulseBoard: { backgroundColor: "#172337", padding: "24px", borderRadius: "12px" },
  pulseRow: { display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" },
  pulseDot: { width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981" },
  authStatRow: { display: "flex", gap: "32px", marginTop: "24px" },
  authCard: { width: "100%", maxWidth: "400px" },
  roleToggle: { display: "flex", gap: "8px", marginBottom: "20px" },
  roleBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px", borderRadius: "6px", border: "1px solid #23334D", backgroundColor: "#132033", color: "#8895AA", cursor: "pointer" },
  roleBtnActive: { backgroundColor: "#E8A33D", color: "#0F1A2B", borderColor: "#E8A33D", fontWeight: "600" },
  tabRow: { display: "flex", borderBottom: "1px solid #23334D", marginBottom: "20px" },
  tabBtn: { flex: 1, padding: "10px", background: "none", border: "none", color: "#8895AA", cursor: "pointer" },
  tabBtnActive: { color: "#F5F3EE", borderBottom: "2px solid #E8A33D" },
  fieldWrap: { display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" },
  fieldInputWrap: { display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#132033", border: "1px solid #23334D", borderRadius: "6px", padding: "0 12px" },
  input: { flex: 1, padding: "12px 0", backgroundColor: "transparent", border: "none", color: "#F5F3EE", outline: "none" },
  primaryBtn: { width: "100%", padding: "12px", backgroundColor: "#E8A33D", color: "#0F1A2B", border: "none", borderRadius: "6px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" },
  errBox: { padding: "10px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid #EF4444", borderRadius: "6px", color: "#EF4444", fontSize: "13px", marginBottom: "16px" },
  linkBtn: { background: "none", border: "none", color: "#E8A33D", cursor: "pointer", textDecoration: "underline" },
  mobileShell: { maxWidth: "480px", margin: "0 auto", padding: "20px", display: "flex", flexDirection: "column", minHeight: "100vh" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  sosSection: { padding: "20px 0" },
  sosButton: { width: "100%", padding: "32px 20px", backgroundColor: "#E8A33D", border: "none", borderRadius: "16px", color: "#0F1A2B", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" },
  scrollArea: { flex: 1 },
  typeGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  typeCard: { padding: "16px", border: "1px solid #23334D", backgroundColor: "#132033", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" },
  typeCardActive: { backgroundColor: "#E8A33D", borderColor: "#E8A33D" },
  select: { width: "100%", padding: "12px", backgroundColor: "#132033", border: "1px solid #23334D", color: "#F5F3EE", borderRadius: "6px", outline: "none" },
  textarea: { width: "100%", padding: "12px", backgroundColor: "#132033", border: "1px solid #23334D", color: "#F5F3EE", borderRadius: "6px", outline: "none", boxSizing: "border-box" },
  locPreview: { display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" },
  formHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  formFooter: { marginTop: "20px" },
  sendBtn: { width: "100%", padding: "14px", backgroundColor: "#EF4444", color: "#FFF", border: "none", borderRadius: "8px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" },
  activeBanner: { backgroundColor: "#132033", border: "1px solid #E8A33D", padding: "16px", borderRadius: "8px", marginBottom: "20px" },
  activeBannerTop: { display: "flex", alignItems: "center", gap: "8px" },
  pulseDotSmall: { width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#E8A33D" },
  iconBtn: { background: "none", border: "none", cursor: "pointer" },
  emptyState: { padding: "32px", textAlignment: "center", border: "1px dashed #23334D", borderRadius: "8px" },
  incidentCard: { padding: "12px", backgroundColor: "#132033", border: "1px solid #23334D", borderRadius: "8px", display: "flex", justifyContent: "space-between", cursor: "pointer" },
  modalOverlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  modalCard: { backgroundColor: "#0F1A2B", border: "1px solid #23334D", borderRadius: "12px", padding: "24px", maxWidth: "400px", width: "100%" },
  consoleShell: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
  toast: { position: "fixed", bottom: "20px", right: "20px", padding: "12px 20px", borderRadius: "6px", color: "#FFF", zIndex: 1000 }
};

const GlobalStyle = () => (
  <style>{`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #0B131F; }
  `}</style>
);

// ---------------------------------------------------------------------------
// Storage Helpers
// ---------------------------------------------------------------------------
function hasStorage() {
  return typeof window !== "undefined" && window.storage && typeof window.storage.get === "function";
}

async function storageGet(key) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

async function storageSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ---------------------------------------------------------------------------
// Root App
// ---------------------------------------------------------------------------
export default function App() {
  const [booting, setBooting] = useState(true);
  const [session, setSession] = useState(null);
  const [users, setUsers] = useState({});
  const [incidents, setIncidents] = useState({});
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    (async () => {
      const [u, inc, localSession] = await Promise.all([
        storageGet("csa:users", true),
        storageGet("csa:incidents", true),
        storageGet("csa:session", false),
      ]);
      setUsers(u || {});
      setIncidents(inc || {});
      if (localSession && (u || {})[localSession.userId]) setSession(localSession);
      setBooting(false);
    })();
  }, []);

  useEffect(() => {
    const t = setInterval(async () => {
      const [u, inc] = await Promise.all([
        storageGet("csa:users", true),
        storageGet("csa:incidents", true),
      ]);
      if (u) setUsers(u);
      if (inc) setIncidents(inc);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const showToast = useCallback((msg, kind = "info") => {
    setToast({ msg, kind, id: Date.now() });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const persistUsers = useCallback(async (next) => {
    setUsers(next);
    await storageSet("csa:users", next, true);
  }, []);

  const persistIncidents = useCallback(async (next) => {
    setIncidents(next);
    await storageSet("csa:incidents", next, true);
  }, []);

  const login = useCallback(async (userId, role) => {
    const s = { userId, role };
    setSession(s);
    await storageSet("csa:session", s, false);
  }, []);

  const logout = useCallback(async () => {
    setSession(null);
    await storageSet("csa:session", null, false);
  }, []);

  if (booting) {
    return (
      <div style={styles.bootScreen}>
        <Shield size={28} color="#E8A33D" strokeWidth={2.2} />
        <div style={{ ...type.eyebrow, color: "#8895AA", marginTop: 14 }}>CAMPUS SAFETY &amp; EMERGENCY ALERT SYSTEM</div>
      </div>
    );
  }

  const currentUser = session ? users[session.userId] : null;

  return (
    <div style={styles.appShell}>
      <GlobalStyle />
      {!session || !currentUser ? (
        <AuthScreen users={users} persistUsers={persistUsers} login={login} showToast={showToast} />
      ) : session.role === "responder" ? (
        <DispatchConsole
          user={currentUser}
          incidents={incidents}
          persistIncidents={persistIncidents}
          logout={logout}
          showToast={showToast}
        />
      ) : (
        <ReportApp
          user={currentUser}
          incidents={incidents}
          persistIncidents={persistIncidents}
          logout={logout}
          showToast={showToast}
        />
      )}
      {toast && <Toast key={toast.id} msg={toast.msg} kind={toast.kind} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Auth Screen
// ---------------------------------------------------------------------------
function AuthScreen({ users, persistUsers, login, showToast }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({ name: "", matric: "", email: "", password: "" });
  const [err, setErr] = useState("");

  const reset = () => setForm({ name: "", matric: "", email: "", password: "" });

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setErr("Fill in all required fields.");
      return;
    }
    const exists = Object.values(users).some((u) => u.email.toLowerCase() === form.email.toLowerCase());
    if (exists) {
      setErr("An account with this email already exists.");
      return;
    }
    const id = uid("usr");
    const newUser = {
      id,
      name: form.name.trim(),
      matric: form.matric.trim(),
      email: form.email.trim(),
      password: form.password,
      role,
      createdAt: Date.now(),
    };
    const next = { ...users, [id]: newUser };
    await persistUsers(next);
    await login(id, role);
    showToast(`Welcome, ${newUser.name.split(" ")[0]}.`, "success");
    reset();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    const match = Object.values(users).find(
      (u) => u.email.toLowerCase() === form.email.toLowerCase() && u.password === form.password
    );
    if (!match) {
      setErr("No account matches that email and password.");
      return;
    }
    await login(match.id, match.role);
    showToast(`Signed in as ${match.name.split(" ")[0]}.`, "success");
    reset();
  };

  return (
    <div style={styles.authWrap}>
      <div style={styles.authLeft}>
        <div style={styles.brandRow}>
          <div style={styles.brandMark}>
            <Shield size={20} color="#0F1A2B" strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ ...type.eyebrow, color: "#E8A33D" }}>UNIVERSITY OF ABUJA</div>
            <div style={{ ...type.h3, color: "#F5F3EE", marginTop: 2 }}>Campus Safety &amp; Emergency Alert</div>
          </div>
        </div>
        <div style={styles.pulseBoard}>
          <div style={{ ...type.eyebrow, color: "#66748C" }}>LIVE STATUS STRIP</div>
          <div style={styles.pulseRow}>
            <span style={styles.pulseDot} />
            <span style={{ ...type.mono, color: "#B9C2D0" }}>DISPATCH CHANNEL — ACTIVE</span>
          </div>
          <p style={{ ...type.body, color: "#8895AA", marginTop: 18, maxWidth: 380 }}>
            Report an emergency in seconds. Your location is shared with campus security the moment you send an
            alert, so responders can reach you directly — no phone call, no waiting on hold.
          </p>
          <div style={styles.authStatRow}>
            <div>
              <div style={{ ...type.numeral, color: "#F5F3EE" }}>24/7</div>
              <div style={{ ...type.caption, color: "#66748C" }}>Monitored dispatch</div>
            </div>
            <div>
              <div style={{ ...type.numeral, color: "#F5F3EE" }}>1‑tap</div>
              <div style={{ ...type.caption, color: "#66748C" }}>Location sharing</div>
            </div>
          </div>
        </div>
      </div>
      <div style={styles.authRight}>
        <div style={styles.authCard}>
          <div style={styles.roleToggle}>
            <button
              type="button"
              onClick={() => setRole("user")}
              style={{ ...styles.roleBtn, ...(role === "user" ? styles.roleBtnActive : {}) }}
            >
              <User size={14} strokeWidth={2.4} /> Student / Staff
            </button>
            <button
              type="button"
              onClick={() => setRole("responder")}
              style={{ ...styles.roleBtn, ...(role === "responder" ? styles.roleBtnActive : {}) }}
            >
              <Radio size={14} strokeWidth={2.4} /> Security Personnel
            </button>
          </div>
          <div style={styles.tabRow}>
            <button
              type="button"
              onClick={() => { setMode("login"); setErr(""); }}
              style={{ ...styles.tabBtn, ...(mode === "login" ? styles.tabBtnActive : {}) }}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setErr(""); }}
              style={{ ...styles.tabBtn, ...(mode === "register" ? styles.tabBtnActive : {}) }}
            >
              Register
            </button>
          </div>
          <form onSubmit={mode === "login" ? handleLogin : handleRegister} style={{ marginTop: 22 }}>
            {mode === "register" && (
              <Field label="Full name" icon={User}>
                <input
                  style={styles.input}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Zakari Abba"
                />
              </Field>
            )}
            {mode === "register" && role === "user" && (
              <Field label="Matric / staff number" icon={IdCard}>
                <input
                  style={styles.input}
                  value={form.matric}
                  onChange={(e) => setForm({ ...form, matric: e.target.value })}
                  placeholder="e.g. UAB/CSC/22/1044"
                />
              </Field>
            )}
            <Field label="Email" icon={Mail}>
              <input
                type="email"
                style={styles.input}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@uniabuja.edu.ng"
              />
            </Field>
            <Field label="Password" icon={Lock}>
              <input
                type="password"
                style={styles.input}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </Field>
            {err && <div style={styles.errBox}>{err}</div>}
            <button type="submit" style={styles.primaryBtn}>
              {mode === "login" ? "Sign in" : "Create account"}
              <ChevronRight size={16} strokeWidth={2.4} />
            </button>
          </form>
          <p style={{ ...type.caption, color: "#8895AA", marginTop: 16, textAlign: "center" }}>
            {mode === "login" ? (
              <>No account? <button style={styles.linkBtn} onClick={() => setMode("register")}>Register here</button></>
            ) : (
              <>Already registered? <button style={styles.linkBtn} onClick={() => setMode("login")}>Sign in</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label style={styles.fieldWrap}>
      <span style={{ ...type.caption, color: "#66748C" }}>{label}</span>
      <div style={styles.fieldInputWrap}>
        <Icon size={15} color="#66748C" strokeWidth={2.2} style={{ flexShrink: 0 }} />
        {children}
      </div>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Reporter App
// ---------------------------------------------------------------------------
function ReportApp({ user, incidents, persistIncidents, logout, showToast }) {
  const [screen, setScreen] = useState("home");
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [sending, setSending] = useState(false);
  const [activeDetailId, setActiveDetailId] = useState(null);

  const myIncidents = Object.values(incidents)
    .filter((i) => i.userId === user.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  const activeIncident = myIncidents.find((i) => i.status !== "resolved");

  const submitReport = async () => {
    if (!selectedType) {
      showToast("Choose what's happening first.", "error");
      return;
    }
    setSending(true);
    const id = uid("inc");
    const record = {
      id,
      userId: user.id,
      userName: user.name,
      userMatric: user.matric,
      type: selectedType,
      description: description.trim(),
      location: selectedLocation,
      status: "new",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      log: [{ status: "new", at: Date.now(), note: "Alert sent by reporter." }],
    };
    await persistIncidents({ ...incidents, [id]: record });
    setSending(false);
    setSelectedType(null);
    setDescription("");
    setScreen("home");
    showToast("Alert sent — security has been notified.", "success");
  };

  if (screen === "report") {
    return (
      <ReportForm
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        description={description}
        setDescription={setDescription}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        onBack={() => setScreen("home")}
        onSubmit={submitReport}
        sending={sending}
      />
    );
  }

  return (
    <div style={styles.mobileShell}>
      <TopBar user={user} onLogout={logout} />
      <div style={styles.scrollArea}>
        {activeIncident ? (
          <ActiveIncidentBanner incident={activeIncident} />
        ) : (
          <div style={styles.sosSection}>
            <button style={styles.sosButton} onClick={() => setScreen("report")}>
              <Siren size={30} strokeWidth={2.2} />
              <span style={{ ...type.h2, marginTop: 8 }}>Report emergency</span>
              <span style={{ ...type.caption, color: "#3A2410", marginTop: 4 }}>Sends your location instantly</span>
            </button>
          </div>
        )}
        <div style={{ ...type.eyebrow, color: "#66748C", margin: "28px 0 12px" }}>YOUR REPORTS</div>
        {myIncidents.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ ...type.body, color: "#66748C" }}>No reports yet. If something happens, tap the button above — it takes seconds.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {myIncidents.map((inc) => (
              <IncidentRow key={inc.id} incident={inc} onClick={() => setActiveDetailId(inc.id)} />
            ))}
          </div>
        )}
      </div>
      {activeDetailId && (
        <IncidentDetailSheet
          incident={incidents[activeDetailId]}
          onClose={() => setActiveDetailId(null)}
        />
      )}
    </div>
  );
}

function ReportForm({ selectedType, setSelectedType, description, setDescription, selectedLocation, setSelectedLocation, onBack, onSubmit, sending }) {
  return (
    <div style={styles.mobileShell}>
      <div style={styles.formHeader}>
        <button style={styles.iconBtn} onClick={onBack}><X size={18} color="#F5F3EE" /></button>
        <div style={{ ...type.eyebrow, color: "#E8A33D" }}>NEW ALERT</div>
        <div style={{ width: 34 }} />
      </div>
      <div style={styles.scrollArea}>
        <div style={{ ...type.caption, color: "#66748C", marginBottom: 10 }}>WHAT'S HAPPENING</div>
        <div style={styles.typeGrid}>
          {INCIDENT_TYPES.map((t) => {
            const Icon = t.icon;
            const active = selectedType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                style={{ ...styles.typeCard, ...(active ? styles.typeCardActive : {}) }}
              >
                <Icon size={20} strokeWidth={2.2} color={active ? "#0F1A2B" : "#E8A33D"} />
                <span style={{ ...type.small, color: active ? "#0F1A2B" : "#F5F3EE", marginTop: 6 }}>{t.label}</span>
              </button>
            );
          })}
        </div>
        <div style={{ ...type.caption, color: "#66748C", margin: "22px 0 10px" }}>YOUR LOCATION</div>
        <select
          style={styles.select}
          value={selectedLocation.name}
          onChange={(e) => setSelectedLocation(CAMPUS_LOCATIONS.find((l) => l.name === e.target.value))}
        >
          {CAMPUS_LOCATIONS.map((l) => (
            <option key={l.name} value={l.name}>{l.name}</option>
          ))}
        </select>
        <div style={styles.locPreview}>
          <MapPin size={14} color="#E8A33D" strokeWidth={2.4} />
          <span style={{ ...type.small, color: "#8895AA" }}>
            {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)} — shared automatically with responders
          </span>
        </div>
        <div style={{ ...type.caption, color: "#66748C", margin: "22px 0 10px" }}>DESCRIBE BRIEFLY (OPTIONAL)</div>
        <textarea
          style={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Collapsed near the library entrance, conscious but not responding well."
          rows={4}
        />
      </div>
      <div style={styles.formFooter}>
        <button style={styles.sendBtn} onClick={onSubmit} disabled={sending}>
          {sending ? "Sending…" : (
            <>
              <Siren size={18} strokeWidth={2.4} /> Send alert to security
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function TopBar({ user, onLogout }) {
  return (
    <div style={styles.topBar}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Shield size={20} color="#E8A33D" />
        <div>
          <div style={{ ...type.h3 }}>{user.name}</div>
          <div style={{ ...type.caption, color: "#8895AA" }}>{user.matric || user.role}</div>
        </div>
      </div>
      <button style={styles.iconBtn} onClick={onLogout}><LogOut size={18} color="#8895AA" /></button>
    </div>
  );
}

function ActiveIncidentBanner({ incident }) {
  const meta = INCIDENT_TYPES.find((t) => t.id === incident.type) || INCIDENT_TYPES[4];
  const Icon = meta.icon;
  const st = STATUS[incident.status] || STATUS.new;

  return (
    <div style={styles.activeBanner}>
      <div style={styles.activeBannerTop}>
        <span style={styles.pulseDotSmall} />
        <span style={{ ...type.eyebrow, color: "#E8A33D" }}>ACTIVE INCIDENT ({st.label})</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
        <Icon size={24} color="#E8A33D" />
        <div>
          <div style={{ ...type.h3 }}>{meta.label} Emergency</div>
          <div style={{ ...type.caption, color: "#8895AA" }}>{incident.location.name} • {timeAgo(incident.createdAt)}</div>
        </div>
      </div>
    </div>
  );
}

function IncidentRow({ incident, onClick }) {
  const meta = INCIDENT_TYPES.find((t) => t.id === incident.type) || INCIDENT_TYPES[4];
  const st = STATUS[incident.status] || STATUS.new;

  return (
    <div style={styles.incidentCard} onClick={onClick}>
      <div>
        <div style={{ ...type.h3 }}>{meta.label}</div>
        <div style={{ ...type.caption, color: "#8895AA" }}>{incident.location.name}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ ...type.caption, color: st.color, fontWeight: "600" }}>{st.label}</div>
        <div style={{ ...type.caption, color: "#66748C" }}>{timeAgo(incident.createdAt)}</div>
      </div>
    </div>
  );
}

function IncidentDetailSheet({ incident, onClose }) {
  if (!incident) return null;
  const meta = INCIDENT_TYPES.find((t) => t.id === incident.type) || INCIDENT_TYPES[4];

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ ...type.h3 }}>{meta.label} Report Details</div>
          <button style={styles.iconBtn} onClick={onClose}><X size={18} color="#F5F3EE" /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ ...type.caption, color: "#66748C" }}>LOCATION</div>
            <div style={{ ...type.body }}>{incident.location.name}</div>
          </div>
          <div>
            <div style={{ ...type.caption, color: "#66748C" }}>DESCRIPTION</div>
            <div style={{ ...type.body }}>{incident.description || "No specific details provided."}</div>
          </div>
          <div>
            <div style={{ ...type.caption, color: "#66748C" }}>STATUS HISTORY</div>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 8 }}>
              {incident.log && incident.log.map((item, idx) => (
                <div key={idx} style={{ ...type.caption, color: "#8895AA" }}>
                  <span style={{ color: "#F5F3EE" }}>[{STATUS[item.status]?.label || item.status}]</span> - {item.note} ({timeAgo(item.at)})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dispatch Console (Responder View)
// ---------------------------------------------------------------------------
function DispatchConsole({ user, incidents, persistIncidents, logout, showToast }) {
  const incList = Object.values(incidents).sort((a, b) => b.createdAt - a.createdAt);

  const updateStatus = async (id, nextStatus) => {
    const target = incidents[id];
    if (!target) return;

    const nextLog = [
      ...(target.log || []),
      { status: nextStatus, at: Date.now(), note: `Status set to ${STATUS[nextStatus]?.label} by responder.` }
    ];

    const updated = {
      ...target,
      status: nextStatus,
      updatedAt: Date.now(),
      log: nextLog
    };

    await persistIncidents({ ...incidents, [id]: updated });
    showToast(`Updated status to ${STATUS[nextStatus]?.label}.`, "info");
  };

  return (
    <div style={styles.consoleShell}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <div style={{ ...type.eyebrow, color: "#E8A33D" }}>DISPATCH CONTROL</div>
          <div style={{ ...type.h2 }}>Responder Console</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ ...type.caption, color: "#8895AA" }}>Logged in as {user.name}</span>
          <button style={styles.iconBtn} onClick={logout}><LogOut size={18} color="#8895AA" /></button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {incList.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ ...type.body, color: "#66748C" }}>No incidents reported yet.</div>
          </div>
        ) : (
          incList.map((inc) => {
            const meta = INCIDENT_TYPES.find((t) => t.id === inc.type) || INCIDENT_TYPES[4];
            return (
              <div key={inc.id} style={{ ...styles.incidentCard, flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ ...type.h3 }}>{meta.label}</span>
                    <span style={{ ...type.caption, color: "#8895AA", marginLeft: 8 }}>by {inc.userName} ({inc.userMatric || "Staff/User"})</span>
                  </div>
                  <span style={{ ...type.caption, color: STATUS[inc.status]?.color, fontWeight: "600" }}>
                    {STATUS[inc.status]?.label}
                  </span>
                </div>
                <div style={{ ...type.body, color: "#B9C2D0" }}>
                  <MapPin size={14} inline style={{ marginRight: 4 }} /> {inc.location.name}
                </div>
                {inc.description && <div style={{ ...type.small, color: "#8895AA" }}>"{inc.description}"</div>}
                
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  {Object.keys(STATUS).map((stKey) => (
                    <button
                      key={stKey}
                      onClick={() => updateStatus(inc.id, stKey)}
                      disabled={inc.status === stKey}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "4px",
                        border: "1px solid #23334D",
                        backgroundColor: inc.status === stKey ? STATUS[stKey].color : "#132033",
                        color: inc.status === stKey ? "#FFF" : "#8895AA",
                        fontSize: "12px",
                        cursor: inc.status === stKey ? "default" : "pointer"
                      }}
                    >
                      {STATUS[stKey].label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toast Component
// ---------------------------------------------------------------------------
function Toast({ msg, kind }) {
  const bg = kind === "error" ? "#EF4444" : kind === "success" ? "#10B981" : "#3B82F6";
  return (
    <div style={{ ...styles.toast, backgroundColor: bg }}>
      <span style={{ ...type.small }}>{msg}</span>
    </div>
  );
}
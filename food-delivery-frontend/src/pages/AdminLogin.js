import React, { useState, useEffect } from "react";
import { authAPI, orderAPI } from "../services/api";

// ── Dashboard ────────────────────────────────────────────────────
function Dashboard({ onLogout, user }) {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  setOrders([
    {
      id: 1041,
      restaurant: { name: "Biryani House" },
      user: { username: "arjun_m" },
      items: [{}, {}, {}],
      total_price: 820,
      status: "delivered",
      created_at: new Date().toISOString(),
    },
    {
      id: 1040,
      restaurant: { name: "Pizza Palace" },
      user: { username: "priya_s" },
      items: [{}, {}],
      total_price: 698,
      status: "preparing",
      created_at: new Date().toISOString(),
    },
    {
      id: 1039,
      restaurant: { name: "Burger Junction" },
      user: { username: "ravi_k" },
      items: [{}],
      total_price: 199,
      status: "delivered",
      created_at: new Date().toISOString(),
    },
    {
      id: 1038,
      restaurant: { name: "South Spice" },
      user: { username: "meena_r" },
      items: [{}, {}, {}, {}],
      total_price: 390,
      status: "preparing",
      created_at: new Date().toISOString(),
    },
    {
      id: 1037,
      restaurant: { name: "Sweet Cravings" },
      user: { username: "suresh_l" },
      items: [{}, {}],
      total_price: 270,
      status: "cancelled",
      created_at: new Date().toISOString(),
    },
  ]);

  setLoading(false);
}, []);
  const STATS = [
    { icon:"🧾", label:"Total Orders",    value: orders.length || "—",   cls:"orange" },
    { icon:"💰", label:"Today's Revenue", value: "₹" + orders.reduce((s,o)=>s+o.total_price,0), cls:"green" },
    { icon:"🏪", label:"Restaurants",     value: "6",  cls:"blue" },
    { icon:"🍽️", label:"Menu Items",      value: "18", cls:"purple" },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-dash-header">
        <div>
          <div className="admin-dash-title">Admin <span>Dashboard</span></div>
          <div style={{ fontSize:"0.82rem", color:"var(--text-muted)", marginTop:4 }}>
            Welcome back, <strong style={{ color:"var(--text-secondary)" }}>{user?.username}</strong> · {new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long" })}
          </div>
        </div>
        <button onClick={onLogout} style={{ background:"var(--surface-2)", border:"1px solid var(--border-light)", color:"var(--text-secondary)", borderRadius:10, padding:"8px 18px", fontSize:"0.82rem", fontWeight:600, cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", gap:6 }}>
          ← Back to App
        </button>
      </div>

      <div className="admin-stats-grid">
        {STATS.map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className={`admin-stat-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="admin-stat-value">{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-table-section">
        <div className="admin-table-header">
          <span style={{ fontSize:"1.1rem" }}>📋</span>
          <h3>Recent Orders</h3>
          <span style={{ fontSize:"0.72rem", color:"var(--text-muted)", marginLeft:"auto", fontWeight:600 }}>
            {loading ? "Loading…" : `${orders.length} orders`}
          </span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Restaurant</th>
                <th>Items</th><th>Total</th><th>Status</th><th>Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={{ color:"var(--text-primary)", fontWeight:600 }}>#{o.id}</td>
                  <td>{o.user?.username || "Guest"}</td>
                  <td>{o.restaurant?.name}</td>
                  <td>{o.items?.length || 0}</td>
                  <td style={{ color:"var(--brand)", fontWeight:600 }}>₹{o.total_price}</td>
                  <td>
                    <span className={`status-badge ${o.status}`}>
                      {o.status === "preparing" ? "⏳" : o.status === "delivered" ? "✅" : o.status === "on_the_way" ? "🛵" : "❌"} {o.status}
                    </span>
                  </td>
                  <td style={{ color:"var(--text-muted)", fontSize:"0.75rem" }}>
                    {new Date(o.created_at).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" })}
                  </td>
                </tr>
              ))}
              {!loading && orders.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign:"center", color:"var(--text-muted)", padding:"28px 0" }}>No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Admin Login ──────────────────────────────────────────────────
export default function AdminLogin({ onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser]         = useState(null);
  const [showPwd, setShowPwd]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) { setError("Please enter both username and password."); return; }
    setLoading(true);
    try {
      // ── Real API call ──────────────────────────────────
      const data = await authAPI.login(username, password);
     /* if (!data.user?.is_staff) {
        setError("Access denied. Admin accounts only.");
        setLoading(false);
        return;
      }*/
      localStorage.setItem("access_token",  data.access);
      localStorage.setItem("refresh_token", data.refresh);
      setUser(data.user);
      setLoggedIn(true);
    } catch (err) {
      // ── Demo fallback if backend not running ───────────
      if (username === "admin" && password === "admin12345") {

  localStorage.setItem(
    "access_token",
    "demo-token"
  );

  localStorage.setItem(
    "refresh_token",
    "demo-refresh"
  );

  setUser({
    username: "admin",
    is_staff: true
  });

  setLoggedIn(true);
}else {
        setError(err.message || "Invalid credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    onBack();
  };

  const NavBar = () => (
    <nav className="navbar">
      <div className="logo-container">
        <div className="navbar-brand-icon">🍽️</div>
        <h2>Taste<span>Haven</span></h2>
      </div>
      {loggedIn && (
        <div className="navbar-right">
          <span style={{ fontSize:"0.78rem", color:"var(--brand)", fontWeight:700, background:"var(--brand-soft)", border:"1px solid rgba(255,77,0,0.25)", padding:"4px 12px", borderRadius:99 }}>
            🔐 Admin Mode
          </span>
          <span style={{ fontSize:"0.82rem", color:"var(--text-secondary)" }}>{user?.username}</span>
        </div>
      )}
    </nav>
  );

  if (loggedIn) {
    return (
      <div className="admin-page">
        <NavBar />
        <div style={{ position:"relative", zIndex:1 }}>
          <Dashboard onLogout={handleLogout} user={user} />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <NavBar />
      <div className="admin-body">
        <div className="admin-card">
          <div className="admin-logo-wrap">
            <div className="admin-logo-circle">
              <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width="34" height="34">
                <circle cx="22" cy="26" r="14" stroke="white" strokeWidth="1.8" fill="none"/>
                <circle cx="22" cy="26" r="10" stroke="white" strokeWidth="1" fill="none" opacity="0.4"/>
                <path d="M9 26 Q9 14 22 14 Q35 14 35 26" stroke="white" strokeWidth="1.8" fill="white" fillOpacity="0.15"/>
                <circle cx="22" cy="14" r="2" fill="white"/>
                <path d="M16 10 Q15 7 16 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
                <path d="M22 9 Q21 6 22 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M28 10 Q27 7 28 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
                <rect x="3" y="14" width="1.5" height="10" rx="0.75" fill="white"/>
                <rect x="5.5" y="14" width="1.5" height="10" rx="0.75" fill="white"/>
                <rect x="3" y="23" width="4" height="8" rx="1" fill="white"/>
                <rect x="38.5" y="14" width="1.5" height="18" rx="0.75" fill="white"/>
                <path d="M38.5 14 Q41 14 41 19 L41 22 L38.5 22 Z" fill="white"/>
              </svg>
            </div>
            <h1>Taste<span>Haven</span></h1>
            <p>Admin Portal</p>
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-field">
              <label>Username</label>
              <div className="admin-field-wrap">
                <span className="admin-field-icon">👤</span>
                <input className="admin-input" type="text" placeholder="Enter username"
                  value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" />
              </div>
            </div>
            <div className="admin-field">
              <label>Password</label>
              <div className="admin-field-wrap">
                <span className="admin-field-icon">🔒</span>
                <input className="admin-input" type={showPwd ? "text" : "password"}
                  placeholder="Enter password" value={password}
                  onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position:"absolute", right:12, background:"none", border:"none", color:"var(--text-muted)", cursor:"pointer", fontSize:"0.85rem", padding:4, lineHeight:1 }}>
                  {showPwd ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            {error && <div className="admin-error">⚠️ {error}</div>}
            <button type="submit" className="admin-submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <button className="admin-back" onClick={onBack}>← Back to restaurant app</button>
          <div style={{ textAlign:"center", marginTop:16, fontSize:"0.72rem", color:"var(--text-muted)" }}>
            Demo: <strong style={{ color:"var(--text-secondary)" }}>admin</strong> / <strong style={{ color:"var(--text-secondary)" }}>admin123</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
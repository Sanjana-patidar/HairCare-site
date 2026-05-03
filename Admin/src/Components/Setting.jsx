import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser, FiMail, FiPhone, FiLock, FiSave, FiEdit3,
  FiEye, FiEyeOff, FiCheck, FiAlertCircle, FiSettings,
  FiSun, FiMoon, FiBell, FiShield
} from "react-icons/fi";
import { MdOutlineWc } from "react-icons/md";
import { BsCalendar3 } from "react-icons/bs";
import axios from "axios";
import Swal from "sweetalert2";
import "./Setting.css";

const API = "http://localhost:5000/api/users";

const Setting = () => {
  const token = localStorage.getItem("token");

  /* ─── Tab ─── */
  const [activeTab, setActiveTab] = useState("profile");

  /* ─── Profile state ─── */
  const [profile, setProfile] = useState({
    username: "", email: "", phone: "", gender: "Male", dob: ""
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);  // {type, text}

  /* ─── Password state ─── */
  const [passwords, setPasswords] = useState({
    current: "", newPw: "", confirm: ""
  });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg]       = useState(null);

  /* ─── Preferences state ─── */
  const [isDark, setIsDark]               = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOn, setNotificationsOn]   = useState(true);

  /* ──────────────────────────────────────────
     Load profile on mount
  ────────────────────────────────────────── */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${API}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile({
          username: data.username || "",
          email   : data.email    || "",
          phone   : data.phone    || "",
          gender  : data.gender   || "Male",
          dob     : data.dob      || ""
        });
      } catch {
        setProfileMsg({ type: "error", text: "Failed to load profile data." });
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();

    // Load saved preferences
    const savedTheme = localStorage.getItem("adminTheme");
    setIsDark(savedTheme === "dark");
    setSidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
    setNotificationsOn(localStorage.getItem("adminNotifications") !== "false");
  }, []);

  /* ──────────────────────────────────────────
     Save Profile
  ────────────────────────────────────────── */
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      await axios.put(
        `${API}/profile`,
        { username: profile.username, phone: profile.phone, gender: profile.gender, dob: profile.dob },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
      Swal.fire({ icon: "success", title: "Profile Saved!", timer: 1500, showConfirmButton: false });
    } catch {
      setProfileMsg({ type: "error", text: "Failed to update profile." });
    } finally {
      setProfileSaving(false);
    }
  };

  /* ──────────────────────────────────────────
     Change Password  (via login re-auth logic)
  ────────────────────────────────────────── */
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwMsg(null);

    if (passwords.newPw !== passwords.confirm) {
      return setPwMsg({ type: "error", text: "New passwords do not match." });
    }
    if (passwords.newPw.length < 6) {
      return setPwMsg({ type: "error", text: "Password must be at least 6 characters." });
    }

    setPwSaving(true);
    try {
      await axios.put(
        `${API}/change-password`,
        { currentPassword: passwords.current, newPassword: passwords.newPw },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPwMsg({ type: "success", text: "Password changed successfully!" });
      setPasswords({ current: "", newPw: "", confirm: "" });
      Swal.fire({ icon: "success", title: "Password Changed!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to change password.";
      setPwMsg({ type: "error", text: msg });
    } finally {
      setPwSaving(false);
    }
  };

  /* ──────────────────────────────────────────
     Preferences helpers
  ────────────────────────────────────────── */
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("adminTheme", "dark");
    } else {
      document.body.removeAttribute("data-theme");
      localStorage.setItem("adminTheme", "light");
    }
    // Notify Header to stay in sync
    window.dispatchEvent(new CustomEvent("adminThemeChanged", { detail: next ? "dark" : "light" }));
  };

  const toggleNotifications = () => {
    const next = !notificationsOn;
    setNotificationsOn(next);
    localStorage.setItem("adminNotifications", String(next));
  };

  /* ──────────────────────────────────────────
     Tab config
  ────────────────────────────────────────── */
  const tabs = [
    { key: "profile",     label: "Profile",     icon: <FiUser /> },
    { key: "password",    label: "Password",    icon: <FiLock /> },
    { key: "preferences", label: "Preferences", icon: <FiSettings /> },
  ];

  /* ──────────────────────────────────────────
     Render
  ────────────────────────────────────────── */
  return (
    <div className="setting-page">
      {/* Page header */}
      <motion.div
        className="setting-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="setting-header-text">
          <h2>Settings</h2>
          <p>Manage your admin account and preferences</p>
        </div>
        <div className="setting-avatar-wrapper">
          <div className="setting-avatar">
            {profile.username ? profile.username[0].toUpperCase() : "A"}
          </div>
          <div className="setting-avatar-info">
            <span className="setting-avatar-name">{profile.username || "Admin"}</span>
            <span className="setting-avatar-role">Administrator</span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="setting-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`setting-tab-btn ${activeTab === t.key ? "active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="setting-panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >

          {/* ═══════ PROFILE TAB ═══════ */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSave} className="setting-form">
              <div className="setting-section-title">
                <FiUser /> Personal Information
              </div>

              {profileLoading ? (
                <div className="setting-skeleton-wrap">
                  {[1,2,3,4,5].map(i => <div key={i} className="setting-skeleton" />)}
                </div>
              ) : (
                <>
                  <div className="setting-row">
                    <div className="setting-field">
                      <label><FiUser /> Username</label>
                      <input
                        type="text"
                        value={profile.username}
                        onChange={e => setProfile(p => ({ ...p, username: e.target.value }))}
                        placeholder="Enter username"
                        required
                      />
                    </div>
                    <div className="setting-field">
                      <label><FiMail /> Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        title="Email cannot be changed"
                        className="disabled-field"
                      />
                      <span className="field-hint">Email address cannot be changed</span>
                    </div>
                  </div>

                  <div className="setting-row">
                    <div className="setting-field">
                      <label><FiPhone /> Phone Number</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 00000 00000"
                      />
                    </div>
                    <div className="setting-field">
                      <label><MdOutlineWc /> Gender</label>
                      <select
                        value={profile.gender}
                        onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="setting-row">
                    <div className="setting-field">
                      <label><BsCalendar3 /> Date of Birth</label>
                      <input
                        type="date"
                        value={profile.dob}
                        onChange={e => setProfile(p => ({ ...p, dob: e.target.value }))}
                      />
                    </div>
                  </div>

                  <AlertMsg msg={profileMsg} />

                  <div className="setting-actions">
                    <button type="submit" className="setting-save-btn" disabled={profileSaving}>
                      {profileSaving ? (
                        <><span className="btn-spinner" /> Saving…</>
                      ) : (
                        <><FiSave /> Save Changes</>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* ═══════ PASSWORD TAB ═══════ */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordSave} className="setting-form">
              <div className="setting-section-title">
                <FiShield /> Change Password
              </div>

              <PwField
                label="Current Password"
                id="current"
                value={passwords.current}
                show={showPw.current}
                onToggle={() => setShowPw(s => ({ ...s, current: !s.current }))}
                onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                placeholder="Enter current password"
              />
              <PwField
                label="New Password"
                id="newPw"
                value={passwords.newPw}
                show={showPw.newPw}
                onToggle={() => setShowPw(s => ({ ...s, newPw: !s.newPw }))}
                onChange={e => setPasswords(p => ({ ...p, newPw: e.target.value }))}
                placeholder="Minimum 6 characters"
              />
              <PwField
                label="Confirm New Password"
                id="confirm"
                value={passwords.confirm}
                show={showPw.confirm}
                onToggle={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))}
                onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                placeholder="Re-enter new password"
              />

              {/* Strength bar */}
              <StrengthBar password={passwords.newPw} />

              <AlertMsg msg={pwMsg} />

              <div className="setting-actions">
                <button type="submit" className="setting-save-btn" disabled={pwSaving}>
                  {pwSaving ? (
                    <><span className="btn-spinner" /> Updating…</>
                  ) : (
                    <><FiLock /> Update Password</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ═══════ PREFERENCES TAB ═══════ */}
          {activeTab === "preferences" && (
            <div className="setting-form">
              <div className="setting-section-title">
                <FiSettings /> Display & Preferences
              </div>

              <div className="pref-list">
                <PrefRow
                  icon={isDark ? <FiMoon /> : <FiSun />}
                  title={isDark ? "Dark Mode" : "Light Mode"}
                  subtitle="Switch between light and dark theme"
                  checked={isDark}
                  onChange={toggleTheme}
                />
                <PrefRow
                  icon={<FiBell />}
                  title="Notifications"
                  subtitle="Receive admin alerts and system updates"
                  checked={notificationsOn}
                  onChange={toggleNotifications}
                />
              </div>

              <div className="setting-section-title" style={{ marginTop: 28 }}>
                <FiShield /> Account Info
              </div>
              <div className="account-info-grid">
                <div className="acc-info-card">
                  <span className="acc-info-label">Account Type</span>
                  <span className="acc-info-value admin-badge">Administrator</span>
                </div>
                <div className="acc-info-card">
                  <span className="acc-info-label">Current Theme</span>
                  <span className="acc-info-value">{isDark ? "🌙 Dark" : "☀️ Light"}</span>
                </div>
                <div className="acc-info-card">
                  <span className="acc-info-label">Notifications</span>
                  <span className={`acc-info-value ${notificationsOn ? "status-on" : "status-off"}`}>
                    {notificationsOn ? "● Enabled" : "○ Disabled"}
                  </span>
                </div>
                <div className="acc-info-card">
                  <span className="acc-info-label">Username</span>
                  <span className="acc-info-value">{profile.username || "—"}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ──────────────────────────────────────────
   Sub-components
────────────────────────────────────────── */

const PwField = ({ label, id, value, show, onToggle, onChange, placeholder }) => (
  <div className="setting-field pw-field">
    <label><FiLock /> {label}</label>
    <div className="pw-input-wrap">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
      <button type="button" className="pw-toggle" onClick={onToggle}>
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  </div>
);

const StrengthBar = ({ password }) => {
  const getStrength = () => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 6)  score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { score, label: "Weak",   color: "#ef4444" };
    if (score <= 3) return { score, label: "Medium",  color: "#f59e0b" };
    return                { score, label: "Strong", color: "#10b981" };
  };
  const { score, label, color } = getStrength();
  if (!password) return null;
  return (
    <div className="strength-bar-wrap">
      <div className="strength-bars">
        {[1,2,3,4,5].map(i => (
          <div
            key={i}
            className="strength-bar-seg"
            style={{ background: i <= score ? color : "var(--border-color)" }}
          />
        ))}
      </div>
      <span className="strength-label" style={{ color }}>{label}</span>
    </div>
  );
};

const AlertMsg = ({ msg }) => {
  if (!msg) return null;
  return (
    <motion.div
      className={`setting-alert ${msg.type}`}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {msg.type === "success" ? <FiCheck /> : <FiAlertCircle />}
      {msg.text}
    </motion.div>
  );
};

const PrefRow = ({ icon, title, subtitle, checked, onChange }) => (
  <div className="pref-row">
    <div className="pref-icon">{icon}</div>
    <div className="pref-info">
      <span className="pref-title">{title}</span>
      <span className="pref-subtitle">{subtitle}</span>
    </div>
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  </div>
);

export default Setting;

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiPackage, FiX, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NotificationBell.css";

const API = "http://localhost:5000/api/orders";
const POLL_INTERVAL = 30_000; // 30 seconds

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const statusColor = {
  Pending:  { bg: "rgba(245,158,11,0.12)",  text: "#f59e0b" },
  Approved: { bg: "rgba(16,185,129,0.12)",  text: "#10b981" },
  Rejected: { bg: "rgba(239,68,68,0.12)",   text: "#ef4444" },
};

const NotificationBell = () => {
  const [open, setOpen]               = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading]         = useState(false);
  const [lastSeen, setLastSeen]       = useState(
    () => localStorage.getItem("notifLastSeen") || ""
  );

  const dropdownRef = useRef(null);
  const navigate    = useNavigate();
  const token       = localStorage.getItem("token");

  /* ── Fetch notifications ── */
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const params = lastSeen ? { lastSeen } : {};
      const { data } = await axios.get(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      /* silently ignore – admin might not be logged in yet */
    }
  }, [token, lastSeen]);

  /* ── Initial load + polling ── */
  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  /* ── Close on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Mark all as read when dropdown opens ── */
  const handleOpen = () => {
    const newOpen = !open;
    setOpen(newOpen);
    if (newOpen && unreadCount > 0) {
      const now = new Date().toISOString();
      setLastSeen(now);
      localStorage.setItem("notifLastSeen", now);
      setUnreadCount(0);
    }
  };

  /* ── Navigate to order history ── */
  const goToOrders = () => {
    setOpen(false);
    navigate("/admin/orderhistory");
  };

  return (
    <div className="notif-wrapper" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        className={`notif-bell-btn ${open ? "active" : ""}`}
        onClick={handleOpen}
        title="Notifications"
        aria-label="Notifications"
      >
        <FiBell />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              className="notif-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="notif-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="notif-dropdown-header">
              <div className="notif-header-left">
                <FiBell />
                <span>Notifications</span>
                {notifications.length > 0 && (
                  <span className="notif-total-badge">{notifications.length}</span>
                )}
              </div>
              <button className="notif-close-btn" onClick={() => setOpen(false)}>
                <FiX />
              </button>
            </div>

            {/* List */}
            <div className="notif-list">
              {notifications.length === 0 ? (
                <div className="notif-empty">
                  <div className="notif-empty-icon">🔔</div>
                  <p>No notifications yet</p>
                  <span>New orders will appear here</span>
                </div>
              ) : (
                notifications.map((n, idx) => {
                  const isNew = lastSeen
                    ? new Date(n.createdAt) > new Date(lastSeen)
                    : idx < 3;
                  const sc = statusColor[n.status] || statusColor.Pending;
                  return (
                    <motion.div
                      key={n._id}
                      className={`notif-item ${isNew ? "notif-item--new" : ""}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={goToOrders}
                    >
                      {/* Icon */}
                      <div className="notif-item-icon">
                        <FiPackage />
                        {isNew && <span className="notif-dot" />}
                      </div>

                      {/* Content */}
                      <div className="notif-item-content">
                        <div className="notif-item-top">
                          <span className="notif-item-title">
                            New Order — {n.customer?.firstname} {n.customer?.lastname}
                          </span>
                          <span className="notif-item-time">{timeAgo(n.createdAt)}</span>
                        </div>
                        <div className="notif-item-bottom">
                          <span className="notif-item-amount">₹{n.totalAmount}</span>
                          <span
                            className="notif-item-status"
                            style={{ background: sc.bg, color: sc.text }}
                          >
                            {n.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <button className="notif-view-all" onClick={goToOrders}>
                View all orders <FiChevronRight />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;

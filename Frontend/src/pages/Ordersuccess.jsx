import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Ordersuccess.css';

const STATUS_CONFIG = {
  Pending: { color: "#f59e0b", bg: "#fef3c7", icon: "fa-clock" },
  Processing: { color: "#3b82f6", bg: "#dbeafe", icon: "fa-gear" },
  Shipped: { color: "#8b5cf6", bg: "#ede9fe", icon: "fa-truck" },
  Delivered: { color: "#22c55e", bg: "#dcfce7", icon: "fa-circle-check" },
  Cancelled: { color: "#ef4444", bg: "#fee2e2", icon: "fa-circle-xmark" },
};

const PAYMENT_CONFIG = {
  Paid: { color: "#22c55e", bg: "#dcfce7", label: "Paid" },
  Pending: { color: "#f59e0b", bg: "#fef3c7", label: "Pending" },
  Failed: { color: "#ef4444", bg: "#fee2e2", label: "Failed" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <span className="ord-status-badge" style={{ color: cfg.color, background: cfg.bg }}>
      <i className={`fa-solid ${cfg.icon}`} />
      {status || "Pending"}
    </span>
  );
}

function PayBadge({ status }) {
  const cfg = PAYMENT_CONFIG[status] || PAYMENT_CONFIG.Pending;
  return (
    <span className="ord-pay-badge" style={{ color: cfg.color, background: cfg.bg }}>
      {cfg.label}
    </span>
  );
}

export default function Ordersuccess() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/myorders`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="ord-page">
        <div className="ord-header">
          <h1 className="ord-page-title">My Orders</h1>
        </div>
        <div className="ord-skeleton-list">
          {[1, 2, 3].map(i => <div key={i} className="ord-skeleton" />)}
        </div>
      </div>
    );
  }

  /* ── Empty ── */
  if (orders.length === 0) {
    return (
      <div className="ord-page">
        <div className="ord-header">
          <h1 className="ord-page-title">My Orders</h1>
        </div>
        <div className="ord-empty">
          <div className="ord-empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Looks like you haven't placed any orders. Start shopping!</p>
          <button className="ord-shop-btn" onClick={() => navigate('/allproducts')}>
            Browse Products <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="outline">
      <div className="ord-page">
        {/* Page header */}
        <div className="ord-header">
          <div>
            <h1 className="ord-page-title">My Orders</h1>
            <p className="ord-page-sub">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
          </div>
          <button className="ord-shop-btn" onClick={() => navigate('/allproducts')}>
            Shop More <i className="fa-solid fa-bag-shopping" />
          </button>
        </div>

        {/* Order cards */}
        <div className="ord-list">
          {orders.map((order) => {
            const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            });
            const prods = order.products || [];
            const isOpen = selectedOrder?._id === order._id;

            return (
              <div key={order._id} className={`ord-card ${isOpen ? 'ord-card--open' : ''}`}>
                {/* Card header */}
                <div className="ord-card-head" onClick={() => setSelectedOrder(isOpen ? null : order)}>
                  <div className="ord-card-left">
                    <div className="ord-id">
                      <span className="ord-id-label">Order</span>
                      <span className="ord-id-val">#{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="ord-meta">
                      <span><i className="fa-regular fa-calendar" /> {date}</span>
                      <span>
                        {order.paymentMethod === "Online" || order.paymentMethod === "Razorpay"
                          ? "💳 Online" : "💵 COD"}
                      </span>
                    </div>
                  </div>

                  <div className="ord-card-mid">
                    {/* Product thumbnails */}
                    <div className="ord-thumb-row">
                      {prods.slice(0, 3).map((p, i) => (
                        <img
                          key={i}
                          src={`${import.meta.env.VITE_API_IMAGE}/${p.image}`}
                          alt={p.name}
                          className="ord-thumb"
                          onError={(e) => { e.target.src = '/placeholder.png'; }}
                        />
                      ))}
                      {prods.length > 3 && (
                        <div className="ord-thumb ord-thumb-more">+{prods.length - 3}</div>
                      )}
                    </div>
                  </div>

                  <div className="ord-card-right">
                    <div className="ord-amount">₹{order.totalAmount?.toLocaleString('en-IN')}</div>
                    <StatusBadge status={order.status} />
                    <PayBadge status={order.paymentStatus} />
                    <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} ord-chevron`} />
                  </div>
                </div>

                {/* Expanded detail panel */}
                {isOpen && (
                  <div className="ord-detail">
                    <div className="ord-detail-grid">
                      {/* Products */}
                      <div className="ord-detail-section">
                        <h4 className="ord-section-title">
                          <i className="fa-solid fa-box" /> Items Ordered
                        </h4>
                        <div className="ord-items">
                          {prods.map((p, i) => (
                            <div key={i} className="ord-item">
                              <img
                                src={`${import.meta.env.VITE_API_IMAGE}/${p.image}`}
                                alt={p.name}
                                className="ord-item-img"
                                onError={(e) => { e.target.src = '/placeholder.png'; }}
                              />
                              <div className="ord-item-info">
                                <div className="ord-item-name">{p.name}</div>
                                <div className="ord-item-qty">Qty: {p.quantity}</div>
                              </div>
                              <div className="ord-item-price">₹{(p.price * p.quantity).toLocaleString('en-IN')}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery + Summary */}
                      <div className="ord-detail-right">
                        <div className="ord-detail-section">
                          <h4 className="ord-section-title">
                            <i className="fa-solid fa-location-dot" /> Delivery Address
                          </h4>
                          <div className="ord-address-box">
                            <div className="ord-addr-name">
                              {order.customer?.firstname} {order.customer?.lastname}
                              {order.customer?.name}
                            </div>
                            <div className="ord-addr-line">{order.customer?.address}</div>
                            <div className="ord-addr-line">
                              {order.customer?.city}{order.customer?.city && order.customer?.pincode ? " – " : ""}
                              {order.customer?.pincode}
                            </div>
                            {order.customer?.phone && (
                              <div className="ord-addr-phone">
                                <i className="fa-solid fa-phone" /> {order.customer.phone}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="ord-detail-section">
                          <h4 className="ord-section-title">
                            <i className="fa-solid fa-receipt" /> Order Summary
                          </h4>
                          <div className="ord-summary">
                            <div className="ord-summary-row">
                              <span>Subtotal</span>
                              <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="ord-summary-row">
                              <span>Shipping</span>
                              <span className="ord-free">FREE</span>
                            </div>
                            <div className="ord-summary-row ord-summary-total">
                              <span>Total</span>
                              <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

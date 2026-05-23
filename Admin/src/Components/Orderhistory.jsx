import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaCheck, FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHashtag, FaCalendarAlt, FaBox, FaShoppingBag } from "react-icons/fa";
import "./Orderhistory.css";

const Orderhistory = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [orderDetails, setOrderDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const perPage = 7;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/orderhistory`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return "";
    return status.toLowerCase();
  };

  const filteredOrders = orders.filter((o) => {
    const searchString = searchTerm.toLowerCase();
    const orderId = o._id.toLowerCase();
    const customerName = `${o.customer?.firstname || ''} ${o.customer?.lastname || ''}`.toLowerCase();
    const customerEmail = (o.customer?.email || '').toLowerCase();
    
    return orderId.includes(searchString) || 
           customerName.includes(searchString) || 
           customerEmail.includes(searchString);
  });

  const start = (page - 1) * perPage;
  const currentOrders = filteredOrders.slice(start, start + perPage);
  const totalPages = Math.ceil(filteredOrders.length / perPage);

  return (
    <>
      {/* Order Details Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content od-modal-content">
            {orderDetails ? (
              <>
                {/* Premium Gradient Header */}
                <div className="od-modal-header">
                  <div className="od-header-top">
                    <div className="od-header-left">
                      <div className="od-header-icon">
                        <FaShoppingBag />
                      </div>
                      <div>
                        <h5 className="od-header-title">Order Details</h5>
                        <p className="od-header-id">#{orderDetails._id.slice(0, 12).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="od-header-right">
                      <span className={`od-status-badge ${getStatusClass(orderDetails.status)}`}>
                        {orderDetails.status}
                      </span>
                      <button
                        type="button"
                        className="od-close-btn"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                  {orderDetails.createdAt && (
                    <div className="od-header-date">
                      <FaCalendarAlt />
                      <span>Placed on {new Date(orderDetails.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>

                {/* Modal Body */}
                <div className="od-modal-body">
                  {/* Customer Info Card */}
                  <div className="od-section">
                    <h6 className="od-section-title">
                      <FaUser className="od-section-icon" />
                      Customer Information
                    </h6>
                    <div className="od-customer-card">
                      <div className="od-customer-grid">
                        <div className="od-info-item">
                          <div className="od-info-icon"><FaUser /></div>
                          <div>
                            <span className="od-info-label">Full Name</span>
                            <span className="od-info-value">{orderDetails.customer.firstname} {orderDetails.customer.lastname}</span>
                          </div>
                        </div>
                        <div className="od-info-item">
                          <div className="od-info-icon"><FaEnvelope /></div>
                          <div>
                            <span className="od-info-label">Email</span>
                            <span className="od-info-value">{orderDetails.customer.email}</span>
                          </div>
                        </div>
                        <div className="od-info-item">
                          <div className="od-info-icon"><FaPhone /></div>
                          <div>
                            <span className="od-info-label">Phone</span>
                            <span className="od-info-value">{orderDetails.customer.phone}</span>
                          </div>
                        </div>
                        <div className="od-info-item">
                          <div className="od-info-icon"><FaMapMarkerAlt /></div>
                          <div>
                            <span className="od-info-label">Shipping Address</span>
                            <span className="od-info-value">{orderDetails.customer.address}, {orderDetails.customer.city}, {orderDetails.customer.pincode}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products Section */}
                  <div className="od-section">
                    <h6 className="od-section-title">
                      <FaBox className="od-section-icon" />
                      Order Items
                      <span className="od-item-count">{orderDetails.products.length} item{orderDetails.products.length > 1 ? 's' : ''}</span>
                    </h6>
                    <div className="od-products-list">
                      {orderDetails.products.map((item, index) => (
                        <div className="od-product-row" key={item._id || index}>
                          <div className="od-product-img-wrap">
                            <img
                              src={`${import.meta.env.VITE_API_IMAGE}/${item.image}`}
                              alt={item.name}
                              className="od-product-img"
                            />
                          </div>
                          <div className="od-product-info">
                            <span className="od-product-name">{item.name}</span>
                            <span className="od-product-meta">Qty: {item.quantity} × ₹{item.price}</span>
                          </div>
                          <div className="od-product-total">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="od-summary">
                    <div className="od-summary-row">
                      <span>Subtotal</span>
                      <span>₹{orderDetails.totalAmount}</span>
                    </div>
                    <div className="od-summary-row">
                      <span>Shipping</span>
                      <span className="od-free-shipping">Free</span>
                    </div>
                    <div className="od-summary-divider"></div>
                    <div className="od-summary-row od-summary-total">
                      <span>Total Amount</span>
                      <span>₹{orderDetails.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="od-modal-footer">
                  <button
                    type="button"
                    className="od-btn od-btn-close"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <div className="od-loading">
                <div className="od-loading-spinner"></div>
                <p>Loading order details...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="order-history-container">
        <div className="admin-header d-flex justify-content-between align-items-center">
          <h2>Order History</h2>
          <div style={{width: '250px'}}>
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="form-control"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="table-card">
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentOrders.map((o) => (
                <tr key={o._id}>
                  <td>{o._id.slice(0, 8)}</td>
                  <td>
                    {o.customer?.firstname} {o.customer?.lastname}
                  </td>
                  <td>{o.customer?.email}</td>
                  <td className="price">₹{o.totalAmount}</td>
                  <td>
                    <span className={`status-badge ${o.status.toLowerCase()}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="action-btns">
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      className="action-icon view"
                      onClick={() => setOrderDetails(o)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>

                    <button
                      className="action-icon view"
                      style={{ color: "#059669" }}
                      onClick={() => updateStatus(o._id, "Approved")}
                      title="Approve Order"
                    >
                      <FaCheck />
                    </button>

                    <button
                      className="action-icon delete"
                      onClick={() => updateStatus(o._id, "Rejected")}
                      title="Reject Order"
                    >
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <p className="empty-text">No orders found.</p>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                disabled={page === i + 1}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Orderhistory;

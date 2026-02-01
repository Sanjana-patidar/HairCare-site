import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye,FaCheck,FaTimes } from "react-icons/fa";
import "./Orderhistory.css";

const Orderhistory = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [orderDetails, setOrderDetails] = useState(null);

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

  const start = (page - 1) * perPage;
  const currentOrders = orders.slice(start, start + perPage);
  const totalPages = Math.ceil(orders.length / perPage);

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
  <div className="modal-dialog modal-dialog-centered modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title " id="exampleModalLabel">
          Order Details
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>

      <div className="modal-body">
        {orderDetails ? (
          <>
            {/* Customer Info */}
            <div className="customer-info mb-3">
              <h6>Customer Information</h6>
              <p><strong>Name:</strong> {orderDetails.customer.firstname} {orderDetails.customer.lastname}</p>
              <p><strong>Email:</strong> {orderDetails.customer.email}</p>
              <p><strong>Phone:</strong> {orderDetails.customer.phone}</p>
              <p><strong>Address:</strong> {orderDetails.customer.address}, {orderDetails.customer.city}, {orderDetails.customer.pincode}</p>
              <p><strong>Order ID:</strong> {orderDetails._id}</p>
            </div>

            <hr />

            {/* Product List Table */}
            <div className="product-list">
              <h6>Products</h6>
              <div className="table-responsive">
                <table className="table table-bordered ">
                  <thead>
                    <tr >
                      <th>Image</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.products.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <img
                            src={`${import.meta.env.VITE_API_IMAGE}/${item.image}`}
                            alt={item.name}
                            className="product-img"
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.price}</td>
                        <td>₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Amount */}
            <div className="total-amount text-end mt-3">
              <h6>Total Amount: ₹{orderDetails.totalAmount}</h6>
            </div>
          </>
        ) : (
          <p>Loading order details...</p>
        )}
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</div>

    <div className="order-page">
      <h2>Order History</h2>

      {/* TABLE */}
      <div className="table-wrapper">
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
                  {o.customer.firstname} {o.customer.lastname}
                </td>
                <td>{o.customer.email}</td>
                <td>₹{o.totalAmount}</td>
                <td>
                  <span className={`status ${o.status.toLowerCase()}`}>
                    {o.status}
                  </span>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <button 
                    data-bs-toggle="modal" data-bs-target="#exampleModal"
                    className="eye-btn"
                    onClick={() => setOrderDetails(o)}
                  >
                    <FaEye />
                  </button>

                  <button
                    className="approve-btn"
                    onClick={() => updateStatus(o._id, "Approved")}
                  >
                    <FaCheck />
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => updateStatus(o._id, "Rejected")}
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
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

import { useEffect, useState } from "react";
import { Table, Button, Modal, Badge, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import './Ordersuccess.css';
const Ordersuccess = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 🔹 FETCH ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/myorders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🔹 MODAL HANDLERS
  const openModal = (order) => {
    setSelectedOrder(order);
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return <Spinner animation="border" className="m-5" />;
  }

  return (
    <div className="p-5 mt-4">
      <h4 className="mb-3">My Orders</h4>

    <div className="orders-table">
        <Table bordered > 
        <thead className="table-light">
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id.slice(-6)}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>₹{order.totalAmount}</td>
              <td>{order.paymentMethod}</td>
              <td>
                <Badge bg="warning" text="dark">
                  {order.status}
                </Badge>
              </td>
              <td>
                <Button
                  className="view-btn"
                  size="sm"
                  onClick={() => openModal(order)}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

    </div>
      {/* ================= MODAL ================= */}
      <Modal show={show} onHide={closeModal} size="lg" centered>
        {selectedOrder && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                Order #{selectedOrder._id.slice(-6)}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {/* ORDER INFO */}
              <Row className="mb-3">
                <Col md={6}><b>Date:</b> {new Date(selectedOrder.createdAt).toLocaleDateString()}</Col>
                <Col md={6}><b>Status:</b> {selectedOrder.status}</Col>
                <Col md={6}><b>Payment:</b> {selectedOrder.paymentMethod}</Col>
                <Col md={6}><b>Total:</b> ₹{selectedOrder.totalAmount}</Col>
              </Row>

              <hr />

              {/* PRODUCTS */}
              <h6>Products</h6>
              {selectedOrder.products.map((p) => (
                <div
                  key={p._id}
                  className="d-flex align-items-center border rounded p-2 mb-2"
                >
                  <img
                    src={`http://localhost:5000/uploads/${p.image}`}
                    width="60"
                    height="60"
                    className="me-3 rounded"
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{p.name}</div>
                    <small>Qty: {p.quantity}</small>
                  </div>
                  <div className="fw-bold">₹{p.price}</div>
                </div>
              ))}

              <hr />

              {/* CUSTOMER */}
              <h6>Delivery Address</h6>
              <p className="mb-1">
                {selectedOrder.customer.firstname}{" "}
                {selectedOrder.customer.lastname}
              </p>
              <p className="mb-1">{selectedOrder.customer.address}</p>
              <p className="mb-1">
                {selectedOrder.customer.city} -{" "}
                {selectedOrder.customer.pincode}
              </p>
              <p>📞 {selectedOrder.customer.phone}</p>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Ordersuccess;

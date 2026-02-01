import React, { useState, useEffect } from "react";
import axios from "axios";
import "./User.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7); // Change this to control how many users per page

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || res.data);
    } catch (error) {
      console.log("user fetching error", error);
    }
  };

  // VIEW USER
  const handleView = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // DELETE USER
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((u) => u._id !== id));

      // Adjust current page if necessary
      const lastPage = Math.ceil((users.length - 1) / usersPerPage);
      if (currentPage > lastPage) setCurrentPage(lastPage);
    } catch (error) {
      alert("Delete failed");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="user-container">
      <h2 className="page-title">User Management</h2>

      <div className="table-card">
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{indexOfFirstUser + index + 1}</td>

                <td className="user-info">
                  <div className="avatar">{user.username?.charAt(0).toUpperCase()}</div>
                  <span>{user.username}</span>
                </td>

                <td>{user.email}</td>

                <td>
                  <span className={`role-badge ${user.role === "admin" ? "admin" : "user"}`}>
                    {user.role}
                  </span>
                </td>

                <td>
                  <div className="d-flex align-items-center gap-3">
                    <div>
                      <i
                        className="fa-regular fa-eye action-icon view"
                        onClick={() => handleView(user)}
                      ></i>
                    </div>
                    <div>
                      <i
                        className="fa-solid fa-trash action-icon delete"
                        onClick={() => handleDelete(user._id)}
                      ></i>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && <p className="empty-text">No users found</p>}

        {/* ===== Pagination Buttons ===== */}
        {users.length > usersPerPage && (
          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>

      {/* ===== MODAL ===== */}
      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ×
            </button>
            <div className="modal-header">
              <div className="d-flex align-items-center gap-2">
                <div className="modal-avatar">{selectedUser.username?.charAt(0).toUpperCase()}</div>
                <div>{selectedUser.username}</div>
              </div>
            </div>

            <div className="modal-body">
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>User ID:</strong> {selectedUser._id}
              </p>
              <p>
                <strong>Created At:</strong> {formatDate(selectedUser.createdAt)}
              </p>
              <p>
                <strong>Role: </strong>
                {selectedUser.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;

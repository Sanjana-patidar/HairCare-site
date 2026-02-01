import React, { useState, useEffect } from "react";
import axios from "axios";
import "./User.css";

const User = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
        setUsers(res.data.users || res.data || []);
      } catch (error) {
        console.log("user fetching error", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="user-container">
      <h2 className="page-title"> User Management</h2>

      <div className="table-card">
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id || index}>
                <td>{index + 1}</td>

                <td className="user-info">
                  <div className="avatar">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.username}</span>
                </td>

                <td>{user.email}</td>

                <td>
                  <span
                    className={`role-badge ${
                      user.role === "admin" ? "admin" : "user"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="empty-text">No users found</p>
        )}
      </div>
    </div>
  );
};

export default User;

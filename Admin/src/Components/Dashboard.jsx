import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { FaUsers, FaBoxOpen, FaShoppingBag, FaRupeeSign } from "react-icons/fa";
import "./Dashboard.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Use Promise.all to fetch all stats efficiently in parallel
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/users`, config).catch(() => ({ data: [] })),
          axios.get(`${import.meta.env.VITE_API_URL}/products/all`).catch(() => ({ data: [] })),
          axios.get(`${import.meta.env.VITE_API_URL}/orders/orderhistory`, config).catch(() => ({ data: [] }))
        ]);

        const users = Array.isArray(usersRes.data.users) ? usersRes.data.users : Array.isArray(usersRes.data) ? usersRes.data : [];
        const products = Array.isArray(productsRes.data) ? productsRes.data : [];
        let orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];

        // Sort orders by date descending
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentOrders(orders.slice(0, 5));

        // Calculate total revenue from orders
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        setStats({
          users: users.length,
          products: products.length,
          orders: orders.length,
          revenue: totalRevenue
        });

        // Compute Category Data (Number of products per category)
        const catMap = {};
        products.forEach(p => {
          const c = p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "Other";
          catMap[c] = (catMap[c] || 0) + 1;
        });
        setCategoryData(Object.keys(catMap).map(k => ({ name: k, value: catMap[k] })));

        // Compute Revenue by Month (Last 6 active months, or all months with data)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const revMap = {};
        orders.forEach(o => {
          if (!o.createdAt) return;
          const date = new Date(o.createdAt);
          const m = months[date.getMonth()];
          revMap[m] = (revMap[m] || 0) + (o.totalAmount || 0);
        });
        
        // Show all months that have revenue, sorted chronologically
        const currentMonth = new Date().getMonth();
        let revData = [];
        for (let i = 5; i >= 0; i--) {
          let mIndex = (currentMonth - i + 12) % 12;
          let mName = months[mIndex];
          revData.push({ name: mName, revenue: revMap[mName] || 0 });
        }
        setRevenueData(revData);

      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    fetchDashboardData();

    // GSAP Animation for number counters
    gsap.fromTo(
      ".stat-value",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
  }, []);

  const statCards = [
    { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: <FaRupeeSign />, color: "#4f46e5", bg: "#e0e7ff" },
    { title: "Total Orders", value: stats.orders, icon: <FaShoppingBag />, color: "#059669", bg: "#d1fae5" },
    { title: "Total Products", value: stats.products, icon: <FaBoxOpen />, color: "#ea580c", bg: "#ffedd5" },
    { title: "Total Users", value: stats.users, icon: <FaUsers />, color: "#2563eb", bg: "#dbeafe" },
  ];

  return (
    <div className="dashboard-container p-4">
      <motion.div 
        className="dashboard-header mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="fw-bold text-dark">Dashboard Overview</h2>
        <p className="text-muted">Welcome back! Here's what's happening with your store today.</p>
      </motion.div>

      {/* Stats Cards Row */}
      <div className="row g-4 mb-4">
        {statCards.map((card, index) => (
          <div className="col-12 col-sm-6 col-lg-3" key={index}>
            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="stat-card-icon" style={{ backgroundColor: card.bg, color: card.color }}>
                {card.icon}
              </div>
              <div className="stat-card-info">
                <p className="stat-title">{card.title}</p>
                <h3 className="stat-value">{card.value}</h3>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-8">
          <motion.div 
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h5 className="chart-title mb-4">Revenue Analytics</h5>
            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="col-12 col-lg-4">
          <motion.div 
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h5 className="chart-title mb-4">Sales by Category</h5>
            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <motion.div 
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="chart-title mb-0">Recent Orders</h5>
              <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/admin/orderhistory')}>View All</button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? recentOrders.map((order, idx) => (
                    <tr key={idx}>
                      <td><small className="text-muted">#{order._id ? order._id.slice(-6) : 'N/A'}</small></td>
                      <td>{order.customer ? `${order.customer.firstname} ${order.customer.lastname}` : 'Guest'}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>₹{order.totalAmount}</td>
                      <td>
                        <span className={`badge ${
                          order.status === 'Approved' ? 'bg-success text-white' : 
                          order.status === 'Rejected' ? 'bg-danger text-white' : 
                          'bg-warning text-dark'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-3">No recent orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

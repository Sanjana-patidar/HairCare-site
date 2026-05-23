import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileError, setProfileError] = useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    phone: '',
    gender: 'Male',
    dob: '',
    profileImage: ''
  });

  // Address state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [openAddressId, setOpenAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phoneNo: '',
    addressType: 'Home',
    address: '',
    pincode: '',
    city: '',
    state: '',
    country: 'India'
  });

  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = React.useRef(null);

  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders' && orders.length === 0) {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setProfileError(false);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile`, config);
      setUser(res.data);
      setProfileForm({
        username: res.data.username || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        gender: res.data.gender || 'Male',
        dob: res.data.dob || '',
        profileImage: res.data.profileImage || ''
      });
      setImagePreview(res.data.profileImage || '');
    } catch (err) {
      toast.error('Failed to load profile');
      setProfileError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/myorders`, config);
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load orders');
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  // Convert selected image to base64 for storage
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setProfileForm(prev => ({ ...prev, imageFile: file }));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async () => {
    try {
      const formData = new FormData();
      formData.append("username", profileForm.username);
      formData.append("phone", profileForm.phone);
      formData.append("gender", profileForm.gender);
      formData.append("dob", profileForm.dob);
      
      if (profileForm.imageFile) {
        formData.append("image", profileForm.imageFile);
      }

      await axios.put(`${import.meta.env.VITE_API_URL}/users/profile`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      toast.success('Profile updated successfully');
      window.dispatchEvent(new Event('profileUpdated'));
      fetchProfile();
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const resetAddressForm = () => {
    setAddressForm({
      name: '', phoneNo: '', addressType: 'Home', address: '',
      pincode: '', city: '', state: '', country: 'India'
    });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleAddressSave = async () => {
    try {
      if (editingAddressId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/users/address/${editingAddressId}`, addressForm, config);
        toast.success('Address updated successfully');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/users/address`, addressForm, config);
        toast.success('Address added successfully');
      }
      resetAddressForm();
      fetchProfile();
    } catch (err) {
      toast.error('Failed to save address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/users/address/${id}`, config);
        toast.success('Address deleted');
        fetchProfile();
      } catch (err) {
        toast.error('Failed to delete address');
      }
    }
  };

  const openEditAddress = (addr) => {
    setAddressForm(addr);
    setEditingAddressId(addr._id);
    setShowAddressForm(true);
  };

  const toggleAddressAccordion = (id) => {
    setOpenAddressId(prev => (prev === id ? null : id));
  };

  if (loading) return (
    <div className="prf-loading">
      <div className="prf-spinner" />
      <p>Loading profile...</p>
    </div>
  );
  if (profileError) return (
    <div className="prf-error">
      <i className="fa-solid fa-triangle-exclamation" />
      Failed to load profile. Please login again.
    </div>
  );
  if (!user) return null;

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header-banner">
        <h2>My Account</h2>
        <p>Manage your personal information &amp; preferences</p>
      </div>

      <div className="profile-content-wrapper">
        <div className="profile-sidebar">
          <div className="profile-user-badge">
            {/* Clickable avatar with upload overlay */}
            <div
              className="profile-avatar-wrap"
              onClick={() => fileInputRef.current?.click()}
              title="Click to change photo"
            >
              {imagePreview ? (
                <img src={imagePreview.startsWith('data:') ? imagePreview : `${import.meta.env.VITE_API_IMAGE}/${imagePreview}`} alt={user.username} className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="profile-avatar-overlay">
                <i className="fa-solid fa-camera" />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <h3 className="profile-user-name">{user.username}</h3>
            <p className="profile-user-email">{user.email}</p>
            {user.phone && <p className="profile-user-phone"><i className="fa-solid fa-phone" /> {user.phone}</p>}
          </div>

          <ul className="profile-nav-list">
            <li className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <i className="fa-solid fa-user" /> My Profile
            </li>
            <li className={`profile-nav-item ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>
              <i className="fa-solid fa-location-dot" /> Addresses
            </li>
            <li className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <i className="fa-solid fa-box" /> Orders
            </li>
          </ul>
        </div>


        <div className="profile-main-content">
          {activeTab === 'profile' && (
            <div>
              <h3>Personal Information</h3>
              <div className="profile-form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="username" className="form-control" value={profileForm.username} onChange={handleProfileChange} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" className="form-control" value={profileForm.email} disabled />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" name="phone" className="form-control" value={profileForm.phone} onChange={handleProfileChange} />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" className="form-control" value={profileForm.gender} onChange={handleProfileChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>DOB</label>
                  <input type="date" name="dob" className="form-control" value={profileForm.dob} onChange={handleProfileChange} />
                </div>
              </div>
              <button className="btn-warning" onClick={handleProfileSave}>Save Profile</button>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h3>Saved Addresses</h3>

              {!showAddressForm ? (
                <>
                  {user.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((addr) => (
                      <div className={`address-card ${openAddressId === addr._id ? 'open' : ''}`} key={addr._id}>
                        <div className="address-card-header" onClick={() => toggleAddressAccordion(addr._id)}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <i className={`fa-solid fa-chevron-${openAddressId === addr._id ? 'up' : 'down'}`} style={{ color: '#888', fontSize: '13px', transition: 'all 0.3s' }}></i>
                            <h4>{addr.name} - {addr.phoneNo}</h4>
                          </div>
                          <span className="address-type-badge">{addr.addressType}</span>
                        </div>
                        
                        {openAddressId === addr._id && (
                          <div className="address-accordion-body">
                            <div className="address-details">
                              <p>{addr.address}</p>
                              <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                              <p>{addr.country}</p>
                            </div>
                            <div className="address-actions">
                              <button className="btn-edit" onClick={() => openEditAddress(addr)}>Edit</button>
                              <button className="btn-delete" onClick={() => handleDeleteAddress(addr._id)}>Delete</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No addresses found.</p>
                  )}

                  <button className="btn-warning" onClick={() => setShowAddressForm(true)}>+ Add Another Address</button>
                </>
              ) : (
                <div className="address-form">
                  <h4>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h4>
                  <div className="profile-form-grid">
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" name="name" className="form-control" value={addressForm.name} onChange={handleAddressChange} />
                    </div>
                    <div className="form-group">
                      <label>Phone No</label>
                      <input type="text" name="phoneNo" className="form-control" value={addressForm.phoneNo} onChange={handleAddressChange} />
                    </div>
                    <div className="form-group">
                      <label>Address Type</label>
                      <select name="addressType" className="form-control" value={addressForm.addressType} onChange={handleAddressChange}>
                        <option value="Home">Home</option>
                        <option value="Business">Business</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <input type="text" name="address" className="form-control" value={addressForm.address} onChange={handleAddressChange} />
                    </div>
                    <div className="form-group">
                      <label>Pincode</label>
                      <input type="text" name="pincode" className="form-control" value={addressForm.pincode} onChange={handleAddressChange} />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" name="city" className="form-control" value={addressForm.city} onChange={handleAddressChange} />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input type="text" name="state" className="form-control" value={addressForm.state} onChange={handleAddressChange} />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input type="text" name="country" className="form-control" value={addressForm.country} disabled />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button className="btn-warning" onClick={handleAddressSave}>Save Address</button>
                    <button className="btn-cancel" onClick={resetAddressForm}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-section">
              <h3>Order History</h3>
              {orders.length > 0 ? (
                <div className="orders-grid">
                  {orders.map((order) => (
                    <div className="order-card" key={order._id}>
                      <div className="order-header">
                        <div className="order-header-left">
                          <div className="order-icon-wrap">
                            <i className="fa-solid fa-box-open"></i>
                          </div>
                          <div>
                            <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                            <span className="order-date"><i className="fa-regular fa-calendar"></i> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                        <span className={`order-status ${order.status?.toLowerCase() || 'pending'}`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                      
                      <div className="order-details">
                        <div className="order-stat">
                          <span className="order-stat-label">Total Amount</span>
                          <span className="order-amount">₹{order.totalAmount}</span>
                        </div>
                        <div className="order-stat">
                          <span className="order-stat-label">Items</span>
                          <span className="order-stat-val">{order.products?.length || 0} Products</span>
                        </div>
                        <div className="order-stat">
                          <span className="order-stat-label">Payment</span>
                          <span className="order-stat-val">
                            <i className={`fa-solid ${order.paymentMethod === 'ONLINE' ? 'fa-credit-card' : 'fa-money-bill-wave'}`}></i> {order.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fa-solid fa-box-archive"></i>
                  <p>You haven't placed any orders yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

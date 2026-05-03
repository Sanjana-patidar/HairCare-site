import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import './Reviews.css';

const API_URL = import.meta.env.VITE_API_URL;
const API_IMG = import.meta.env.VITE_API_IMAGE;

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [error,   setError]   = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      console.log('[Reviews] token:', token ? 'present' : 'MISSING');
      const res = await axios.get(`${API_URL}/reviews/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[Reviews] API response:', res.status, res.data);
      // Ensure we always set an array
      const data = Array.isArray(res.data) ? res.data : [];
      setReviews(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.Message || err.message;
      console.error('[Reviews] Fetch error:', err.response?.status, msg, err);
      setError(`Error ${err.response?.status || ''}: ${msg}`);
      toast.error(`Failed to load reviews: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete this review?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/reviews/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          toast.success('Review deleted');
          fetchReviews();
        } catch { toast.error('Failed to delete'); }
      }
    });
  };

  const filtered = reviews.filter(r => {
    const q = search.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q) ||
      r.product?.name?.toLowerCase().includes(q)
    );
  });

  // Stats
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';
  const dist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length
      ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100)
      : 0,
  }));

  return (
    <div className="rv-page">

      {/* Header */}
      <div className="rv-header">
        <div>
          <h1 className="rv-title">Reviews</h1>
          <p className="rv-sub">Manage all customer product reviews</p>
        </div>
        <div className="rv-stats-strip">
          <div className="rv-stat"><span className="rv-stat-n">{reviews.length}</span><span>Total</span></div>
          <div className="rv-stat"><span className="rv-stat-n">{avgRating}⭐</span><span>Avg Rating</span></div>
          <div className="rv-stat"><span className="rv-stat-n">{reviews.filter(r => r.rating >= 4).length}</span><span>Positive</span></div>
        </div>
      </div>

      {/* Rating distribution */}
      <div className="rv-dist-card">
        <div className="rv-dist-left">
          <span className="rv-dist-big">{avgRating}</span>
          <Rating value={Number(avgRating)} precision={0.1} readOnly size="large" />
          <span className="rv-dist-sub">{reviews.length} total reviews</span>
        </div>
        <div className="rv-dist-bars">
          {dist.map(d => (
            <div key={d.star} className="rv-dist-row">
              <span className="rv-dist-star">{d.star} ★</span>
              <div className="rv-dist-track">
                <div className="rv-dist-fill" style={{ width: `${d.pct}%` }} />
              </div>
              <span className="rv-dist-cnt">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="rv-search-wrap">
        <i className="fa-solid fa-magnifying-glass rv-search-icon" />
        <input
          className="rv-search"
          placeholder="Search by reviewer name, product, or comment…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {error && (
        <div className="rv-empty" style={{ color: '#ef4444', background: '#fef2f2', borderRadius: 12, padding: '16px 24px', marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}
      {loading ? (
        <div className="rv-loading">Loading reviews…</div>
      ) : filtered.length === 0 ? (

        <div className="rv-empty">No reviews found.</div>
      ) : (
        <div className="rv-table-wrap">
          <table className="rv-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Reviewer</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r._id}>
                  <td>
                    <div className="rv-prod-cell">
                      {r.product?.image && (
                        <img
                          src={`${API_IMG}/${r.product.image}`}
                          alt={r.product?.name}
                          className="rv-prod-img"
                        />
                      )}
                      <span>{r.product?.name || '—'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="rv-reviewer">
                      <div className="rv-av">{(r.name || 'U')[0].toUpperCase()}</div>
                      <div>
                        <div className="rv-reviewer-name">{r.name}</div>
                        <div className="rv-reviewer-email">{r.user?.email || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="rv-rating-cell">
                      <Rating value={r.rating} readOnly size="small" />
                      <span className="rv-rating-num">{r.rating}/5</span>
                    </div>
                  </td>
                  <td>
                    <p className="rv-comment">{r.comment}</p>
                  </td>
                  <td className="rv-date">
                    {new Date(r.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td>
                    <button
                      className="rv-del-btn"
                      onClick={() => handleDelete(r._id)}
                      title="Delete Review"
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

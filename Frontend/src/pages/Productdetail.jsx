import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import confetti from 'canvas-confetti';
import './Productdetail.css';

const API_IMG = import.meta.env.VITE_API_IMAGE || 'http://localhost:5000/uploads';
const API_URL = import.meta.env.VITE_API_URL   || 'http://localhost:5000/api';

const TABS     = ['Overview', 'Benefits', 'How to Use', 'Reviews'];
const BENEFITS = [
  { icon: '🌿', title: 'Reduces Hair Fall',  desc: 'Strengthens roots and minimises breakage with regular use.' },
  { icon: '✨', title: 'Adds Natural Shine',  desc: 'Restores dull hair and gives a healthy, glossy finish.' },
  { icon: '💧', title: 'Deep Nourishment',    desc: 'Nourishes scalp without making hair greasy.' },
  { icon: '🛡️', title: 'Gentle Daily Care',  desc: 'Mild sulphate-free formula safe for everyday use.' },
  { icon: '🌱', title: '100% Natural',        desc: 'Free from parabens, sulphates, and harmful chemicals.' },
  { icon: '⚡', title: 'Fast Absorption',     desc: 'Lightweight formula absorbs quickly without residue.' },
];
const STEPS = [
  { n: '01', t: 'Wet Your Hair',   d: 'Thoroughly wet your hair with lukewarm water.' },
  { n: '02', t: 'Apply Product',   d: 'Take a small amount and work from roots to tips.' },
  { n: '03', t: 'Gentle Massage',  d: 'Massage into scalp for 2–3 minutes in circular motions.' },
  { n: '04', t: 'Leave & Rinse',   d: 'Leave for 3–5 minutes then rinse with cool water.' },
];

export default function Productdetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  // Safe outlet context — openCart might not always be provided
  let outletCtx;
  try { outletCtx = useOutletContext(); } catch { outletCtx = {}; }
  const openCart = outletCtx?.openCart || (() => {});

  const { cartItems = [], addToCart }                    = useCart() || {};
  const { wishlistItems = [], addToWishlist, removeFromWishlist } = useWishlist() || {};

  const [product,    setProduct]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState(0);
  const [activeImg,  setActiveImg]  = useState(0);
  const [qty,        setQty]        = useState(1);
  const [zoomPos,    setZoomPos]    = useState({ x: 50, y: 50 });

  // Reviews
  const [reviews,    setReviews]    = useState([]);
  const [revLoading, setRevLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [revRating,  setRevRating]  = useState(0);
  const [revComment, setRevComment] = useState('');

  const isLoggedIn = !!localStorage.getItem('token');
  const cartItem   = cartItems.find(i => i._id === product?._id);
  const inWish     = wishlistItems.some(i => i._id === product?._id);

  /* ── Fetch product ── */
  useEffect(() => {
    setLoading(true);
    setActiveTab(0);
    setQty(1);
    setActiveImg(0);
    setReviews([]);
    axios.get(`${API_URL}/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  /* ── Fetch reviews when Reviews tab opens ── */
  useEffect(() => {
    if (activeTab === 3 && id) loadReviews();
  }, [activeTab, id]);

  const loadReviews = async () => {
    try {
      setRevLoading(true);
      const res = await axios.get(`${API_URL}/reviews/${id}`);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch { /* silent */ }
    finally  { setRevLoading(false); }
  };

  /* ── Submit review ── */
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!revRating)          { toast.warning('Please select a star rating'); return; }
    if (!revComment.trim())  { toast.warning('Please write a comment');      return; }
    try {
      setSubmitting(true);
      await axios.post(
        `${API_URL}/reviews/${id}`,
        { rating: revRating, comment: revComment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Review submitted! ⭐');
      setRevRating(0);
      setRevComment('');
      loadReviews();
      // Refresh product rating
      const updated = await axios.get(`${API_URL}/products/${id}`);
      setProduct(updated.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  const handleAddToCart = () => {
    if (!isLoggedIn)  { toast.warning('Login first!');       return; }
    if (cartItem)     { toast.warning('Already in cart!');   return; }
    addToCart(product, qty);
    confetti({ particleCount: 140, spread: 90, origin: { y: 0.55 } });
    toast.success('Added to cart 🎉');
  };

  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoomPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  /* ── Loading skeleton ── */
  if (loading) return (
    <div className="pd-root">
      <div className="pd-skeleton">
        <div className="pd-sk-img" />
        <div className="pd-sk-info">
          <div className="pd-sk-line pd-sk-h" />
          <div className="pd-sk-line" />
          <div className="pd-sk-line pd-sk-sm" />
          <div className="pd-sk-line" />
          <div className="pd-sk-line pd-sk-sm" />
        </div>
      </div>
    </div>
  );

  if (!product) return <div className="pd-root"><div className="pd-notfound">Product not found.</div></div>;

  const allImgs  = [product.image, ...(Array.isArray(product.images) ? product.images : [])].filter(Boolean);
  const curImg   = allImgs[activeImg] ? `${API_IMG}/${allImgs[activeImg]}` : '';
  const savings  = (product.price || 0) - (product.discountprice || 0);
  const stockPct = Math.min(((product.stock || 0) / 100) * 100, 100);

  return (
    <div className="pd-root">
      <div className="pd-page">

        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <span className="pd-bc-link" onClick={() => navigate('/')}>Home</span>
          <i className="fa-solid fa-chevron-right pd-bc-sep" />
          <span className="pd-bc-link" onClick={() => navigate(`/Category${product.category}`)}>
            {product.category}
          </span>
          <i className="fa-solid fa-chevron-right pd-bc-sep" />
          <span className="pd-bc-cur">{product.name}</span>
        </nav>

        {/* ═══ Product Card ═══ */}
        <div className="pd-card">
          <div className="pd-main">

            {/* ── LEFT: Gallery ── */}
            <div className="pd-gallery">
              {/* Thumbnail strip */}
              {allImgs.length > 1 && (
                <div className="pd-thumbs">
                  {allImgs.map((img, i) => (
                    <button
                      key={i}
                      className={`pd-thumb ${activeImg === i ? 'pd-thumb-active' : ''}`}
                      onClick={() => setActiveImg(i)}
                    >
                      <img src={`${API_IMG}/${img}`} alt={`View ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div className="pd-img-main-wrap">
                <div className="pd-badges">
                  {Number(product.discountpercentage) > 0 && (
                    <span className="pd-badge pd-badge-off">−{product.discountpercentage}%</span>
                  )}
                  <span className={`pd-badge ${product.stock > 0 ? 'pd-badge-in' : 'pd-badge-out'}`}>
                    {product.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                  </span>
                </div>

                <div
                  className="pd-img-zoom-wrap"
                  onMouseMove={handleMouseMove}
                  style={{ '--zx': `${zoomPos.x}%`, '--zy': `${zoomPos.y}%` }}
                >
                  {curImg && <img src={curImg} alt={product.name} className="pd-img-main" />}
                </div>

                {allImgs.length > 1 && (
                  <div className="pd-dots">
                    {allImgs.map((_, i) => (
                      <button key={i} className={`pd-dot ${activeImg === i ? 'pd-dot-active' : ''}`} onClick={() => setActiveImg(i)} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Info ── */}
            <div className="pd-info">
              <div className="pd-info-top">
                <span className="pd-cat">{product.category}</span>
                <button
                  className={`pd-wish ${inWish ? 'pd-wish-on' : ''}`}
                  onClick={() => inWish ? removeFromWishlist(product._id) : addToWishlist(product)}
                >
                  <i className={`fa-${inWish ? 'solid' : 'regular'} fa-heart`} />
                </button>
              </div>

              <h1 className="pd-name">{product.name}</h1>

              <div className="pd-rating-row">
                <Rating value={Number(product.rating) || 0} precision={0.5} readOnly size="small" />
                <span className="pd-rating-txt">{product.rating || 0}/5 · {reviews.length} reviews</span>
              </div>

              <div className="pd-price-row">
                <span className="pd-price-now">₹{product.discountprice}</span>
                {savings > 0 && (
                  <>
                    <span className="pd-price-old">₹{product.price}</span>
                    <span className="pd-price-save">Save ₹{savings}</span>
                  </>
                )}
              </div>

              <div className="pd-divider" />

              <p className="pd-desc">{product.description}</p>

              <div className="pd-perks">
                {['Reduces Hair Fall', 'Strengthens Roots', 'Sulphate Free', 'All Hair Types'].map(p => (
                  <span key={p} className="pd-perk">✓ {p}</span>
                ))}
              </div>

              <div className="pd-divider" />

              <div className="pd-stock-row">
                <span className="pd-stock-lbl">Stock</span>
                <div className="pd-stock-track">
                  <div className="pd-stock-fill" style={{ width: `${stockPct}%` }} />
                </div>
                <span className="pd-stock-num">{product.stock} units</span>
              </div>

              <div className="pd-qty-row">
                <span className="pd-qty-lbl">Qty:</span>
                <div className="pd-qty-ctrl">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock || 1, q + 1))}>+</button>
                </div>
              </div>

              <div className="pd-cta-row">
                <button
                  className={`pd-btn-add ${cartItem ? 'pd-btn-done' : ''}`}
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                >
                  <i className="fa-solid fa-bag-shopping" />
                  {!product.stock ? 'Out of Stock' : cartItem ? 'Already in Cart' : 'Add to Cart'}
                </button>
                <button className="pd-btn-view" onClick={openCart}>
                  <i className="fa-solid fa-cart-shopping" /> View Cart
                </button>
              </div>

              <div className="pd-trust-row">
                <div className="pd-trust-item">
                  <i className="fa-solid fa-truck-fast" /><span>Free Delivery ₹499+</span>
                </div>
                <div className="pd-trust-item">
                  <i className="fa-solid fa-rotate-left" /><span>7-Day Returns</span>
                </div>
                <div className="pd-trust-item">
                  <i className="fa-solid fa-shield-halved" /><span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ TABS ═══ */}
        <div className="pd-tabs-wrap">
          <div className="pd-tab-bar">
            {TABS.map((t, i) => (
              <button key={t} className={`pd-tab-btn ${activeTab === i ? 'pd-tab-active' : ''}`} onClick={() => setActiveTab(i)}>
                {t}
              </button>
            ))}
          </div>

          <div className="pd-tab-body">

            {/* OVERVIEW */}
            {activeTab === 0 && (
              <div className="pd-overview">
                <p className="pd-ov-text">{product.description}</p>
                <div className="pd-ov-grid">
                  {[
                    ['Category',    product.category],
                    ['MRP',         `₹${product.price}`],
                    ['Offer Price', `₹${product.discountprice}`],
                    ['Discount',    `${product.discountpercentage || 0}%`],
                    ['Stock',       `${product.stock} units`],
                    ['Rating',      `⭐ ${product.rating || 0} / 5`],
                  ].map(([k, v]) => (
                    <div key={k} className="pd-ov-card">
                      <span className="pd-ov-key">{k}</span>
                      <span className="pd-ov-val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BENEFITS */}
            {activeTab === 1 && (
              <div className="pd-ben-grid">
                {BENEFITS.map(b => (
                  <div key={b.title} className="pd-ben-card">
                    <div className="pd-ben-icon">{b.icon}</div>
                    <h4>{b.title}</h4>
                    <p>{b.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* HOW TO USE */}
            {activeTab === 2 && (
              <div className="pd-steps">
                {STEPS.map(s => (
                  <div key={s.n} className="pd-step">
                    <div className="pd-step-num">{s.n}</div>
                    <div><h4>{s.t}</h4><p>{s.d}</p></div>
                  </div>
                ))}
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === 3 && (
              <div className="pd-reviews">

                {/* Summary card */}
                <div className="pd-rev-summary">
                  <span className="pd-rev-big">{product.rating ? Number(product.rating).toFixed(1) : '0.0'}</span>
                  <Rating value={Number(product.rating) || 0} precision={0.5} readOnly />
                  <span className="pd-rev-sub">
                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </span>
                </div>

                {/* Submit form */}
                {isLoggedIn ? (
                  <form className="pd-rev-form" onSubmit={handleReviewSubmit}>
                    <h4 className="pd-rev-form-title">✍️ Write a Review</h4>
                    <div className="pd-rev-star-pick">
                      <label>Your Rating:</label>
                      <Rating value={revRating} onChange={(_, v) => setRevRating(v)} size="large" />
                    </div>
                    <textarea
                      className="pd-rev-textarea"
                      placeholder="Share your experience with this product…"
                      value={revComment}
                      onChange={e => setRevComment(e.target.value)}
                      rows={3}
                      maxLength={500}
                    />
                    <div className="pd-rev-form-footer">
                      <span className="pd-rev-char">{revComment.length}/500</span>
                      <button type="submit" className="pd-rev-submit-btn" disabled={submitting}>
                        {submitting ? 'Submitting…' : '📝 Submit Review'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="pd-rev-login-prompt">
                    <p>Please <span className="pd-rev-login-link" onClick={() => navigate('/login')}>login</span> to write a review.</p>
                  </div>
                )}

                {/* Reviews list */}
                {revLoading ? (
                  <div className="pd-rev-loading">Loading reviews…</div>
                ) : reviews.length === 0 ? (
                  <div className="pd-rev-empty">No reviews yet — be the first to review! ⭐</div>
                ) : (
                  <div className="pd-rev-list">
                    {reviews.map((r, i) => (
                      <div key={r._id || i} className="pd-rev-card">
                        <div className="pd-rev-top">
                          <div className="pd-rev-av">{(r.name || 'U')[0].toUpperCase()}</div>
                          <div>
                            <div className="pd-rev-name">{r.name}</div>
                            <div className="pd-rev-date">
                              {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                          <div className="pd-rev-stars">
                            <Rating value={r.rating} readOnly size="small" />
                          </div>
                        </div>
                        <p className="pd-rev-text">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

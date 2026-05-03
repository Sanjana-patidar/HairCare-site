import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Mainheader.css';

const categories = [
  { name: 'Shampoo',     emoji: '🧴', route: '/Categoryshampoo',     color: 'hcc-1' },
  { name: 'Conditioner', emoji: '✨', route: '/Categoryconditioner', color: 'hcc-2' },
  { name: 'Serum',       emoji: '💧', route: '/Categoryserum',       color: 'hcc-3' },
  { name: 'Hair Oil',    emoji: '🌿', route: '/Categoryoil',         color: 'hcc-4' },
];

const promoItems = [
  { icon: 'fa-truck',         text: 'Free Delivery on orders above ₹499' },
  { icon: 'fa-leaf',          text: '100% Natural & Vegan Ingredients'   },
  { icon: 'fa-rotate-left',   text: '7-Day Easy Returns'                 },
  { icon: 'fa-shield-halved', text: 'Secure & Encrypted Payments'        },
];

export default function Mainheader() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, brands: 0, customers: 0 });

  // Fetch live stats for the hero stats pills
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, brandRes] = await Promise.allSettled([
          axios.get(`${import.meta.env.VITE_API_URL}/products/all`),
          axios.get(`${import.meta.env.VITE_API_URL}/brands`),
        ]);
        const products  = prodRes.status  === 'fulfilled' ? prodRes.value.data.length   : 0;
        const brands    = brandRes.status === 'fulfilled' ? brandRes.value.data.length  : 0;
        setStats({ products, brands, customers: 10000 });
      } catch (_) {}
    };
    fetchStats();
  }, []);

  return (
    <>
      {/* ── Promo Banner ── */}
      <div className="promo-banner">
        {promoItems.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div className="promo-divider" />}
            <div className="promo-item">
              <i className={`fa-solid ${item.icon}`} />
              <span>{item.text}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ── Hero ── */}
      <section className="hero">
        {/* Background elements */}
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />
        <div className="hero-grid" />

        <div className="hero-inner">
          {/* LEFT: Copy */}
          <div className="hero-left">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Premium Hair Care Brand
            </div>

            <h1 className="hero-h1">
              Unlock Your <br />
              <span className="hero-accent">Hair's</span>{' '}
              <span className="hero-thin">Full</span>
              <br />Potential
            </h1>

            <p className="hero-desc">
              Science-backed, nature-powered formulas crafted for every hair type.
              From scalp care to vibrant shine — your complete hair ritual starts here.
            </p>

            <div className="hero-ctas">
              <button
                className="hero-btn-primary"
                onClick={() => navigate('/allproducts')}
              >
                Shop Now <i className="fa-solid fa-arrow-right" />
              </button>
              <button
                className="hero-btn-secondary"
                onClick={() => document.getElementById('hair-quiz-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <i className="fa-solid fa-flask" /> Hair Quiz
              </button>
            </div>

            {/* Trust row */}
            <div className="hero-trust">
              <div className="hero-trust-faces">
                {['R','S','A','M'].map((l, i) => (
                  <div key={i} className="hero-trust-face">{l}</div>
                ))}
              </div>
              <div className="hero-trust-text">
                <strong>10,000+</strong> happy customers
              </div>
              <div className="hero-trust-sep" />
              <div>
                <div className="hero-trust-stars">★★★★★</div>
                <div className="hero-trust-rating"><strong>4.9</strong> / 5 rating</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Category cards + offer + stats */}
          <div className="hero-right">
            <div className="hero-cats">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className={`hero-cat-card ${cat.color}`}
                  onClick={() => navigate(cat.route)}
                >
                  <span className="hero-cat-emoji">{cat.emoji}</span>
                  <div className="hero-cat-name">{cat.name}</div>
                  <div className="hero-cat-count">Browse collection</div>
                  <div className="hero-cat-arrow">
                    <i className="fa-solid fa-arrow-right" />
                  </div>
                </div>
              ))}
            </div>

            {/* Offer strip */}
            <div className="hero-offer-strip">
              <div className="hero-offer-text">
                🔥 Use code <strong>SHINNY20</strong> for <strong>20% off</strong> your first order
              </div>
              <span className="hero-offer-badge">LIMITED TIME</span>
            </div>

            {/* Live stats */}
            <div className="hero-stats-row">
              <div className="hero-stat-pill">
                <span className="hero-stat-num">{stats.products}+</span>
                <span className="hero-stat-lbl">Products</span>
              </div>
              <div className="hero-stat-pill">
                <span className="hero-stat-num">{stats.brands}+</span>
                <span className="hero-stat-lbl">Brands</span>
              </div>
              <div className="hero-stat-pill">
                <span className="hero-stat-num">10K+</span>
                <span className="hero-stat-lbl">Customers</span>
              </div>
              <div className="hero-stat-pill">
                <span className="hero-stat-num">4.9★</span>
                <span className="hero-stat-lbl">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

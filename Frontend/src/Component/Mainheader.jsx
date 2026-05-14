import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Mainheader.css';

const categories = [
  { name: 'Shampoo', emoji: '🧴', route: '/Categoryshampoo', color: 'hcc-1' },
  { name: 'Conditioner', emoji: '✨', route: '/Categoryconditioner', color: 'hcc-2' },
  { name: 'Serum', emoji: '💧', route: '/Categoryserum', color: 'hcc-3' },
  { name: 'Hair Oil', emoji: '🌿', route: '/Categoryoil', color: 'hcc-4' },
];

const promoItems = [
  { icon: 'fa-truck', text: 'Free Delivery on orders above ₹499' },
  { icon: 'fa-leaf', text: '100% Natural & Vegan Ingredients' },
  { icon: 'fa-rotate-left', text: '7-Day Easy Returns' },
  { icon: 'fa-shield-halved', text: 'Secure & Encrypted Payments' },
];

export default function Mainheader() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, brands: 0, customers: 0 });
  const [categoryCounts, setCategoryCounts] = useState({});
  const [heroContent, setHeroContent] = useState({
    badge: 'Premium Hair Care Brand',
    title: "Unlock Your Hair's Full Potential",
    subtitle: 'Science‑backed, nature‑powered formulas crafted for every hair type.',
    trust: { customers: '10,000+', rating: '4.9' }
  });

  // Fetch live stats and category counts for the hero section
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, brandRes] = await Promise.allSettled([
          axios.get(`${import.meta.env.VITE_API_URL}/products/all`),
          axios.get(`${import.meta.env.VITE_API_URL}/brands`),
        ]);
        const products = prodRes.status === 'fulfilled' ? prodRes.value.data : [];
        const brands = brandRes.status === 'fulfilled' ? brandRes.value.data.length : 0;
        setStats({ products: products.length, brands, customers: 10000 });
        // Compute product counts per category
        const counts = {};
        products.forEach(p => {
          const cat = p.category || 'Other';
          counts[cat] = (counts[cat] || 0) + 1;
        });
        setCategoryCounts(counts);
      } catch (_) { }
    };
    fetchStats();
  }, []);

  return (
    <>


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
              {heroContent.badge}
            </div>

            <h1 className="hero-h1">{heroContent.title}</h1>

            <p className="hero-desc">{heroContent.subtitle}</p>

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
                  <div className="hero-cat-icon-wrap">{cat.emoji}</div>
                  <div className="hero-cat-name">{cat.name}</div>
                  <div className="hero-cat-count">{categoryCounts[cat.name.toLowerCase()] ? `${categoryCounts[cat.name.toLowerCase()]}+ Products` : '0 Products'}</div>
                  <div className="hero-cat-arrow">
                    <i className="fa-solid fa-arrow-right" />
                  </div>
                </div>
              ))}
            </div>

            {/* Offer strip */}


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

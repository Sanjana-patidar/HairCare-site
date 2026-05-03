import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import './Brand.css';

/* ── Animated count-up hook ── */
function useCountUp(target, duration = 1800, started = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started || target === 0) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, started, duration]);

  return count;
}

/* ── Stat Item with individual count-up ── */
function StatItem({ number, suffix = '', label, started }) {
  const count = useCountUp(number, 1800, started);
  return (
    <div className="brand-stat">
      <span className="stat-number">
        {count}{suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

const Brand = () => {
  const [brands,   setBrands]   = useState([]);
  const [stats,    setStats]    = useState({ brands: 0, products: 0, users: 0, rating: 5 });
  const [loading,  setLoading]  = useState(true);
  const [counting, setCounting] = useState(false);

  const statsRef = useRef(null);

  /* Fetch brands + aggregate stats in parallel */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [brandsRes, productsRes, usersRes] = await Promise.allSettled([
          axios.get(`${import.meta.env.VITE_API_URL}/brands`),
          axios.get(`${import.meta.env.VITE_API_URL}/products/all`),
          axios.get(`${import.meta.env.VITE_API_URL}/users`),
        ]);

        const brandsData   = brandsRes.status   === 'fulfilled' ? brandsRes.value.data   : [];
        const productsData = productsRes.status === 'fulfilled' ? productsRes.value.data : [];
        const usersData    = usersRes.status    === 'fulfilled' ? usersRes.value.data    : {};

        setBrands(brandsData);

        // Calculate average rating across all products
        const ratedProducts = productsData.filter(p => p.rating && p.rating > 0);
        const avgRating = ratedProducts.length
          ? Math.round(ratedProducts.reduce((s, p) => s + p.rating, 0) / ratedProducts.length * 10) / 10
          : 5;

        const userCount = Array.isArray(usersData)
          ? usersData.length
          : usersData.users?.length || 0;

        setStats({
          brands:   brandsData.length,
          products: productsData.length,
          users:    userCount,
          rating:   avgRating,
        });
      } catch (err) {
        console.error('Brand stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  /* Intersection Observer — trigger count-up when stats strip enters viewport */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setCounting(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading]); // re-observe after loading finishes

  const loopBrands = brands.length > 0 ? [...brands, ...brands, ...brands] : [];

  if (loading) {
    return (
      <div className="brand-section">
        <div className="brand-skeleton-row">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="brand-skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="brand-section">
      {/* Header */}
      <div className="brand-header">
        <span className="brand-tag">Trusted By Many</span>
        <h2 className="brand-title">Our <span>Brand</span> Partners</h2>
        <p className="brand-subtitle">
          We collaborate with the finest hair care labels
        </p>
      </div>

      {/* Divider */}
      <div className="brand-divider" />

      {/* Swiper Marquee */}
      <div className="brand-slider-wrapper">
        <div className="brand-fade brand-fade-left" />
        <Swiper
          modules={[Autoplay]}
          spaceBetween={32}
          slidesPerView="auto"
          loop={true}
          speed={3000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          allowTouchMove={false}
          className="brand-swiper"
        >
          {loopBrands.map((item, index) => (
            <SwiperSlide key={`${item._id}-${index}`} className="brand-slide">
              <div className="brand-card">
                <div className="brand-logo-wrap">
                  <img
                    src={`${import.meta.env.VITE_API_IMAGE}/${item.logo}`}
                    alt={item.name}
                    className="brand-logo-img"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <span className="brand-name-label">{item.name}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="brand-fade brand-fade-right" />
      </div>

      {/* ── Dynamic Stats Strip with count-up ── */}
      <div className="brand-stats" ref={statsRef}>
        <StatItem
          number={stats.brands}
          suffix="+"
          label="Brand Partners"
          started={counting}
        />
        <div className="brand-stat-divider" />
        <StatItem
          number={stats.products}
          suffix="+"
          label="Products Listed"
          started={counting}
        />
        <div className="brand-stat-divider" />
        <StatItem
          number={stats.users}
          suffix="+"
          label="Happy Customers"
          started={counting}
        />
        <div className="brand-stat-divider" />
        <div className="brand-stat">
          <span className="stat-number">{stats.rating}⭐</span>
          <span className="stat-label">Avg Product Rating</span>
        </div>
      </div>
    </section>
  );
};

export default Brand;

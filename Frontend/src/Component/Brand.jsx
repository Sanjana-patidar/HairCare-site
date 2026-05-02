import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import './Brand.css';

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/brands`);
        setBrands(res.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  // Duplicate brands so the infinite loop looks seamless even with few items
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

      {/* Divider line with glow */}
      <div className="brand-divider" />

      {/* Swiper Marquee */}
      <div className="brand-slider-wrapper">
        {/* Left fade */}
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

        {/* Right fade */}
        <div className="brand-fade brand-fade-right" />
      </div>

      {/* Bottom counter strip */}
      <div className="brand-stats">
        <div className="brand-stat">
          <span className="stat-number">{brands.length}+</span>
          <span className="stat-label">Brand Partners</span>
        </div>
        <div className="brand-stat-divider" />
        <div className="brand-stat">
          <span className="stat-number">100%</span>
          <span className="stat-label">Authentic Products</span>
        </div>
        <div className="brand-stat-divider" />
        <div className="brand-stat">
          <span className="stat-number">5★</span>
          <span className="stat-label">Rated Quality</span>
        </div>
      </div>
    </section>
  );
};

export default Brand;

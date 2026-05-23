import React from 'react';
import './Benifit.css';
import naturalProductImg from '../assets/img/natural-product.png';
import offerImg from '../assets/img/offer.png';
import deliveryImg from '../assets/img/delivery.png';
import deliveryManImg from '../assets/img/delivery-man (1).png';

const benefits = [
  {
    img: naturalProductImg,
    title: 'Trusted Brand',
    desc: '100% natural & vegan-certified ingredients you can trust for healthy, beautiful hair.',
    tag: '✓ Certified Natural',
    num: '01',
  },
  {
    img: offerImg,
    title: 'Best Prices & Offers',
    desc: 'Unbeatable deals, exclusive discounts and loyalty rewards on every purchase.',
    tag: '🏷 Save More',
    num: '02',
  },
  {
    img: deliveryImg,
    title: 'Fast & Secure Delivery',
    desc: 'Packed with care and delivered to your doorstep within 2-4 business days.',
    tag: '🚚 2–4 Day Delivery',
    num: '03',
  },
  {
    img: deliveryManImg,
    title: 'Happy Customers',
    desc: 'Trusted by 10,000+ customers with a 4.9★ average rating across all products.',
    tag: '⭐ 4.9 Rating',
    num: '04',
  },
];

const Benfit = () => {
  return (
    <section className="benifit-section">
      {/* Header */}
      <div className="text-center">
        <div className="benefit-eyebrow">
          <span className="benefit-eyebrow-dot" />
          Our Promise
        </div>
        <h2 className="benefit-title">
          Why Choose <span className="brand">Shinny</span>
        </h2>
        <p className="benefit-sub">
          We blend science and nature to deliver hair care you can feel good about — from ingredient to delivery.
        </p>
      </div>

      {/* Cards */}
      <div className="benefit-grid">
        {benefits.map((b) => (
          <div className="benefit-card" key={b.num}>
            <span className="benefit-num">{b.num}</span>
            <div className="benefit-icon-wrap">
              <img src={b.img} alt={b.title} />
            </div>
            <h3 className="benefit-card-title">{b.title}</h3>
            <p className="benefit-card-desc">{b.desc}</p>
            <span className="benefit-tag">{b.tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benfit;

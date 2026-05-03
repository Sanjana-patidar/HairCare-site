import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HowItWorks.css';

const steps = [
  {
    num: "01",
    icon: "🔍",
    title: "Discover",
    desc: "Browse our curated range of 100% natural shampoos, serums, oils & conditioners crafted for every hair type.",
    color: "#c0df36",
  },
  {
    num: "02",
    icon: "🧪",
    title: "Choose Your Match",
    desc: "Use our Hair Quiz or filter by concern — hair fall, dandruff, dryness, frizz — to find your perfect formula.",
    color: "#34d399",
  },
  {
    num: "03",
    icon: "🛒",
    title: "Order Easily",
    desc: "Add to cart, pay securely via Razorpay or Cash on Delivery, and get your order delivered fast to your doorstep.",
    color: "#60a5fa",
  },
  {
    num: "04",
    icon: "✨",
    title: "Transform Your Hair",
    desc: "See real results in weeks — stronger, shinier, healthier hair. Share your story and join thousands of happy customers.",
    color: "#f472b6",
  },
];

const ingredients = [
  { name: "Rosemary",  emoji: "🌿", benefit: "Stimulates hair growth" },
  { name: "Onion",     emoji: "🧅", benefit: "Reduces hair fall"       },
  { name: "Bhringraj", emoji: "🌱", benefit: "Strengthens roots"       },
  { name: "Argan Oil", emoji: "🫒", benefit: "Adds shine & softness"   },
  { name: "Aloe Vera", emoji: "🌵", benefit: "Soothes scalp"           },
  { name: "Coconut",   emoji: "🥥", benefit: "Deep conditioning"        },
];

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── HOW IT WORKS ── */}
      <section className="hiw-section">
        <div className="hiw-header">
          <span className="hiw-eyebrow">✦ Simple Process</span>
          <h2 className="hiw-title">How <span>Shinny</span> Works</h2>
          <p className="hiw-sub">From discovery to transformation — in 4 easy steps</p>
        </div>

        <div className="hiw-steps">
          {steps.map((s, i) => (
            <div className="hiw-step" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
              <div className="hiw-step-num" style={{ color: s.color, borderColor: `${s.color}33` }}>
                {s.num}
              </div>
              <div className="hiw-step-icon">{s.icon}</div>
              <h3 className="hiw-step-title">{s.title}</h3>
              <p className="hiw-step-desc">{s.desc}</p>
              {i < steps.length - 1 && <div className="hiw-connector" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── KEY INGREDIENTS ── */}
      <section className="ing-section">
        <div className="ing-header">
          <span className="ing-eyebrow">🌿 Nature-Powered</span>
          <h2 className="ing-title">Key <span>Ingredients</span> We Use</h2>
          <p className="ing-sub">Every product is crafted with clinically proven natural actives</p>
        </div>

        <div className="ing-grid">
          {ingredients.map((item, i) => (
            <div className="ing-card" key={i} data-aos="zoom-in" data-aos-delay={i * 80}>
              <div className="ing-emoji">{item.emoji}</div>
              <h4 className="ing-name">{item.name}</h4>
              <p className="ing-benefit">{item.benefit}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="ing-cta">
          <div className="ing-cta-content">
            <h3>Ready for Healthier Hair?</h3>
            <p>Join 10,000+ happy customers who transformed their hair with Shinny</p>
          </div>
          <button className="ing-cta-btn" onClick={() => navigate('/allproducts')}>
            Shop All Products <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      </section>
    </>
  );
}

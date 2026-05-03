import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HairQuiz.css';

const steps = [
  {
    question: "What's your hair type?",
    options: [
      { label: "Straight", icon: "💧", value: "straight" },
      { label: "Wavy",     icon: "〰️", value: "wavy"     },
      { label: "Curly",    icon: "🌀", value: "curly"    },
      { label: "Coily",    icon: "🌿", value: "coily"    },
    ],
  },
  {
    question: "What's your main hair concern?",
    options: [
      { label: "Hair Fall",  icon: "😟", value: "fall"    },
      { label: "Dandruff",   icon: "❄️", value: "dandruff"},
      { label: "Dryness",    icon: "🏜️", value: "dry"     },
      { label: "Frizz",      icon: "⚡", value: "frizz"   },
    ],
  },
  {
    question: "How often do you wash your hair?",
    options: [
      { label: "Daily",       icon: "📅", value: "daily"    },
      { label: "2-3x / week", icon: "🗓️", value: "moderate" },
      { label: "Weekly",      icon: "📆", value: "weekly"   },
      { label: "Rarely",      icon: "🌙", value: "rarely"   },
    ],
  },
];

const recommendations = {
  fall:     { cat: "oil",         label: "Hair Oils",      desc: "Strengthen roots & reduce breakage" },
  dandruff: { cat: "shampoo",     label: "Shampoos",       desc: "Cleanse & control scalp buildup"    },
  dry:      { cat: "conditioner", label: "Conditioners",   desc: "Deep nourish & restore moisture"    },
  frizz:    { cat: "serum",       label: "Serums",         desc: "Tame frizz & add shine"             },
};

export default function HairQuiz() {
  const [step,      setStep]      = useState(0);
  const [answers,   setAnswers]   = useState({});
  const [done,      setDone]      = useState(false);
  const navigate = useNavigate();

  const handleSelect = (val) => {
    const key = `step${step}`;
    const newAnswers = { ...answers, [key]: val };
    setAnswers(newAnswers);
    if (step < steps.length - 1) {
      setTimeout(() => setStep(s => s + 1), 260);
    } else {
      setTimeout(() => setDone(true), 260);
    }
  };

  const concern = answers.step1;
  const rec = recommendations[concern] || recommendations.frizz;
  const progress = ((step) / steps.length) * 100;

  const restart = () => { setStep(0); setAnswers({}); setDone(false); };

  return (
    <section className="hq-section" id="hair-quiz-section">
      <div className="hq-bg-blob hq-blob-1" />
      <div className="hq-bg-blob hq-blob-2" />

      <div className="hq-inner">
        {/* Left — copy */}
        <div className="hq-left">
          <span className="hq-eyebrow">✦ Personalised For You</span>
          <h2 className="hq-heading">Find Your <br/><span>Perfect</span> Hair Routine</h2>
          <p className="hq-sub">
            Answer 3 quick questions and we'll recommend the ideal products
            for your hair type and concerns — in under 30 seconds.
          </p>
          <ul className="hq-bullets">
            <li><i className="fa-solid fa-check" /> 100% Free &amp; Instant</li>
            <li><i className="fa-solid fa-check" /> Based on your hair type</li>
            <li><i className="fa-solid fa-check" /> Dermatologist-approved picks</li>
          </ul>
        </div>

        {/* Right — quiz card */}
        <div className="hq-right">
          <div className="hq-card">
            {!done ? (
              <>
                {/* Progress */}
                <div className="hq-progress-wrap">
                  <div className="hq-progress-bar" style={{ width: `${progress}%` }} />
                </div>
                <p className="hq-step-label">Step {step + 1} of {steps.length}</p>
                <h3 className="hq-question">{steps[step].question}</h3>
                <div className="hq-options">
                  {steps[step].options.map(opt => (
                    <button
                      key={opt.value}
                      className={`hq-option ${answers[`step${step}`] === opt.value ? 'hq-option--selected' : ''}`}
                      onClick={() => handleSelect(opt.value)}
                    >
                      <span className="hq-opt-icon">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="hq-result">
                <div className="hq-result-icon">🎉</div>
                <h3 className="hq-result-title">Your Perfect Match!</h3>
                <p className="hq-result-sub">Based on your hair profile, we recommend:</p>
                <div className="hq-result-card">
                  <div className="hq-result-label">{rec.label}</div>
                  <p className="hq-result-desc">{rec.desc}</p>
                </div>
                <button
                  className="hq-result-btn"
                  onClick={() => navigate(`/Category${rec.cat}`)}
                >
                  Shop {rec.label} <i className="fa-solid fa-arrow-right" />
                </button>
                <button className="hq-restart-btn" onClick={restart}>
                  Retake Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

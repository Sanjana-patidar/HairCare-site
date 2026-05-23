import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate(-1)}>
      <i className="fa-solid fa-arrow-left"></i> Back
    </button>
  );
};

export default BackButton;

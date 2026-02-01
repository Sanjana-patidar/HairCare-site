import React from 'react'
import './SplashScreen.css'
const SplashScreen = () => {
  return (
     <div className="splash-container">
      <div className="logo-box">
        <h1 className='text-warning'>HairCare</h1>
        <span>Natural HairCare Care</span>
      </div>

      <div className="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}

export default SplashScreen

import React from 'react'
import './Benifit.css'
const Benfit = () => {
  return (
    <div data-aos="zoom-in" className='benifit-section  p-4'>
       <div>
          <h3 data-aos="fade-right"  className='text-center'>Why Choose <span className='brand'>Shinny</span></h3>
          <div className="row mt-5 g-3">
            <div className="col-12 col-sm-6 col-md-6 col-lg-3">
              <div className=' box rounded-4 p-3 text-center'>
                <img className='benifit-img  pb-3 hvr-pulse' src="\src\assets\img\natural-product.png" alt="" />
                <h5>Trusted Brand</h5>
                <p>We sell only natural products & Quality Hair Care Product</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3">
              <div className=' box  rounded-4 p-3 text-center'>
                <img  className=' benifit-img  pb-3 hvr-pulse ' src="/src/assets/img/offer.png" alt="" />
                <h5>Best Prices & Offers</h5>
                <p>We sell only natural products & Quality Hair Care Product</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3">
              <div className=' box rounded-4 p-3 text-center'>
                <img className='benifit-img  pb-3 hvr-pulse' src="/src/assets/img/delivery.png" alt="" />
                <h5>Fast & Secure Delivery</h5>
                <p>We sell only natural products & Quality Hair Care Product</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3">
              <div className='box rounded-4 p-3 text-center'>
                <img className='benifit-img  pb-3 hvr-pulse' src="/src/assets/img/delivery-man (1).png" alt="" />
                <h5>Happy Customers</h5>
                <p>We sell only natural products & Quality Hair Care Product</p>
              </div>
            </div>
          </div>
       </div>
    </div>
  )
}

export default Benfit

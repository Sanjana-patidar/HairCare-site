import React from 'react'
import { Link } from 'react-router-dom'
import './Productcategorie.css'
const product = () => {
  return (
    <div className='product-section p-3'>
        <h3 data-aos="fade-right" className='text-center pt-4 pb-4' style={{color:"rgb(195, 229, 43)"}}>Product Categories</h3>
        <div data-aos="zoom-in"  className='product-container'>
            <Link to="/Categoryshampoo" className="text-decoration-none">
            <div className='pro-card pro-card-1'><span>Shampoo</span></div>
            </Link>
            <Link  to="/Categoryconditioner" className="text-decoration-none">
             <div className='pro-card pro-card-2'><span>Conditioner</span></div>
            </Link>
            <Link to="/Categoryserum" className="text-decoration-none">
              <div className='pro-card pro-card-3'><span>Serum</span></div>
            </Link>
            <Link to="/Categoryoil" className="text-decoration-none" >
              <div className='pro-card pro-card-4'><span>Oil</span></div>
            </Link>
        </div>
    </div>
  )
}

export default product

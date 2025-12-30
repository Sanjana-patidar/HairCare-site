import React from 'react'
import './Footer.css'
const Footer = () => {
  return (
    <div className='footer '>
      <footer className='p-2 '>
       <div className='hvr-grow'>
            <h3 className="logo-text text-warning"> <img src="/src/assets/img/womens-day.png" className="logo" alt="" />Shinny</h3>
       </div>
       <div className="row m-0 justify-content-start  ">
        <div className='col-12 col-sm-6 col-md-6 col-lg-4 p-3'>
            <div>
                <h3>About Us</h3>
                <p>At Shinny, We are dedicated to bringing you preminum quality hair care products that enhance your hair's natural beauty. We offer caterfully curated products to suit every hair type and need.</p>
                <hr className='w-50'/>
            </div>
        </div>
        <div className='col-12 col-sm-6 col-md-6 col-lg-2 p-3'>
            <h3>Contact us</h3>
            <ul className='list-unstyled'>
                <li><i class="fa-solid fa-phone"></i> 91+ 8878778689</li>
                <li><i class="fa-solid fa-location-dot"></i> main road, Ahemdabad</li>
                <li><i class="fa-regular fa-envelope"></i> Shinyy12@gmail.com</li>
            </ul>
        </div>
        <div className='col-12 col-sm-6 col-md-6 col-lg-2 p-3'>
            <div>
                <h3>Social Media</h3>
                < div >
                    <i class="fa-brands fa-instagram fs-4 text-danger me-3"></i>
                    <i class="fa-brands fa-facebook fs-4 text-primary me-3"></i>
                    <i class="fa-brands fa-youtube text-danger fs-4 me-3"></i>
                </div>
            </div>
        </div>
        <div className='col-12 col-sm-6 col-md-6 col-lg-2 p-3'>
            <div>
                <h3>Service</h3>
                 <ul className='list-unstyled'>
                <li>Help Center</li>
                <li>Any FAQ</li>
                <li>Call Center</li>  
            </ul>
            </div>
        </div>
        <div className='col-12 col-sm-6 col-md-6 col-lg-2 p-3'>
           <div>
             <h3>Discover</h3>
              <ul className='list-unstyled'>
                <li>Privacy</li>  
                <li>Teams</li>
                <li>Blogs</li>
              </ul>
            </div>
        </div>
       </div>
       <div className='text-center'>
        © 2025 Shinyy. All Rights Reserved | designed and developed by Alagu Nandhini
       </div>
      </footer>

    </div>
  )
}

export default Footer

import React from 'react'
import Navbar from '../Component/Navbar'
import Footer from '../Component/Footer'
import {Outlet} from "react-router-dom"
import { useState } from 'react'
import CartOffcanvas from '../Component/Cartoffcanvas'
const Layout = () => {
  // state for cart offcanvas
  const [cartOpen, setCartOpen] = useState(false);
   const openCart = () => setCartOpen(true);
   const closeCart = () => setCartOpen(false)
  return (
    <>
      <Navbar openCart={() => setCartOpen(true)} />
        <CartOffcanvas
        isOpen={cartOpen}
        closeCart={closeCart}
      />
      <Outlet context={{ openCart}} />
      <Footer/>
    </>
  )
}

export default Layout

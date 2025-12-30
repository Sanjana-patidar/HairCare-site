import { useState } from 'react'
import { useEffect } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from './pages/Layout';
import Contect from './Pages/Contect';
import Home from './pages/Home';
import Adminlayout from './Admin/Adminlayout';
import Dashboard from './Admin/Dashboard';
import User from './Admin/User';
import Product from './Admin/Product';
import Setting from './Admin/Setting';
import Addproduct from './Admin/Addproduct';
import Productdetail from './pages/Productdetail';
import Oil from './pages/Oil';
import Shampoo from './pages/Shampoo';
import Conditioner from './pages/Conditioner';
import Serum from './pages/Serum'
import './App.css'

function App() {
 useEffect(() => {
    AOS.init({
      duration: 1100,
      once:false,  
       mirror: true,
      easing: "ease-in-out",
    });
  }, []);
  return (
    <>
    <BrowserRouter>
        <Routes>
          {/* user route */}
           <Route path="/" element={<Layout/>}>
             <Route index element={<Home/>} />
             <Route path="Categoryoil" element={<Oil/>} />
             <Route path="Categoryshampoo" element={<Shampoo/>} />
             <Route path="Categoryconditioner" element={<Conditioner/>} />
             <Route path="Categoryserum" element={<Serum/>} />
             <Route path="contact" element={<Contect/>} />
             <Route path="productdetail/:id" element={<Productdetail/>} />

           </Route>
           {/* admin route */}
           <Route path="/admin" element={<Adminlayout/>}>
             <Route index element={<Dashboard/>} />
             <Route path="user" element={<User/>} />
             <Route path="product" element={<Product/>} />
             <Route path="addproduct" element={<Addproduct/>} />
             <Route path="setting" element={<Setting/>} />
           </Route>
        </Routes>
    </BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  )
}

export default App

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
import Productdetail from './pages/Productdetail';
import Oil from './pages/Oil';
import Shampoo from './pages/Shampoo';
import Conditioner from './pages/Conditioner';
import Serum from './pages/Serum'
import './App.css'
import Checkout from './pages/Checkout';
import Ordersuccess from './pages/Ordersuccess';
import ScroolToTop from './Component/ScroolToTop';
import SplashScreen from './Component/SplashScreen';
function App() {
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const visited = sessionStorage.getItem("visited");

    if (visited) {
      setLoading(false);
    } else {
      setTimeout(() => {
        sessionStorage.setItem("visited", "true");
        setLoading(false);
      }, 4000);
    }
  }, []);

 useEffect(() => {
    AOS.init({
      duration: 1100,
      once:false,  
       mirror: true,
      easing: "ease-in-out",
    });
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

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
             <Route path="Checkout" element={<Checkout/>} />
             <Route path="Placeorder" element={<Ordersuccess/>} />
             <Route path="productdetail/:id" element={<Productdetail/>} />
           </Route>
        </Routes>
    </BrowserRouter>
      <ToastContainer position="top-right" autoClose={1000} />
      <ScroolToTop/>
    </>
    
  )
}

export default App

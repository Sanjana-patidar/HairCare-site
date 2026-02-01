import React from 'react'
import "aos/dist/aos.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Adminlayout from './Components/Adminlayout'
import Dashboard from './Components/Dashboard'
import User from './Components/User'
import Product from './Components/Product'
import Setting from './Components/Setting'
import Addproduct from './Components/Addproduct'
import Brand from './Components/Brand'
import Addbrand from './Components/Addbrand'
import Orderhistory from './Components/Orderhistory'
import Login from './Pages/Login';
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>} />
          <Route path="/admin" element={<Adminlayout/>}>
             <Route index element={<Dashboard/>} />
             <Route path="user" element={<User/>} />
             <Route path="product" element={<Product/>} />
             <Route path="addproduct" element={<Addproduct/>} />
             <Route path="brand" element={<Brand/>} />
             <Route path="addbrand" element={<Addbrand/>} />
             <Route path="orderhistory" element={<Orderhistory/>} />
             <Route path="setting" element={<Setting/>} />
           </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

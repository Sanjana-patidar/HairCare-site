import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './Brand.css'
const Brand = () => {
  const [brand, setBrand] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/brands`);
        setBrand(res.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) return <p>Loading brands...</p>;

  return (
    <>
      <div>
        <h3 style={{color: "rgb(192, 223, 54)"}} className=" text-center brand-heading">Our Brands</h3>
      </div> 
      <div>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
      </div>
    </>
  )
}

export default Brand

import React from 'react'
import Mainheader from '../Component/Mainheader'
import Productcategorie from '../Component/Productcategorie'
import Product from '../Component/Product'
import Benfit from '../Component/Benfit'
import Video from '../Component/Video'
import Brand from '../Component/Brand'
import HairQuiz from '../Component/HairQuiz'
import HowItWorks from '../Component/HowItWorks'

const Home = () => {
  return (
    <>
      <Mainheader/>
      <Productcategorie/>
      <HowItWorks/>
      <Video/>
      <Brand/>
      <HairQuiz/>
      <Product/>
      <Benfit/>
    </>
  )
}

export default Home

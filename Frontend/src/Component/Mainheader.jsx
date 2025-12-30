import React from 'react'
import './Mainheader.css'
const Mainheader = () => {
  return (
    <div>
      <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="/src/assets/img/first.webp" class="d-block w-100" alt="..."/>
    </div>
    <div class="carousel-item">
      <img src="\src\assets\img\second.webp" class="d-block w-100" alt="..."/>
    </div>
    <div class="carousel-item">
      <img src="/src/assets/img/third.webp" class="d-block w-100" alt="..."/>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span class=" text-black fs-2"><i class="fa-solid fa-angle-left"></i></span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
     <span class=" text-black fs-2"><i class="fa-solid fa-angle-right"></i></span>
  </button>
</div>
    </div>
  )
}

export default Mainheader

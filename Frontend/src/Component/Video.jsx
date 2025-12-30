import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {  Navigation,Autoplay } from 'swiper/modules';
import './Video.css'
const Video = () => {
  return (
    <>
    <div className='text-center mt-5 mb-5' style={{color:"rgb(195, 229, 43)"}}>
        <h3 data-aos="fade-right"  >Real Care Real Results.</h3>
        <h3 data-aos="fade-left" >See the difference in every strand</h3>
    </div>
    {/* swiper for video */}
    <div data-aos="zoom-in" className="video-container p-4">
       <Swiper
        slidesPerView={5}
        spaceBetween={20}
        loop={true}
        autoplay={{
        delay: 2000,
        disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
       navigation={true}
        breakpoints={{
            320:{
              slidesPerView:1
            },
            450:{
              slidesPerView:2
            },
            650:{
              slidesPerView:3
            },
            750:{
              slidesPerView:4
            },
             1100:{
              slidesPerView:4
            },
            1300:{
              slidesPerView:5
            },
            
        }}
        modules={[ Navigation,Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide >
            <div className='video-section'>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    >
                    <source src="/Video/haircareproductvideo.mp4" type="video/mp4" />
                </video>
           </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className='video-section '>
          <video
            autoPlay
            muted
            loop
            playsInline
           
            >
            <source src="/Video/haircarepro3.mp4" type="video/mp4" />
          </video>
       </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className='video-section '>
          <video
            autoPlay
            muted
            loop
            playsInline
            >
            <source src="/Video/haircarepro4.mp4" type="video/mp4" />
          </video>
       </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className='video-section '>
          <video
            autoPlay
            muted
            loop
            playsInline
           
            >
            <source src="/Video/haircarepro5.mp4" type="video/mp4" />
          </video>
       </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className='video-section '>
          <video
            autoPlay
            muted
            loop
            playsInline
            >
            <source src="/Video/hairecarepro1.mp4" type="video/mp4" />
          </video>
       </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className='video-section '>
          <video
            autoPlay
            muted
            loop
            playsInline
        
            >
            <source src="/Video/haircarepro2.mp4" type="video/mp4" />
          </video>
       </div>
        </SwiperSlide>
         <SwiperSlide>
        <div className='video-section '>
          <video
            autoPlay
            muted
            loop
            playsInline
            >
            <source src="/Video/haircarepro4.mp4" type="video/mp4" />
          </video>
       </div>
        </SwiperSlide>
        
      </Swiper>
    </div>
    {/* swiper end */}
    </>
  )
}

export default Video

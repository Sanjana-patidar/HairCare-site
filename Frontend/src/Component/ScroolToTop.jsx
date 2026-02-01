import React, { useEffect } from 'react'
import{ useState }from 'react'
import './ScrollToTop.css'
const ScroolToTop = () => {
    const [show, setShow] = useState(false);
   
    useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 350);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

    const scroll = () =>{
        window.scrollTo({
            top:0,
            behaviour: "smooth"
        }
        )
    }
  return (
    <>
     {show && 
         (  
             <button onClick={scroll} className='scroolbtn'>
              <i class="fa-solid fa-arrow-up text-black"></i>
            </button>
         )
     }
    </>
  )
}

export default ScroolToTop

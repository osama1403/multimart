import { useEffect } from "react";
import { useState } from "react";
import {BsChevronUp} from 'react-icons/bs'

const ScrollToTopButton = () => {
  const [showButton,setShowButton]=useState(false); 
  useEffect(()=>{
    const handleShowButton = ()=>{
      window.scrollY > 300 ? setShowButton(true):setShowButton(false);
    }
    window.addEventListener('scroll',handleShowButton);
    return ()=>{window.removeEventListener('scroll',handleShowButton);}
  },[])
  return (
    <button className={`fixed right-7 bottom-16 z-10 border-2 border-primary outline-none p-3 rounded-full text-2xl text-primary bg-white opacity-50 ${showButton ? '':'hidden' } `}
     onClick={()=>{window.scrollTo({top:0,left:0,behavior:"smooth"})}}><BsChevronUp /></button>
  );
}
 
export default ScrollToTopButton;
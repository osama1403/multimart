import { Outlet, NavLink, useLocation } from "react-router-dom";
import { FaUser, FaShoppingCart, FaListAlt, FaHeart } from 'react-icons/fa'
import { BsChatFill } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { socketIoContext } from "../Context/SocketIoContext";
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'
import { RiLogoutBoxLine } from "react-icons/ri";
import useLogout from "../hooks/useLogout";

const links = [
  { name: "Profile", link: '/profile', icon: <FaUser /> },
  { name: "Cart", link: '/cart', icon: <FaShoppingCart /> },
  { name: "Orders", link: '/orders', icon: <FaListAlt /> },
  { name: "Wishlist", link: '/wishlist', icon: <FaHeart /> },
  { name: "Chat", link: '/chat', icon: <BsChatFill /> }
]



const UserLayout = () => {
  const { notification } = useContext(socketIoContext)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation();
  const { logout, loading } = useLogout()


  useEffect(() => {
    setOpen(false);
  }, [pathname])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'clip';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [open])

  useEffect(() => {
    const el = window.addEventListener('resize', () => { if (window.innerWidth > 640) { setOpen(false) } })
    return (() => { window.removeEventListener('resize', el) })
  }, [])

  return (
    <>
      <div className="relative sm:flex flex-row min-h-[calc(100vh-64px)]">
        {/* <div className="bg-white sticky top-16 md:top-0 md:relative border-b md:border-r md:border-b-0 z-10">
          <div className={`relative md:sticky md:top-16  w-full md:w-fit flex flex-row md:flex-col justify-start md:gap-3  md:pt-10   text-zinc-600 font-nunito text-2xl md:text-xl font-medium `}>
            <NavLink to='/profile' className={({ isActive }) => { return `relative w-full py-2 px-2 sm:px-6 flex items-center justify-center md:justify-start gap-4 ${isActive ? 'text-primary' : ''}` }}>
              <FaUser /> 
              <p className="hidden md:block">profile</p>
            </NavLink>
            <NavLink to='/cart' className={({ isActive }) => { return `relative w-full py-2 px-2 sm:px-6 flex items-center justify-center md:justify-start gap-4 ${isActive ? 'text-primary' : ''} ` }}>
              <FaShoppingCart /> 
              <p className="hidden md:block">cart</p>
            </NavLink>
            <NavLink to='/orders' className={({ isActive }) => { return `relative w-full py-2 px-2 sm:px-6 flex items-center justify-center md:justify-start gap-4 ${isActive ? 'text-primary' : ''} ` }}>
              <FaListAlt />
              <p className="hidden md:block">orders</p>
            </NavLink>
            <NavLink to='/wishlist' className={({ isActive }) => { return `relative w-full py-2 px-2 sm:px-6 flex items-center justify-center md:justify-start gap-4 ${isActive ? 'text-primary' : ''}` }}>
              <FaHeart /> 
              <p className="hidden md:block">wishlist</p>
            </NavLink>
            <NavLink to='/chat' className={({ isActive }) => { return `relative w-full py-2 px-2 sm:px-6 flex items-center justify-center md:justify-start gap-4 ${isActive ? 'text-primary' : ''}` }}>
            <i className={`relative chaticon ${notification ? '':'before:hidden'}`}><BsChatFill /></i> 
              <p className="hidden md:block">chat</p>
            </NavLink>

          </div>
        </div> */}

        <div className="w-full sm:hidden sticky top-16 z-10">
          <div className="p-4 bg-white">
            <div className="cursor-pointer w-fit text-xl" onClick={() => { setOpen(open => !open) }}>
              {open ? <AiOutlineClose /> : <AiOutlineMenu />}
            </div>
          </div>

          <div className={`sm:hidden absolute w-full  left-0 ${open ? 'h-[calc(100vh-116px)]' : 'h-0'} transition-all duration-300  bg-white`}>
            <div className="w-full h-full overflow-auto noscrollbar">
              <div className="flex flex-col w-full text-xl p-6 [&>*:not(:last-child)]:border-b ">
                {links.map((el, idx) =>
                  <NavLink to={el.link} key={idx} className={({ isActive }) => { return `relative w-full py-5 flex items-center justify-center  gap-4 ${isActive ? 'text-primary' : ''}` }}>
                    {el.name === 'Chat' ? <i className={`relative chaticon ${notification ? '' : 'before:hidden'}`}>{el.icon}</i> : el.icon} <span className="inline">{el.name}</span>
                  </NavLink>
                )}
                <button className={`relative w-full py-5 flex items-center justify-center  gap-4 hover:text-primary`}  onClick={logout}>
                  <RiLogoutBoxLine /><span className="inline">{loading?'...':'Log out'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden sm:block border-r">
          <div className="flex flex-col justify-between py-10 gap-3 sticky top-16 min-w-max h-[calc(100vh-64px)] text-2xl lg:text-lg text-zinc-600 font-nunito overflow-y-auto noscrollbar">
            <div className="flex flex-col gap-3">
              {links.map((el, idx) =>
                <NavLink to={el.link} key={idx} className={({ isActive }) => { return `relative w-full  px-5 py-2 flex items-center justify-center sm:justify-start gap-4 ${isActive ? 'text-primary' : ''}` }}>
                  {el.name === 'Chat' ? <i className={`relative chaticon ${notification ? '' : 'before:hidden'}`}>{el.icon}</i> : el.icon} <span className={` hidden lg:inline`}>{el.name}</span>
                </NavLink>
              )}
            </div>
            <button className={`relative w-full  px-5 py-2 flex items-center justify-center sm:justify-start gap-4 hover:text-primary `} onClick={logout}>
              <RiLogoutBoxLine /><span className={` hidden lg:inline`}>{loading?'...':'Log out'}</span>
            </button>

          </div>
        </div>




        <Outlet />
      </div>
    </>
  );
}

export default UserLayout;
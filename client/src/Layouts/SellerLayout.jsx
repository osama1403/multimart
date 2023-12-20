import { Outlet, NavLink, useLocation } from "react-router-dom";
import { FaStore, FaThLarge, FaPlus, FaListUl } from 'react-icons/fa'
import { AiFillDashboard, AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'
import { BsFillChatFill } from 'react-icons/bs'
import { useState, useEffect, useContext } from "react";
import { socketIoContext } from "../Context/SocketIoContext";
import { RiLogoutBoxLine } from "react-icons/ri";
import useLogout from "../hooks/useLogout";

const links = [
  { name: "Store", link: '/seller/store', icon: <FaStore /> },
  { name: "Dashboard", link: '/seller/dashboard', icon: <AiFillDashboard /> },
  { name: "Products", link: '/seller/products', icon: <FaThLarge /> },
  { name: "Add product", link: '/seller/addproduct', icon: <FaPlus /> },
  { name: "Orders", link: '/seller/orders', icon: <FaListUl /> },
  { name: "Chat", link: '/seller/chat', icon: <BsFillChatFill /> }
]

const SellerLayout = () => {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation();
  const { notification } = useContext(socketIoContext)
  const { logout, loading } = useLogout()
  console.log(notification);
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
      <div className=" relative sm:flex flex-row min-h-screen mx-auto">
        <div className="w-full sm:hidden sticky top-0 z-10">
          <div className="p-4 bg-white">
            <div className="cursor-pointer w-fit text-xl" onClick={() => { setOpen(open => !open) }}>
              {open ? <AiOutlineClose /> : <AiOutlineMenu />}
            </div>
          </div>

          <div className={`sm:hidden absolute w-full top-[52] left-0 ${open ? 'h-[calc(100vh-52px)]' : 'h-0'} transition-all duration-300  bg-white`}>
            <div className="w-full h-full overflow-auto noscrollbar">
              <div className="flex flex-col w-full text-xl p-6 [&>*:not(:last-child)]:border-b ">
                {links.map((el, idx) =>
                  <NavLink to={el.link} key={idx} className={({ isActive }) => { return `relative w-full py-5 flex items-center justify-center  gap-4 ${isActive ? 'text-primary' : ''}` }}>
                    {el.name === 'Chat' ? <i className={`relative chaticon ${notification ? '' : 'before:hidden'}`}>{el.icon}</i> : el.icon} <span className="inline">{el.name}</span>
                  </NavLink>
                )}
                <button className={`relative w-full py-5 flex items-center justify-center  gap-4 hover:text-primary`} onClick={logout}>
                  <RiLogoutBoxLine /><span className="inline">{loading ? '...' : 'Log out'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>


        <div className="relative hidden sm:block border-r">
          <div className="flex flex-col sticky top-0 gap-3 py-10 justify-between min-w-max h-screen text-2xl lg:text-lg text-zinc-600  font-nunito  overflow-y-auto noscrollbar">
            <div className="flex flex-col gap-3">
              {links.map((el, idx) =>
                <NavLink to={el.link} key={idx} className={({ isActive }) => { return `relative w-full  px-5 py-2 flex items-center justify-center sm:justify-start gap-4 ${isActive ? 'text-primary' : ''}` }}>
                  {el.name === 'Chat' ? <i className={`relative chaticon ${notification ? '' : 'before:hidden'}`}>{el.icon}</i> : el.icon} <span className={` hidden lg:inline`}>{el.name}</span>
                </NavLink>
              )}
            </div>
            <button className={`relative w-full  px-5 py-2 flex items-center justify-center sm:justify-start gap-4 hover:text-primary `} onClick={logout}>
              <RiLogoutBoxLine /><span className={` hidden lg:inline`}>{loading ? '...' : 'Log out'}</span>
            </button>
          </div>
        </div>

        <Outlet />
      </div >
    </>
  );
}

export default SellerLayout;
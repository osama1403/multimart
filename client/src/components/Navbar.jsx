import { Link, NavLink, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from '../assets/logo.svg'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'
import { useState, useEffect, useContext } from "react";
import useAuth from '../hooks/useAuth';
import profilePlaceholder from '../assets/images/profilePlaceholder.png'
import { socketIoContext } from "../Context/SocketIoContext";

const Navbar = () => {
  const serverUrl = process.env.REACT_APP_URL
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { auth } = useAuth();
  const { accessToken } = auth
  const { notification } = useContext(socketIoContext)

  console.log(accessToken);

  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [pathname])

  // prevent scrolling when navList is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'clip';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [open])

  useEffect(() => {
    const el = window.addEventListener('resize', () => { if (window.innerWidth > 768) { setOpen(false) } })
    return (() => { window.removeEventListener('resize', el) })
  }, [])

  return (
    <nav >
      <div className="w-full z-20 h-16 scroll px-4 lg:px-10 fixed top-0 flex flex-row justify-between items-center outline outline-1 outline-zinc-200 border-zinc-200 bg-white ">
        <Link to='/' className="h-2/3 w-32 flex justify-center items-center outline-none" >
          <Logo className='h-fit w-full' />
        </Link>


        <div className="md:hidden  w-6 h-6 text-2xl cursor-pointer" onClick={() => { setOpen(!open) }}>
          {open ? <AiOutlineClose className="text-primary" /> : <AiOutlineMenu />}
        </div>

        {/* <div className={` absolute w-full transition-all duration-300 top-16 left-0 ${open ? 'h-[calc(100vh-64px)]' : 'h-0'} md:h-16  md:inset-0 md:w-auto md:relative`}> */}

        <div className={` absolute w-full transition-all duration-300 top-16 left-0 ${open ? 'h-[calc(100vh-64px)]' : 'h-0'} md:h-16 overflow-y-scroll noscrollbar md:inset-0 md:w-auto md:relative`}>

          <div className={`md:p-0 pb-10 flex flex-col md:flex-row md:h-full min-h-full md:gap-7 font-nunito text-lg font-bold bg-white [&>*]:w-full [&>*]:md:w-auto [&>*]:grow [&>*]:flex [&>*]:items-center [&>*]:justify-center [&>*]:border-b [&>*]:md:border-b-0 [&>*]:py-4 [&>*:not(:last-child)]:md:py-0 text-center `}>

            <NavLink to={'/'} className={({ isActive }) => isActive ? 'text-primary' : 'text-black'}>
              Home
            </NavLink>

            <NavLink to={'/products'} className={({ isActive }) => isActive ? 'text-primary' : 'text-black'}>
              Products
            </NavLink>

            <NavLink to={'/deals'} className={({ isActive }) => isActive ? 'text-primary' : 'text-black'}>
              Deals
            </NavLink>


            <NavLink to={'/about'} className={({ isActive }) => isActive ? 'text-primary' : 'text-black'}>
              About Us
            </NavLink>

            {
              accessToken ?
                <NavLink to={'/profile'} className={` -order-1 md:order-1 flex flex-col md:flex-row items-center md:pl-6 gap-2 box-border md:h-full text-base `}>
                  <div className={`inline navimg relative ${notification ? '':'before:hidden'}`}>
                    <img src={auth.userData?.img ? serverUrl + '/' + auth.userData.img : profilePlaceholder} alt="" className=" inline rounded-full w-20 h-20 md:w-10 md:h-10 object-cover" />
                  </div>
                  <p className="mt-1 text-center md:max-w-[130px] md:line-clamp-2 ">{auth?.userData?.name}</p>
                </NavLink> :
                <>
                  <NavLink to={'/login'} className={({ isActive }) => { return ` py-1 rounded-md font-light ${isActive ? 'text-primary' : 'text-black'}` }}>
                    Login
                  </NavLink>
                  <NavLink to={'/signup'} className={({ isActive }) => { return `  py-1 rounded-md font-light ${isActive ? 'text-primary' : 'text-black'}` }}>
                    Sign up
                  </NavLink>
                </>

            }
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
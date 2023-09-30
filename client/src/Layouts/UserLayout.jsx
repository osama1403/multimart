import { Outlet, NavLink } from "react-router-dom";
import { FaUser, FaShoppingCart, FaListAlt, FaHeart } from 'react-icons/fa'

const UserLayout = () => {
  return (
    <>
      <div className="sm:flex flex-row min-h-[calc(100vh-64px)]">
        <div className="bg-white sticky top-16 sm:top-0 sm:relative border-b sm:border-r sm:border-b-0 z-10">
          <div className={`relative sm:sticky sm:top-16  w-full sm:w-fit flex flex-row sm:flex-col justify-start sm:gap-3  sm:pt-10   text-zinc-600 font-nunito text-2xl sm:text-xl font-medium `}>
            <NavLink to='/profile' className={({ isActive }) => { return `relative w-full py-2 px-6 flex items-center justify-center sm:justify-start gap-4 ${isActive ? 'text-primary' : ''}` }}>
              <FaUser /> 
              <p className="hidden sm:block">profile</p>
            </NavLink>
            <NavLink to='/cart' className={({ isActive }) => { return `relative w-full py-2 px-6 flex items-center justify-center sm:justify-start gap-4 ${isActive ? 'text-primary' : ''} ` }}>
              <FaShoppingCart /> 
              <p className="hidden sm:block">cart</p>
            </NavLink>
            <NavLink to='/orders' className={({ isActive }) => { return `relative w-full py-2 px-6 flex items-center justify-center sm:justify-start gap-4 ${isActive ? 'text-primary' : ''} ` }}>
              <FaListAlt />
              <p className="hidden sm:block">orders</p>
            </NavLink>
            <NavLink to='/wishlist' className={({ isActive }) => { return `relative w-full py-2 px-6 flex items-center justify-center sm:justify-start gap-4 ${isActive ? 'text-primary' : ''}` }}>
              <FaHeart /> 
              <p className="hidden sm:block">wishlist</p>
            </NavLink>

          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default UserLayout;
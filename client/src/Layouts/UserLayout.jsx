import { Outlet, NavLink } from "react-router-dom";
import { FaUser, FaShoppingCart, FaListAlt, FaHeart } from 'react-icons/fa'

const UserLayout = () => {
  return (
    <>
      <div className="md:flex flex-row min-h-[calc(100vh-64px)]">
        <div className="bg-white sticky top-16 md:top-0 md:relative border-b md:border-r md:border-b-0 z-10">
          <div className={`relative md:sticky md:top-16  w-full md:w-fit flex flex-row md:flex-col justify-start md:gap-3  md:pt-10   text-zinc-600 font-nunito text-2xl md:text-xl font-medium `}>
            <NavLink to='/profile' className={({ isActive }) => { return `relative w-full py-2 px-6 flex items-center justify-center md:justify-start gap-4 ${isActive ? 'text-primary' : ''}` }}>
              <FaUser /> 
              <p className="hidden md:block">profile</p>
            </NavLink>
            <NavLink to='/cart' className={({ isActive }) => { return `relative w-full py-2 px-6 flex items-center justify-center md:justify-start gap-4 ${isActive ? 'text-primary' : ''} ` }}>
              <FaShoppingCart /> 
              <p className="hidden md:block">cart</p>
            </NavLink>
            <NavLink to='/orders' className={({ isActive }) => { return `relative w-full py-2 px-6 flex items-center justify-center md:justify-start gap-4 ${isActive ? 'text-primary' : ''} ` }}>
              <FaListAlt />
              <p className="hidden md:block">orders</p>
            </NavLink>
            <NavLink to='/wishlist' className={({ isActive }) => { return `relative w-full py-2 px-6 flex items-center justify-center md:justify-start gap-4 ${isActive ? 'text-primary' : ''}` }}>
              <FaHeart /> 
              <p className="hidden md:block">wishlist</p>
            </NavLink>

          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default UserLayout;
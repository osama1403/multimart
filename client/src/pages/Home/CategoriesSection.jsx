import { useState } from 'react';
import { Link } from 'react-router-dom';
import Categories from '../../Categories';

const CategoriesSection = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className=" mx-auto px-2 sm:px-4 py-5  max-w-[1520px] min-w-[220px] font-nunito">
      <h2 className="py-2 text-xl text-center">Explore different categories for all your shopping needs</h2>
      <div className={`mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 ${!open ? '[&>*:nth-child(n+5)]:hidden' : ''}`}>
        {Categories.map((el) => {
          return (
          
            <Link to={'/products'} state={{category:el.name}}  className="w-full transition-all duration-150 hover:scale-105 max-w-[150px] p-2 box-border mx-auto" key={el.name}>
              <div className='rounded-full w-full bg-slate-200 p-6'>
              <img src={el.img} alt="" className=' p-0' />
              </div>
              <p className='text-center text-lg font-semibold py-2'>{el.name}</p>
            </Link>
            
          )
        })}


      </div>

      <div className='w-full'>

        <button className={` outline-none bg-slate-100 text-xl text-zinc-800 px-3 py-1  rounded-lg block mx-auto  `}
          onClick={() => { setOpen(!open) }}>{open ? 'Show less':'Show more'}</button>
      </div>


    </div>
  );
}

export default CategoriesSection;
import { Link } from 'react-router-dom'
import { HiOutlineArrowSmLeft } from 'react-icons/hi'
import { AiOutlineCalendar } from 'react-icons/ai'
import { FaTruck, FaCheckCircle, FaCircle, FaClock } from 'react-icons/fa'
import { FaGear } from 'react-icons/fa6'


import img from '../../assets/prod.jpeg'

const OrderPage = () => {
  return (
    <>
      {/* container */}
      <div className="grow max-w-6xl mx-auto p-4 bg-slate-50 font-nunito">

        {/* back button and order name and date */}
        <Link to={-1} className='text-blue-400 pr-6  w-fit flex items-center gap-1 hover:text-blue-600'> <HiOutlineArrowSmLeft className='text-xl' /> <span>Orders</span></Link>

        {/* summary */}
        <div className='w-full px-4 py-1 border rounded-lg bg-white shadow-md mt-1 flex items-center flex-wrap '>
          <h1 className='text-2xl font-bold mr-8'>order #<span>726</span></h1>
          <div className='grow flex items-center justify-between flex-wrap'>
            <p className='text-zinc-700'><AiOutlineCalendar className='inline' /> 06/march/2023 at 4:33pm</p>
            <p className='text-xl font-bold text-zinc-600'>$435.99</p>
          </div>

        </div>




        {/* status */}
        <div className='mt-2 w-full p-4 border rounded-lg bg-white shadow-md'>
          <p className='text-zinc-500 font-medium mb-3'> <FaCircle className=' inline mb-1 text-blue-500' /> shipping</p>

          {/* status diagram */}
          <div className='w-full flex items-center text-2xl text-zinc-400 gap-2 max-w-2xl'>
            <FaClock className='text-primary' />
            <div className='grow h-2  rounded-full bg-primary'></div>
            <FaGear className='text-primary on' />
            <div className='grow h-2 rounded-full bg-primary'></div>
            <FaTruck className='text-primary ontruck' />
            <div className='grow h-2 bg-zinc-300 rounded-full'></div>
            <FaCheckCircle />
          </div>
        </div>


        {/* info */}
        <div className='mt-2 w-full p-4 border rounded-lg bg-white shadow-md'>
          <p className='text-lg font-semibold text-zinc-500 '>info:</p>

          <p className='mt-2'>Shipping to:</p>
          <p className='text-zinc-600'>Al-Qadmous Tartus Syria</p>

          <p className='mt-2'>Estimated delivery:</p>
          <p className='text-zinc-600'>08/march/2023</p>

          <div className='mt-2 max-w-2xl [&>*:nth-child(even)]:bg-slate-100'>
            <div className='flex justify-between p-1 '>
              <p >Elements:</p>
              <p>#4</p>
            </div>
            <div className='flex md justify-between p-1  '>
              <p >Subtotal:</p>
              <p>$ 473.99</p>
            </div>
            <div className='flex justify-between items-center p-1 gap-3'>
              <p >Estimated shipping cost:</p>
              <p className='whitespace-nowrap'>$ 60.00</p>
            </div>
            <div className='flex justify-between p-1  '>
              <p>Tax:</p>
              <p>$ 68.89</p>
            </div>
            <div className='flex justify-between p-1  '>
              <p >Total:</p>
              <p>$ 602.88</p>
            </div>
          </div>

        </div>


        {/* <div className='w-full '> */}
        <div className='mt-4 w-full p-4 border rounded-lg bg-white shadow-md [&>*:nth-child(n+3)]:border-t'>
          {/* <p className='text-zinc-600 pl-2 font-medium mb-3'> <FaCircle className='text-lg text-gray-600 inline pb-1' /> Pending</p> */}
          <p className='text-lg font-semibold text-zinc-500 '>Items:</p>
          {/* item */}
          {
            [1, 2, 2, 2].map((i) => {
              return (
                <div className='w-full flex flex-col sm:flex-row gap-3 py-4 max-w-2xl '>
                  
                  <div className='grow flex flex-wrap  gap-4  font-semibold font-nunito'>
                    <img src={img} alt="" className='w-24 shadow-zinc-400 shadow-md aspect-[4/5] rounded-md' />
                   
                    <div className=' flex flex-col pb-4 min-w-[200px]' >
                      <h2 className='font-semibold text-lg'>item num one</h2>
                      <div className='my-auto grow flex flex-col justify-center'>
                        <p className=''><span className='text-zinc-600'>size:</span> xl</p>
                        <p className=''><span className='text-zinc-600'>color:</span> Black</p>

                      </div>
                    </div>
                  </div>

                  <div className='grow w-fit sm:w-auto flex justify-between gap-4'>
                    <p className=''>$83.99</p>
                    <p className=''>#2</p>
                    <p>$167.98</p>
                  </div>

                </div>
              )
            })
          }


        </div>


        {/* </div> */}

      </div>
    </>
  );
}

export default OrderPage;
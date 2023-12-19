import { Link, useParams } from 'react-router-dom'
import { HiOutlineArrowSmLeft } from 'react-icons/hi'
import { AiOutlineCalendar } from 'react-icons/ai'
import { FaTruck, FaCheckCircle, FaCircle, FaClock } from 'react-icons/fa'
import { FaGear } from 'react-icons/fa6'
import useGetAxios from '../../hooks/useGetAxios'
import usePrivateAxios from '../../hooks/usePrivateAxios'
import LoadingThreeDots from '../../components/LoadingThreeDots'
import OrderProductItem from './OrderProductItem'

const OrderPage = () => {
  const { id } = useParams()
  const privateAxios = usePrivateAxios()
  const { data, loading, error } = useGetAxios(`/user/orders/${id}`, privateAxios, [])
  const inStage = (stage, currentStage) => {
    const stages = ['Pending', 'Processing', 'Shipping', 'Delivered']
    return (stages.indexOf(currentStage) >= stages.indexOf(stage))
  }

  return (
    < div className="grow max-w-6xl mx-auto p-4 bg-slate-50 font-nunito" >
      {
        error ? <p className="text-lg text-red-500 "> {error}</p>
          : loading ?
            <LoadingThreeDots />
            : data &&
            <>

              {/* back button and order name and date */}
              <Link to={'/orders'} className='text-blue-400 pr-6  w-fit flex items-center gap-1 hover:text-blue-600'> <HiOutlineArrowSmLeft className='text-xl' /> <span>Orders</span></Link>

              {/* summary */}

              <div className='w-full px-4 py-1 border rounded-lg bg-white shadow-md mt-1'>
                {/* <h1 className='text-2xl font-bold mr-8'>order #<span>726</span></h1> */}
                <div className='flex items-center justify-between w-full max-w-2xl flex-wrap'>
                  <p className='text-zinc-700'><AiOutlineCalendar className='inline' />{new Date(data.date).toLocaleString()}</p>
                  <p className='text-xl font-bold text-zinc-600'>${data.totalCost / 100}</p>
                </div>
                <span>seller:</span><Link className='text-blue-400 ml-2 hover:text-blue-600'>{data.seller.shopName}</Link>
              </div>

              {/* status */}
              <div className='mt-2 w-full p-4 border rounded-lg bg-white shadow-md'>
                <p className='text-zinc-500 font-medium mb-3'>
                  <FaCircle className={` inline mb-1 mr-2 ${data.status === 'Pending' ? 'text-zinc-300'
                    : data.status === 'Processing' ? 'text-yellow-500'
                      : data.status === 'Shipping' ? 'text-blue-500'
                        : 'text-green-500'}`} />
                  {data.status}
                </p>

                {/* status diagram */}
                <div className='w-full flex items-center text-2xl text-zinc-400 gap-2 max-w-2xl'>
                  <FaClock className='text-primary' />
                  <div className={`grow h-2  rounded-full ${inStage('Processing', data.status) ? 'bg-primary' : 'bg-zinc-300'}`}></div>
                  <FaGear className={`${inStage('Processing', data.status) ? 'text-primary' : ''} ${data.status === 'Processing' ? 'on' : ''}`} />
                  <div className={`grow h-2  rounded-full ${inStage('Shipping', data.status) ? 'bg-primary' : 'bg-zinc-300'}`}></div>
                  <FaTruck className={`${inStage('Shipping', data.status) ? 'text-primary' : ''} ${data.status === 'Shipping' ? 'ontruck' : ''}`} />
                  <div className={`grow h-2  rounded-full ${inStage('Delivered', data.status) ? 'bg-primary' : 'bg-zinc-300'}`}></div>
                  <FaCheckCircle className={`${data.status === 'Delivered' ? 'text-primary' : ''}`} />
                </div>
              </div>


              {/* info */}
              <div className='mt-2 w-full p-4 border rounded-lg bg-white shadow-md'>
                <p className='text-lg font-semibold text-zinc-500 '>info:</p>

                <p className='mt-2'>Shipping to:</p>
                <p className='text-zinc-600'>{data.shippingAddress}</p>

                <div className='mt-2 max-w-2xl [&>*:nth-child(even)]:bg-slate-100'>
                  <div className='flex justify-between p-1 '>
                    <p >Elements:</p>
                    <p>#{data.products.length}</p>
                  </div>
                  <div className='flex md justify-between p-1  '>
                    <p >Subtotal:</p>
                    <p>${(data.subtotal / 100).toFixed(2)}</p>
                  </div>
                  <div className='flex justify-between p-1  '>
                    <p>Tax:</p>
                    <p>${(data.tax / 100).toFixed(2)}</p>
                  </div>
                  <div className='flex justify-between p-1  '>
                    <p >Total:</p>
                    <p>${(data.totalCost / 100).toFixed(2)}</p>
                  </div>
                </div>

              </div>


              <div className='mt-4 w-full p-4 border rounded-lg bg-white shadow-md [&>*:nth-child(n+3)]:border-t'>
                <p className='text-lg font-semibold text-zinc-500 '>Items:</p>
                {/* items */}
                {
                  data.productsElements.map((el, idx) => {
                    const details = data.products.find(c => c.id === el._id)
                    const rating = data.ratings.find(r => r.productId === el._id)
                    return (
                      <OrderProductItem product={el} details={details} rating={rating} delivered={data.status==='Delivered'} key={idx} />
                    )
                  })
                }


              </div>


            </>
      }
      {/* </div> */}

    </div >
  );
}

export default OrderPage;
import { useParams } from "react-router-dom";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import useGetAxios from "../../hooks/useGetAxios";
import LoadingThreeDots from "../../components/LoadingThreeDots";
import { AiOutlineCalendar } from "react-icons/ai";
import { BsThreeDots } from 'react-icons/bs';
import OrderItem from "./OrderItem";
import { FaCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

const SellerSingleOrder = () => {
  const { id } = useParams()
  const privateAxios = usePrivateAxios()
  const { data, loading, error,setData } = useGetAxios(`/seller/orders/${id}`, privateAxios, [])
  const abortController = new AbortController()

  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const upgradeStatus = async () => {
    setUpgradeLoading(true)
    try {
      const res = await privateAxios.post('/seller/orders/upgradestatus', { id: data._id }, { signal: abortController.signal })
      const { status } = res.data
      setData(p=>{return{...p,status}})
      console.log(status);
    } catch (error) {
      console.log(error);
    }
    setUpgradeLoading(false)
  }

  useEffect(() => {
    return () => {
      abortController.abort()
    }
  }, [])
  return (
    <>
      <div className="grow min-h-screen px-2 sm:px-6 py-8 max-w-6xl mx-auto">
        {
          error ? <p className="text-lg text-red-500 "> {error}</p>
            : loading ?
              <LoadingThreeDots />
              : data &&
              <>
                <div className="w-full px-4 py-3 rounded-lg border shadow-md text-zinc-700 ">
                  <p >placed in:</p>
                  <p ><AiOutlineCalendar className='inline' />{new Date(data.date).toLocaleString()}</p>
                  <p className="mt-2">total price : <span className="text-xl">${(data.subtotal + data.shippingCost) / 100 .toFixed(2)}</span></p>

                  <p className="mt-2">ship to:</p>
                  <p>{data.shippingAddress}</p>
                </div>

                <div className="w-full px-4 py-3  mt-4 rounded-lg border shadow-md text-zinc-700 [&>*:nth-child(n+3)]:border-t">
                  <p className="text-lg font-semibold text-zinc-600">status:</p>
                  <div className="flex justify-start items-center gap-6 flex-wrap ">

                    <p className='text-zinc-600 font-medium '>
                      <FaCircle className={` inline mb-1 mr-2 ${data.status === 'Pending' ? 'text-zinc-400'
                        : data.status === 'Processing' ? 'text-yellow-400'
                          : data.status === 'Shipping' ? 'text-blue-500'
                            : 'text-green-500'}`} />
                      {data.status}
                    </p>
                    <button className={`flex items-center justify-center border rounded-md w-32 py-1 px-3 ${data.status === 'Delivered' ? 'hidden' : ''} `} onClick={upgradeStatus}>
                      {
                        upgradeLoading ? <BsThreeDots className="text-2xl"/>
                          :
                          `to ${data.status === 'Pending' ? 'Processing' : data.status === 'Processing' ? 'Shipping' : 'Delivered'}`
                      }
                    </button>
                  </div>
                </div>

                <div className="w-full px-4 py-3 mt-4 rounded-lg border shadow-md text-zinc-700 [&>*:nth-child(n+3)]:border-t">
                  <p className="text-lg font-semibold text-zinc-600">items:</p>

                  {
                    data.productsElements.map((el, idx) => {
                      const details = data.products.find(c => c.id === el._id)
                      return (
                        <OrderItem product={el} details={details} key={idx} />
                      )
                    })
                  }

                </div>


              </>
        }
      </div>
    </>
  );
}

export default SellerSingleOrder;
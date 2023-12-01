import { AiOutlineReload } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import usePrivateAxios from '../../hooks/usePrivateAxios';
import useGetAxios from '../../hooks/useGetAxios';
import LoadingThreeDots from '../../components/LoadingThreeDots';
import { useMemo, useState } from 'react';

const SellerOrders = () => {
  const privateAxios = usePrivateAxios()
  const [reloading, setReloading] = useState(false)
  const [show, setShow] = useState('all')
  const { data, loading, error, setData } = useGetAxios('/seller/orders', privateAxios, [])
  const ordersClass = useMemo(() => {
    const obj = {
      all: 0,
      pending: 0,
      processing: 0,
      shipping: 0,
      delivered: 0
    }
    if (!data?.length > 0) {
      return obj
    } else {
      data.forEach(el => {
        obj.all += 1
        obj[el.status.toLowerCase()] += 1
      });
      return obj
    }

  }, [data])


  const reload = async () => {
    try {
      setReloading(true)
      const res = await (privateAxios.get('/seller/orders'))
      setData(res.data)
    } catch (error) {
      console.log(error);
    }
    setReloading(false)

  }

  return (
    <div className="grow max-w-6xl self-stretch mx-auto px-1 sm:px-4 py-4 mb-4 font-nunito">
      {
        error ? <p className="text-lg text-red-500 " > {error}</p>
          :
          loading ?
            <LoadingThreeDots />
            : data?.length > 0 ?
              <>

                <div className='flex justify-between'>
                  <h1 className="text-2xl text-primary">orders:</h1>
                  <button className='flex items-center px-5 rounded-lg text-lg text-green-400 hover:bg-green-400 hover:text-white' onClick={reload}>
                    Reload<AiOutlineReload className={`ml-2 ${reloading ? 'onfast' : ''}`} />
                  </button>
                </div>

                <div className="mt-3  max-w-fit flex-wrap flex items-center justify-between gap-4 text-zinc-600">
                  <p className={`px-2 rounded-md  transition-all duration-300 cursor-pointer ${show === 'all' ? 'bg-primary text-white' : ''}`} onClick={() => { setShow('all') }}>All: {ordersClass.all}</p>
                  <p className={`px-2 rounded-md  transition-all duration-300 cursor-pointer ${show === 'pending' ? 'bg-primary text-white' : ''}`} onClick={() => { setShow('pending') }}>Pending: {ordersClass.pending}</p>
                  <p className={`px-2 rounded-md  transition-all duration-300 cursor-pointer ${show === 'processing' ? 'bg-primary text-white' : ''}`} onClick={() => { setShow('processing') }}>Processing: {ordersClass.processing}</p>
                  <p className={`px-2 rounded-md  transition-all duration-300 cursor-pointer ${show === 'shipping' ? 'bg-primary text-white' : ''}`} onClick={() => { setShow('shipping') }}>Shipping: {ordersClass.shipping}</p>
                  <p className={`px-2 rounded-md  transition-all duration-300 cursor-pointer ${show === 'delivered' ? 'bg-primary text-white' : ''}`} onClick={() => { setShow('delivered') }}>Delivered: {ordersClass.delivered}</p>
                </div>

                <div className='grid w-full mt-5 rounded-xl overflow-hidden shadow-md border'>
                  <div className='w-full overflow-x-scroll  noscrollbar top-0 left-0'>
                    <table className='w-full px-2 min-w-max text-left'>
                      <thead className="border-b text-lg">
                        <tr>
                          {/* <th className="p-3 font-medium">order num</th> */}
                          <th className="p-3 font-medium">status</th>
                          <th className="p-3 font-medium">total</th>
                          <th className="p-3 font-medium">placed in</th>
                          <th className="p-3 font-medium">shipping to</th>
                          <th className="p-3 font-medium">total items</th>
                          <th className="p-3 font-medium">view</th>
                        </tr>

                      </thead>
                      <tbody className='[&>*:not(last-child)]:border-b'>
                        {
                          data.map(el => {
                            if (show !== 'all' && el.status.toLowerCase() !== show) {
                              return
                            } else {

                              return (
                                <tr key={el._id}>
                                  {/* <td className="p-3 text-primary">#795</td> */}
                                  <td className="p-3">
                                    <p className="px-4 rounded bg-primary text-white w-fit">{el.status}</p>
                                  </td>
                                  <td className="p-3 font-semibold">${((el.subtotal + el.shippingCost) / 100).toFixed(2)}</td>
                                  <td className="p-3 text-zinc-600">{new Date(el.date).toLocaleString()}</td>
                                  <td className="p-3 text-zinc-600 max-w-[270px] overflow-clip text-ellipsis">{el.shippingAddress}</td>
                                  <td className="p-3">{el.products?.reduce((p, e) => p + e.count, 0)}</td>
                                  <td className="p-3">
                                    <Link to={`/seller/orders/${el._id}`} className='py-3 text-blue-500 hover:text-primary'>{`view >`}</Link>
                                  </td>
                                </tr>
                              )
                            }
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                </div>

              </> :
              <div className='h-full flex items-center justify-center'>
                <p className='text-lg text-red-500 text-center '>you have no orders</p>
              </div>
      }
    </div>

  );
}
export default SellerOrders;
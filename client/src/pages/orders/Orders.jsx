import { Link } from 'react-router-dom'
import useGetAxios from '../../hooks/useGetAxios'
import usePrivateAxios from '../../hooks/usePrivateAxios'
import LoadingThreeDots from '../../components/LoadingThreeDots'

const Orders = () => {
  const privateAxios = usePrivateAxios()
  const { data, loading, error } = useGetAxios('/user/orders', privateAxios, [])

  return (
    <>
      <div className="grow max-w-6xl self-stretch mx-auto flex flex-col gap-4 px-1 sm:px-4 py-4 mb-4 font-nunito">
        {
          error ? <p className="text-lg text-red-500 " > {error}</p>
            :
            loading ?
              <LoadingThreeDots />
              : data?.length > 0 ?
                <>
                  {
                    data.map((el, idx) => {

                      return (
                        <div className=" max-w-3xl border rounded-lg p-4 shadow-md">
                          <div className='w-full flex justify-between items-start'>
                            <p className='mt-1 text-zinc-500'>{new Date(el.date).toLocaleString()}</p>
                            <p className='text-primary'>{(el.totalCost / 100).toFixed(2)}$</p>
                          </div>
                          <p className={`inline-block px-2 mt-2  rounded-md
                          ${el.status === 'Pending' ? 'bg-zinc-300' : el.status === 'Processing' ? 'bg-yellow-400' : el.status === 'Shipping' ? 'bg-blue-400 ' : 'bg-green-400'} `}>
                            {el.status}
                          </p>

                          <div className='flex flex-col sm:flex-row gap-6'>
                            <div className='border-t mt-2 grow min-w-[240px]'>
                              {
                                el.productsElements.map((el, idx) => {
                                  return (
                                    <div className='py-1 border-b' key={idx}><span>{idx + 1}</span> <p className='ml-2 inline-block'> {el.name} </p></div>
                                  )
                                })
                              }

                            </div>

                            <div className='flex sm:flex-col justify-end gap-3'>
                              <Link to={`/orders/${el._id}`} className='w-20 px-4 box-content py-1 border font-medium hover:text-primary border-primary rounded text-center' > Details</Link>
                            </div>

                          </div>
                        </div>
                      )
                    })
                  }
                </>

                :
                <div className='h-full flex items-center justify-center'>
                  <p className='text-lg text-red-500 text-center '>you have no orders</p>
                </div>

        }
      </div >
    </>
  );
}

export default Orders;


{/* <div className="w-1/5 max-w-[9rem] min-w-[5rem] per p-4 box-border">
          <img src={img} alt="" className=' w-full  rotateY aspect-[4/5] border rounded-md'  />
          <img src={shirt1} alt="" className= 'inset-4 absolute w-[calc(100%-32px)] trx1 rotateY aspect-[4/5] border rounded-md'  />
          <img src={img} alt="" className='inset-4 absolute w-[calc(100%-32px)] trx2 rotateY aspect-[4/5] border rounded-md'  />

        </div> */}
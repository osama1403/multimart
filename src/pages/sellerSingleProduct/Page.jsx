import { AiOutlineStar } from 'react-icons/ai'
import usePrivateAxios from '../../hooks/usePrivateAxios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useGetAxios from '../../hooks/useGetAxios';
import { BsThreeDots } from 'react-icons/bs'
import LoadingThreeDots from '../../components/LoadingThreeDots'

const SellerSingleProduct = () => {
  const privateaxios = usePrivateAxios()
  const { id } = useParams()
  const [x, setX] = useState(false)
  const { data, loading, error } = useGetAxios(`/seller/products/${id}`, privateaxios, [id, x])
  const [editStock, setEditStock] = useState(false)
  const [editStockData, setEditStockData] = useState({ mode: 'ADD', value: 0 })
  const [stockLoading, setStockLoading] = useState(false)
  const [err, setErr] = useState('')
  const serverUrl = process.env.REACT_APP_SERVER_URL


  const handleEditSubmit = async () => {
    if (editStockData.mode !== 'ALWAYS AVAILABLE' && editStockData.value === 0) {
      return setErr('please provide a value')
    }
    if (editStockData.mode !== 'SET' && data?.stock < 0) {
      return setErr('product is always available')
    }
    setErr('')
    setStockLoading(true)
    try {
      const data = {
        id,
        ...editStockData
      }
      await privateaxios.post('/seller/editstock', data)
      setX(!x)
      setEditStockData({ mode: 'ADD', value: 0 })
      setEditStock(false)
    } catch (error) {
      if (error.response) {
        setErr(error.response.data?.msg ? error.response.data?.msg : 'something went wrong')
      } else if (error.request) {
        setErr('no server response')
      }
    }
    setStockLoading(false)


  }

  return (

    <div className="grow min-h-screen px-2 sm:px-6 py-8 max-w-6xl mx-auto">
      {
        error ? <p className="text-lg text-red-500 "> {error}</p>
          : loading ?
            <LoadingThreeDots />
            : data &&
            <>

              <div className='w-full mb-4 px-2 py-3 border rounded-xl shadow-md '>
                <h1 className='text-2xl  font-semibold '>
                  {data.name}
                </h1>
              </div>

              <div className='w-full mb-4 px-2 py-3 border rounded-xl shadow-md '>
                <p>Added in: {new Date(data.date).toLocaleString()}</p>
                <p className='text-lg font-medium'>units sold: {data.ordersCount.total}</p>
                <p className=''>pending units: {data.ordersCount.pending}</p>
                <p className=''>processing units: {data.ordersCount.processing}</p>
                <p className=''>shipping units: {data.ordersCount.shipping}</p>
                <p className=''>delivered: {data.ordersCount.delivered}</p>

              </div>


              <div className='w-full px-2 py-4 border rounded-xl shadow-md '>


                {/* <p className='mt-2 text-green-400 text-lg'>in stock</p> */}

                {
                  data.stock !== 0 ?
                    <p className='mt-2 inline-block w-fit px-2 rounded bg-green-500 text-white  text-lg'>in stock</p>
                    : <p className='mt-2 inline-block w-fit px-2 rounded bg-red-500 text-white  text-lg'>out of stock</p>
                }
                <span className='ml-3'>{data.stock >= 0 ? data.stock : 'always available'}</span> <button className='text-xs border text-primary ml-8 border-primary rounded-full px-2 ' onClick={() => { setEditStock(p => !p) }}>Edit</button>
                {editStock &&
                  <div className='p-2 mt-2 border border-zinc-500 rounded-md w-full max-w-sm'>
                    <div className=''>
                      <input type="radio" name="stock" id="ADD" checked={editStockData.mode === 'ADD'} onChange={() => { setEditStockData(p => { return { ...p, mode: 'ADD' } }) }} className='mr-2' />
                      <label htmlFor="ADD">ADD</label>
                      <input type="text" value={editStockData.value}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value.match("^\\d{0,3}$")) {
                            setEditStockData(p => { return { ...p, value: value ? parseInt(value) : 0 } })
                          }
                        }}
                        disabled={editStockData.mode !== 'ADD'}
                        className={`${editStockData.mode !== 'ADD' ? 'hidden' : ''} ml-2 border rounded-md outline-none border-primary w-10 px-1 `}
                      />
                    </div>
                    <div className=''>
                      <input type="radio" name="stock" id="REMOVE" checked={editStockData.mode === 'REMOVE'} onChange={() => { setEditStockData(p => { return { ...p, mode: 'REMOVE' } }) }} className='mr-2' />
                      <label htmlFor="REMOVE">REMOVE</label>
                      <input type="text" value={editStockData.value}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value.match("^\\d{0,3}$")) {
                            setEditStockData(p => { return { ...p, value: value ? parseInt(value) : 0 } })
                          }
                        }}

                        disabled={editStockData.mode !== 'REMOVE'}
                        className={`${editStockData.mode !== 'REMOVE' ? 'hidden' : ''} ml-2 border rounded-md outline-none border-primary w-10 px-1`} />
                    </div>
                    <div className=''>
                      <input type="radio" name="stock" id="SET" checked={editStockData.mode === 'SET'} onChange={() => { setEditStockData(p => { return { ...p, mode: 'SET' } }) }} className='mr-2' />
                      <label htmlFor="SET">SET</label>
                      <input type="text" value={editStockData.value}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value.match("^\\d{0,3}$")) {
                            setEditStockData(p => { return { ...p, value: value ? parseInt(value) : 0 } })
                          }
                        }}
                        disabled={editStockData.mode !== 'SET'}
                        className={`${editStockData.mode !== 'SET' ? 'hidden' : ''} ml-2 border rounded-md outline-none border-primary w-10 px-1`}
                      />
                    </div>
                    <div className=''>
                      <input type="radio" name="stock" id="ALWAYS AVAILABLE" checked={editStockData.mode === 'ALWAYS AVAILABLE'} onChange={() => { setEditStockData(p => { return { ...p, mode: 'ALWAYS AVAILABLE' } }) }} className='mr-2' />
                      <label htmlFor="ALWAYS AVAILABLE" >ALWAYS AVAILABLE</label>
                    </div>
                    <p className='text-red-500 '>{err}</p>
                    <button className='border  border-primary rounded-md px-2 w-24' onClick={handleEditSubmit}> {stockLoading ? <BsThreeDots className='mx-auto text-primary text-2xl' /> : 'submit'} </button>
                  </div>

                }

                <div className='mt-2 flex items-center text-xl font font-nunito text-primary'>
                  <AiOutlineStar className='inline-block mr-2' />
                  <p className='inline-block'>{data.totalRatingCount === 0 ? 0 : (data.totalRating / data.totalRatingCount).toFixed(1)}</p>
                </div>

                <p className='text-xl mt-2 '>
                  Price: ${(data.price / 100).toFixed(2)}
                </p>

                {/* description */}
                <p className='mt-4'>
                  {data.description}
                </p>
                {/* specifications */}
                <p className='mt-4'>
                  <h2 className='text-xl'>Specifications:</h2>
                  <ul className='list-disc list-inside'>
                    {
                      data.specifications.map((el, idx) => {
                        return (
                          <li key={idx}>{el}</li>
                        )
                      })
                    }
                  </ul>
                </p>

                {/* Customization */}
                <div className='mt-4'>

                  <h2 className='text-xl'>Customizations:</h2>
                  {
                    data.customizations.map((el, idx) => {
                      return (
                        <div key={idx} className='mb-2 pl-2'>
                          <p className='text-lg font-medium'>{el.name}:</p>
                          <div className='flex flex-wrap gap-10 items-center justify-s max-w-lg w-full '>
                            {
                              el.options.map((option, optidx) => <p className='bg-slate-200 rounded-full px-3 pb-[2px] font-semibold' key={optidx}>{option}</p>)
                            }
                          </div>
                        </div>
                      )
                    })
                  }
                </div>


                <h2 className='mt-4 mb-2 text-xl'>images:</h2>
                {data.images.length > 0 ?
                  <div className='flex flex-wrap space-x-3'>
                    {
                      data.images.map((el, idx) => {
                        return <img src={`${serverUrl}/api/image/${el}`} alt="prod image" key={idx} className='w-24 h-24 rounded object-cover border' />
                      })
                    }
                  </div>
                  : <p>no images</p>
                }


              </div>
            </>
      }
    </div>
  );
}

export default SellerSingleProduct;
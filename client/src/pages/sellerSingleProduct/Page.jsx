import { AiOutlineStar } from 'react-icons/ai'
import usePrivateAxios from '../../hooks/usePrivateAxios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SellerSingleProduct = () => {
  const privateaxios = usePrivateAxios()
  const { id } = useParams()

  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const abort = new AbortController()
    const fetchData = async () => {
      try {
        const response = await privateaxios.get(`/seller/products/${id}`, { signal: abort.signal })
        setData(response.data)
      } catch (error) {
        if (error.response) {
          setError(error.response.data?.msg ? error.response.data?.msg : 'something went wrong')
        } else if (error.request) {
          setError('no server response')
        }
      }
    }
    fetchData()
    return (() => {
      abort.abort()
    })
  }, [privateaxios, id])

  return (
    <div className="grow min-h-screen px-2 sm:px-6 py-8 max-w-6xl mx-auto">

      {error && <p className='text-lg font-semibold'>{error}</p>}

      {data &&

        <div className='w-full px-2 py-6 border rounded-xl shadow-md max-w-3xl'>

          <h1 className='text-2xl  font-semibold '>
            {data.name}
          </h1>

          {/* <p className='mt-2 text-green-400 text-lg'>in stock</p> */}

          {
            data.stock !== 0 ?
              <p className='mt-2 inline-block w-fit px-2 rounded bg-green-500 text-white  text-lg'>in stock</p>
              : <p className='mt-2 inline-block w-fit px-2 rounded bg-red-500 text-white  text-lg'>out of stock</p>
          }
          <span className='ml-3'>{data.stock >= 0 ? data.stock : 'always available'}</span>


          <div className='mt-2 flex items-center text-xl font font-nunito text-primary'>
            <AiOutlineStar className='inline-block mr-2' />
            <p className='inline-block'>{data.rating}</p>
          </div>

          <div className='mt-2 flex items-center space-x-3'>
            <p className='line-through '>
              {data.price.toFixed(2)}
            </p>
            <p className='text-xl  '>
              {data.price.toFixed(2)}
            </p>
          </div>
          {/* description */}
          <p className='mt-4'>
            {data.description}
          </p>
          {/* specifications */}
          <p className='mt-4'>
            <h2>Specifications:</h2>
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
          <div className='mt-5'>

            <h2>Customizations:</h2>
            {
              data.customizations.map((el, idx) => {
                return (
                  <div key={idx}>
                    <p className='text-lg font-semibold mb-1'>{el.name}:</p>
                    <div className='flex flex-wrap gap-10 items-center justify-s max-w-lg w-full '>
                      {
                        el.options.map((option, optidx) => <p key={optidx}>{option}</p>)
                      }
                    </div>
                  </div>
                )
              })
            }
          </div>


          <h2 className='mt-5 mb-2'>images:</h2>
          {
              <div className='flex flex-wrap space-x-3'>
                {
                  data.images.map((el,idx)=>{
                    return <img src={`http://127.0.0.1:5000/${el}`} alt="prod image" key={idx} className='w-24 h-24 rounded object-cover border'/>
                  })
                }
              </div>
          }


        </div>
      }
    </div>
  );
}

export default SellerSingleProduct;
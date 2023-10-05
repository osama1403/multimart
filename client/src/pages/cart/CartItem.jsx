import { useState } from 'react'
import prodPlaceholder from '../../assets/images/prodPlaceholder.jpg'
import usePrivateAxios from '../../hooks/usePrivateAxios'
import { BsThreeDots } from 'react-icons/bs'
const serverUrl = process.env.REACT_APP_URL

const CartItem = ({ el, customizations, setData }) => {
  const privateAxios = usePrivateAxios()
  const [loadingRemove, setLoadingRemove] = useState(false)

  const handleRemove = async () => {
    const id = el._id
    setLoadingRemove(true)
    try {
      const res = await privateAxios.post('/user/removefromcart', { id, refresh: true })
      setData(res.data)
    } catch (err) {
      console.log('err:' + err.message);
      setLoadingRemove(false)
    }
  }

  return (
    <div className="w-full border px-2 md:px-4 py-4 my-4 hyphens-auto" >
      {/* <h2 className="text-lg font-semibold md:hidden"> {el.name}</h2> */}
      <div className="flex  flex-row flex-wrap  gap-3 items-stretch my-3">
        <img src={el.images[0] ? serverUrl + '/' + el.images[0] : prodPlaceholder} alt="" className='border self-center aspect-square w-32 md:w-36 mx-auto' />
        <div className='grow flex gap-3 justify-between items-center min-w-[275px]'>
          <div className='min-w-[135px] h-full md:min-w-[256px] w-min grow '>
            <div className=' mb-2 '>
              <h2 className='w-full text-lg font-semibold break-words block'> {el.name}</h2>
              <div className='text-center w-fit '>
                {
                  el.stock !== 0 ?
                    <p className='bg-green-400 text-white text-sm inline-block px-1 rounded'>Available</p>
                    : <p className='bg-red-400 text-white text-sm px-1 rounded'>Not Available</p>
                }
                <p className=' ml-2 text-sm inline-block'>{el.stock >= 0 ? el.stock + ' left' : 'always'}</p>
              </div>
            </div>


            {
              el.customizations?.map((el, idx) => {
                return (
                  <p key={idx}><span className='font-semibold'>{`${el.name}: `}</span>{customizations[el.name]}</p>
                )
              })
            }

          </div>
          <p className='self-start text-primary'>{`$${(el.price / 100).toFixed(2)}`}</p>

        </div>
      </div>
      <div className=' w-fit mx-auto flex flex-wrap items-center'>
        <button className='w-32 h-8 inline-flex items-center justify-center bg-zinc-200 hover:bg-slate-300 p-1 rounded-md  m-1' onClick={handleRemove}>{loadingRemove ? <BsThreeDots className='text-2xl' /> : 'Remove'}</button>
        <button className='w-32 h-8 inline-flex items-center justify-center bg-zinc-200 hover:bg-slate-300 p-1 rounded-md  m-1'>Edit</button>
      </div>

    </div>
  );
}

export default CartItem;
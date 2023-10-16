import { useState ,memo} from 'react'
import prodPlaceholder from '../../assets/images/prodPlaceholder.jpg'
import usePrivateAxios from '../../hooks/usePrivateAxios'
import { BsThreeDots } from 'react-icons/bs'
import { FaPlus, FaMinus } from 'react-icons/fa';

const serverUrl = process.env.REACT_APP_URL

const CartItem = ({ el, customizations, setData, elcount , setelcount }) => {
  console.log('item');
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

  const setcount = (n) => {
    if (!isNaN(n) && n !== '' && n > 0 && n < 1000) {
      setelcount(p => { return { ...p, [el._id]: n } })
    }
  }

  return (
    <div className="w-full border p-3 my-4 hyphens-auto" >
      {/* <h2 className="text-lg font-semibold md:hidden"> {el.name}</h2> */}
      <div className="flex  flex-col sm:flex-row gap-3 items-stretch mb-3">
        <img src={el.images[0] ? serverUrl + '/' + el.images[0] : prodPlaceholder} alt="" className='border self-center aspect-square w-36 mx-auto' />
        <div className='grow flex gap-3 justify-between items-center min-w-[250px]'>
          <div className='min-w-[135px] h-full md:min-w-[256px] w-min grow grid grid-cols-1 break-words '>
            <div className=' mb-2 '>
              <h2 className='w-full text-lg font-semibold  block'>{el.name}</h2>
              <div className='text-center w-fit '>
                {
                  el.stock !== 0 ?
                    <p className='bg-green-500 text-white text-sm inline-block px-1 rounded'>Available</p>
                    : <p className='bg-red-500 text-white text-sm inline-block px-1 rounded'>Not Available</p>
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
          <div className='self-start'>
            <p className=' text-primary text-center'>{`$${(el.price / 100).toFixed(2)}`}</p>
            <p className='text-center'>x{elcount ? elcount : 1}</p>
            <p className=' text-primary text-center'>{`$${((el.price * (elcount ? elcount : 1)) / 100).toFixed(2)}`}</p>
          </div>

        </div>
      </div>
      <div className=' w-full mx-auto flex flex-wrap justify-center items-center gap-2'>
        {/* <div className=' w-full '> */}

        {/* quantity */}
        <div className='w-fit flex items-center gap-1'>
          <button className='text-primary p-1 border rounded-md '
            onClick={() => {
              if (elcount) {
                setcount(elcount + 1)
              } else {
                setcount(2)
              }
            }}><FaPlus /></button>

          <input type="text" id="count" value={elcount ? elcount : 1}
            onChange={(e) => {
              const value = e.target.value
              if (value.match("^\\d{0,3}$")) {
                setcount(parseInt(value))
              }
            }}
            className='outline-none text-center w-8 border rounded-md '
          />

          <button className='text-primary p-1 border rounded-md '
            onClick={() => {
              if (elcount) {
                setcount(elcount - 1)
              }
            }}><FaMinus /></button>

        </div>

        <button className='w-32 h-8 ml-auto flex items-center justify-center bg-zinc-200 hover:bg-slate-300 p-1 rounded-md ' onClick={handleRemove}>{loadingRemove ? <BsThreeDots className='text-2xl' /> : 'Remove'}</button>
        {/* <button className='w-32 h-8 inline-flex items-center justify-center bg-zinc-200 hover:bg-slate-300 p-1 rounded-md '>Edit</button> */}
      </div>

    </div>
  );
}

export default memo(CartItem);
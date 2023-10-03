import { useState } from 'react'
import prodPlaceholder from '../../assets/images/prodPlaceholder.jpg'
import usePrivateAxios from '../../hooks/usePrivateAxios'
import useAuth from '../../hooks/useAuth'
import { BsThreeDots } from 'react-icons/bs'
const serverUrl = process.env.REACT_APP_URL

const CartItem = ({ el, customizations, setData }) => {
  const privateAxios = usePrivateAxios()
  const { setAuth } = useAuth()
  const [loadingRemove, setLoadingRemove] = useState(false)

  const handleRemove = async () => {
    const id = el._id
    try {
      setLoadingRemove(true)
      await privateAxios.post('/user/removefromcart', { id })
      setData(p => { return ({ ...p, cart: p.cart.filter(el => el.id !== id), products: p.products.filter(el => el._id !== id) }) })
      setAuth(p => { return ({ ...p, userData: { ...p.userData, cart: p.userData.cart.filter(el => el.id !== id) } }) })

    } catch (err) {
      console.log(err.message);
    }
    setLoadingRemove(false)
  }

  return (
    <div className="w-full border p-4 my-4 hyphens-auto">
      <h2 className="text-lg font-semibold md:hidden"> {el.name}</h2>
      <div className="flex  flex-row flex-wrap sm:flex-nowrap gap-3 items-stretch my-3">
        <img src={el.images[0] ? serverUrl + '/' + el.images[0] : prodPlaceholder} alt="" className='border self-center aspect-square w-32 md:w-36' />
        <div className='grow flex gap-3 justify-between items-center'>
          <div className='min-w-[135px]  md:min-w-[256px] w-min grow '>
            <h2 className='w-full mb-2 text-lg font-semibold break-words hidden  md:block'> {el.name}</h2>
            {
              el.customizations?.map((el, idx) => {
                return (
                  <p key={idx}><span className='font-semibold'>{`${el.name}: `}</span>{customizations[el.name]}</p>
                )
              })
            }
          </div>
          <p className='self-start text-primary'>{`$${el.price.toFixed(2)}`}</p>

        </div>
      </div>
      <div className=' w-fit mx-auto flex items-center'>
        <button className='w-32 h-8 inline-flex items-center justify-center bg-zinc-200 hover:bg-slate-300 p-1 rounded-md  m-1' onClick={handleRemove}>{loadingRemove ? <BsThreeDots className='text-2xl' /> : 'Remove'}</button>
        <button className='w-32 h-8 inline-flex items-center justify-center bg-zinc-200 hover:bg-slate-300 p-1 rounded-md  m-1'>Edit</button>
      </div>

    </div>
  );
}

export default CartItem;
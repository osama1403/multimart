import shirt1 from '../../assets/shirt1.jpg'
import useGetAxios from '../../hooks/useGetAxios';
import usePrivateAxios from '../../hooks/usePrivateAxios';
import LoadingThreeDots from '../../components/LoadingThreeDots';
import prodPlaceholder from '../../assets/images/prodPlaceholder.jpg'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
const serverUrl = process.env.REACT_APP_URL

const Cart = () => {
  const privateAxios = usePrivateAxios()
  const [cartInfo, setCartInfo] = useState({})
  const [data, loading, error] = useGetAxios('/user/cart', privateAxios, [])
  const { auth, setAuth } = useAuth()
  const [syncedCart, setSyncedCart] = useState(false)
  const [adress, setAdress] = useState('')

  const [checkout, setCheckout] = useState(false)


  useEffect(() => {
    if (data) {
      console.log('set auth');
      setAuth({ ...auth, userData: { ...auth.userData, cart: data.cart } })
      setSyncedCart(true)
    }
  }, [data])

  useEffect(() => {
    // avoid extra rerender
    if (data && !syncedCart) {
      return
    }
    //
    if (data?.products?.length >= 0) {
      const taxRate = 8
      const subtotal = data.products.reduce((p, el) => { return (auth.userData.cart.some((e) => e.id === el._id) ? p + el.price : p) }, 0)
      console.log("subtotal : " + subtotal);
      const tax = subtotal * taxRate / 100
      const estShCost = 60
      const cartdata = {
        elements: `# ${auth.userData.cart.length}`,
        subtotal: `$ ${subtotal}`,
        estShCost: `$ ${estShCost.toFixed(2)}`,
        taxRate: taxRate,
        tax: `$ ${tax}`,
        total: (subtotal + tax + estShCost).toFixed(2)

      }
      console.log(subtotal + ' tax : ' + tax + ' estsh: ' + estShCost + ' tot: ' + subtotal + tax + estShCost);
      setCartInfo(cartdata)

    } else {
      const cartdata = {
        elements: `# -`,
        subtotal: `$ -`,
        estShCost: `$ -`,
        taxRate: '',
        tax: `$ -`,
        total: '-'
      }
      setCartInfo(cartdata)
    }

  }, [data, auth, syncedCart])

  useEffect(() => {
    if (checkout) {
      document.body.style.overflow = 'clip';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [checkout])


  return (
    <div className="max-w-6xl relative grow p-1 sm:p-4 mx-auto flex flex-col lg:flex-row flex-wrap gap-4 ">
      <div className=" grow ">
        {error ?
          <div className="flex w-full h-[calc(100vh-64px)] justify-center items-center ">
            <p className="text-xl font font-semibold text-red-500">{error} </p>
          </div>
          :
          loading ?
            <LoadingThreeDots />
            : data?.cart?.length > 0 ?
              <>
                <h1 className="text-2xl p-3 rounded-xl bg-zinc-100 "> your cart:</h1>
                {
                  data.products.map((el) => {
                    const cus = data.cart.find(e => e.id === el._id).customizations
                    return (
                      <div className="w-full border p-4 my-4 hyphens-auto">
                        <h2 className="text-lg font-semibold md:hidden"> {el.name}</h2>
                        <div className="flex  flex-row flex-wrap sm:flex-nowrap gap-3 items-stretch my-3">
                          <img src={el.images[0] ? serverUrl + '/' + el.images[0] : prodPlaceholder} alt="" className='border self-center aspect-square w-32 md:w-36' />
                          <div className='grow flex gap-3 justify-between items-center'>
                            <div className='min-w-[135px]  md:min-w-[256px] w-min grow '>
                              <h2 className='w-full mb-2 text-lg font-semibold break-words hidden  md:block'> {el.name}</h2>
                              <div className=''>
                                {
                                  el.customizations?.map((el, idx) => {
                                    return (
                                      <p key={idx}><span className='font-semibold'>{`${el.name}: `}</span>{cus[el.name]}</p>
                                    )
                                  })
                                }

                              </div>
                            </div>
                            <p className='self-start text-primary'>{`$${el.price}`}</p>

                          </div>
                        </div>
                        <div className=' w-fit mx-auto'>
                          <button className='w-32 bg-zinc-200 hover:bg-slate-300 p-1 rounded-md  m-1'>Remove</button>
                          <button className='w-32 bg-zinc-200 hover:bg-slate-300 p-1 rounded-md  m-1'>Edit</button>
                        </div>

                      </div>
                    )
                  })
                }
              </>
              :
              <div className="flex  h-[calc(100vh-64px)] justify-center items-center ">
                <p className="text-xl font font-semibold text-red-500"> Your cart is empty </p>
              </div>
        }
      </div>

      {/* side box */}

      {/* <div className=' grow w-full   max-w-xs   relative'> */}
      <div className=' max-w-sm min-w-fit w-full lg:w-auto  lg:grow relative mx-auto '>
        <div className=' sticky top-20 w-full  bg-zinc-800 rounded-lg py-6 px-3  text-white font-light flex flex-col space-y-5'>
          <h1 className='text-xl font-medium '>SUMMARY:</h1>
          {

            <>
              <div className='flex justify-between pb-1 border-b border-zinc-400 '>
                <p >elements :</p>
                <p>{cartInfo.elements}</p>
              </div>
              <div className='flex md justify-between pb-1 border-b border-zinc-400 '>
                <p >subtotal :</p>
                <p> {cartInfo.subtotal}</p>
              </div>
              <div className='flex justify-between items-center pb-1 gap-3 border-b border-zinc-400 '>
                <p >estimated shipping cost :</p>
                <p className='whitespace-nowrap'>{cartInfo.estShCost}</p>
              </div>
              <div className='flex justify-between pb-1 border-b border-zinc-400 '>
                <p>Tax : {cartInfo.taxRate}%</p>
                <p>{cartInfo.tax}</p>
              </div>
              <div className='flex justify-between pb-1 border-b border-zinc-400 text-lg font-normal '>
                <p >TOTAL :</p>
                <p>{cartInfo.total}</p>
              </div>
              <button className='w-full max-w-[240px] mx-auto py-1 rounded-md hover: bg-primary text-lg text-white font-normal font-nunito ' onClick={() => { setCheckout(true) }}> Checkout</button>
            </>

          }

        </div>
      </div>


      {
        (data && auth.userData.cart.length !== 0) &&

        <div className={`fixed  py-10 px-4 inset-0 w-full ${checkout ? 'flex' : 'hidden'} items-center justify-center backdrop-blur z-30`}>
          <div className='w-full p-3 rounded-xl relative max-w-xl bg-white border border-primary   '>
            <button className='absolute -top-3 -right-3 rounded-full text-3xl text-primary bg-slate-200' onClick={() => { setCheckout(false) }}><AiOutlineCloseCircle /></button>
            <p className='text-zinc-500 text-lg'>items:</p>
            <ol className='list-decimal list-inside '>
              {
                data.products.filter((el) => auth.userData.cart.some((e) => e.id === el._id)).map((el, idx) => {
                  return (
                    <li className='flex justify-between items-center px-3 even:bg-slate-200 my-1' key={idx}>
                      <p className='text-zinc-700 font-medium '>{el.name}</p>
                      <p>{el.price}</p>

                    </li>
                  )

                })
              }
            </ol>
            <p className='text-zinc-500 text-lg mt-4'>total: {cartInfo.total}$</p>
            <div className='flex items-center flex-wrap space-x-3 mt-4'>
              <p className='text-zinc-500 text-lg'>ship to:</p>
              {auth.userData.addresses.map((el, idx) => {
                return (
                  <button className={`border px-2 rounded-full ${adress === auth.userData.addresses[idx] ? 'border-primary text-primary' : 'border-zinc-400'} `}
                    onClick={() => { setAdress(el) }}>
                    address #{idx}
                  </button>
                )
              })}

            </div>
            <input type="text" name="adress" id="adress" value={adress}
              className='w-full outline-none text-zinc-600 px-3 py-1 mt-2 border border-zinc-400 rounded-md'
              onChange={(e) => { setAdress(e.target.value) }} />
            <button className='py-1 px-3 my-4 mx-auto block text-primary border border-primary rounded-full text-lg font-semibold'>Buy Now</button>
          </div>
        </div>
      }

    </div>
  );
}

export default Cart;
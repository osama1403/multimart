import useGetAxios from '../../hooks/useGetAxios';
import usePrivateAxios from '../../hooks/usePrivateAxios';
import LoadingThreeDots from '../../components/LoadingThreeDots';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import CartItem from './CartItem';
import useAuth from '../../hooks/useAuth';

const Cart = () => {
  const privateAxios = usePrivateAxios()
  const { data, loading, error, setData } = useGetAxios('/user/cart', privateAxios, [])
  const { auth, setAuth } = useAuth()
  const [cartInfo, setCartInfo] = useState({})
  const [address, setAddress] = useState('')
  const [checkout, setCheckout] = useState(false)
  const [checkoutAlert, setCheckoutAlert] = useState('')
  const [cartAlert, setCartAlert] = useState('')

  useEffect(() => {
    // console.log("data: " +data);
    if (data) {
      console.log('set auth');
      setAuth((p) => { return ({ ...p, userData: { ...p.userData, cart: data.cart } }) })
    }
  }, [data, setAuth])

  useEffect(() => {
    if (data?.products?.length >= 0) {
      const taxRate = 8
      const subtotal = data.products.reduce((p, el) => p + el.price, 0)
      console.log("subtotal : " + subtotal);
      const tax = (subtotal * taxRate / 100)
      const estShCost = 6000
      const cartdata = {
        elements: `# ${data.cart.length}`,
        subtotal: `$ ${(subtotal / 100).toFixed(2)}`,
        estShCost: `$ ${(estShCost / 100).toFixed(2)}`,
        taxRate: taxRate,
        tax: `$ ${(tax / 100).toFixed(2)}`,
        total: `$ ${((subtotal + tax + estShCost) / 100).toFixed(2)}`
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

  }, [data])

  useEffect(() => {
    if (checkout) {
      document.body.style.overflow = 'clip';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [checkout])

  const handleCheckout = () => {
    setCartAlert('')
    if (data.products.some(el => el.stock === 0)) {
      setCartAlert('one of the products is not available')
    } else {
      setCheckout(true)
    }
  }


  const handleSubmit = async () => {
    if (!address) {
      setCheckoutAlert('please provide shipping address')
      return
    }
    setCheckoutAlert('')
    try {
      await privateAxios.post('/user/placeorder', { address })
    } catch (err) {

    }

  }


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
                  data.products.map((el, idx) => {
                    const cus = data.cart.find(e => e.id === el._id).customizations
                    return (
                      <div key={el._id}>
                        <CartItem el={el} customizations={cus} setData={setData} />
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
          <button className='w-full max-w-[240px] mx-auto py-1 rounded-md hover: bg-primary text-lg text-white font-normal font-nunito ' onClick={handleCheckout}> Checkout</button>
          <p className='text-red-500'>{cartAlert}</p>
        </div>
      </div>


      {/* checkout modal */}
      {

        (data && data.cart.length !== 0) &&

        <div className={`fixed py-10 px-4 top-0 left-0 overflow-y-auto h-screen w-full ${checkout ? 'grid' : 'hidden'}  grid-cols-1 backdrop-blur z-30`}>
          <div className='w-full m-auto p-3 rounded-xl relative max-w-xl bg-white border border-primary '>
            <button className='absolute -top-3 -right-3 rounded-full text-3xl text-primary bg-zinc-200' onClick={() => { setCheckout(false) }}><AiOutlineCloseCircle /></button>
            <p className='text-zinc-500 text-lg'>items:</p>
            <ol className='list-decimal list-inside '>
              {
                data.products.map((el, idx) => {
                  return (
                    <li className='flex justify-between items-center px-3 even:bg-zinc-100 my-1' key={idx}>
                      <p className='text-zinc-700 font-medium '>{el.name}</p>
                      <p>${(el.price / 100).toFixed(2)}</p>

                    </li>
                  )

                })
              }
            </ol>
            <p className='text-zinc-500 text-lg mt-4'>total: {cartInfo.total}</p>
            <div className='flex items-center flex-wrap gap-2 mt-4'>
              <p className='text-zinc-500 text-lg'>ship to:</p>
              <div className='space-x-2'>
                {auth.userData.addresses.map((el, idx) => {
                  return (
                    <button className={`border px-2 rounded-full ${address === auth.userData.addresses[idx] ? 'border-primary text-primary' : 'border-zinc-400'} `}
                      onClick={() => { setAddress(el) }} key={idx}>
                      address #{idx + 1}
                    </button>
                  )
                })}
              </div>

            </div>
            <input type="text" name="address" id="address" value={address}
              className='w-full outline-none text-zinc-600 px-3 py-1 my-2 border border-zinc-400 rounded-md'
              onChange={(e) => { setAddress(e.target.value) }} />
            <p className='text-sm text-red-600'>{checkoutAlert}</p>
            <button className='py-1 px-3 my-4 mx-auto block text-primary border border-primary rounded-full text-lg font-semibold' onClick={handleSubmit}>Buy Now</button>
          </div>
        </div>
      }

    </div>
  );
}

export default Cart;
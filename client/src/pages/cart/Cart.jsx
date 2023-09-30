import shirt1 from '../../assets/shirt1.jpg'
import useGetAxios from '../../hooks/useGetAxios';
import usePrivateAxios from '../../hooks/usePrivateAxios';
import LoadingThreeDots from '../../components/LoadingThreeDots';
import prodPlaceholder from '../../assets/images/prodPlaceholder.jpg'
const serverUrl = process.env.REACT_APP_URL

const Cart = () => {
  const privateAxios = usePrivateAxios()
  const [data, loading, error] = useGetAxios('/user/cart', privateAxios, [])

  return (
    <div className="max-w-6xl grow p-1 sm:p-4 mx-auto flex flex-row flex-wrap gap-4 ">
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
                          <div className='grow   flex gap-3 justify-between items-center'>
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
      <div className=' max-w-sm min-w-fit w-auto grow relative mx-auto '>
        <div className=' sticky top-20 w-full  bg-zinc-800 rounded-lg py-6 px-3  text-white font-light flex flex-col space-y-5'>
          <h1 className='text-xl font-medium '>SUMMARY:</h1>
          <div className='flex justify-between pb-1 border-b border-zinc-400 '>
            <p >elements :</p>
            <p># 4</p>
          </div>
          <div className='flex md justify-between pb-1 border-b border-zinc-400 '>
            <p >subtotal :</p>
            <p>$ 473.99</p>
          </div>
          <div className='flex justify-between items-center pb-1 gap-3 border-b border-zinc-400 '>
            <p >estimated shipping cost :</p>
            <p className='whitespace-nowrap'>$ 60.00</p>
          </div>
          <div className='flex justify-between pb-1 border-b border-zinc-400 '>
            <p>Tax :</p>
            <p>$ 68.89</p>
          </div>
          <div className='flex justify-between pb-1 border-b border-zinc-400 text-lg font-normal '>
            <p >TOTAL :</p>
            <p>$ 602.88</p>
          </div>
          <button className='w-full max-w-[240px] mx-auto py-1 rounded-md hover: bg-primary text-lg text-white font-normal font-nunito '> Checkout</button>

        </div>
      </div>



    </div>
  );
}

export default Cart;
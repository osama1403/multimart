import img from '../../assets/prod.jpeg'
import ProductCard from '../../components/ProductCard'
import useGetAxios from '../../hooks/useGetAxios';
import axios from '../../api/axios'
import { useParams,Link } from 'react-router-dom'
import LoadingThreeDots from '../../components/LoadingThreeDots';
import profilePlaceholder from '../../assets/images/profilePlaceholder.png';
import coverPlaceholder from '../../assets/images/coverPlaceholder.png';
import { BsChatDots } from 'react-icons/bs';

const SellerPage = () => {
  const serverUrl = process.env.REACT_APP_URL

  const { id } = useParams()
  const { data, loading, error } = useGetAxios(`/products/seller/${id}`, axios, [])


  return (
    <>

      {error ? <p className="text-lg text-red-500"> {error}</p>
        :
        loading ?
          <LoadingThreeDots />
          : data &&
          <div className="grow max-w-6xl p-1 self-stretch mx-auto  mb-4 font-nunito">
            <div className="w-full border py-4 sm:py-0 rounded-2xl shadow-md overflow-hidden">
              <img src={(data?.coverPicture) ? serverUrl + '/' + data?.coverPicture : coverPlaceholder} alt="" className='hidden sm:block w-full aspect-[3/1] object-cover' />
              <div className='relative sm:mb-16'>
                <div className='sm:absolute sm:-top-24 sm:left-20 flex flex-col sm:flex-row justify-center items-center gap-2 sm:items-end sm:w-fit'>
                  <div className='pfp before:hidden after:hidden sm:before:block sm:after:block z-0 relative w-40 h-40  '>
                    <img src={(data?.profilePicture) ? serverUrl + '/' + data?.profilePicture : profilePlaceholder} alt="" className='object-cover bg-white border-white sm:border-4 rounded-full w-full h-full' />
                  </div>
                  <div className='flex flex-col sm:flex-row gap-2 items-center sm:pb-8 sm:pl-1'>
                    <h1 className='text-xl font-semibold '>{data?.shopName}</h1>
                    <Link to={`/chat/${id}`} className='outline-none text-zinc-600 hover:text-primary text-xl '><BsChatDots /></Link>
                  </div>
                </div>
              </div>
              <p className='text-zinc-700 max-w-xl px-4 py-2 text- font-medium '>{data?.bio}</p>
            </div>
            <div className='w-full rounded-2xl shadow-md mt-3 px-4 pb-7 pt-3 border'>
              <p className='text-lg font-semibold text-primary opacity-80 mb-4'>products:</p>
              <div className="grid grid-flow-row grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-3 md:gap-6 w-full mx-auto ">
                {
                  data.products.map(el => {
                    return <ProductCard data={el} key={el._id} />
                  })
                }
              </div>
            </div>

          </div>

      }
    </>

  );
}

export default SellerPage;
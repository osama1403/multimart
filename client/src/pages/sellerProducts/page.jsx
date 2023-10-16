import prodPlaceholder from '../../assets/images/prodPlaceholder.jpg'
import { Link } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa';
import usePrivateAxios from '../../hooks/usePrivateAxios';
import useGetAxios from '../../hooks/useGetAxios';
import LoadingThreeDots from '../../components/LoadingThreeDots';

const SellerProducts = () => {
  const privateaxios = usePrivateAxios()
  const { data, loading, error } = useGetAxios('/seller/products', privateaxios, [])


  return (
    <>
      {
        error ? <p className="text-lg text-red-500 "> {error}</p>
          : loading ?
            <LoadingThreeDots />
            : data &&


            <div className="grow min-h-screen px-2 sm:px-6 py-8 max-w-6xl mx-auto">
              <div className='flex justify-between items-center'>
                <h1 className="text-2xl font-semibold text-primary">Your Products: <span className="text-green-300">{data.length}</span></h1>
                <Link to='/seller/addproduct' className=' flex items-center py-1 px-3 mr-6 text-zinc-600 text-lg border hover:border-primary rounded hover:text-primary'><span className='mr-2'>Add Product</span> <FaPlus /></Link>
              </div>

              {/* <div className="flex flex-col overflow-x-auto mt-5 [&>*:not(last-child)]:border-b"> */}
              <div className='grid w-full mt-5 min-w-0 rounded-xl overflow-hidden shadow-md border'>
                <div className='w-full overflow-x-auto  noscrollbar'>
                  <table className='w-full min-w-max text-left'>
                    <thead className='border-b text-lg'>
                      <tr >
                        <th scope="col" className="p-3 font-medium">product</th>
                        <th scope="col" className="p-3 font-medium">selling for</th>
                        <th scope="col" className="p-3 font-medium">stock</th>
                        <th scope="col" className="p-3 font-medium">units sold</th>
                        <th scope="col" className="p-3 font-medium">Go to</th>
                      </tr>
                    </thead>
                    <tbody className='[&>*:not(last-child)]:border-b'>
                      {
                        loading ?
                          <tr>
                            <td colSpan={5} className='text-center p-3 text-lg'>Loading ...</td>
                          </tr>
                          :
                          data?.length > 0 ?
                            data.map((el, idx) => {
                              return (
                                <tr key={idx}>
                                  <td className='p-3'>
                                    <div className='flex items-center'>
                                      <img src={el.images[0] ? `http://127.0.0.1:5000/${el.images[0]}` : prodPlaceholder} alt="prod img" className="w-16 h-16 aspect-square object-cover rounded " />
                                      <p className="text-base  ml-2 max-w-[150px]">{el.name}</p>
                                    </div>
                                  </td>
                                  <td className='p-3'>
                                    {`$${(el.price/100).toFixed(2)}`}
                                  </td>
                                  <td className='p-3'>
                                    <div className='text-center w-fit '>
                                      {
                                        el.stock != 0 ?
                                          <p className='bg-green-400 text-white text-sm px-1 rounded'>Available</p>
                                          : <p className='bg-red-400 text-white text-sm px-1 rounded'>Not Available</p>
                                      }
                                      <p className=''>{el.stock >= 0 ? el.stock : 'always'}</p>
                                    </div>
                                  </td>
                                  <td className='p-3'>
                                    {el.sold}
                                  </td>

                                  <td className='p-3'>
                                    <Link to={`/seller/products/${el._id}`} className='text-blue-700 py-4'>{`View >`}</Link>
                                  </td>
                                </tr>
                              )
                            })
                            :
                            <tr>
                              <td colSpan={5} className='text-center p-3 text-lg'>no porducts</td>
                            </tr>

                      }

                    </tbody>
                  </table>
                </div>
              </div>

            </div>
      }
    </>
  );
}

export default SellerProducts;
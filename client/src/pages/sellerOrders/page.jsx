import { AiOutlineReload } from 'react-icons/ai'
import { Link } from 'react-router-dom'
const SellerOrders = () => {
  return (
    <div className="grow mx-auto max-w-6xl px-4 py-10  ">
      <div className='flex justify-between'>
        <h1 className="text-2xl text-primary">orders:</h1>
        <button className='flex items-center px-5 rounded-lg text-lg text-green-400 hover:bg-green-400 hover:text-white'>
        Reload<AiOutlineReload className='ml-2'/>
        </button>
      </div>
      <p className="font-semibold text-lg mt-3">New: <span className="text-primary">4</span></p>
      <div className="mt-3  max-w-lg flex-wrap flex items-center justify-between gap-4 text-zinc-600">
        <p>pending: {`4`}</p>
        <p>processing: {`4`}</p>
        <p>shipping: {`5`}</p>
        <p>completed: {`16`}</p>
      </div>

      <div className='grid w-full mt-5 rounded-xl overflow-hidden shadow-md border'>
        <div className='w-full overflow-x-scroll  noscrollbar top-0 left-0'>
          <table className='w-full px-2 min-w-max text-left'>
            <thead className="border-b text-lg">
              <tr>
                <th className="p-3 font-medium">order num</th>
                <th className="p-3 font-medium">status</th>
                <th className="p-3 font-medium">total</th>
                <th className="p-3 font-medium">placed in</th>
                <th className="p-3 font-medium">shipping to</th>
                <th className="p-3 font-medium">total items</th>
                <th className="p-3 font-medium">view</th>
              </tr>

            </thead>
            <tbody className='[&>*:not(last-child)]:border-b'>
              <tr>
                <td className="p-3 text-primary">#795</td>
                <td className="p-3">
                  <p className="px-4 rounded bg-primary text-white w-fit">Pending</p>
                </td>
                <td className="p-3 font-semibold">138.99$</td>
                <td className="p-3 text-zinc-600">15/12/2023 13:03pm</td>
                <td className="p-3 text-zinc-600">Al-qadmus tartus syria</td>
                <td className="p-3">7
                </td>
                <td className="p-3">
                  <Link to={`/seller/orders/`} className='py-3 text-blue-500 hover:text-primary'>{`view >`}</Link>
                </td>


              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default SellerOrders;
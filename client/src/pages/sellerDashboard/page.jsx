import Chart from "./Chart.js";
import img from '../../assets/prod.jpeg'
import usePrivateAxios from "../../hooks/usePrivateAxios.js";
import useGetAxios from "../../hooks/useGetAxios.js";
import LoadingThreeDots from "../../components/LoadingThreeDots.jsx";
import prodPlaceholder from '../../assets/images/prodPlaceholder.jpg'
import { Link } from "react-router-dom";
const serverUrl = process.env.REACT_APP_URL

const Dashboard = () => {
  const privateAxios = usePrivateAxios()
  const { data, loading, error } = useGetAxios('/seller/dashboard', privateAxios, [])
  // const data = true
  // const loading = false, error = false
  return (
    <div className="grow max-w-6xl self-stretch mx-auto px-1 sm:px-4 py-4 mb-4 font-nunito">
      {
        error ? <p className="text-lg text-red-500 " > {error}</p>
          :
          loading ?
            <LoadingThreeDots />
            : data &&
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-5 text-white font-nunito">
                <div className="flex flex-col mx-auto gap-2 justify-center items-center p-3 w-full bg-red-400 h-32 rounded-xl shadow-md">
                  <p className="text-xl sm:text-3xl">{data.productsCount}</p>
                  <p className="text-base sm:text-xl">Products</p>
                </div>
                <div className="flex flex-col mx-auto gap-2 justify-center items-center p-3 w-full bg-green-400 h-32 rounded-xl shadow-md">
                  <p className="text-xl sm:text-3xl">{data.totalOrders}</p>
                  <p className="text-base sm:text-xl">Total orders</p>
                </div>
                <div className="flex flex-col mx-auto gap-2 justify-center items-center p-3 w-full bg-blue-400 h-32 rounded-xl shadow-md">
                  <p className="text-xl sm:text-3xl">${(data.totalSales / 100).toFixed(2)}</p>
                  <p className="text-base sm:text-xl">Total sales</p>
                </div>
                <div className="flex flex-col mx-auto gap-2 justify-center items-center p-3 w-full bg-zinc-600 h-32 rounded-xl shadow-md">
                  <p className="text-xl sm:text-3xl">${(data.lastSevenDays / 100).toFixed(2)}</p>
                  <p className="text-base sm:text-xl">Last 7 days</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-5 mt-5 text-lg font-nunito ">
                <div className="w-full rounded-xl shadow-md bg-white border ">
                  <p className="border-b border-red text-lg p-2">orders :</p>
                  <div className="py-2 px-4">

                    <div className="flex justify-between w-full">
                      <p>pending :</p>
                      <p>{data.pending}</p>
                    </div>
                    <div className="flex justify-between w-full">
                      <p>processing :</p>
                      <p>{data.processing}</p>
                    </div>
                    <div className="flex justify-between w-full">
                      <p>shipping :</p>
                      <p>{data.shipping}</p>
                    </div>
                    <div className="flex justify-between w-full">
                      <p>complete :</p>
                      <p>{data.complete}</p>
                    </div>
                  </div>
                </div>

                {/* <div className="w-full rounded-xl shadow-md bg-white h-fit border">
                  <p className="border-b border-red text-lg p-2">orders :</p>
                  <div className="py-2 px-4">
                    <div className="flex justify-between w-full">
                      <p>total :</p>
                      <p>17</p>
                    </div>
                    <div className="flex justify-between w-full">
                      <p>complete :</p>
                      <p>15</p>
                    </div>
                    <div className="flex justify-between w-full">
                      <p>pending :</p>
                      <p>2</p>
                    </div>
                    <div className="flex justify-between w-full">
                      <p>processing :</p>
                      <p>17</p>
                    </div>
                  </div>
                </div> */}

              </div>

              {/* chart for sales and orders */}
              {/* chart resise based on container , container should have known sizes (not percentages) */}
              <div className=" relative max-w-4xl px-1 md:px-4 py-2 mt-5 min-h-[250px]  mx-auto w-full sm:w-[70vw] aspect-[2/1] bg-white rounded-lg shadow-md border scroller overflow-x-auto">
                <div className="w-full h-full min-w-[450px]">
                  <Chart chartData={data.chartData}/>
                </div>
              </div>


              {/* <div className="h-36 w-[70vw]  max-w-fit bg-red-300 overflow-auto">
                      <div className="flex flex-nowrap min-w-fit">
                        <div className="w-36">h</div>
                        <div className="w-36">h</div>
                        <div className="w-36">h</div>
                        <div className="w-36">h</div>
                      </div>
                    </div> */}

              {/* most sold products */}
              <div className=" max-w-4xl mt-5 mx-auto bg-white rounded-xl overflow-hidden shadow-md border ">

                <div className=" w-full  overflow-auto noscrollbar">
                  <table className="w-full min-w-max text-left  bg-white ">
                    <thead className=" font-medium border-b border-zinc-300 bg-white sticky top-0">
                      <tr>
                        <th scope="col" className="px-3 py-3 ">#</th>
                        <th scope="col" className="px-3 py-3">product name</th>
                        <th scope="col" className="px-3 py-3"># of orders</th>
                        <th scope="col" className="px-3 py-3 ">price</th>
                      </tr>
                    </thead>
                    <tbody className="[&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-zinc-300">
                      {
                        data.topProducts.map((el, idx) => {
                          return (
                            <tr className="">
                              <td className="px-3 py-2 w-fit">{idx + 1}</td>
                              <td className="box-border">
                                <Link to={'/seller/products/'+el._id} className="w-full px-3 py-2 flex min-w-max items-center hover:bg-slate-200">

                                <img src={el.images[0] ? serverUrl + '/' + el.images[0] : prodPlaceholder} alt="" className="w-11 aspect-square object-cover rounded-full" />
                                <p className="ml-3 font-semibold max-w-[150px] break-words">{el.name}</p>
                                </Link>
                              </td>
                              <td className="px-3 py-2">{el.sold}</td>
                              <td className="px-3 py-2">${(el.price / 100).toFixed(2)}</td>
                            </tr>

                          )
                        })
                      }

                    </tbody>
                  </table>

                </div>
              </div>



            </>
      }
    </div>
  );
}

export default Dashboard;
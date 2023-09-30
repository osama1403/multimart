import Chart from "./mychart.js";
import img from '../../assets/prod.jpeg'
const Dashboard = () => {



  return (
    <>
      <div className="grow bg-inc-50 min-h-screen px-2 sm:px-6 py-8 max-w-6xl mx-auto">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-5 text-white font-nunito">
          <div className="flex flex-col mx-auto gap-2 justify-center items-center p-3 w-full bg-red-400 h-32 rounded-xl shadow-md">
            <p className="text-xl sm:text-3xl">10</p>
            <p className="text-base sm:text-xl">Products</p>
          </div>
          <div className="flex flex-col mx-auto gap-2 justify-center items-center p-3 w-full bg-green-400 h-32 rounded-xl shadow-md">
            <p className="text-xl sm:text-3xl">17</p>
            <p className="text-base sm:text-xl">Total orders</p>
          </div>
          <div className="flex flex-col mx-auto gap-2 justify-center items-center p-3 w-full bg-blue-400 h-32 rounded-xl shadow-md">
            <p className="text-xl sm:text-3xl">1324.99$</p>
            <p className="text-base sm:text-xl">Total sales</p>
          </div>
          <div className="flex flex-col mx-auto gap-2 justify-center items-center p-3 w-full bg-zinc-600 h-32 rounded-xl shadow-md">
            <p className="text-xl sm:text-3xl">585.00$</p>
            <p className="text-base sm:text-xl">Last 7 days</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 mt-5 text-lg font-nunito ">
          <div className="w-full rounded-xl shadow-md bg-white border ">
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
                <p>3</p>
              </div>
              <div className="flex justify-between w-full">
                <p>shipping :</p>
                <p>4</p>
              </div>
            </div>
          </div>

          <div className="w-full rounded-xl shadow-md bg-white h-fit border">
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
          </div>

        </div>

        {/* chart for sales and orders */}
        {/* chart resise based on container , container should have known sizes (not percentages) */}
        <div className=" relative max-w-4xl px-1 md:px-4 py-2 mt-5 min-h-[250px]  mx-auto w-full sm:w-[70vw] aspect-[2/1] bg-white rounded-lg shadow-md border scroller overflow-x-auto">
         <div className="w-full h-full min-w-[450px]">
          <Chart />
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
                <tr className="">
                  <td className="px-3 py-2">1</td>

                  <td className="px-3 py-2 flex min-w-max items-center">
                    <img src={img} alt="" className="w-11 aspect-square object-cover rounded-full" />
                    <p className="ml-3 font-semibold"> product 1</p>
                  </td>
                  <td className="px-3 py-2"> 34</td>
                  <td className="px-3 py-2">77$</td>
                </tr>
                <tr className="">
                  <td className="px-3 py-2">1</td>

                  <td className="px-3 py-2 flex items-center">
                    <img src={img} alt="" className="w-11 aspect-square object-cover rounded-full" />
                    <p className="ml-3 font-semibold"> product 1</p>
                  </td>
                  <td className="px-3 py-2"> 34</td>
                  <td className="px-3 py-2">77$</td>
                </tr>
                <tr className="">
                  <td className="px-3 py-2">1</td>

                  <td className="px-3 py-2 flex items-center">
                    <img src={img} alt="" className="w-11 aspect-square object-cover rounded-full" />
                    <p className="ml-3 font-semibold"> product 1</p>
                  </td>
                  <td className="px-3 py-2"> 34</td>
                  <td className="px-3 py-2">77$</td>
                </tr>
                <tr className="">
                  <td className="px-3 py-2">1</td>

                  <td className="px-3 py-2 flex items-center">
                    <img src={img} alt="" className="w-11 aspect-square object-cover rounded-full" />
                    <p className="ml-3 font-semibold"> product 1</p>
                  </td>
                  <td className="px-3 py-2"> 34</td>
                  <td className="px-3 py-2">77$</td>
                </tr>
                <tr className="">
                  <td className="px-3 py-2">1</td>

                  <td className="px-3 py-2 flex items-center">
                    <img src={img} alt="" className="w-11 aspect-square object-cover rounded-full" />
                    <p className="ml-3 font-semibold"> product 1</p>
                  </td>
                  <td className="px-3 py-2"> 34</td>
                  <td className="px-3 py-2">77$</td>
                </tr>

              </tbody>
            </table>

          </div>
        </div>


      </div>
      
    </>
  );
}

export default Dashboard;
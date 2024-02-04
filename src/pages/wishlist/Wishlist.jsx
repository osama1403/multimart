// import img from '../assets/prod.jpeg'
import LoadingThreeDots from "../../components/LoadingThreeDots";
import ProductCard from "../../components/ProductCard"
import useGetAxios from "../../hooks/useGetAxios";
import usePrivateAxios from "../../hooks/usePrivateAxios";
const Wishlist = () => {
  const privateAxios = usePrivateAxios()
  const { data, loading, error } = useGetAxios('/user/wishlist', privateAxios, [])

  return (
    <>
      <div className="grow max-w-[1520px] mx-auto">
        {error ?
          <div className="flex w-full h-[calc(100vh-64px)] justify-center items-center ">
            <p className="text-xl font font-semibold text-red-500">{error} </p>
          </div>
          :
          loading ?
            <LoadingThreeDots />
            : data?.length > 0 ?
              <main className=" px-4 py-7  grid grid-flow-row grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-3 md:gap-6">
                {data.map((el, idx) => {
                  return (
                    <ProductCard data={el} key={idx} />
                  )
                })}
              </main>
              :
              <div className="flex w-full h-[calc(100vh-64px)] justify-center items-center ">
                <p className="text-xl font font-semibold text-red-500"> Your wishlist is empty </p>
              </div>
        }

      </div >
    </>
  );
}

export default Wishlist;
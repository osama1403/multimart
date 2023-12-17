import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import axios from "../../api/axios";
import useGetAxios from "../../hooks/useGetAxios";


const HorizontalScroller = ({ category }) => {
  // const [data, setData] = useState(null)
  // const [loading, setLoading] = useState(false)
  // const [msg, setMsg] = useState('')

  // useEffect(() => {
  //   const aborter = new AbortController()
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true)
  //       setMsg('')
  //       const res = await axios.get(`/products?categories[]=${category}&limit=8`, { signal: aborter.signal })
  //       setData(res.data)
  //     } catch (error) {
  //       if (error.response) {
  //         setMsg(error.response.data?.msg ? error.response.data?.msg : 'something went wrong')
  //       } else if (error.request) {
  //         setMsg('no server response')
  //       }
  //     }
  //     setLoading(false)
  //   }
  //   fetchData()
  //   return (() => {
  //     aborter.abort()
  //   })
  // }, [axios])

  const {data,loading,error} = useGetAxios(`/products?categories[]=${category}&limit=8`,axios,[])

  return (
    <>
      <div className=" mx-auto px-2 sm:px-4 py-10  max-w-[1520px] overflow-clip">
        <h2 className="text-xl font-semibold mb-2 font-nunito inline-block">{category}</h2>
        <Link to={`/products`} state={{category}} className='px-4 py-2 mt-2 ml-8 border border-primary rounded-lg box-border inline-block hover:text-primary' >{'Show More >'}</Link>
        {error && <p className="text-red-500">{error}</p>}
        {
          loading ?
            <p className="text-lg text-center">Loading ..</p>
            :
            data?.products.length > 0 ?
              <div className="overflow-x-scroll scroller py-2">
                <div className="flex flex-nowrap w-fit gap-3 py-4">
                  {
                    data.products.map((el, idx) => {
                      return (
                        <div className="w-64 md:w-72" key={idx}>
                          <ProductCard data={el} />
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              :
              <p className="text-lg text-center">no products available</p>
        }
      </div>
    </>
  );
}

export default HorizontalScroller;
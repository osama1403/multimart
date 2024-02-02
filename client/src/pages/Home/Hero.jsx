import { Link, useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar';
import headerimg from '../../assets/images/headerimg.png'
const Hero = () => {
  const navigate = useNavigate()
  const handleSearch = (x) => {
    navigate('/products', { state: { searchString: x } })
  }
  return (
    <>
      <section className="max-w-[1520px] mx-auto bg-cover bg-center bg-gradient-to-tr font-nunito  from-blue-100 to-pink-200">
        <div className=" relative md:w-5/6 lg:w-3/4 max-w-7xl  p-8 mx-auto ">
          <div className='flex flex-col-reverse md:flex-row items-center '>
            <div className='md:pt-8' >
              <div className=" md:grow md:max-w-3xl ">
                <h1 className="text-4xl lg:text-5xl  text-left md:text-left text-zinc-800 font-bold ">
                  <span className='text-primary'>Multimart</span> - a marketplace for everyone.</h1>
                <p className="text-xl font-semibold text-left md:text-left text-zinc-800 my-7">
                  Experience the future of ecommerce with Multimart, where sellers collaborate and thrive in a dynamic marketplace.
                  {/* Discover a world of endless possibilities with our curated selection of products from top-rated vendors, all in one convenient online marketplace. */}
                </p>
              </div>

              <Link to={'/seller/login'} className='py-3 px-4 bg-blue-300 font-semibold hover:bg-orange-300 rounded-xl whitespace-nowrap' >
                Are you a Seller?
              </Link>
            </div>
            <img src={headerimg} className='w-4/5 md:w-1/2 max-w-md' alt="" />

          </div>

          <div className='flex justify-center items-center mt-10'>
            <SearchBar handleSearch={handleSearch} searchValue={''} />
          </div>

        </div>


      </section>
    </>
  );
}

export default Hero;
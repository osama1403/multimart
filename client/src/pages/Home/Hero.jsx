import { Link, useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar';

const Hero = () => {
  const navigate = useNavigate()
  const handleSearch = (x) => {
    navigate('/products', { state: { searchString: x } })
  }
  return (
    <>
      {/* <section class="bg-gray-900 text-white">
        <div class="container mx-auto px-4 py-12 md:py-24">
          <h1 class="text-4xl md:text-6xl font-bold mb-4">Welcome to our website</h1>
          <p class="text-lg md:text-xl mb-8">We offer the best services for your needs.</p>
          <a href="#" class="bg-white text-gray-900 font-bold py-2 px-6 rounded-full hover:bg-gray-300 transition duration-300 ease-in-out">Get started</a>
        </div>
      </section> */}

      <section className="bg-cover bg-center bg-gradient-to-r font-nunito from-violet-300 to-pink-200">
        <div className=" relative md:w-5/6 lg:w-2/3 max-w-7xl pt-8 md:pt-16 pb-8 px-8 mx-auto ">

          <div className='flex flex-col-reverse gap-5 md:gap-0 md:flex-row justify-between items-end md:items-start md:pt-8' >

            <div className=" md:w-2/3 md:max-w-3xl ">
              <h1 className="text-5xl  text-center md:text-left text-primary font-bold ">Lorem title Ipsum</h1>
              <p className="text-xl font-semibold text-center md:text-left text-zinc-800 my-7">
                Discover a world of endless possibilities with our curated selection of products from top-rated vendors, all in one convenient online marketplace.
              </p>
            </div>

            <Link to={'/seller/login'} className=' py-3 px-4 bg-gray-200 hover:bg-orange-300 rounded-xl ' >
              I'm a seller
            </Link>
          </div>

          <div className='flex justify-center items-center mt-10'>
            <SearchBar handleSearch={handleSearch} searchValue={''}/>
          </div>

        </div>


      </section>
    </>
  );
}

export default Hero;
import { ReactComponent as BWLogo } from '../assets/LogoBW.svg'
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaPhone, FaLocationArrow } from 'react-icons/fa'
const Footer = () => {
  return (
    <>
      <footer className=" px-10 pt-12 bg-zinc-900 w-full text-white">
        <div className="flex flex-col gap-8 sm:gap-0 sm:flex-row justify-around items-center sm:items-start text-center sm:text-left ">

          <div className="self-center flex flex-col justify-between items-center sm:items-start">
            <div className="flex flex-col items-center sm:block">
              <BWLogo className='w-28 h-11' />
              <p className="max-w-[250px] text-xs  font-light">Lorem ipsum dolor sit amet consectetur, adipisicing elit. delectus
                debitis?</p>
              <div className="mt-2 flex gap-4 items-center">
                <a href="#" className='block'><FaFacebook className=' inline text-3xl hover:text-blue-500' /></a>
                <a href="#" className='block'><FaInstagram className=' inline text-3xl hover:text-pink-600' /></a>
                <a href="#" className='block'><FaTwitter className=' inline text-3xl hover:text-blue-500' /></a>

              </div>

            </div>
          </div>

          <div className="text-center sm:text-left">
            <p className="font-bold">Links:</p>
            <a href="#" className="block mt-2 font-extralight hover:text-primary">Home</a>
            <a href="#" className="block mt-2 font-extralight hover:text-primary">Products</a>
            <a href="#" className="block mt-2 font-extralight hover:text-primary">About Us</a>
            <a href="#" className="block mt-2 font-extralight hover:text-primary">Seller Login</a>
          </div>
          <div>
            <p className="font-bold">Contact Us:</p>
            <div className="mt-2 flex items-center justify-center sm:justify-start">
              <FaEnvelope className='text-primary' />
              <span className="ml-2">multimart@gmail.com</span>
            </div>
            <div className="mt-2 flex items-center justify-center sm:justify-start">
              <FaPhone className='text-primary' />
              <span className="font-semibold ml-2">+1 234 5678 9123 </span>
            </div>
            <div className="mt-2 flex items-center justify-center sm:justify-start">
              <FaLocationArrow className='text-primary shrink-0' />
              <span className="font-light max-w-36 inline-block ml-2">Lorem ipsum dolor sit amet consectetur.</span>
            </div>
          </div>


        </div>
        <p className="text-center text-lg font-thin text-zinc-400 pt-8 pb-2">Developed By: Osama Abo Ajeeb</p>
      </footer>
    </>
  );
}

export default Footer;